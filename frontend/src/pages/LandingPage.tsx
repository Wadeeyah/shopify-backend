import { useState, useEffect } from 'react';
import { ArrowRight, Linkedin, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const Navbar = () => {
    const [user, setUser] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="relative z-50 flex items-center justify-between py-5 px-6 md:px-8 max-w-7xl mx-auto w-full">
            <div className="flex items-center">
                <Link to="/">
                    <img src="/logo.png" alt="Cluemetrics Logo" className="logo-brand drop-shadow-sm hover:scale-105 transition-transform" />
                </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <Link to="/#how-it-works" className="hover:text-primary transition-colors">Features</Link>
                <Link to="/#pricing" className="hover:text-primary transition-colors">Pricing</Link>
                <Link to="/#testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
                <Link to="/contact-us" className="hover:text-primary transition-colors">Contact Us</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
                {user ? (
                    <>
                        <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Dashboard</Link>
                        <button onClick={() => {
                            const pricingElement = document.getElementById('pricing');
                            if (pricingElement) {
                                pricingElement.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                window.location.hash = 'pricing';
                            }
                        }} className="text-sm font-medium bg-brand-600 text-white px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors shadow-soft">
                            Upgrade
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/auth" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Sign In</Link>
                        <button onClick={() => {
                            const pricingElement = document.getElementById('pricing');
                            if (pricingElement) {
                                pricingElement.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                window.location.hash = 'pricing';
                            }
                        }} className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-soft">
                            Get Started
                        </button>
                    </>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
                <button
                    onClick={toggleMenu}
                    className="p-2 text-slate-600 hover:text-primary focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-6 flex flex-col gap-6 z-40 md:hidden"
                    >
                        <Link to="/#how-it-works" onClick={toggleMenu} className="text-base font-semibold text-slate-800">Features</Link>
                        <Link to="/#pricing" onClick={toggleMenu} className="text-base font-semibold text-slate-800">Pricing</Link>
                        <Link to="/#testimonials" onClick={toggleMenu} className="text-base font-semibold text-slate-800">Testimonials</Link>
                        <Link to="/contact-us" onClick={toggleMenu} className="text-base font-semibold text-slate-800">Contact Us</Link>
                        <hr className="border-slate-100" />
                        {user ? (
                            <div className="flex flex-col gap-4">
                                <Link to="/dashboard" onClick={toggleMenu} className="text-base font-semibold text-slate-800">Dashboard</Link>
                                <button onClick={() => {
                                    toggleMenu();
                                    const pricingElement = document.getElementById('pricing');
                                    if (pricingElement) {
                                        pricingElement.scrollIntoView({ behavior: 'smooth' });
                                    } else {
                                        window.location.hash = 'pricing';
                                    }
                                }} className="w-full text-center bg-brand-600 text-white py-3 rounded-xl font-bold">
                                    Upgrade
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <Link to="/auth" onClick={toggleMenu} className="text-base font-semibold text-slate-800">Sign In</Link>
                                <button onClick={() => {
                                    toggleMenu();
                                    const pricingElement = document.getElementById('pricing');
                                    if (pricingElement) {
                                        pricingElement.scrollIntoView({ behavior: 'smooth' });
                                    } else {
                                        window.location.hash = 'pricing';
                                    }
                                }} className="w-full text-center bg-primary text-white py-3 rounded-xl font-bold">
                                    Get Started
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};


// Testimonials section removed as it's not being rendered in the main page currently


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
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">Link your Shopify store and Ad accounts securely via encrypted API. Cluemetrics establishes a permanent, secure handshake instantly.</p>
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

const WhyChooseUs = () => {
    const reasons = [
        {
            title: 'Save Hours Every Week',
            description: 'With or without dashboards, no exports, just insight and recommendations.',
            emoji: '⏱️',
            iconBg: 'bg-emerald-50',
            iconText: 'text-emerald-600',
        },
        {
            title: 'Plain-English Summaries',
            description: 'Understand your business at a glance.',
            emoji: '💡',
            iconBg: 'bg-purple-50',
            iconText: 'text-purple-600',
        },
        {
            title: 'Secure & Automated',
            description: 'Works 24/7 without manual effort.',
            emoji: '🛡️',
            iconBg: 'bg-sky-50',
            iconText: 'text-sky-600',
        },
        {
            title: 'Your Channel, Your Choice',
            description: 'Slack, WhatsApp, or Email.',
            emoji: '🌐',
            iconBg: 'bg-amber-50',
            iconText: 'text-amber-600',
        },
    ];

    // Card styles applied via inline styles for md+ breakpoint
    // These are applied conditionally based on window width in the component
    const cardStyles = [
        { rotate: '0deg', translateY: '0.75rem', marginLeft: undefined },        // Save Hours Every Week
        { rotate: '3deg', translateY: '1rem', marginLeft: '-1.8rem' },           // Plain-English Summaries
        { rotate: '0deg', translateY: '-1rem', marginLeft: '-1.8rem' },          // Secure & Automated (raised center)
        { rotate: '-3.5deg', translateY: '0.5rem', marginLeft: '-1.8rem' },      // Your Channel, Your Choice
    ];

    const zOrder = [20, 40, 50, 50];

    const [isMd, setIsMd] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia('(min-width: 768px)');
        setIsMd(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsMd(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    return (
        <section id="why-choose-us" className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="relative rounded-[2rem] bg-brand-600 pt-10 pb-16 md:pb-24 px-6 md:px-10 text-white shadow-2xl shadow-slate-900/25">
                    {/* Top pill line */}
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-1.5 bg-white/70 rounded-full" />
                    </div>

                    <div className="text-center mb-14 flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                            Why Choose Us
                        </h2>
                        <p className="mt-3 text-sm md:text-base text-sky-50/90 max-w-2xl mx-auto font-medium">
                            We provide more than just access — we deliver clear, secure, and always-on insights for every growth-focused team.
                        </p>
                    </div>

                    {/* Cards with overlapping effect */}
                    <div className="relative mt-12 flex flex-col md:flex-row justify-center items-stretch md:items-end max-w-5xl mx-auto gap-6 md:gap-0">
                        {reasons.map((reason, index) => {
                            const s = cardStyles[index];
                            const inlineStyle: React.CSSProperties = {
                                zIndex: zOrder[index],
                                ...(isMd
                                    ? {
                                        transform: `rotate(${s.rotate}) translateY(${s.translateY})`,
                                        marginLeft: s.marginLeft,
                                    }
                                    : {}),
                            };

                            return (
                                <div
                                    key={reason.title}
                                    className="relative group flex-1 max-w-[270px] bg-white rounded-[1.75rem] p-7 border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 mx-auto md:mx-0"
                                    style={inlineStyle}
                                >
                                    <div className={`w-12 h-12 rounded-full ${reason.iconBg} ${reason.iconText} flex items-center justify-center mb-5 text-xl`}>
                                        <span aria-hidden="true">{reason.emoji}</span>
                                    </div>

                                    <h3 className="text-lg md:text-xl font-bold text-primary mb-3 leading-tight">
                                        {reason.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {reason.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Pricing = () => {
    const plans = [
        {
            name: 'Basic',
            tagline: 'Visibility Without Complexity',
            description: 'For store owners who just want clarity',
            price: '9',
            badge: 'Best for Beginners',
            features: [
                'Shopify performance overview',
                'Ads performance preview (blurred Google/Meta insights)',
                'Clean visual dashboard',
                'Automated weekly summary (Email or Slack)',
                'Secure data processing (bank-level encryption)',
                '7-day free trial'
            ],
            positioning: '👉 See what’s happening in your store — without analysis overload.',
            buttonClass: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
            borderClass: 'border-slate-200',
            badgeClass: 'bg-slate-100 text-slate-600',
        },
        {
            name: 'Standard',
            tagline: 'Unified Performance View',
            description: 'For stores running ads and needing full visibility',
            price: '29',
            badge: 'For Growing Stores',
            popular: true,
            features: [
                'Everything in Basic PLUS',
                'Full Shopify sales dashboard',
                'Full Google Ads performance charts',
                'Full Meta Ads performance charts',
                'Cross-platform performance view',
                'Scheduled report delivery (Email, Slack, WhatsApp)',
                'Multi-account integrations'
            ],
            positioning: '👉 Understand your entire growth engine in one place.',
            buttonClass: 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20',
            borderClass: 'border-brand-500 shadow-2xl shadow-brand-900/10 scale-105 z-10',
            badgeClass: 'bg-brand-500 text-white',
        },
        {
            name: 'Premium',
            tagline: 'AI Growth Engine',
            description: 'For businesses that want results, not reports',
            price: '49',
            badge: 'Most Popular',
            aiBadge: 'AI Powered',
            features: [
                'Everything in Standard PLUS',
                'AI analysis of Shopify + Ads performance',
                'Clear growth recommendations',
                'Revenue improvement roadmap',
                'Action milestones to increase sales',
                'Sales health score tracking',
                'Priority processing',
                'Advanced report frequency'
            ],
            positioning: '👉 Cluemetrics doesn’t show data — it tells you how to grow.',
            buttonClass: 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/20',
            borderClass: 'border-slate-200',
            badgeClass: 'bg-purple-100 text-purple-700',
        }
    ];

    const features = [
        { name: 'Shopify Sales Visibility', basic: '✓', standard: '✓', premium: '✓' },
        { name: 'Google Ads Analytics', basic: 'Preview', standard: '✓', premium: '✓' },
        { name: 'Meta Ads Analytics', basic: 'Preview', standard: '✓', premium: '✓' },
        { name: 'Automated Report Delivery', basic: '✓', standard: '✓', premium: '✓' },
        { name: 'AI Growth Recommendations', basic: '—', standard: '—', premium: '✓' },
        { name: 'Revenue Milestones', basic: '—', standard: '—', premium: '✓' },
        { name: 'Unified Performance View', basic: '—', standard: '✓', premium: '✓' },
        { name: 'Priority Processing', basic: '—', standard: '—', premium: '✓' },
        { name: 'Free Trial', basic: '7 days', standard: '—', premium: '—' },
    ];

    return (
        <section id="pricing" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="text-center mb-16 md:mb-[6rem]">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-primary mb-6">
                        Not just dashboards. Decisions delivered.
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-6">
                        Cluemetrics combines beautiful performance dashboards with automated summaries and AI recommendations sent directly to you — no digging through data.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 md:mb-[6rem] items-stretch md:items-center">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`relative bg-white rounded-3xl p-8 border-2 ${plan.borderClass} transition-all duration-300 hover:shadow-2xl flex flex-col h-full ${!plan.popular ? 'my-2 md:my-0' : 'z-20 md:z-10'}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-brand-500 text-white text-sm font-[600] rounded-full shadow-md">
                                    {plan.badge}
                                </div>
                            )}
                            {!plan.popular && (
                                <div className={`inline-block w-max px-3 py-1 text-xs font-[600] rounded-full mb-6 ${plan.badgeClass}`}>
                                    {plan.badge}
                                </div>
                            )}
                            {plan.aiBadge && (
                                <div className="absolute top-8 right-8 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-sm">
                                    {plan.aiBadge}
                                </div>
                            )}

                            <div className={`text-center ${plan.popular ? 'mt-4' : ''}`}>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline justify-center gap-1 mb-2">
                                    <span className="text-5xl font-extrabold text-slate-900">${plan.price}</span>
                                    <span className="text-slate-500 font-medium">/month</span>
                                </div>
                                <p className="text-slate-800 font-semibold mb-1">{plan.tagline}</p>
                                <p className="text-sm text-slate-500 mb-8 h-10">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <svg className={`w-5 h-5 shrink-0 mt-0.5 ${i === 0 && plan.name !== 'Basic' ? 'text-primary' : 'text-emerald-500'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className={`text-sm ${i === 0 && plan.name !== 'Basic' ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="bg-slate-50 rounded-xl p-4 mb-8 text-sm text-slate-700 italic border border-slate-100">
                                {plan.positioning}
                            </div>

                            <button
                                onClick={async () => {
                                    const { data: { session } } = await supabase.auth.getSession();
                                    if (session) {
                                        const { data: profile } = await supabase
                                            .from('profiles')
                                            .select('store_id')
                                            .eq('id', session.user.id)
                                            .single();
                                            
                                        if (profile?.store_id) {
                                            // Had verified store_id, redirect to checkout
                                            window.location.href = `https://bizsummaryai.lemonsqueezy.com/checkout/buy/5214473e-6356-4023-a361-01a6e7b1d125?checkout[email]=${session.user.email}&checkout[custom][store_id]=${profile.store_id}`;
                                        } else {
                                            // Need to create store_id
                                            window.location.href = `/verify?plan=${plan.name.toLowerCase()}`;
                                        }
                                    } else {
                                        // Not logged in, send to auth and tell it to bounce back to Verify
                                        window.location.href = `/auth?redirect=/verify&plan=${plan.name.toLowerCase()}`;
                                    }
                                }}
                                className={`w-full py-4 rounded-xl font-bold transition-colors ${plan.buttonClass}`}
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>

                {/* Feature Comparison Table */}
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Compare Plans</h3>
                        <p className="text-slate-600">See exactly what you get at every tier.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="py-4 px-6 border-b-2 border-slate-200 text-slate-800 font-bold bg-slate-50/50 rounded-tl-xl w-1/3">Capability</th>
                                    <th className="py-4 px-6 border-b-2 border-slate-200 text-slate-800 font-bold bg-slate-50/50 text-center">Basic</th>
                                    <th className="py-4 px-6 border-b-2 border-slate-200 text-brand-600 font-bold bg-brand-50/50 text-center">Standard</th>
                                    <th className="py-4 px-6 border-b-2 border-slate-200 text-purple-600 font-bold bg-purple-50/50 text-center rounded-tr-xl">Premium</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {features.map((feature, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors duration-150">
                                        <td className="py-4 px-6 text-sm font-semibold text-slate-700">{feature.name}</td>
                                        <td className="py-4 px-6 text-sm text-center font-medium text-slate-600">
                                            {feature.basic === '✓' ? <span className="text-emerald-500 font-bold text-lg">✓</span> : feature.basic}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-center font-medium text-slate-600 bg-brand-50/10">
                                            {feature.standard === '✓' ? <span className="text-emerald-500 font-bold text-lg">✓</span> : feature.standard}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-center font-medium text-slate-600 bg-purple-50/10">
                                            {feature.premium === '✓' ? <span className="text-emerald-500 font-bold text-lg">✓</span> : feature.premium}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

const FinalCTA = () => {
    return (
        <section className="py-24 bg-brand-600 relative overflow-hidden flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10 text-white">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                    Make smarter decisions without digging through data.
                </h2>
                <p className="text-lg md:text-xl text-brand-50 mb-10 leading-relaxed font-medium md:px-8">
                    Cluemetrics shows your performance in a clear dashboard, explains what&apos;s happening, and delivers actionable summaries with AI recommendations to Slack, Email, or WhatsApp.
                </p>
                <div className="flex items-center justify-center">
                    <button onClick={() => {
                        const pricingElement = document.getElementById('pricing');
                        if (pricingElement) {
                            pricingElement.scrollIntoView({ behavior: 'smooth' });
                        } else {
                            window.location.hash = 'pricing';
                        }
                    }} className="w-[80vw] sm:w-auto px-8 py-4 bg-white text-brand-600 rounded-xl font-[600] text-lg hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                        Start Your Free 7-Day Trial
                    </button>
                </div>
            </div>
            {/* Background glowing decorations */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-brand-500/50 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-brand-400/50 blur-[80px] rounded-full" />
        </section>
    );
};

export const Footer = () => (
    <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between gap-16 mb-16">
                <div className="w-full max-w-[40rem] flex-shrink-0">
                    <div className="flex items-center mb-6">
                        <img src="/logo.png" alt="Cluemetrics Logo" className="logo-brand drop-shadow-md filter brightness-0 invert" loading="lazy" />
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Simplifying business insights with AI-powered summaries and recommendations delivered to your preferred channel.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-600 hover:text-white transition-all">
                            <Linkedin className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#25D366] hover:text-white transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.031 2.016A10.021 10.021 0 0122.05 12.037c0 5.513-4.484 9.996-9.998 9.996-1.761 0-3.468-.456-4.997-1.3l-5.61 1.472 1.5-5.464a9.966 9.966 0 01-1.35-5.068c0-5.513 4.483-9.998 9.997-9.998H12.03zM16.936 15.35c-.267-.091-1.58-.781-1.825-.872-.244-.09-.422-.136-.6.136-.178.273-.69.871-.845 1.053-.156.182-.312.204-.579.112-.267-.091-1.127-.416-2.146-1.325-.792-.707-1.326-1.582-1.482-1.855-.156-.272-.017-.42.118-.555.121-.121.267-.312.4-.467.133-.156.178-.273.267-.455.089-.182.044-.34-.022-.477-.067-.136-.6-1.448-.823-1.983-.213-.53-.43-.455-.6-.464-.156-.006-.334-.006-.512-.006a.987.987 0 00-.712.33c-.244.273-.934.912-.934 2.224 0 1.313.957 2.585 1.09 2.767.134.182 1.886 2.875 4.568 4.032.636.273 1.134.435 1.52.557.638.204 1.218.175 1.673.106.51-.077 1.58-.644 1.802-1.267.223-.623.223-1.156.156-1.267-.067-.11-.245-.177-.512-.268z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-end gap-12 md:gap-24 w-full md:w-2/3">
                    <div className="w-full sm:w-auto">
                        <h3 className="text-white font-semibold mb-6">Product</h3>
                        <ul className="space-y-4">
                            <li><Link to="/#how-it-works" className="text-slate-400 hover:text-white transition-colors">Features</Link></li>
                            <li><Link to="/#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div className="w-full sm:w-auto">
                        <h3 className="text-white font-semibold mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><Link to="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link></li>
                            <li><Link to="/about-us" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/contact-us" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>

                        </ul>
                    </div>

                    <div className="w-full sm:w-auto">
                        <h3 className="text-white font-semibold mb-6">Legal</h3>
                        <ul className="space-y-4">
                            <li><Link to="/terms-of-service" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/cookie-policy" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-center">
                <p className="text-slate-500 text-sm">
                    © {new Date().getFullYear()} Cluemetrics. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
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
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-brand-50/50 rounded-full blur-3xl -z-10 opacity-80" />

                <div className="space-y-8 z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl lg:text-6xl font-extrabold text-primary tracking-tight leading-tight"
                    >
                        Stop Guessing. Start Scaling.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xl text-slate-600 leading-relaxed max-w-lg"
                    >
                        Cluemetrics automatically syncs your Shopify store data with your Ads performance. Get daily summaries delivered to Slack, WhatsApp, or Email so you can focus on growth, not spreadsheets.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                        <button onClick={() => {
                            const pricingElement = document.getElementById('pricing');
                            if (pricingElement) {
                                pricingElement.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                window.location.hash = 'pricing';
                            }
                        }} className="inline-flex justify-center items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-8 py-3.5 rounded-lg font-semibold transition-all shadow-[0_0_40px_-10px_rgba(20,184,166,0.5)] hover:shadow-[0_0_60px_-15px_rgba(20,184,166,0.6)]">
                            Build Your First Report <ArrowRight className="w-5 h-5" />
                        </button>
                        <a href="#how-it-works" className="inline-flex justify-center items-center gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-8 py-3.5 rounded-lg font-semibold transition-all shadow-sm">
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
                                alt="Cluemetrics Preview Mockup"
                                className={`w-full h-full object-cover absolute inset-0 ${currentImage === 0 ? 'object-[center_10%]' : 'object-center'}`}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                                loading="eager"
                                decoding="async"
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
            <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-8 -mt-10 mb-[-7rem]">
                {/* Full-width separator line placed explicitly on top of/outside the menu island */}
                <hr className="w-full border-t-[1.5px] border-slate-200/60 shadow-sm relative z-30 mb-0" />

                <div className="bg-white/80 backdrop-blur-md rounded-[1rem] rounded-tl-none rounded-tr-none p-6 sm:pt-[2rem] sm:px-[2rem] sm:pb-[1rem] flex flex-col gap-6 relative shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)]">
                    {/* Top Row: Spaced-out Selling Points */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-sm sm:text-base font-bold text-slate-800 tracking-tight w-full pt-1">
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

                    {/* Navigation Links */}
                    <div className="flex flex-wrap justify-center items-end gap-6 sm:gap-10 text-sm font-semibold text-slate-500 pb-3">
                        <div className="relative flex flex-col items-center" style={{ paddingTop: '10px' }}>
                            <a href="#how-it-works" className="text-brand-600 pb-1.5 transition-colors">How It Works</a>
                            <div className="absolute bottom-0 w-[calc(100%+8px)] h-[3px] bg-brand-500 rounded-t-[4px] rounded-b-none shadow-[0_-2px_8px_rgba(20,184,166,0.4)]" />
                        </div>
                        <a href="#why-choose-us" className="hover:text-brand-600 transition-colors pb-1.5" style={{ paddingTop: '7px' }}>Why Choose Us</a>
                        <a href="#pricing" className="hover:text-brand-600 transition-colors pb-1.5" style={{ paddingTop: '7px' }}>Pricing</a>
                        <a href="#testimonials" className="hover:text-brand-600 transition-colors pb-1.5" style={{ paddingTop: '7px' }}>Testimonials</a>
                    </div>
                </div>
            </div>

            <HowItWorks />
            <WhyChooseUs />
            <Pricing />
            <FinalCTA />
            <Footer />
        </div>
    );
};

export default LandingPage;
