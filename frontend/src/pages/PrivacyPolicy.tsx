import { Navbar, Footer } from './LandingPage';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-slate-700 selection:bg-brand-500/30">
            {/* Navbar Wrapper - Keeping it distinct and clean */}
            <div className="relative z-20 bg-white border-b border-slate-200/50">
                <Navbar />
            </div>

            <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 py-12 md:py-20 relative z-10 w-full">
                {/* Main Card Container */}
                <div className="w-full max-w-[800px] bg-white p-6 sm:p-10 md:p-12 lg:p-16 rounded-[12px] shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-200">

                    {/* Header Block */}
                    <div className="mb-[32px] border-b border-slate-100 pb-[24px]">
                        <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight text-slate-900 mb-4 text-left">
                            Privacy Policy
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
                            <p>Welcome to <strong>InsightFlow</strong> ("we," "our," or "us").</p>
                            <p>This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you access or use our website and SaaS platform (collectively, the "Service").</p>
                            <p>By accessing or using InsightFlow, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.</p>
                        </div>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">1. Information We Collect</h2>
                            <p className="mb-4">We collect information that is reasonably necessary to provide, maintain, and improve our Service.</p>

                            <h3 className="text-[18px] font-semibold text-slate-800 mt-6 mb-3">A. Account Information</h3>
                            <p className="mb-2">When you register for an account, we may collect the following personal information:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6">
                                <li><strong>Full name</strong></li>
                                <li><strong>Email address</strong></li>
                                <li><strong>Company or store name</strong></li>
                                <li><strong>Billing details</strong> (Please note that all payments are processed securely by third-party payment providers. We do not store complete payment card details on our servers.)</li>
                            </ul>

                            <h3 className="text-[18px] font-semibold text-slate-800 mt-6 mb-3">B. Integration Data</h3>
                            <p className="mb-2">To provide analytical insights, you may choose to connect third-party platforms (e.g., Shopify, Google Ads, Meta Ads). When you authorize these integrations, we securely access:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Store performance data and sales metrics</li>
                                <li>Advertising performance and campaign statistics</li>
                            </ul>
                            <p className="mb-6 font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                We access this data strictly via secure API connections and only with your explicit authorization. We do not modify, sell, or publish your data externally.
                            </p>

                            <h3 className="text-[18px] font-semibold text-slate-800 mt-6 mb-3">C. Usage Data</h3>
                            <p className="mb-2">We automatically collect certain technical information when you navigate the Service, which helps us improve platform performance and security:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6">
                                <li>IP address</li>
                                <li>Browser type and device characteristics</li>
                                <li>Pages visited and time spent on the platform</li>
                                <li>Feature usage and interaction metrics</li>
                            </ul>

                            <h3 className="text-[18px] font-semibold text-slate-800 mt-6 mb-3">D. Communication Data</h3>
                            <p className="mb-2">If you contact us for support, join a waitlist, or subscribe to updates, we securely collect and store:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Your email address</li>
                                <li>The contents of your message</li>
                                <li>Your communication preferences</li>
                            </ul>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">2. How We Use Your Information</h2>
                            <p className="mb-4">We use the information we collect for various business and operational purposes, including to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Provide, operate, and maintain dashboard analytics</li>
                                <li>Generate AI-powered summaries, insights, and recommendations</li>
                                <li>Deliver automated reports via Slack, Email, or WhatsApp</li>
                                <li>Process subscriptions, billing, and related payments</li>
                                <li>Provide customer support and respond to inquiries</li>
                                <li>Monitor and improve system performance and user experience</li>
                                <li>Maintain security, prevent fraud, and investigate security incidents</li>
                                <li>Comply with applicable legal and regulatory obligations</li>
                            </ul>
                            <p className="font-semibold text-slate-800 mt-4">We do not sell your personal data to any third parties.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">3. AI Processing & Automated Analysis</h2>
                            <p className="mb-4">InsightFlow utilizes advanced automated systems and AI models to analyze your performance data and generate actionable recommendations. Regarding these systems:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>They operate strictly on <strong>aggregated performance metrics</strong>.</li>
                                <li>They do not access or process personal, customer-level identifiable information unless explicitly required by the established integration scope.</li>
                                <li>They are designed exclusively to provide performance insights and workflow enhancements.</li>
                            </ul>
                            <p className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm italic text-slate-700">
                                <strong>Disclaimer:</strong> AI-generated outputs are intended as business recommendations and do not constitute formal financial, legal, or investment advice.
                            </p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">4. Data Storage & Security</h2>
                            <p className="mb-4">We prioritize the security of your data and implement appropriate technical and organizational measures to protect it, including:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li><strong>Encrypted API connections</strong> for all third-party integrations</li>
                                <li><strong>Secure database storage</strong> with rigorous access control restrictions</li>
                                <li><strong>Encrypted data transmission</strong> in transit (HTTPS/TLS)</li>
                            </ul>
                            <p>While we implement commercially reasonable, industry-standard safeguards to protect your personal information, please note that no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">5. Third-Party Services</h2>
                            <p className="mb-4">We may engage trusted third-party service providers to perform platform operations on our behalf. These include:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Cloud computing and hosting providers</li>
                                <li>Database management and analytics providers</li>
                                <li>Payment processing gateways</li>
                                <li>Messaging and communication delivery services (e.g., Slack, Email clients, WhatsApp API providers)</li>
                            </ul>
                            <p>These third parties are authorized to process data <strong>only as strictly necessary</strong> to perform their contracted services and are bound by stringent confidentiality and data protection obligations.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">6. Data Retention</h2>
                            <p className="mb-4">We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. Specifically, we retain data:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>For as long as your InsightFlow account remains active</li>
                                <li>As necessary to comply with our legal and regulatory obligations</li>
                                <li>To resolve disputes and enforce our legal agreements and policies</li>
                            </ul>
                            <p className="mt-4">You reserve the right to request comprehensive account and data deletion at any time.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">7. Your Rights</h2>
                            <p className="mb-4">Depending on your geographic location and jurisdiction (such as under the GDPR or CCPA), you may have certain rights regarding your personal data, including the right to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li><strong>Access</strong> the personal information we maintain about you</li>
                                <li><strong>Correct</strong> inaccurate or incomplete data</li>
                                <li><strong>Request deletion</strong> of your personal data ("right to be forgotten")</li>
                                <li><strong>Restrict or object</strong> to our processing of your data</li>
                                <li><strong>Withdraw consent</strong> at any time, where processing is based on consent</li>
                                <li><strong>Data portability</strong> to request a copy of your data in a structured, machine-readable format</li>
                            </ul>
                            <p>To exercise any of these rights, please contact our support team using the information provided in the Contact section below. We will respond to your request in accordance with applicable data protection laws.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">8. Cookies & Tracking Technologies</h2>
                            <p className="mb-4">We may use cookies, web beacons, and similar tracking technologies to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Maintain core session functionality and security</li>
                                <li>Improve user experience and platform navigation</li>
                                <li>Analyze platform traffic and usage patterns</li>
                            </ul>
                            <p>You may configure your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. If you disable or refuse cookies, please note that certain parts of the Service may become inaccessible or not function properly.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">9. International Users</h2>
                            <p>InsightFlow operates its services globally. If you access the Service from outside our primary operating jurisdiction, please be aware that your information may be transferred to, stored, and processed in facilities located in countries where our servers are based. Data protection laws in these countries may differ from those of your country of residence.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">10. Children's Privacy</h2>
                            <p>The InsightFlow platform and Service are exclusively designed for and intended for individuals aged 18 years or older, operating in a B2B or professional capacity. We do not knowingly solicit or collect personal information from minors.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] mb-[40px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">11. Changes to This Policy</h2>
                            <p className="mb-4">We may periodically update this Privacy Policy to reflect changes in our practices, technology, or legal requirements. When we do, we will update the "Last Updated" date at the top of this page.</p>
                            <p>If material changes are made, we will notify registered users via email or through a prominent notice on the platform. We encourage you to review this policy periodically. Your continued use of the Service following the posting of any changes constitutes your acceptance of the updated policy.</p>
                        </section>

                        <section className="border-t border-slate-100 pt-[32px] pb-[16px]">
                            <h2 className="text-[22px] md:text-[24px] font-semibold text-slate-900 mb-[20px]">12. Contact Information</h2>
                            <p className="mb-4">If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
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

            {/* Footer without the extra container background to match the clean neutral style */}
            <div className="w-full mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default PrivacyPolicy;
