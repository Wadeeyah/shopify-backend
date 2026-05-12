import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, RefreshCw, ChevronDown, CheckCircle, AlertTriangle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PLANS = ['basic', 'standard', 'premium'] as const;
type Plan = typeof PLANS[number];

const PLAN_COLORS: Record<Plan, string> = {
    basic: 'bg-slate-100 text-slate-700',
    standard: 'bg-blue-50 text-blue-700',
    premium: 'bg-amber-50 text-amber-700',
};

interface UserRow {
    id: string;
    email: string;
    plan: Plan;
    created_at: string;
    last_sign_in_at: string | null;
    confirmed: boolean;
}

const UsersPanel = () => {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [savedId, setSavedId] = useState<string | null>(null);
    const [draftPlan, setDraftPlan] = useState<Plan>('basic');

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Try admin API first (requires service_role)
            const { data: authData, error: authErr } = await supabase.auth.admin.listUsers();
            
            if (authErr) throw authErr;

            const rows: UserRow[] = (authData?.users ?? []).map((u: any) => ({
                id: u.id,
                email: u.email ?? '(no email)',
                plan: (u.user_metadata?.plan ?? u.app_metadata?.plan ?? 'basic') as Plan,
                created_at: u.created_at,
                last_sign_in_at: u.last_sign_in_at ?? null,
                confirmed: !!u.confirmed_at,
            }));

            setUsers(rows);
        } catch (err: any) {
            // If admin API is not available (anon key), try a profiles/user_plans table
            try {
                // Fetch basic columns first, then add optional ones if they exist
                const { data, error: tblErr } = await supabase
                    .from('user_plans')
                    .select('*') // use * as a fallback for simpler schema
                    .order('created_at', { ascending: false });

                if (tblErr) throw tblErr;
                
                const mappedRows: UserRow[] = (data || []).map((row: any) => ({
                    id: row.id,
                    email: row.email || '(no email)',
                    plan: (row.plan || 'basic') as Plan,
                    created_at: row.created_at || new Date().toISOString(),
                    last_sign_in_at: row.last_sign_in_at || null,
                    confirmed: row.confirmed !== undefined ? row.confirmed : true,
                }));
                
                setUsers(mappedRows);
            } catch {
                setError(
                    'Could not load users. The admin API requires a service_role key, or create a "user_plans" view in Supabase.'
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const openEdit = (user: UserRow) => {
        setEditingId(user.id);
        setDraftPlan(user.plan);
    };

    const savePlan = async (userId: string) => {
        setSavingId(userId);
        try {
            // Try admin update first
            const { error: adminErr } = await supabase.auth.admin.updateUserById(userId, {
                user_metadata: { plan: draftPlan },
            });

            if (adminErr) {
                // Fallback: upsert into user_plans table
                const { error: tblErr } = await supabase
                    .from('user_plans')
                    .upsert({ id: userId, plan: draftPlan }, { onConflict: 'id' });
                if (tblErr) throw tblErr;
            }

            // Update local state
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: draftPlan } : u));
            setSavedId(userId);
            setTimeout(() => setSavedId(null), 2500);
        } catch (err: any) {
            alert('Failed to update plan: ' + (err.message ?? err));
        } finally {
            setSavingId(null);
            setEditingId(null);
        }
    };

    const formatDate = (iso: string | null) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-primary">Users & Plans</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                        View all registered users and manage their subscription plans.
                    </p>
                </div>
                <button
                    onClick={fetchUsers}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Table */}
            <div className="ifam-elevation overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                        <User className="w-12 h-12 mb-3 opacity-30" />
                        <p className="font-medium text-slate-500">No users found</p>
                        <p className="text-xs mt-1">Users who sign up will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200">
                                    <th className="px-4 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">User</th>
                                    <th className="px-4 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">Plan</th>
                                    <th className="px-4 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">Joined</th>
                                    <th className="px-4 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">Last Sign In</th>
                                    <th className="px-4 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user, i) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        {/* Email */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                    {user.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800 text-[13px]">{user.email}</p>
                                                    <p className="text-[10px] font-mono text-slate-400">{user.id.slice(0, 8)}…</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Plan */}
                                        <td className="px-4 py-4">
                                            <AnimatePresence mode="wait">
                                                {editingId === user.id ? (
                                                    <motion.div
                                                        key="edit"
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div className="relative">
                                                            <select
                                                                value={draftPlan}
                                                                onChange={e => setDraftPlan(e.target.value as Plan)}
                                                                className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold border border-brand-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer"
                                                            >
                                                                {PLANS.map(p => (
                                                                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.span
                                                        key="badge"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${PLAN_COLORS[user.plan] ?? 'bg-slate-100 text-slate-600'}`}
                                                    >
                                                        {savedId === user.id && <CheckCircle className="w-3 h-3 mr-1 text-green-500" />}
                                                        {user.plan}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.confirmed ? 'text-green-600' : 'text-amber-600'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.confirmed ? 'bg-green-500' : 'bg-amber-400'}`} />
                                                {user.confirmed ? 'Active' : 'Pending'}
                                            </span>
                                        </td>

                                        {/* Joined */}
                                        <td className="px-4 py-4 text-slate-500 text-xs">{formatDate(user.created_at)}</td>

                                        {/* Last Sign In */}
                                        <td className="px-4 py-4 text-slate-500 text-xs">{formatDate(user.last_sign_in_at)}</td>

                                        {/* Actions */}
                                        <td className="px-4 py-4 text-right">
                                            {editingId === user.id ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => savePlan(user.id)}
                                                        disabled={savingId === user.id}
                                                        className="px-3 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-60"
                                                    >
                                                        {savingId === user.id && <Loader2 className="w-3 h-3 animate-spin" />}
                                                        Save
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => openEdit(user)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-brand-200 opacity-0 group-hover:opacity-100"
                                                >
                                                    Change Plan
                                                </button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400 bg-slate-50/60">
                            {users.length} user{users.length !== 1 ? 's' : ''} registered
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default UsersPanel;
