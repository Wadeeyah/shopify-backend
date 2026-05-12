import React, { useState } from 'react';

import { ShieldCheck, Gift, Zap, CheckCircle2 } from 'lucide-react';
import { Navbar, Footer } from './LandingPage';

const BlogWaitlist = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#fafaf8] flex flex-col font-sans selection:bg-brand-500/30">
            <div className="relative z-20">
                <Navbar />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 mt-4 md:mt-10 relative z-10">

                {/* Hero Content */}
                <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                        You're not lost — <br className="hidden sm:block" />
                        <span className="text-slate-800">you're just early.</span>
                    </h1>

                    <div className="space-y-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        <p>
                            We're building a space designed to guide, support, and simplify your journey as a business owner.
                            If you care about growing smarter and moving with clarity, you're in the right place.
                        </p>
                        <p className="font-medium text-slate-700">
                            Give us a little time — something meaningful is on the way.
                        </p>
                    </div>
                </div>

                {/* Email Capture Form */}
                <div className="w-full max-w-xl mx-auto mb-16">
                    <form
                        onSubmit={handleSubscribe}
                        className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80"
                    >
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email to get early access"
                            className="flex-1 bg-slate-50/50 px-6 py-4 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
                            disabled={status === 'loading' || status === 'success'}
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-brand-600/20 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {status === 'loading' ? 'Joining...' : status === 'success' ? 'You\'re on the list!' : 'Join the Waitlist'}
                        </button>
                    </form>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-6 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full border border-slate-200/50">
                            <CheckCircle2 className="w-4 h-4 text-brand-500" />
                            No spam. Only valuable insights
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full border border-slate-200/50">
                            <CheckCircle2 className="w-4 h-4 text-brand-500" />
                            Early access to new features
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full border border-slate-200/50">
                            <CheckCircle2 className="w-4 h-4 text-brand-500" />
                            Priority launch updates
                        </div>
                    </div>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto pb-24">
                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 transition-transform duration-300 hover:-translate-y-1">
                        <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Priority Access</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Be among the first to experience smarter business insights without the guesswork.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 transition-transform duration-300 hover:-translate-y-1">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                            <Gift className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Exclusive Early Benefits</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Unlock special launch perks and exclusive early adopter advantages.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 transition-transform duration-300 hover:-translate-y-1">
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Insider Updates</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Get progress updates and be the first to know when InsightFlow goes live.
                        </p>
                    </div>
                </div>
            </main>

            {/* Subtle decorative background elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/20 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-blue-200/20 rounded-full blur-[120px]" />
            </div>

            <Footer />
        </div>
    );
};

export default BlogWaitlist;
