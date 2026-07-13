import { Navbar, Footer } from './LandingPage';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

const ContactUs = () => {
    return (
        <div className="min-h-screen bg-[#fafaf8] flex flex-col font-sans selection:bg-brand-500/30">
            <div className="relative z-20">
                <Navbar />
            </div>

            <main className="flex-1 flex flex-col items-center justify-start px-4 md:px-8 pt-12 md:pt-20 pb-24 relative z-10 w-full">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto w-full text-center mb-16 space-y-4">
                    <p className="text-sm font-semibold tracking-wider text-slate-500 uppercase">Contact Us</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Get in touch with us</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Fill out the form below or schedule a meeting with us at your convenience.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                    {/* Left Column - Form */}
                    <div className="flex flex-col space-y-8">
                        <form className="space-y-6">
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Name</label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter Your Email"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="Enter Your Message"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors placeholder:text-slate-400 resize-y"
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-3 pb-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <label htmlFor="terms" className="text-sm text-slate-600">
                                    I agree with <a href="/terms-of-service" className="text-slate-500 underline hover:text-slate-800 transition-colors">Terms and Conditions</a>
                                </label>
                            </div>

                            <button
                                type="button"
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 rounded-lg transition-colors shadow-sm"
                            >
                                Send Your Request
                            </button>
                        </form>

                        <div className="pt-8 border-t border-slate-200/60 text-left">
                            <p className="font-semibold text-slate-900 mb-6">You can also Contact Us via</p>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 bg-white shadow-sm">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">support@insightflow.com</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 bg-white shadow-sm">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">+1 000-000-0000</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info List & Address */}
                    <div className="flex flex-col space-y-12 text-left">
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900">Why founders choose InsightFlow</h2>
                            <ul className="space-y-5">
                                <li className="flex items-start gap-4 text-slate-700">
                                    <CheckCircle2 className="w-6 h-6 text-brand-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-slate-900 mb-1">See your entire store performance in one clear view</strong>
                                        <span className="text-slate-500 text-sm leading-relaxed">Unify Shopify, Google Ads, and Meta Ads data in a clean, actionable dashboard.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 text-slate-700">
                                    <CheckCircle2 className="w-6 h-6 text-brand-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-slate-900 mb-1">Receive AI-powered growth recommendations</strong>
                                        <span className="text-slate-500 text-sm leading-relaxed">Get plain-language insights that tell you what to improve and why it matters.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 text-slate-700">
                                    <CheckCircle2 className="w-6 h-6 text-brand-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-slate-900 mb-1">Track revenue milestones with confidence</strong>
                                        <span className="text-slate-500 text-sm leading-relaxed">Know your next performance target — and how to reach it.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 text-slate-700">
                                    <CheckCircle2 className="w-6 h-6 text-brand-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-slate-900 mb-1">Get insights delivered automatically</strong>
                                        <span className="text-slate-500 text-sm leading-relaxed">Receive summaries and updates in Slack, Email, or WhatsApp — no manual digging.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 text-slate-700">
                                    <CheckCircle2 className="w-6 h-6 text-brand-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-slate-900 mb-1">Save hours every week on analysis</strong>
                                        <span className="text-slate-500 text-sm leading-relaxed">Spend less time interpreting data and more time growing your store.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 text-slate-700">
                                    <CheckCircle2 className="w-6 h-6 text-brand-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-slate-900 mb-1">Scale smarter without hiring an analyst</strong>
                                        <span className="text-slate-500 text-sm leading-relaxed">Make informed decisions without adding team overhead.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-200/60">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-5 h-5 text-slate-900" />
                                    <h3 className="font-bold text-slate-900">USA</h3>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
                                    280 W, 17th street<br />
                                    4th floor, Flat no: 407<br />
                                    New York NY, 10018
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-5 h-5 text-slate-900" />
                                    <h3 className="font-bold text-slate-900">India</h3>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
                                    Plot No 8-2-601/p/15ms<br />
                                    Banjara Hills, Road No 10<br />
                                    Hyderabad, 500034
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactUs;
