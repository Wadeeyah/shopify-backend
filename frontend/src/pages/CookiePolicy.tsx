import { Navbar, Footer } from './LandingPage';

const CookiePolicy = () => {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-slate-700 selection:bg-brand-500/30">
            {/* Navbar Wrapper */}
            <div className="relative z-20 bg-white border-b border-slate-200/50">
                <Navbar />
            </div>

            <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 py-12 md:py-20 relative z-10 w-full">
                {/* Main Card Container */}
                <div className="w-full max-w-[800px] bg-white p-6 sm:p-10 md:p-12 lg:p-16 rounded-[12px] shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-200">

                    {/* Header Block */}
                    <div className="mb-[32px] border-b border-slate-100 pb-[24px]">
                        <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight text-slate-900 mb-4 text-left">
                            Cookie Policy
                        </h1>
                        <div className="text-[14px] md:text-[15px] text-slate-500 space-y-1.5 font-medium flex flex-col sm:flex-row sm:gap-6 sm:space-y-0">
                            <div>
                                <span className="text-slate-400">Effective Date:</span> <span className="text-slate-700">March 5, 2026</span>
                            </div>
                            <div className="hidden sm:block text-slate-300">|</div>
                            <div>
                                <span className="text-slate-400">Last Updated:</span> <span className="text-slate-700">March 5, 2026</span>
                            </div>
                        </div>
                        <div className="mt-3 text-[14px] md:text-[15px] text-slate-500 space-y-1.5 font-medium flex flex-col sm:flex-row sm:gap-6 sm:space-y-0">
                            <div>
                                <span className="text-slate-400">Company Name:</span> <span className="text-slate-700">InsightFlow</span>
                            </div>
                            <div className="hidden sm:block text-slate-300">|</div>
                            <div>
                                <span className="text-slate-400">Website:</span> <span className="text-slate-700">www.insightflow.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="text-[16px] md:text-[17px] leading-[1.6] text-slate-600 block text-left">

                        <section className="mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">1. Introduction</h2>
                            <p className="mb-4">This Cookie Policy explains how InsightFlow ("we," "our," "us") uses cookies and similar tracking technologies when you visit or use our website and SaaS platform (the "Service").</p>
                            <p>By continuing to use our Service, you consent to the use of cookies in accordance with this policy, subject to your browser or consent preferences.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">2. What Are Cookies?</h2>
                            <p className="mb-4">Cookies are small text files stored on your device when you visit a website. They help websites function properly, enhance user experience, and provide analytical insights.</p>
                            <p className="mb-4">Cookies may be:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li><strong>Session cookies</strong> (expire when you close your browser)</li>
                                <li><strong>Persistent cookies</strong> (remain on your device for a defined period)</li>
                            </ul>
                            <p>We may also use similar technologies such as pixels, tags, or local storage.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">3. How InsightFlow Uses Cookies</h2>
                            <p className="mb-4">InsightFlow uses cookies to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Ensure secure login and session management</li>
                                <li>Maintain platform functionality</li>
                                <li>Remember user preferences</li>
                                <li>Analyze usage patterns</li>
                                <li>Improve dashboard performance and user experience</li>
                                <li>Monitor system reliability and security</li>
                            </ul>
                            <p className="font-semibold text-slate-800">We do not use cookies to sell personal data.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">4. Types of Cookies We Use</h2>

                            <h3 className="text-[18px] font-semibold text-slate-800 mt-6 mb-3">A. Strictly Necessary Cookies</h3>
                            <p className="mb-4">These cookies are essential for the operation of the Service. They enable:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Secure authentication</li>
                                <li>Account session management</li>
                                <li>Protection against fraudulent activity</li>
                                <li>API connection stability</li>
                            </ul>
                            <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-medium text-slate-700">
                                Without these cookies, the platform cannot function properly.
                            </p>

                            <h3 className="text-[18px] font-semibold text-slate-800 mt-6 mb-3">B. Analytics Cookies</h3>
                            <p className="mb-4">We use analytics tools to understand how users interact with InsightFlow. These cookies help us:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Measure page performance</li>
                                <li>Identify feature usage trends</li>
                                <li>Improve dashboard usability</li>
                                <li>Monitor system efficiency</li>
                            </ul>
                            <p className="mb-4 text-slate-700">Analytics data is aggregated and does not directly identify individual users. Examples may include:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6">
                                <li>Website traffic measurement</li>
                                <li>Platform engagement tracking</li>
                                <li>Feature interaction insights</li>
                            </ul>

                            <h3 className="text-[18px] font-semibold text-slate-800 mt-6 mb-3">C. Functional Cookies</h3>
                            <p className="mb-4">These cookies enhance user experience by remembering:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Dashboard preferences</li>
                                <li>Display settings</li>
                                <li>Notification configurations</li>
                                <li>Saved interface selections</li>
                            </ul>
                            <p className="mb-6">They allow InsightFlow to provide a more personalized experience.</p>

                            <h3 className="text-[18px] font-semibold text-slate-800 mt-6 mb-3">D. Third-Party Cookies</h3>
                            <p className="mb-4">Some cookies may be placed by trusted third-party services that support our operations, such as:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Analytics providers</li>
                                <li>Payment processors</li>
                                <li>Infrastructure or hosting providers</li>
                            </ul>
                            <p className="mb-4">These third parties process data only to the extent necessary to provide their services.</p>
                            <p>We do not control third-party cookies and encourage you to review their respective privacy policies.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">5. Cookies and AI Processing</h2>
                            <p className="mb-4">InsightFlow uses AI systems to analyze performance data and generate insights.</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li><strong>Cookies are not used to train AI models.</strong></li>
                                <li>They are used solely for:
                                    <ul className="list-circle pl-6 mt-2 space-y-1">
                                        <li>Platform functionality</li>
                                        <li>Usage analytics</li>
                                        <li>Performance optimization</li>
                                    </ul>
                                </li>
                            </ul>
                            <p className="font-semibold text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                AI-generated insights are based on integrated performance data (e.g., Shopify or advertising metrics), not on cookie tracking.
                            </p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">6. Managing Your Cookie Preferences</h2>
                            <p className="mb-4">You can control or disable cookies through:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Your browser settings</li>
                                <li>Cookie consent banners (where applicable)</li>
                                <li>Third-party opt-out tools</li>
                            </ul>
                            <p className="text-slate-700 italic">
                                Please note that disabling certain cookies may affect platform functionality, including login persistence and dashboard preferences.
                            </p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">7. Data Retention</h2>
                            <p className="mb-4">Cookies are retained for varying periods depending on their purpose:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li><strong>Session cookies</strong> expire upon browser closure</li>
                                <li><strong>Persistent cookies</strong> remain for a defined duration or until manually deleted</li>
                            </ul>
                            <p>You may delete stored cookies at any time via your browser settings.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">8. International Users</h2>
                            <p className="mb-4">If you access InsightFlow from outside our primary operating jurisdiction, your data may be processed in countries where data protection laws may differ.</p>
                            <p>We implement appropriate safeguards to protect your data in accordance with applicable regulations.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">9. Changes to This Cookie Policy</h2>
                            <p className="mb-4">We may update this Cookie Policy periodically to reflect changes in technology, regulation, or our services.</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Material updates will be communicated through the website or via email where appropriate.</li>
                                <li>Continued use of the Service after updates constitutes acceptance of the revised policy.</li>
                            </ul>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] pb-[16px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">10. Contact Us</h2>
                            <p className="mb-4">If you have questions about this Cookie Policy, please contact:</p>
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 text-slate-700">
                                <p className="font-semibold text-slate-900 mb-2 text-lg">InsightFlow</p>
                                <div className="space-y-2">
                                    <p className="flex items-center gap-2"><strong className="text-slate-500 font-medium min-w-[70px]">Email:</strong> <a href="mailto:support@insightflow.com" className="text-brand-600 hover:text-brand-700 underline font-medium transition-colors">support@insightflow.com</a></p>
                                    <p className="flex items-center gap-2"><strong className="text-slate-500 font-medium min-w-[70px]">Website:</strong> <a href="https://www.insightflow.com" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 underline font-medium transition-colors">www.insightflow.com</a></p>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <div className="w-full mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default CookiePolicy;
