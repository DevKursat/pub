'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const platforms = [
    {
        name: 'TikTok',
        color: '#ff0050',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
            </svg>
        ),
    },
    {
        name: 'Instagram',
        color: '#e1306c',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
    },
    {
        name: 'YouTube',
        color: '#ff0000',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
    },
    {
        name: 'Twitter',
        color: '#1da1f2',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        name: 'Facebook',
        color: '#1877f2',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        name: 'LinkedIn',
        color: '#0a66c2',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
];

export function PlatformIcons() {
    const radius = 120;

    return (
        <div className="relative w-[320px] h-[320px] mx-auto">
            {/* Pulse Rings */}
            {[1, 2, 3].map((ring) => (
                <motion.div
                    key={ring}
                    className="absolute rounded-full border border-primary/20"
                    style={{
                        width: 80 + ring * 70,
                        height: 80 + ring * 70,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.3, 0.1, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        delay: ring * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Center Pub Logo */}
            <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                animate={{
                    boxShadow: [
                        '0 0 40px -10px rgba(139, 92, 246, 0.5)',
                        '0 0 60px -10px rgba(139, 92, 246, 0.7)',
                        '0 0 40px -10px rgba(139, 92, 246, 0.5)',
                    ],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                <Image
                    src="/logo.png"
                    alt="Pub"
                    width={64}
                    height={64}
                    className="rounded-2xl"
                />
            </motion.div>

            {/* Orbiting Platforms */}
            {platforms.map((platform, index) => {
                const angle = (index / platforms.length) * 360 - 90;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                    <motion.div
                        key={platform.name}
                        className="absolute z-10"
                        style={{
                            left: '50%',
                            top: '50%',
                        }}
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                        animate={{
                            x,
                            y,
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            delay: 0.1 * index,
                            duration: 0.6,
                            ease: 'easeOut',
                        }}
                    >
                        <motion.div
                            className="flex items-center justify-center w-12 h-12 -ml-6 -mt-6 rounded-xl bg-background-secondary border border-border shadow-lg cursor-pointer"
                            style={{
                                color: platform.color,
                            }}
                            whileHover={{
                                scale: 1.15,
                                boxShadow: `0 0 30px -5px ${platform.color}40`,
                                borderColor: `${platform.color}50`,
                            }}
                            animate={{
                                y: [0, -4, 0],
                            }}
                            transition={{
                                y: {
                                    duration: 2 + index * 0.2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                },
                            }}
                        >
                            {platform.icon}
                        </motion.div>

                        {/* Connection Line */}
                        <svg
                            className="absolute pointer-events-none"
                            style={{
                                width: radius + 20,
                                height: radius + 20,
                                left: -radius / 2 - 10,
                                top: -radius / 2 - 10,
                            }}
                        >
                            <motion.line
                                x1={radius / 2 + 10}
                                y1={radius / 2 + 10}
                                x2={radius / 2 + 10 - x / 2}
                                y2={radius / 2 + 10 - y / 2}
                                stroke={`${platform.color}30`}
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                            />
                        </svg>
                    </motion.div>
                );
            })}
        </div>
    );
}

export default PlatformIcons;
