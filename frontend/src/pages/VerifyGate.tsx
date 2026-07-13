import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const VerifyGate = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [errorMsg, setErrorMsg] = useState('');
    const plan = searchParams.get('plan') || 'basic';

    useEffect(() => {
        const verifyStoreId = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate(`/auth?redirect=/verify&plan=${plan}`);
                return;
            }

            try {
                // First, check if they already have a store_id via the DB directly
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('store_id')
                    .eq('id', session.user.id)
                    .single();

                if (profile?.store_id) {
                    redirectToCheckout(session.user.email!, profile.store_id);
                    return;
                }

                // If no store_id, generate one securely via a Postgres RPC function
                const { data: storeId, error } = await supabase.rpc('generate_store_id');
                
                if (error) {
                    throw new Error('Failed to verify identity. Database error: ' + error.message);
                }

                if (storeId) {
                    redirectToCheckout(session.user.email!, storeId);
                } else {
                    throw new Error('No store ID was retrieved.');
                }

            } catch (err: any) {
                console.error('Verification error:', err);
                setErrorMsg(err.message || 'An error occurred during verification.');
            }
        };

        verifyStoreId();
    }, [navigate, plan]);

    const redirectToCheckout = (email: string, storeId: string) => {
        // Here you can change the URL conditionally based on the `plan` variable if you have different URLs
        // e.g. if (plan === 'premium') { ... } 
        const checkoutUrl = `https://bizsummaryai.lemonsqueezy.com/checkout/buy/5214473e-6356-4023-a361-01a6e7b1d125?checkout[email]=${email}&checkout[custom][store_id]=${storeId}`;
        window.location.href = checkoutUrl;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md ifam-elevation p-8 space-y-6 text-center bg-white rounded-[2rem]">
                {errorMsg ? (
                    <>
                        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Verification Failed</h2>
                        <p className="text-slate-500 text-sm">{errorMsg}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full mt-4 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition"
                        >
                            Try Again
                        </button>
                    </>
                ) : (
                    <>
                        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">One moment...</h2>
                        <p className="text-slate-500 font-medium">We're verifying your workspace and preparing your secure checkout.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyGate;
