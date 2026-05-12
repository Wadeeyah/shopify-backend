import { Navbar, Footer } from './LandingPage';
import { Target, Lock, Zap, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-[#fafaf8] flex flex-col font-sans selection:bg-brand-500/30">
            <div className="relative z-20">
                <Navbar />
            </div>

            <main className="flex-1 flex flex-col w-full relative z-10">

                {/* Hero / Intro Section */}
                <section className="w-full px-4 md:px-8 py-16 md:py-24 max-w-7xl mx-auto overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="order-2 lg:order-1 space-y-8 relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100/50">
                                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                                <span className="text-sm font-semibold tracking-wide text-brand-700 uppercase">About Us</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
                                InsightFlow exists to bring structure <span className="text-brand-600">and intelligence</span> to modern commerce.
                            </h1>

                            <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium max-w-xl">
                                <p>
                                    Today's store owners operate in an environment flooded with metrics, platforms, and fragmented reports. The challenge is no longer access to data — it is knowing what truly matters and what to do next.
                                </p>
                                <p>
                                    InsightFlow transforms performance data into clear, actionable direction. We unify Shopify and advertising performance into a refined dashboard, apply intelligent analysis, and deliver meaningful insights directly to you.
                                </p>
                            </div>

                            <div className="pt-4">
                                <p className="text-xl font-bold text-slate-800 border-l-[4px] border-brand-500 pl-4 py-1">
                                    No noise. No guesswork. Just clarity that drives action.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-slate-500 font-semibold">
                                <span>Built for modern eCommerce founders</span>
                                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                <span>AI-powered insights</span>
                                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                <span>Shopify & Ads performance intelligence</span>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end animate-fade-in-up">
                            {/* Decorative background blocks */}
                            <div className="absolute inset-0 bg-brand-100/50 rounded-[2.5rem] transform rotate-3 scale-[0.98] -z-10 transition-transform hover:rotate-6 duration-500"></div>
                            <div className="absolute inset-0 bg-slate-100 rounded-[2.5rem] transform -rotate-3 scale-[0.98] -z-20 transition-transform hover:-rotate-6 duration-500"></div>

                            <img
                                src="/about-hero.jpg"
                                alt="InsightFlow dashboard analytics visualization"
                                className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover rounded-[2.5rem] shadow-2xl z-10 relative ifam-elevation filter hover:scale-[1.01] transition-transform duration-500"
                            />

                            {/* Floating Card */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl z-30 hidden md:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Data-Driven</p>
                                        <p className="text-xs text-slate-500 font-medium">Clarity and purpose</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className="w-full px-4 md:px-8 py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
                    {/* Background blob */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Our Philosophy</h2>
                            <p className="text-2xl md:text-3xl font-bold text-brand-400 leading-snug">
                                We believe growth should be intentional.
                            </p>
                            <div className="space-y-6 text-xl text-slate-300 font-medium border-l-[3px] border-brand-500/30 pl-8">
                                <p className="relative">
                                    <span className="absolute -left-[39px] top-2.5 w-2 h-2 rounded-full bg-brand-400 shadow-[0_0_10px_rgba(20,184,166,0.6)]"></span>
                                    Data without interpretation creates hesitation.
                                </p>
                                <p className="relative">
                                    <span className="absolute -left-[39px] top-2.5 w-2 h-2 rounded-full bg-brand-400 shadow-[0_0_10px_rgba(20,184,166,0.6)]"></span>
                                    Interpretation without action creates stagnation.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 to-purple-600/20 rounded-[2rem] transform rotate-3 -z-10 blur-xl"></div>
                            <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 md:p-12 border border-white/10 shadow-2xl relative">
                                <svg className="w-12 h-12 text-brand-500/40 mb-6" fill="currentColor" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" /></svg>

                                <p className="text-xl md:text-2xl font-semibold leading-relaxed text-slate-100">
                                    InsightFlow was designed to bridge that gap — combining visual clarity with intelligent guidance so founders can move forward with confidence.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Meet the Founder Section */}
                <section className="w-full px-4 md:px-8 py-16 md:py-24 max-w-7xl mx-auto bg-[#fafaf8]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-center">
                        <div className="relative flex justify-center lg:justify-start">
                            <div className="absolute inset-0 bg-brand-600/10 rounded-[2.5rem] transform -rotate-3 scale-[0.95] -z-10 transition-transform hover:-rotate-6 duration-500"></div>

                            <img
                                src="/about-founder.png"
                                alt="Saani Sheriff - Founder"
                                className="w-full max-w-md lg:max-w-none lg:w-[90%] object-cover rounded-[2.5rem] aspect-[3/4] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-10 relative filter contrast-[1.02] hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-sm font-bold tracking-widest text-brand-600 uppercase">Meet the Founder</h2>
                                <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Saani Sheriff</h3>
                                <p className="text-lg font-bold text-slate-500 tracking-wide">Founder of InsightFlow • Systems Engineer • Product Architect</p>
                                <p className="text-sm text-slate-500 pt-2">
                                    Focused on building intelligent systems that help founders understand performance and scale with confidence.
                                </p>
                            </div>

                            <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium pt-2">
                                <p>
                                    With a background in engineering and digital systems, I have always been driven by one principle: <strong className="text-slate-900 font-bold">complexity should serve people — not overwhelm them.</strong>
                                </p>
                                <p>
                                    After observing how eCommerce founders struggle with fragmented analytics and time-consuming analysis, I set out to build a platform that does more than display numbers. InsightFlow was created to interpret performance, surface meaningful direction, and provide a structured path toward measurable growth.
                                </p>
                            </div>

                            <div className="inline-flex items-center gap-4 bg-white px-6 py-5 rounded-2xl border border-slate-200 shadow-sm mt-4">
                                <div className="p-2 bg-brand-50 text-brand-600 rounded-full shrink-0">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <span className="text-slate-800 font-bold text-sm sm:text-base leading-snug">
                                    Built with precision, security, and long-term scalability in mind.
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Visual Divider */}
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                </div>

                {/* Our Commitment Section */}
                <section className="w-full px-4 md:px-8 py-16 md:py-24 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Our Commitment</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                                We are committed to a framework of transparency and utility that aligns our platform with your success.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
                            {[
                                { title: 'Clear, responsible data interpretation', icon: <Target className="w-6 h-6" /> },
                                { title: 'Secure and reliable integrations', icon: <Lock className="w-6 h-6" /> },
                                { title: 'Action-oriented intelligence', icon: <Zap className="w-6 h-6" /> },
                                { title: 'A product experience grounded in simplicity and control', icon: <Sliders className="w-6 h-6" /> },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-5 bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all group">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm shrink-0 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
                                        {item.icon}
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-lg font-bold text-slate-900 leading-snug">{item.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="max-w-4xl mx-auto text-center bg-brand-50 p-8 md:p-12 rounded-[2rem] border border-brand-100/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-relaxed relative z-10 text-balance">
                                InsightFlow is not designed to impress with complexity. <br className="hidden md:block" />
                                <span className="text-brand-600">It is designed to deliver clarity that compounds over time.</span>
                            </h3>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full px-4 md:px-8 py-16 md:py-24 bg-slate-900 text-white">
                    <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
                        <h2 className="text-4xl md:text-5xl font-extrabold">
                            Ready to see your business with clarity?
                        </h2>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            InsightFlow turns complex performance data into structured insights you can actually act on.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
                            <Link to="/auth" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                                Start Free Trial
                            </Link>
                            <Link to="/auth" className="border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors">
                                View Product
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;
