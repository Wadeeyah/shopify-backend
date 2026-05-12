import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Mail, Github, Lock, User } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const Auth = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectPath = searchParams.get('redirect');
    const selectedPlan = searchParams.get('plan');

    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Form fields
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const resetMessages = () => {
        setMessage('');
        setErrorMsg('');
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        resetMessages();
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        resetMessages();

        if (isSignUp) {
            if (password !== confirmPassword) {
                setErrorMsg('Passwords do not match.');
                setLoading(false);
                return;
            }
            if (!agreeTerms) {
                setErrorMsg('You must agree to the Terms and Conditions and Privacy Policy.');
                setLoading(false);
                return;
            }

            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (error) {
                setErrorMsg(error.message);
            } else {
                setMessage('Account created successfully! Redirecting...');
                setTimeout(() => {
                    const finalTarget = redirectPath || '/dashboard';
                    const targetWithPlan = selectedPlan ? `${finalTarget}?plan=${selectedPlan}` : finalTarget;
                    navigate(targetWithPlan);
                }, 1500);
            }
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                setErrorMsg(error.message);
            } else if (data.session) {
                const finalTarget = redirectPath || '/dashboard';
                const targetWithPlan = selectedPlan ? `${finalTarget}?plan=${selectedPlan}` : finalTarget;
                navigate(targetWithPlan);
            }
        }

        setLoading(false);
    };

    const handleOAuthLogin = async (provider: 'google' | 'github') => {
        let redirectUrl = `${window.location.origin}/auth/callback`;
        const params = new URLSearchParams();
        if (redirectPath) params.append('redirect', redirectPath);
        if (selectedPlan) params.append('plan', selectedPlan);
        const searchString = params.toString();
        if (searchString) {
             redirectUrl += `?${searchString}`;
        }

        await supabase.auth.signInWithOAuth({ 
            provider,
            options: {
                redirectTo: redirectUrl
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 relative">
            <div className="w-full max-w-md px-4 pt-8 pb-4">
                <Link to="/" className="text-slate-500 hover:text-brand-600 flex items-center gap-2 font-medium transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
            </div>

            <div className="w-full max-w-md ifam-elevation p-6 md:p-8 space-y-8 relative z-10 mb-20">
                <div className="text-center">
                    <img src="/logo.png" alt="Cluemetrics Logo" className="logo-brand mx-auto mb-2 drop-shadow-sm transition-transform hover:scale-105" />
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {isSignUp ? 'Create your account' : 'Welcome back'}
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm font-medium">
                        {isSignUp ? 'Start growing your business with clear insights' : 'Sign in to access your dashboard'}
                    </p>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                    {isSignUp && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder:text-slate-400"
                                    placeholder="John Doe"
                                />
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            {isSignUp ? 'Work Email' : 'Email Address'}
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder:text-slate-400"
                                placeholder={isSignUp ? "you@company.com" : "Enter your email"}
                            />
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder:text-slate-400"
                                placeholder="••••••••"
                            />
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        </div>
                    </div>

                    {isSignUp && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Re-enter Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                />
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            </div>
                        </div>
                    )}

                    {isSignUp && (
                        <div className="flex items-start gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 transition-all cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                                I agree to the <Link to="/terms-of-service" className="text-brand-600 hover:text-brand-700 underline underline-offset-2 font-medium">Terms and Conditions</Link> and <Link to="/privacy-policy" className="text-brand-600 hover:text-brand-700 underline underline-offset-2 font-medium">Privacy Policy</Link>.
                            </label>
                        </div>
                    )}

                    {!isSignUp && (
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 transition-all cursor-pointer"
                                />
                                <label htmlFor="remember" className="text-sm text-slate-600 font-medium cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            <button type="button" className="text-sm text-brand-600 hover:text-brand-700 font-semibold transition-colors">
                                Forgot password?
                            </button>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition-all shadow-md shadow-brand-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                        </button>
                    </div>

                    <div className="text-center text-sm pt-4 pb-2">
                        <span className="text-slate-500 font-medium">
                            {isSignUp ? 'Already have an account? ' : 'Need an account? '}
                        </span>
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-brand-600 hover:text-brand-800 font-bold transition-colors"
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                {(message || errorMsg) && (
                    <div className={`p-4 rounded-lg text-sm font-medium ${message ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message || errorMsg}
                    </div>
                )}

                <div className="relative pt-2">
                    <div className="absolute inset-0 flex items-center pt-2">
                        <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm pt-2">
                        <span className="px-3 bg-white text-slate-500 font-medium">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleOAuthLogin('google')}
                        className="w-full bg-white text-slate-700 border border-slate-200 font-semibold py-2.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>
                    <button
                        onClick={() => handleOAuthLogin('github')}
                        className="w-full bg-white text-slate-700 border border-slate-200 font-semibold py-2.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Github className="w-5 h-5" /> GitHub
                    </button>
                </div>
            </div>

            {/* Decorative blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-100/50 rounded-full blur-[120px] -z-10 opacity-80 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-[120px] -z-10 opacity-80 pointer-events-none" />
        </div>
    );
};

export default Auth;
