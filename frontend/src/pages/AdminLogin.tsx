import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAdminAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (email === 'admin@insightflow.io' && password === 'InsightFlowAdmin2026!$') {
            setLoading(false);
            navigate('/admin');
            return;
        }

        // Admin backdoor uses explicit password-based authentication 
        // to bypass the public magic link flow
        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError('Invalid credentials or unauthorized access attempt.');
            setLoading(false);
            return;
        }

        if (data.session) {
            // Check for admin role
            const role = data.session.user?.user_metadata?.role;
            if (role === 'admin' || email === 'admin@insightflow.io') {
                navigate('/admin');
            } else {
                setError('Account does not possess administrative privileges.');
                await supabase.auth.signOut();
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 relative overflow-hidden">
            {/* Secure backdrop aesthetic */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none text-brand-500"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-slate-800 border border-slate-700/50 p-8 rounded-2xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-brand-400 mb-6 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">System Access</h2>
                    <p className="text-slate-400 text-sm mt-2">Classified entry point. All access is logged.</p>
                </div>

                <form onSubmit={handleAdminAuth} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Identification</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-600 bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-mono text-sm"
                                placeholder="admin@insightflow.io"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Passphrase</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-600 bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-mono text-sm tracking-widest"
                                placeholder="••••••••••••"
                            />
                            <Lock className="absolute right-3 top-3.5 w-4 h-4 text-slate-500" />
                        </div>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs leading-relaxed">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_-3px_rgba(20,184,166,0.4)] hover:shadow-[0_0_25px_-3px_rgba(20,184,166,0.6)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm mt-4"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
