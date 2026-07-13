import { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, MessageSquare, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav className="flex items-center justify-between py-6 px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                IF
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">InsightFlow</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Sign In</Link>
            <Link to="/auth" className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-soft">
                Get Started
            </Link>
        </div>
    </nav>
);

const Features = () => (
    <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl text-balance">Everything you need to scale securely</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Stop wrestling with spreadsheets. InsightFlow syncs your data autonomously so you can focus on growth.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-ifam transition-shadow duration-300">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">Preset Limit Sync</h3>
                    <p className="text-slate-600">Dynamically sync your Shopify and Ad platform limits based on preset thresholds. Complete automation, zero manual intervention.</p>
                </div>

                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-ifam transition-shadow duration-300">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">Military-Grade Encryption</h3>
                    <p className="text-slate-600">Your API tokens are encrypted with AES-GCM at rest and in transit. We prioritize security above all else.</p>
                </div>

                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-ifam transition-shadow duration-300">
                    <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-6">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">WhatsApp & Slack Ready</h3>
                    <p className="text-slate-600">Receive critical store updates via Email, Slack, or WhatsApp with built-in strict country-code validation.</p>
                </div>
            </div>
        </div>
    </section>
);

const Testimonials = () => (
    <section id="testimonials" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Trusted by 3,000+ businesses</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="ifam-elevation p-8 space-y-4">
                    <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                    </div>
                    <p className="text-slate-700 italic">"InsightFlow completely transformed how we handle our reporting. It's essentially an autonomous growth engine. We set it up once, and it just works seamlessly in the background."</p>
                    <div className="flex items-center gap-3 pt-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                        <div>
                            <p className="text-sm font-bold text-primary">Sarah Jenkins</p>
                            <p className="text-xs text-slate-500">VP of Operations, RetailCo</p>
                        </div>
                    </div>
                </div>
                <div className="ifam-elevation p-8 space-y-4">
                    <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                    </div>
                    <p className="text-slate-700 italic">"The encryption protocols gave our enterprise IT team peace of mind, and the real-time Slack integrations keep the whole marketing team aligned on Ad spend. Highly recommended."</p>
                    <div className="flex items-center gap-3 pt-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                        <div>
                            <p className="text-sm font-bold text-primary">Marcus Chen</p>
                            <p className="text-xs text-slate-500">Director of Growth, ScaleUp Tech</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const HowItWorks = () => (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="flex justify-center mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary px-6 text-center">
                    How It Works
                </h2>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 lg:gap-8 relative mt-16 max-w-6xl mx-auto">
                {/* Step 1 - Tilted Left */}
                <div className="relative group flex-1 p-8 rounded-[2rem] bg-[#1c1c1c] text-white shadow-2xl transition-all duration-300 transform md:-rotate-6 hover:rotate-0 hover:scale-105 z-10 hover:z-30">
                    <div className="flex items-center gap-2 mb-8">
                        <span className="text-3xl font-black italic tracking-tighter">01</span>
                        <div className="w-4 h-4 text-green-400">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 tracking-tight">Connect Platforms</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">Link your Shopify store and Ad accounts securely via encrypted API. InsightFlow establishes a permanent, secure handshake instantly.</p>
                </div>

                {/* Step 2 - Center (Straight) */}
                <div className="relative group flex-1 p-8 rounded-[2rem] bg-[#1c1c1c] text-white shadow-2xl transition-all duration-300 transform hover:-translate-y-4 z-20 hover:z-30 mt-8 md:mt-0">
                    <div className="flex justify-center items-center gap-2 mb-8">
                        <span className="text-3xl font-black italic tracking-tighter">02</span>
                        <div className="w-4 h-4 text-green-400">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-center tracking-tight">Set Constraints</h3>
                    <p className="text-slate-400 text-sm text-center leading-relaxed font-medium">Target exactly what data you want and where it goes. Route critical alerts to Slack, daily briefs to Email, and ROI limits to WhatsApp.</p>
                </div>

                {/* Step 3 - Tilted Right */}
                <div className="relative group flex-1 p-8 rounded-[2rem] bg-[#1c1c1c] text-white shadow-2xl transition-all duration-300 transform md:rotate-6 hover:rotate-0 hover:scale-105 z-10 hover:z-30 mt-8 md:mt-0">
                    <div className="flex justify-end items-center gap-2 mb-8">
                        <span className="text-3xl font-black italic tracking-tighter">03</span>
                        <div className="w-4 h-4 text-green-400">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 tracking-tight">Autonomous Engine</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">Sit back. The Self-Annealing Engine continuously processes and delivers your insights exactly on schedule. Zero spreadsheets.</p>
                </div>
            </div>
        </div>
    </section>
);

const LandingPage = () => {
    const images = [
        '/mockups/dashboard.png',
        '/mockups/slack_message.jpg',
        '/mockups/email_message.jpg',
        '/mockups/whatsapp_message.jpg'
    ];
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex-1 bg-slate-50 overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <main className="relative pt-20 pb-32 px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                {/* Background gradient blob */}
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-brand-50/50 rounded-full blur-3xl -z-10 mix-blend-multiply" />

                <div className="space-y-8 z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl lg:text-6xl font-extrabold text-primary tracking-tight leading-tight text-balance"
                    >
                        Stop Guessing. Start Scaling.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xl text-slate-600 leading-relaxed max-w-lg"
                    >
                        InsightFlow automatically syncs your Shopify store data with your Ads performance. Get daily summaries delivered to Slack, WhatsApp, or Email so you can focus on growth, not spreadsheets.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                        <Link to="/auth" className="inline-flex justify-center items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-8 py-3.5 rounded-lg font-semibold transition-all shadow-[0_0_40px_-10px_rgba(20,184,166,0.5)] hover:shadow-[0_0_60px_-15px_rgba(20,184,166,0.6)]">
                            Build Your First Report <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a href="#features" className="inline-flex justify-center items-center gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-8 py-3.5 rounded-lg font-semibold transition-all shadow-sm">
                            Watch How It Works
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex items-center gap-2 text-sm text-slate-600 font-medium pt-3"
                    >
                        <span className="text-base leading-none">🔒</span> Bank-Level AES-256 Encryption
                    </motion.div>
                </div>

                {/* Floating Image Slideshow */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="relative flex items-center justify-center z-10 w-full"
                >
                    <div className="ifam-elevation w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative bg-slate-100 border border-slate-200">
                        <AnimatePresence mode="popLayout">
                            <motion.img
                                key={currentImage}
                                src={images[currentImage]}
                                alt="InsightFlow Preview Mockup"
                                className={`w-full h-full object-cover absolute inset-0 ${currentImage === 0 ? 'object-[center_10%]' : 'object-center'}`}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Jelly-Ball Pagination Dots */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImage(index)}
                                className="relative rounded-full transition-all duration-300 outline-none"
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                <motion.div
                                    className={`h-2.5 rounded-full ${index === currentImage ? 'bg-slate-600' : 'bg-slate-300 hover:bg-slate-400'}`}
                                    animate={{
                                        width: index === currentImage ? 24 : 10,
                                        backgroundColor: index === currentImage ? '#475569' : '#cbd5e1'
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Decorative glowing orb behind the mockup */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-400/20 blur-[80px] rounded-full -z-10" />
                </motion.div>
            </main>

            {/* Bottom Hero Floating Bar */}
            <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-8 -mt-10 mb-20">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 flex flex-col gap-6 relative">
                    {/* Top Row: Spaced-out Selling Points */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-sm sm:text-base font-bold text-slate-800 tracking-tight w-full">
                        <div className="flex items-center gap-2.5">
                            <span className="text-xl leading-none">⭐</span> Rated 5/5
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span className="text-xl leading-none">🚀</span> Live Shopify & Ads Integration
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span className="text-xl leading-none">⚡</span> Setup in under 2 minutes
                        </div>
                    </div>

                    {/* Thick Faint Ash/Gray Separator */}
                    <hr className="w-full border-t-[1.5px] border-slate-200/80 my-1" />

                    {/* Bottom Row: Centered Navigation Links */}
                    <div className="flex flex-wrap justify-center items-end gap-6 sm:gap-10 text-sm font-semibold text-slate-500">
                        <div className="relative flex flex-col items-center">
                            <a href="#how-it-works" className="text-brand-600 pb-1.5 transition-colors">How It Works</a>
                            <div className="absolute bottom-0 w-[calc(100%+8px)] h-[3px] bg-brand-500 rounded-t-[4px] rounded-b-none shadow-[0_-2px_8px_rgba(20,184,166,0.4)]" />
                        </div>
                        <a href="#features" className="hover:text-brand-600 transition-colors pb-1.5">Why Choose Us</a>
                        <a href="#pricing" className="hover:text-brand-600 transition-colors pb-1.5">Pricing</a>
                        <a href="#testimonials" className="hover:text-brand-600 transition-colors pb-1.5">Testimonials</a>
                    </div>
                </div>
            </div>

            <HowItWorks />
            <Features />
            <Testimonials />
        </div>
    );
};

export default LandingPage;
