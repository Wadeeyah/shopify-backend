import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FormData {
    id: string;
    title: string;
    author: string;
    date: string;
    deliveryPreset: string;
    deliveryOptions: string[];
    schedules: string[];
    times: string[];
    webhookUrl: string;
    lockAdsFields: boolean;
}

interface FormEditorProps {
    form: FormData | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (form: FormData) => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const PRESETS: Record<string, { label: string; options: string[] }> = {
    all: { label: 'All (Email, Slack & WhatsApp)', options: ['email', 'whatsapp', 'slack'] },
    slack_email: { label: 'Slack or Email only', options: ['slack', 'email'] },
    slack_whatsapp: { label: 'Slack and WhatsApp only', options: ['slack', 'whatsapp'] },
    email: { label: 'Email only', options: ['email'] },
};

const FormEditor = ({ form, isOpen, onClose, onSave }: FormEditorProps) => {
    const isNew = !form;
    const [title, setTitle] = useState(form?.title ?? 'New Form');
    const [preset, setPreset] = useState(form?.deliveryPreset ?? 'all');
    const [deliveryOptions, setDeliveryOptions] = useState<string[]>(form?.deliveryOptions ?? ['email', 'whatsapp', 'slack']);
    const [schedules, setSchedules] = useState<string[]>(form?.schedules ?? ['Monday']);
    const [times, setTimes] = useState(form?.times?.join(', ') ?? '09:00');
    const [webhookUrl, setWebhookUrl] = useState(form?.webhookUrl ?? '');
    const [lockAdsFields, setLockAdsFields] = useState(form?.lockAdsFields ?? false);
    const [isSaving, setIsSaving] = useState(false);

    const handlePresetChange = (value: string) => {
        setPreset(value);
        const allowed = PRESETS[value]?.options ?? ['email', 'whatsapp', 'slack'];
        setDeliveryOptions(allowed);
    };

    const toggleSchedule = (day: string) => {
        setSchedules(prev => {
            const isSelected = prev.includes(day);
            return isSelected ? prev.filter(d => d !== day) : [...prev, day];
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 400));

        const now = new Date().toISOString();
        const saved: FormData = {
            id: form?.id ?? `form_${Date.now()}`,
            title,
            author: form?.author ?? 'admin',
            date: isNew ? now : (form?.date ?? now),
            deliveryPreset: preset,
            deliveryOptions,
            schedules,
            times: times.split(',').map(t => t.trim()).filter(Boolean),
            webhookUrl,
            lockAdsFields,
        };

        // Dispatch a specialized event to force a re-render exactly when the admin hits save.
        window.dispatchEvent(new Event('storage'));

        onSave(saved);
        setIsSaving(false);
    };

    const currentPresetOptions = PRESETS[preset]?.options ?? [];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50/80">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {isNew ? 'Create New Form' : 'Edit Form'}
                                </h2>
                                {!isNew && (
                                    <p className="text-xs text-slate-400 mt-0.5 font-mono">ID: {form?.id}</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2.5">Form Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/30 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-base"
                                    placeholder="e.g. Premium Plan Form"
                                />
                            </div>

                            {/* Delivery Preset */}
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2.5">Delivery Preset</label>
                                <select
                                    value={preset}
                                    onChange={e => handlePresetChange(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-base appearance-none cursor-pointer"
                                >
                                    {Object.entries(PRESETS).map(([key, { label }]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-400 mt-2 font-medium">
                                    Determines the available delivery channels for the final user.
                                </p>
                            </div>

                            {/* Delivery Options */}
                            <div className="pt-2">
                                <label className="block text-sm font-bold text-slate-800 mb-4">Delivery Options</label>
                                <div className="flex gap-6">
                                    {['email', 'whatsapp', 'slack'].map(opt => {
                                        const isAllowed = currentPresetOptions.includes(opt);
                                        return (
                                            <label
                                                key={opt}
                                                className={`flex items-center gap-3 text-[15px] font-medium capitalize cursor-pointer select-none transition-colors ${isAllowed ? 'text-slate-700' : 'text-slate-300'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={deliveryOptions.includes(opt)}
                                                    disabled={!isAllowed}
                                                    onChange={() => {
                                                        if (!isAllowed) return;
                                                        setDeliveryOptions(prev =>
                                                            prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
                                                        );
                                                    }}
                                                    className="w-5 h-5 rounded-md border-slate-300 text-brand-500 focus:ring-brand-500 disabled:opacity-30 cursor-pointer"
                                                />
                                                {opt}
                                            </label>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 font-medium">
                                        Current Configuration: <span className="text-brand-600">{currentPresetOptions.join(' + ')}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Schedules */}
                            <div>
                                <div className="flex items-center justify-between mb-3.5">
                                    <label className="block text-sm font-bold text-slate-800">Schedules (Active Days)</label>
                                </div>

                                <div className="flex flex-wrap gap-2.5">
                                    {DAYS.map(day => {
                                        const isSelected = schedules.includes(day);
                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => toggleSchedule(day)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                                    isSelected
                                                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                }`}
                                            >
                                                {day.slice(0, 3)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Times */}
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2.5">Delivery Times (comma separated)</label>
                                <input
                                    type="text"
                                    value={times}
                                    onChange={e => setTimes(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/30 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-mono"
                                    placeholder="09:00, 12:00, 15:00"
                                />
                            </div>

                            {/* Webhook URL */}
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2.5">n8n Webhook URL</label>
                                <input
                                    type="url"
                                    value={webhookUrl}
                                    onChange={e => setWebhookUrl(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 font-mono text-xs bg-slate-50/30 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                                    placeholder="https://your-n8n-instance.com/webhook/..."
                                />
                                <p className="text-xs text-slate-400 mt-2 font-medium italic">
                                    Paste your n8n Production Webhook URL here. This URL receives the form data when a client clicks "Save All Changes".
                                </p>
                            </div>

                            {/* Lock Ads Fields Toggle */}
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-bold text-slate-800">Lock Ads Fields</label>
                                    <p className="text-xs text-slate-400 mt-1 font-medium">
                                        When active, the Ads section on the client integrations page will be blurred and locked.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={lockAdsFields}
                                        onChange={(e) => setLockAdsFields(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                                </label>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !title.trim()}
                                className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSaving ? 'Saving...' : 'Save Form'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FormEditor;
