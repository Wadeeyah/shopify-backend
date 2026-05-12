import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Copy, FileText, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FormEditor, { type FormData } from './FormEditor';

import { DEFAULT_FORMS } from '../../lib/defaultForms';

interface FormManagerProps {
    authorName?: string;
}

const FormManager = ({ authorName = 'admin' }: FormManagerProps) => {
    const [forms, setForms] = useState<FormData[]>(() => {
        const saved = localStorage.getItem('ifam_admin_forms');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { console.error('Failed to parse forms', e); }
        }
        return DEFAULT_FORMS;
    });
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingForm, setEditingForm] = useState<FormData | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Persist forms
    useEffect(() => {
        localStorage.setItem('ifam_admin_forms', JSON.stringify(forms));
        window.dispatchEvent(new CustomEvent('ifam_settings_updated'));
    }, [forms]);

    // -- Actions --
    const handleAddNew = () => {
        setEditingForm(null);
        setEditorOpen(true);
    };

    const handleEdit = (form: FormData) => {
        setEditingForm(form);
        setEditorOpen(true);
    };

    const handleSave = (saved: FormData) => {
        setForms(prev => {
            const idx = prev.findIndex(f => f.id === saved.id);
            if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = saved;
                return copy;
            }
            return [...prev, saved];
        });
        setEditorOpen(false);
        setEditingForm(null);
    };

    const handleDelete = (id: string) => {
        setForms(prev => prev.filter(f => f.id !== id));
        setDeleteConfirm(null);
    };

    const handleDuplicate = (form: FormData) => {
        const dup: FormData = {
            ...form,
            id: `${form.id}_copy_${Date.now()}`,
            title: `${form.title} (Copy)`,
            author: authorName, // Use authorName for duplicated forms
            date: new Date().toISOString(),
        };
        setForms(prev => [...prev, dup]);
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-CA') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
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
                    <h2 className="text-lg font-semibold text-primary">Form Manager</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Create and manage credential forms for different plans.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20"
                >
                    <Plus className="w-4 h-4" /> Add New Form
                </button>
            </div>

            {/* Info Notice */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                <FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                    <strong>API Secret</strong> is now stored securely in <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">Supabase Edge Function secrets</code>. It has been removed from this page for security.
                </p>
            </div>

            {/* Table */}
            <div className="ifam-elevation overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200">
                                <th className="px-4 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">Title</th>
                                <th className="px-4 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">Shortcode</th>
                                <th className="px-4 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">Author</th>
                                <th className="px-4 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">Delivery</th>
                                <th className="px-4 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">Schedules</th>
                                <th className="px-4 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {forms.map((form, i) => (
                                <motion.tr
                                    key={form.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    {/* Title */}
                                    <td className="px-4 py-4">
                                        <button
                                            onClick={() => handleEdit(form)}
                                            className="font-medium text-brand-600 hover:text-brand-700 hover:underline transition-colors text-left"
                                        >
                                            {form.title}
                                        </button>
                                    </td>

                                    {/* Shortcode */}
                                    <td className="px-4 py-4">
                                        <code className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono leading-relaxed block max-w-[200px] break-all overflow-hidden">
                                            [saas_credentials_form id="{form.id}"]
                                        </code>
                                    </td>

                                    {/* Author */}
                                    <td className="px-4 py-4 text-slate-600">{form.author}</td>

                                    {/* Date */}
                                    <td className="px-4 py-4 text-slate-500 text-xs whitespace-nowrap">{formatDate(form.date)}</td>

                                    {/* Delivery */}
                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {form.deliveryOptions.map(opt => (
                                                <span
                                                    key={opt}
                                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${opt === 'email'
                                                        ? 'bg-slate-100 text-slate-500'
                                                        : opt === 'whatsapp'
                                                            ? 'bg-green-50 text-green-700'
                                                            : 'bg-purple-50 text-purple-700'
                                                        }`}
                                                >
                                                    {opt}
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Schedules */}
                                    <td className="px-4 py-4">
                                        <span className="text-xs text-slate-500 leading-relaxed">
                                            {form.schedules.length === 7
                                                ? 'Every day'
                                                : form.schedules.map(s => s.slice(0, 3)).join(', ')}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(form)}
                                                className="p-2 rounded-lg text-slate-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(form.id)}
                                                className="p-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDuplicate(form)}
                                                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                                                title="Duplicate"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}

                            {forms.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                                        <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                        <p className="font-medium">No forms yet</p>
                                        <p className="text-xs mt-1">Click "Add New Form" to get started.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AnimatePresence>
                {deleteConfirm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            onClick={() => setDeleteConfirm(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 z-50 w-full max-w-sm"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Delete Form</h3>
                                    <p className="text-xs text-slate-500">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-5">
                                Are you sure you want to delete <strong>"{forms.find(f => f.id === deleteConfirm)?.title}"</strong>? All associated shortcodes will stop working.
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Form Editor Slide-over */}
            <FormEditor
                key={editingForm?.id ?? 'new'}
                form={editingForm}
                isOpen={editorOpen}
                onClose={() => { setEditorOpen(false); setEditingForm(null); }}
                onSave={handleSave}
            />
        </motion.div>
    );
};

export default FormManager;
