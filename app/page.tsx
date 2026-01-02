import { ToastProvider } from '@/components/ui';
import { Navbar, Hero, Features, Pricing, Testimonials, Footer } from '@/components/marketing';

export default function HomePage() {
    return (
        <ToastProvider>
            <main className="relative">
                <Navbar />
                <Hero />
                <Features />
                <Testimonials />
                <Pricing />
                <Footer />
            </main>
        </ToastProvider>
    );
}
