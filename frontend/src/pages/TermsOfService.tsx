import { Navbar, Footer } from './LandingPage';

const TermsOfService = () => {
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
                            Terms of Service
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
                        {/* Intro snippet */}
                        <div className="space-y-4 mb-[40px]">
                            <p>By accessing or using InsightFlow (the "Service"), you signify that you have read, understood, and agree to be bound by these Terms of Service ("Terms").</p>
                            <p>If you do not agree to these Terms, you may not access or use the Service.</p>
                            <p>These Terms constitute a legally binding agreement between you ("User," "Customer," or "you") and InsightFlow ("we," "us," or "our").</p>
                        </div>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">1. Description of Service</h2>
                            <p className="mb-4">InsightFlow is a software-as-a-service (SaaS) platform that provides analytics and reporting through the following core functions:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Aggregates performance data from securely connected third-party platforms (e.g., Shopify, Google Ads, Meta Ads).</li>
                                <li>Displays such connected data in an organized dashboard format.</li>
                                <li>Generates automated summaries and AI-powered performance recommendations based on your metrics.</li>
                                <li>Delivers actionable insights via Slack, Email, WhatsApp, or other supported communication channels.</li>
                            </ul>
                            <p className="font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <strong>Important limit on scope:</strong> InsightFlow is exclusively an analytics and reporting tool. InsightFlow does not execute advertising campaigns, automatically modify store settings, or make financial decisions on your behalf.
                            </p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">2. Eligibility</h2>
                            <p className="mb-4">You must be at least <strong>18 years old</strong> and legally capable of entering into binding agreements to use the Service. By accessing or using InsightFlow, you represent and warrant that you meet these eligibility requirements.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">3. Account Registration</h2>
                            <p className="mb-4">To fully access and use the Service, you must register for an account. By registering, you agree to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Provide and maintain accurate, current, and complete information.</li>
                                <li>Maintain the strictest security and confidentiality of your login credentials.</li>
                                <li>Accept responsibility for all activity occurring under your account, whether authorized by you or not.</li>
                            </ul>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">4. Subscription Plans & Billing</h2>
                            <p className="mb-4">InsightFlow operates on a subscription-based model to provide ongoing access to our platform.</p>

                            <h3 className="text-[18px] font-semibold text-slate-800 mt-6 mb-3">A. Subscription Tiers</h3>
                            <p className="mb-4">Features and limits vary by plan (e.g., Basic, Standard, Premium). Details are available on our Pricing page.</p>

                            <h3 className="text-[18px] font-semibold text-slate-800 mt-6 mb-3">B. Billing</h3>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Subscriptions are billed either monthly or annually, as selected during checkout.</li>
                                <li>Charges are securely processed via verified third-party payment providers.</li>
                                <li>By subscribing, you explicitly authorize recurring billing on your selected payment method until your subscription is canceled.</li>
                            </ul>

                            <h3 className="text-[18px] font-semibold text-slate-800 mt-6 mb-3">C. Free Trial</h3>
                            <p className="mb-2">If a free trial period is offered and you accept:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Standard subscription billing begins automatically immediately after the trial period ends.</li>
                                <li>To avoid charges, you must actively cancel prior to the expiration of the trial period.</li>
                            </ul>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">5. Cancellation & Termination</h2>
                            <p className="mb-4">You maintain complete control over your subscription status:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>You may cancel your subscription at any time through your account settings dashboard.</li>
                                <li>Cancellation immediately stops future recurring billing for subsequent billing cycles.</li>
                                <li>No partial refunds or prorated credits will be provided for active billing cycles unless explicitly outlined in a standalone Refund Policy.</li>
                            </ul>
                            <p className="font-semibold text-slate-800 mt-4">We reserve the right to immediately suspend or permanently terminate accounts that violate these Terms or engage in fraudulent activity.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">6. Third-Party Integrations</h2>
                            <p className="mb-4">InsightFlow relies on secure API connections to third-party platforms to function. By connecting these platforms, you acknowledge and agree that:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>You grant InsightFlow permission to securely access performance data via authorized APIs on your behalf.</li>
                                <li>InsightFlow cannot be held responsible for service outages, unannounced API changes, rate limits, or underlying data inaccuracies caused directly by third-party providers.</li>
                                <li>Your ongoing use of those third-party platforms remains strictly subject to their respective terms of service and policies.</li>
                            </ul>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">7. AI-Generated Insights & Disclaimer</h2>
                            <p className="mb-4">InsightFlow leverages automated systems and generalized AI models to process data and generate recommendations. You unequivocally understand and agree that:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li><strong>AI-generated recommendations are for informational purposes only.</strong></li>
                                <li>Outputs do not constitute financial, legal, tax, investment, or certified professional advice.</li>
                                <li>You remain solely and completely responsible for any and all business decisions made or actions taken based on insights provided by the Service.</li>
                                <li>We make absolutely no guarantee, warranty, or promise of revenue growth, profitability, marketing success, or specific business outcomes.</li>
                            </ul>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">8. Acceptable Use</h2>
                            <p className="mb-4">To maintain the integrity of the Service, you agree <strong>not</strong> to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Use the Service for any unlawful, fraudulent, or malicious purposes.</li>
                                <li>Attempt to reverse engineer, decompile, or otherwise interfere with the core platform infrastructure.</li>
                                <li>Use automated scripts, bots, or scrapers to unethically extract data or overload system resources.</li>
                                <li>Intentionally circumvent subscription limitations or usage caps.</li>
                                <li>Share your licensed account credentials with unauthorized third-party users.</li>
                            </ul>
                            <p className="font-semibold text-slate-800 mt-4 text-red-600/90">Violation of these acceptable use terms may result in immediate account suspension without refund or notice.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">9. Intellectual Property</h2>
                            <p className="mb-4">All platform architecture, content, visual design, custom software, proprietary AI prompts/models, and documentation are exclusively owned by InsightFlow and are protected by international intellectual property laws.</p>
                            <p className="mb-4">You are granted a limited, personal, non-transferable, and non-exclusive license strictly to use the Service internally during your active subscription period.</p>
                            <p className="font-semibold text-slate-800">You may not copy, reproduce, explicitly resell, creatively mirror, or commercially redistribute the platform or its underlying mechanics without written consent.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">10. Data Ownership</h2>
                            <p className="mb-4"><strong>You retain full, original ownership of your business data.</strong></p>
                            <p className="mb-4">By connecting your accounts and using the Service, you grant us a secure, limited working license strictly to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Process your historical and active data safely.</li>
                                <li>Analyze metrics within our internal models.</li>
                                <li>Generate relevant platform summaries.</li>
                                <li>Deliver targeted insights to your designated channels.</li>
                            </ul>
                            <p className="font-semibold text-slate-800 mt-4">This license is granted <strong>solely</strong> for the purpose of providing the intended Service. We unequivocally do not sell your personal or business data.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">11. Service Availability</h2>
                            <p className="mb-4">We strive to maintain highly reliable uptime and platform stability but do not strictly guarantee 100% uninterrupted service.</p>
                            <p className="mb-2">We are not legally or financially liable for:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Scheduled maintenance downtime or unexpected outages.</li>
                                <li>Transmission delays or intermittent data latency.</li>
                                <li>API failures, rate limits, or broken connections stemming from third-party providers.</li>
                                <li>Delivery failures due to external messaging protocols (e.g., WhatsApp outages).</li>
                            </ul>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">12. Limitation of Liability</h2>
                            <p className="mb-4">To the maximum extent permitted by applicable law, InsightFlow shall <strong>not</strong> be liable for:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Loss of expected profits, revenue, or business valuation.</li>
                                <li>Business interruption or loss of operational continuity.</li>
                                <li>Direct advertising losses or misallocated campaign budgets.</li>
                                <li>Indirect, special, incidental, punitive, or consequential damages.</li>
                                <li>Business or financial decisions executed by human users based on our AI recommendations.</li>
                            </ul>
                            <p className="font-semibold text-slate-800 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                In no event shall our total aggregate liability exceed the total amount actively paid by you to InsightFlow in the three (3) months immediately preceding the event giving rise to the claim.
                            </p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">13. Indemnification</h2>
                            <p className="mb-4">You agree to defend, indemnify, and hold harmless InsightFlow, its officers, directors, employees, and agents from any claims, damages, obligations, losses, liabilities, costs, or debt arising from:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Your intentional misuse or abuse of the Service.</li>
                                <li>Your direct violation of any clause within these Terms.</li>
                                <li>Your breach of connected third-party platform terms or statutory laws.</li>
                            </ul>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">14. Modifications to Service</h2>
                            <p className="mb-4">To continually improve our platform, we explicitly reserve the right to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Modify, add, or deprecate product features.</li>
                                <li>Adjust base or tiered pricing.</li>
                                <li>Add new or remove obsolete third-party integrations.</li>
                                <li>Update parameters of subscription plans.</li>
                            </ul>
                            <p>Material or impactful changes that substantially alter your experience or billing will be proactively communicated to active users.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">15. Governing Law</h2>
                            <p>These Terms shall be exclusively governed by and construed in accordance with the laws of <strong>Ghana</strong>, without regard to its conflict of law principles or external jurisdictional rulings.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">16. Dispute Resolution</h2>
                            <p className="mb-4">Any binding disputes arising from or relating to these Terms shall be resolved through the following sequential process:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li><strong>Good-faith negotiation first:</strong> We encourage reaching out to support to resolve issues amicably.</li>
                                <li><strong>Binding arbitration:</strong> If negotiation fails, disputes will be settled via binding arbitration, unless outright prohibited by prevailing local law.</li>
                            </ul>
                            <p className="font-semibold text-slate-800 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                                Class Action Waiver: Users explicitly waive the right to participate in consolidated class-action lawsuits or representative proceedings against InsightFlow.
                            </p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">17. Changes to These Terms</h2>
                            <p className="mb-4">We may systematically update these Terms periodically to reflect evolving products or legal standards. When updated, the effective date will change.</p>
                            <p>Your continued access or use of the Service after such modifications constitutes your formal acceptance of the revised Terms.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] pb-[16px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">18. Contact Information</h2>
                            <p className="mb-4">If you have specific questions, objections, or legal inquiries regarding these Terms, please contact:</p>
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 text-slate-700">
                                <p className="font-semibold text-slate-900 mb-2 text-lg">InsightFlow Legal & Support</p>
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

export default TermsOfService;
