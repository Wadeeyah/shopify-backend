import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface WhatsAppInputProps {
    value: string;
    onChange: (val: string) => void;
    label?: string;
}

const WhatsAppInput: React.FC<WhatsAppInputProps> = ({ value, onChange, label = 'WhatsApp Number' }) => {
    const [error, setError] = useState(false);

    const validateAndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onChange(val);

        // Legacy restriction: ^\+\d[\d\s\-()]{6,}$
        const isValid = /^$|^\+\d[\d\s\-()]{6,}$/.test(val);
        if (!isValid && val.length > 0) {
            setError(true);
            setTimeout(() => setError(false), 500); // Reset for next shake
        } else {
            setError(false);
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <motion.div
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                <input
                    type="tel"
                    value={value}
                    onChange={validateAndChange}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all ${error ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-transparent bg-white'
                        }`}
                />
            </motion.div>
            {error && <p className="text-xs text-red-500 mt-1">Must include country code (e.g., +1)</p>}
        </div>
    );
};

export default WhatsAppInput;
