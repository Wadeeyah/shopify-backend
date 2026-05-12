import React from 'react';

interface DeliveryToggleProps {
    channels: string[];
    onChange: (channels: string[]) => void;
}

const DeliveryToggle: React.FC<DeliveryToggleProps> = ({ channels, onChange }) => {
    const toggleChannel = (channel: string) => {
        if (channels.includes(channel)) {
            onChange(channels.filter(c => c !== channel));
        } else {
            onChange([...channels, channel]);
        }
    };

    const options = [
        { id: 'email', label: 'Email', icon: '✉️' },
        { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
        { id: 'slack', label: 'Slack', icon: '#️⃣' },
    ];

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Delivery Channels</label>
            <div className="flex gap-3">
                {options.map((opt) => {
                    const isActive = channels.includes(opt.id);
                    return (
                        <button
                            key={opt.id}
                            onClick={(e) => { e.preventDefault(); toggleChannel(opt.id); }}
                            className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${isActive
                                    ? 'border-brand-500 bg-brand-50 shadow-sm'
                                    : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                        >
                            <span className="text-2xl mb-2">{opt.icon}</span>
                            <span className={`text-sm font-medium ${isActive ? 'text-brand-900' : 'text-slate-600'}`}>
                                {opt.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DeliveryToggle;
