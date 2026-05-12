import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Activity, Settings, LogOut, Link2 } from 'lucide-react';
import IntegrationsPage from './IntegrationsPage';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const plan = searchParams.get('plan') || 'basic';

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/auth');
                return;
            }

            try {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('store_id')
                    .eq('id', session.user.id)
                    .single();

                if (!profile?.store_id) {
                    // Redirect back to pricing page if they haven't verified a store_id yet
                    navigate('/');
                    setTimeout(() => {
                        const pricingElement = document.getElementById('pricing');
                        if (pricingElement) {
                            pricingElement.scrollIntoView({ behavior: 'smooth' });
                        } else {
                            window.location.hash = 'pricing';
                        }
                    }, 100);
                    return;
                }

                setIsLoading(false);
            } catch (err) {
                console.error("Error verifying dashboard access:", err);
                navigate('/auth');
            }
        };
        checkSession();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return (
        <div className="flex bg-slate-50 min-h-screen">
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-screen sticky top-0">
                <div className="p-6">
                    <div className="font-bold text-xl text-primary flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-brand-500 to-blue-600 text-white flex items-center justify-center text-sm shadow-md">CM</div>
                        Cluemetrics
                    </div>
                </div>
                <nav className="flex-1 px-4 py-4 flex flex-col overflow-y-auto">
                    <div className="space-y-1.5 text-slate-600 font-medium pb-8">
                        <Link 
                            to={`/dashboard?plan=${plan}`}
                            className={`px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${location.pathname === '/dashboard' ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                            <LayoutDashboard className="w-5 h-5" /> Dashboard
                        </Link>
                        <Link 
                            to={`/dashboard/integrations?plan=${plan}`}
                            className={`px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${location.pathname === '/dashboard/integrations' ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                            <Link2 className="w-5 h-5" /> Integrations
                        </Link>
                        <div className="px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-3 transition-colors text-slate-600">
                            <CreditCard className="w-5 h-5 text-slate-400" /> Finance
                        </div>
                        <div className="px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-3 transition-colors text-slate-600">
                            <Activity className="w-5 h-5 text-slate-400" /> Analytics
                        </div>
                        <div className="px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-3 transition-colors text-slate-600">
                            <Settings className="w-5 h-5 text-slate-400" /> Settings
                        </div>
                    </div>
                </nav>
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg font-semibold flex items-center gap-3 transition-all text-left group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign out
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-primary tracking-tight capitalize">
                        {location.pathname.includes('integrations') ? 'Integrations' : `${plan} Dashboard`}
                    </h1>
                    <div className="flex items-center gap-3 text-sm font-medium">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
                        <span className="text-slate-600">Sync Active</span>
                    </div>
                </header>

                <Routes>
                    <Route index element={
                        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                            <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
                                <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <LayoutDashboard className="w-10 h-10" />
                                </div>
                                <h1 className="text-3xl font-bold text-primary mb-4 tracking-tight">Welcome to your Dashboard</h1>
                                <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
                                    Your personal command center for Cluemetrics. Access your integrations, view analytics, and manage your billing from the sidebar.
                                </p>
                            </div>
                        </div>
                    } />
                    <Route path="integrations" element={<IntegrationsPage />} />
                </Routes>
            </main>
        </div>
    );
};

export default ClientDashboard;
