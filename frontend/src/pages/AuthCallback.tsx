import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    const redirectPath = searchParams.get('redirect') || '/dashboard';
    const plan = searchParams.get('plan');
    const targetWithPlan = plan ? `${redirectPath}?plan=${plan}` : redirectPath;

    useEffect(() => {
        supabase.auth.getSession().then(({ data, error }) => {
            if (error) {
                setError(error.message);
                setTimeout(() => navigate('/auth'), 3000);
            } else if (data.session) {
                // Successful login, route to the target path (usually dashboard or verify)
                navigate(targetWithPlan);
            } else {
                // Supabase handles the hash automatically, but we might need onAuthStateChange
                supabase.auth.onAuthStateChange((event, session) => {
                    if (event === 'SIGNED_IN' && session) {
                        navigate(targetWithPlan);
                    } else if (event === 'SIGNED_OUT') {
                        navigate('/auth');
                    }
                });
            }
        });
    }, [navigate, targetWithPlan]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            {error ? (
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Authentication Failed</h2>
                    <p className="text-slate-500">{error}</p>
                    <p className="text-sm text-slate-400 mt-4">Redirecting back to login...</p>
                </div>
            ) : (
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto" />
                    <h2 className="text-xl font-bold text-slate-800">Authenticating...</h2>
                    <p className="text-slate-500 text-sm">Please wait while we verify your secure session.</p>
                </div>
            )}
        </div>
    );
};

export default AuthCallback;
