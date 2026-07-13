import { useState, useEffect } from 'react';
import { ShieldAlert, Users, Key, AlertTriangle, FileText, Settings, ChevronLeft, ChevronRight, LogOut, BookOpen, Layers, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FormManager from '../components/admin/FormManager';
import PostManager from '../components/admin/PostManager';
import MediaLibrary from '../components/admin/MediaLibrary';
import UsersPanel from '../components/admin/UsersPanel';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'forms' | 'posts' | 'pages' | 'media' | 'users' | 'audit' | 'jwt' | 'settings'>('forms');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [authorName, setAuthorName] = useState('Admin');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [waitlistActive, setWaitlistActive] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase.from('site_settings').select('blog_waitlist_active').eq('id', 1).single();
                if (data && !error) setWaitlistActive(data.blog_waitlist_active);
            } catch (err) {
                console.error("Error fetching site settings:", err);
            }
        };
        fetchSettings();
    }, []);

    const toggleWaitlist = async () => {
        const newValue = !waitlistActive;
        setWaitlistActive(newValue);
        await supabase.from('site_settings').update({ blog_waitlist_active: newValue }).eq('id', 1);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <div className={`flex min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <aside
                className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 relative flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
            >
                <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
                    <AnimatePresence mode="wait">
                        {!isSidebarCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-bold text-xl text-white flex items-center gap-2 overflow-hidden whitespace-nowrap"
                            >
                                <ShieldAlert className="w-6 h-6 text-brand-400" /> Admin
                            </motion.div>
                        )}
                        {isSidebarCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mx-auto"
                            >
                                <ShieldAlert className="w-6 h-6 text-brand-400" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="p-4 space-y-2 font-medium flex-1">
                    {[
                        { id: 'forms', label: 'Forms', icon: FileText },
                        { id: 'posts', label: 'Blog Posts', icon: BookOpen },
                        { id: 'pages', label: 'Pages', icon: Layers },
                        { id: 'media', label: 'Media', icon: ImageIcon },
                        { id: 'users', label: 'Users & Plans', icon: Users },
                        { id: 'audit', label: 'Audit Trail', icon: AlertTriangle },
                        { id: 'jwt', label: 'JWT Utility', icon: Key },
                        { id: 'settings', label: 'Settings', icon: Settings },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            title={isSidebarCollapsed ? item.label : ''}
                            className={`w-full flex items-center transition-all duration-200 rounded-lg px-4 py-2.5 ${activeTab === item.id
                                ? 'bg-brand-600 text-white shadow-lg'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                } ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!isSidebarCollapsed && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 mt-auto space-y-2 border-t border-slate-800/50">
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center rounded-lg px-4 py-2.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}
                        title={isSidebarCollapsed ? 'Sign out' : ''}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!isSidebarCollapsed && <span>Sign out</span>}
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="mx-auto max-w-5xl">
                    <header className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
                            <p className="text-slate-500 mt-1">Manage your platform's forms, users, and security settings.</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 rounded-full text-brand-700 text-sm font-medium border border-brand-100">
                            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></span>
                            {authorName}
                        </div>
                    </header>
                    {activeTab === 'forms' && (
                        <FormManager authorName={authorName} />
                    )}

                    {activeTab === 'posts' && (
                        <PostManager authorName={authorName} type="post" />
                    )}

                    {activeTab === 'pages' && (
                        <PostManager authorName={authorName} type="page" />
                    )}

                    {activeTab === 'media' && (
                        <MediaLibrary />
                    )}

                    {activeTab === 'users' && (
                        <UsersPanel />
                    )}

                    {activeTab === 'audit' && (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="ifam-elevation p-6">
                            <h2 className="text-lg font-semibold text-primary mb-4">Deletion & Security Audit</h2>
                            <div className="space-y-4">
                                <div className="p-4 border border-slate-100 rounded-lg bg-slate-50 flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-primary mb-1">Data Deletion (client_integrations)</p>
                                        <p className="text-xs text-slate-500">Triggered by client: example@company.com</p>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">10 mins ago</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'jwt' && (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="ifam-elevation p-6">
                            <h2 className="text-lg font-semibold text-primary mb-4">JWT Generation Utility</h2>
                            <p className="text-sm text-slate-600 mb-6">Generate short-lived, secure tokens for users to bypass standard auth flows. Useful for legacy WP migrations or API access.</p>
                            <form className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Client Email</label>
                                    <input type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="client@company.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiration (Hours)</label>
                                    <input type="number" defaultValue={24} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                                </div>
                                <button type="button" className="bg-primary text-white w-full py-2.5 rounded-lg flex justify-center items-center gap-2 hover:bg-slate-800 transition-colors shadow-soft">
                                    <Key className="w-4 h-4" /> Generate Token
                                </button>
                            </form>
                        </motion.div>
                    )}
                    {activeTab === 'settings' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ifam-elevation p-8 space-y-8">
                            <div>
                                <h2 className="text-xl font-bold mb-2">Platform Settings</h2>
                                <p className="text-slate-500 text-sm">Configure administrative preferences and global themes.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Profile Configuration</h3>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Administrative Alias</label>
                                        <input
                                            type="text"
                                            value={authorName}
                                            onChange={(e) => setAuthorName(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Visual Experience</h3>
                                    <div>
                                        <label className="block text-sm font-medium mb-3">Color Mode</label>
                                        <div className="flex gap-3">
                                            {(['light', 'dark'] as const).map((m) => (
                                                <button
                                                    key={m}
                                                    onClick={() => setTheme(m)}
                                                    className={`flex-1 py-4 border-2 rounded-xl transition-all capitalize font-medium ${theme === m
                                                        ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                                                        : 'border-slate-100 bg-slate-50 text-slate-400 grayscale hover:grayscale-0 hover:border-slate-200'
                                                        }`}
                                                >
                                                    {m} Mode
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-800">Blog Waitlist Mode</h3>
                                    <p className="text-sm text-slate-500 mt-1">When active, public visitors will see the Waitlist capture page instead of the Blog.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={waitlistActive}
                                        onChange={toggleWaitlist}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                                </label>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
