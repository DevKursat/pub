// TikTok & YouTube Browser Automation Worker
// Run separately: node worker/social-automation.js
// This worker handles platforms that require browser automation

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.WORKER_PORT || 3001;
const SESSIONS_DIR = path.join(__dirname, 'sessions');

// Ensure sessions directory exists
if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

// ============================================
// TIKTOK SERVICE
// ============================================

class TikTokService {
    async login(username, password) {
        const browser = await puppeteer.launch({
            headless: false, // TikTok often requires visible browser
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 720 });

            // Go to TikTok login
            await page.goto('https://www.tiktok.com/login/phone-or-email/email', {
                waitUntil: 'networkidle2'
            });

            await page.waitForTimeout(2000);

            // Find and fill login form
            await page.type('input[name="username"]', username, { delay: 100 });
            await page.type('input[type="password"]', password, { delay: 100 });

            // Click login button
            await page.click('button[type="submit"]');

            // Wait for navigation or captcha
            await page.waitForTimeout(10000);

            // Check if logged in
            const cookies = await page.cookies();
            const sessionId = cookies.find(c => c.name === 'sessionid');

            if (!sessionId) {
                throw new Error('Login failed - captcha or verification may be required');
            }

            // Get user info
            await page.goto(`https://www.tiktok.com/@${username}`, { waitUntil: 'networkidle2' });

            const userInfo = await page.evaluate(() => {
                const nameEl = document.querySelector('[data-e2e="user-subtitle"]');
                const followersEl = document.querySelector('[data-e2e="followers-count"]');
                const avatarEl = document.querySelector('[data-e2e="user-avatar"] img');

                return {
                    displayName: nameEl?.textContent || '',
                    followers: followersEl?.textContent || '0',
                    avatar: avatarEl?.src || '',
                };
            });

            // Save cookies
            const cookiesJson = JSON.stringify(cookies);
            const sessionPath = path.join(SESSIONS_DIR, `tiktok_${username}.json`);
            fs.writeFileSync(sessionPath, cookiesJson);

            await browser.close();

            return {
                success: true,
                platform: 'tiktok',
                userId: username,
                username: username,
                displayName: userInfo.displayName || username,
                profilePicUrl: userInfo.avatar,
                followersCount: parseInt(userInfo.followers.replace(/[^0-9]/g, '')) || 0,
                session: cookiesJson,
            };
        } catch (error) {
            await browser.close();
            throw error;
        }
    }

    async uploadVideo(sessionData, videoPath, caption) {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();

            // Restore cookies
            const cookies = JSON.parse(sessionData);
            await page.setCookie(...cookies);

            // Go to upload page
            await page.goto('https://www.tiktok.com/upload', { waitUntil: 'networkidle2' });
            await page.waitForTimeout(3000);

            // Check if logged in
            const isLoggedIn = await page.evaluate(() => {
                return !document.querySelector('[data-e2e="login-button"]');
            });

            if (!isLoggedIn) {
                throw new Error('Session expired, please login again');
            }

            // Wait for upload input
            const fileInput = await page.$('input[type="file"]');
            if (!fileInput) {
                throw new Error('Could not find upload input');
            }

            // Upload video
            await fileInput.uploadFile(videoPath);

            // Wait for video to process
            await page.waitForTimeout(10000);

            // Find and fill caption
            const captionInput = await page.$('[data-e2e="caption-input"]');
            if (captionInput) {
                await captionInput.click();
                await page.keyboard.type(caption, { delay: 50 });
            }

            // Click post button
            await page.waitForTimeout(2000);
            const postButton = await page.$('[data-e2e="post-button"]');
            if (postButton) {
                await postButton.click();
            }

            // Wait for upload completion
            await page.waitForTimeout(15000);

            await browser.close();

            return {
                success: true,
                platform: 'tiktok',
                postId: Date.now().toString(),
            };
        } catch (error) {
            await browser.close();
            throw error;
        }
    }
}

// ============================================
// YOUTUBE SERVICE
// ============================================

class YouTubeService {
    async login(email, password) {
        const browser = await puppeteer.launch({
            headless: false, // Google login requires visible browser
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 720 });

            // Go to YouTube login
            await page.goto('https://accounts.google.com/signin/v2/identifier?service=youtube', {
                waitUntil: 'networkidle2'
            });

            // Enter email
            await page.type('input[type="email"]', email, { delay: 100 });
            await page.click('#identifierNext');
            await page.waitForTimeout(3000);

            // Enter password
            await page.waitForSelector('input[type="password"]', { visible: true });
            await page.type('input[type="password"]', password, { delay: 100 });
            await page.click('#passwordNext');

            // Wait for login completion
            await page.waitForTimeout(10000);

            // Check if logged in
            await page.goto('https://studio.youtube.com', { waitUntil: 'networkidle2' });

            const channelName = await page.evaluate(() => {
                const nameEl = document.querySelector('#channel-name');
                return nameEl?.textContent?.trim() || '';
            });

            if (!channelName) {
                throw new Error('Login failed - 2FA or verification may be required');
            }

            // Get cookies
            const cookies = await page.cookies();
            const cookiesJson = JSON.stringify(cookies);

            // Save session
            const sessionPath = path.join(SESSIONS_DIR, `youtube_${email.split('@')[0]}.json`);
            fs.writeFileSync(sessionPath, cookiesJson);

            await browser.close();

            return {
                success: true,
                platform: 'youtube',
                userId: email,
                username: email,
                displayName: channelName,
                session: cookiesJson,
            };
        } catch (error) {
            await browser.close();
            throw error;
        }
    }

    async uploadVideo(sessionData, videoPath, title, description) {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();

            // Restore cookies
            const cookies = JSON.parse(sessionData);
            await page.setCookie(...cookies);

            // Go to YouTube Studio
            await page.goto('https://studio.youtube.com', { waitUntil: 'networkidle2' });
            await page.waitForTimeout(3000);

            // Click create button
            const createButton = await page.$('#create-icon');
            if (createButton) {
                await createButton.click();
                await page.waitForTimeout(1000);
            }

            // Click upload video option
            const uploadOption = await page.$('#text-item-0');
            if (uploadOption) {
                await uploadOption.click();
                await page.waitForTimeout(2000);
            }

            // Find file input
            const fileInput = await page.$('input[type="file"]');
            if (!fileInput) {
                throw new Error('Could not find upload input');
            }

            // Upload video
            await fileInput.uploadFile(videoPath);

            // Wait for upload to start
            await page.waitForTimeout(5000);

            // Fill in title
            const titleInput = await page.$('#textbox');
            if (titleInput) {
                await titleInput.click({ clickCount: 3 }); // Select all
                await page.keyboard.type(title, { delay: 30 });
            }

            // Fill description
            const descriptionInputs = await page.$$('#textbox');
            if (descriptionInputs[1]) {
                await descriptionInputs[1].click();
                await page.keyboard.type(description, { delay: 30 });
            }

            // Wait for processing
            await page.waitForTimeout(10000);

            // Click Next buttons
            for (let i = 0; i < 3; i++) {
                const nextButton = await page.$('#next-button');
                if (nextButton) {
                    await nextButton.click();
                    await page.waitForTimeout(2000);
                }
            }

            // Select "Public" visibility
            const publicRadio = await page.$('tp-yt-paper-radio-button[name="PUBLIC"]');
            if (publicRadio) {
                await publicRadio.click();
                await page.waitForTimeout(1000);
            }

            // Click Done/Publish
            const doneButton = await page.$('#done-button');
            if (doneButton) {
                await doneButton.click();
            }

            // Wait for completion
            await page.waitForTimeout(15000);

            await browser.close();

            return {
                success: true,
                platform: 'youtube',
                postId: Date.now().toString(),
            };
        } catch (error) {
            await browser.close();
            throw error;
        }
    }
}

// ============================================
// EXPRESS ROUTES
// ============================================

const tiktokService = new TikTokService();
const youtubeService = new YouTubeService();

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// TikTok Login
app.post('/tiktok/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await tiktokService.login(username, password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// TikTok Upload
app.post('/tiktok/upload', async (req, res) => {
    try {
        const { session, videoPath, caption } = req.body;
        const result = await tiktokService.uploadVideo(session, videoPath, caption);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// YouTube Login
app.post('/youtube/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await youtubeService.login(email, password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// YouTube Upload
app.post('/youtube/upload', async (req, res) => {
    try {
        const { session, videoPath, title, description } = req.body;
        const result = await youtubeService.uploadVideo(session, videoPath, title, description);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🤖 Social Automation Worker running on port ${PORT}`);
    console.log('Endpoints:');
    console.log('  POST /tiktok/login - Login to TikTok');
    console.log('  POST /tiktok/upload - Upload video to TikTok');
    console.log('  POST /youtube/login - Login to YouTube');
    console.log('  POST /youtube/upload - Upload video to YouTube');
});
