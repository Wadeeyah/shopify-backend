import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CredentialForm from '../components/CredentialForm';
import { motion } from 'framer-motion';
import { DEFAULT_FORMS } from '../lib/defaultForms';

const PLAN_LOCKS: Record<string, boolean> = {
    'basic': false, // Matched with Admin FormEditor initial default (false)
    'standard': false,
    'premium': false,
};

const DEFAULT_METHODS: Record<string, string[]> = {
    basic: ['email'],
    standard: ['slack', 'email'],
    premium: ['email', 'whatsapp', 'slack']
};

const DEFAULT_PRESETS: Record<string, string> = {
    basic: 'email',
    standard: 'slack_email',
    premium: 'all'
};

const IntegrationsPage = () => {
    const [searchParams] = useSearchParams();
    const plan = searchParams.get('plan') || 'basic';
    const planKey = plan.toLowerCase();
    
    const [isAdsLocked, setIsAdsLocked] = useState<boolean>(PLAN_LOCKS[planKey] ?? false);
    const [allowedMethods, setAllowedMethods] = useState<string[]>(DEFAULT_METHODS[planKey] ?? ['email', 'whatsapp', 'slack']);
    const [webhookUrl, setWebhookUrl] = useState<string>('');
    const [deliveryPreset, setDeliveryPreset] = useState<string>(DEFAULT_PRESETS[planKey] ?? 'all');
    const [allowedDays, setAllowedDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

    useEffect(() => {
        const loadSettings = () => {
            const planKey = plan.toLowerCase();
            let foundForm = null;

            const savedFormsStr = localStorage.getItem('ifam_admin_forms');
            if (savedFormsStr) {
                try {
                    const savedForms = JSON.parse(savedFormsStr);
                    if (Array.isArray(savedForms)) {
                        // Prioritize exact plan-name matches
                        foundForm = savedForms.find((f: any) => {
                            const title = (f.title || '').toLowerCase();
                            return title === `${planKey} plan`;
                        });
                        
                        // Fallback to fuzzy matches if no exact match
                        if (!foundForm) {
                            foundForm = savedForms.find((f: any) => {
                                const titleStr = (f.title || '').toLowerCase();
                                if (planKey === 'basic') return titleStr.includes('basic') || titleStr.includes('default') || f.id === 'form_1761678397' || f.id === 'form_1';
                                if (planKey === 'standard') return titleStr.includes('standard') || f.id === 'form_1761678397_copy_1766094934';
                                if (planKey === 'premium') return titleStr.includes('premium') || f.id === 'form_1761678397_c';
                                return titleStr.includes(planKey);
                            });
                        }
                    }
                } catch (e) {
                    console.error('Failed to parse admin forms', e);
                }
            } else {
                // Completely empty browser -> Use DEFAULT_FORMS
                const fallbackForms = DEFAULT_FORMS;
                foundForm = fallbackForms.find((f: any) => {
                    const title = (f.title || '').toLowerCase();
                    return title === `${planKey} plan`;
                });
                if (!foundForm) {
                    foundForm = fallbackForms.find((f: any) => {
                        const titleStr = (f.title || '').toLowerCase();
                        if (planKey === 'basic') return titleStr.includes('basic') || titleStr.includes('default') || f.id === 'form_1761678397' || f.id === 'form_1';
                        if (planKey === 'standard') return titleStr.includes('standard') || f.id === 'form_1761678397_copy_1766094934';
                        if (planKey === 'premium') return titleStr.includes('premium') || f.id === 'form_1761678397_c';
                        return titleStr.includes(planKey);
                    });
                }
            }
            
            if (foundForm) {
                setIsAdsLocked(foundForm.lockAdsFields ?? false);
                setAllowedMethods(foundForm.deliveryOptions ?? DEFAULT_METHODS[planKey] ?? ['email', 'whatsapp', 'slack']);
                setWebhookUrl(foundForm.webhookUrl ?? '');
                setDeliveryPreset(foundForm.deliveryPreset ?? 'all');
                setAllowedDays(foundForm.schedules && foundForm.schedules.length > 0 ? foundForm.schedules : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            } else {
                setIsAdsLocked(PLAN_LOCKS[planKey] ?? false);
                setAllowedMethods(DEFAULT_METHODS[planKey] ?? ['email', 'whatsapp', 'slack']);
                setWebhookUrl('');
                setDeliveryPreset(DEFAULT_PRESETS[planKey] ?? 'all');
                setAllowedDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            }
        };

        // Load initially
        loadSettings();

        // Listen for changes from Admin panel
        window.addEventListener('storage', loadSettings);
        window.addEventListener('ifam_settings_updated', loadSettings);
        return () => {
            window.removeEventListener('storage', loadSettings);
            window.removeEventListener('ifam_settings_updated', loadSettings);
        };
    }, [plan]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
        >
            <CredentialForm 
                lockAdsFields={isAdsLocked} 
                plan={plan} 
                allowedDeliveryMethods={allowedMethods} 
                webhookUrl={webhookUrl} 
                deliveryPreset={deliveryPreset} 
                allowedDays={allowedDays}
            />
        </motion.div>
    );
};

export default IntegrationsPage;
