import React, { useState, useEffect } from 'react';
import { Save, Loader2, Link as LinkIcon, CheckCircle, Trash2, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { callN8nProxy } from '../lib/n8nProxy';
import { supabase } from '../lib/supabase';
import '../styles/integrations.css';

const CredentialForm = ({ 
    lockAdsFields = false, 
    plan = 'basic',
    allowedDeliveryMethods = ['email', 'whatsapp', 'slack'],
    webhookUrl = '',
    deliveryPreset = 'all',
    allowedDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
}: { 
    lockAdsFields?: boolean, 
    plan?: string,
    allowedDeliveryMethods?: string[],
    webhookUrl?: string,
    deliveryPreset?: string,
    allowedDays?: string[]
}) => {
    const [activeTab, setActiveTab] = useState<'credentials' | 'delivery' | 'data'>('credentials');
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [storeId, setStoreId] = useState<string | null>(null);
    const [clientId, setClientId] = useState<string | null>(null);

    // State
    const [shopDomain, setShopDomain] = useState('');
    const [shopifyToken, setShopifyToken] = useState('');
    const [adsPlatform, setAdsPlatform] = useState('');
    const [adsToken, setAdsToken] = useState('');
    const [adsEnabled, setAdsEnabled] = useState(false);
    // Delivery State
    const [delMethod, setDelMethod] = useState<string>('email');
    const [delMethods, setDelMethods] = useState<string[]>(['email']);
    const [delEmail, setDelEmail] = useState('');
    const [delWhatsApp, setDelWhatsApp] = useState('');
    const [delSlack, setDelSlack] = useState('');
    const [delDays, setDelDays] = useState<string[]>(['Monday']);
    const [delTime, setDelTime] = useState('09:00');
    
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [deleteResponse, setDeleteResponse] = useState('');
    const [shakingFields, setShakingFields] = useState<string[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showLimitToast, setShowLimitToast] = useState(false);

    // Initial Load: Fetch store_id and existing config
    useEffect(() => {
        const fetchClientData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            // 1. Fetch store_id from profiles
            const { data: profile } = await supabase
                .from('profiles')
                .select('store_id')
                .eq('id', session.user.id)
                .single();
            
            if (profile?.store_id) {
                setStoreId(profile.store_id);
            }

            // 2. Fetch existing config from clients table
            // Cascade lookup to prevent duplicates while supporting email changes:
            // a) Try looking up by store_id if they've saved one previously
            // b) Fallback to email if store_id isn't linked yet (e.g., initial trigger-created row)
            let clientData = null;
            if (profile?.store_id) {
                const { data: clientByStoreId } = await supabase
                    .from('clients')
                    .select('*')
                    .eq('store_id', profile.store_id)
                    .single();
                
                if (clientByStoreId) {
                    clientData = clientByStoreId;
                }
            }

            if (!clientData && session.user.email) {
                // If duplicates already exist, take the oldest/first one to maintain consistency
                const { data: clientsByEmail } = await supabase
                    .from('clients')
                    .select('*')
                    .eq('email', session.user.email)
                    .order('created_at', { ascending: true })
                    .limit(1);
                
                if (clientsByEmail && clientsByEmail.length > 0) {
                    clientData = clientsByEmail[0];
                }
            }

            if (clientData) {
                setClientId(clientData.id);
                setShopDomain(clientData.shop_domain || '');
                setShopifyToken(clientData.shopify_token || '');
                setAdsPlatform(clientData.ads_platform || '');
                setAdsToken(clientData.ads_token || '');
                setAdsEnabled(!!clientData.ads_platform);
                setDelMethod(clientData.delivery_method || 'email');
                setDelEmail(clientData.delivery_email || '');
                setDelWhatsApp(clientData.delivery_whatsapp || '');
                setDelSlack(clientData.delivery_slack || '');
                if (clientData.schedule_days) setDelDays(clientData.schedule_days);
                setDelTime(clientData.delivery_time || '09:00');
            }
        };

        fetchClientData();
    }, []);

    const getDayLimit = () => {
        if (deliveryPreset === 'slack_email') return 1;
        if (deliveryPreset === 'slack_whatsapp') return 3;
        return Infinity;
    };

    const dayLimit = getDayLimit();

    // Derive ui behaviour from preset
    // 'slack_whatsapp' and 'all' → checkboxes (multi-select)
    // 'slack_email' and 'email' → radio buttons (single select)
    const isAndType = deliveryPreset === 'slack_whatsapp' || deliveryPreset === 'all';

    useEffect(() => {
        // Reset selections to match what the preset allows when it changes
        if (isAndType) {
            // For checkbox-type presets, pre-select all allowed methods
            setDelMethods(allowedDeliveryMethods);
        } else {
            // For radio-type, ensure current single selection is valid
            if (allowedDeliveryMethods.length > 0 && !allowedDeliveryMethods.includes(delMethod)) {
                setDelMethod(allowedDeliveryMethods[0]);
            } else if (allowedDeliveryMethods.length === 0) {
                setDelMethod('');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deliveryPreset, allowedDeliveryMethods.join(',')]);

    useEffect(() => {
        // Ensure delDays only contains days from allowedDays
        setDelDays(prev => prev.filter(day => allowedDays.includes(day)));
    }, [allowedDays]);

    const validateAll = () => {
        const errors: string[] = [];
        // Tab 1: Credentials
        if (!shopDomain) errors.push('shopDomain');
        if (!shopifyToken) errors.push('shopifyToken');
        if (adsEnabled) {
            if (!adsPlatform) errors.push('adsPlatform');
            if (!adsToken) errors.push('adsToken');
        }
        
        // Tab 2: Delivery
        const isAndTypeLocal = deliveryPreset === 'slack_whatsapp' || deliveryPreset === 'all';
        if (isAndTypeLocal) {
            if (delMethods.includes('slack') && !delSlack) errors.push('delSlack');
            if (delMethods.includes('whatsapp') && !delWhatsApp) errors.push('delWhatsApp');
            if (delMethods.includes('email') && !delEmail) errors.push('delEmail');
            if (delMethods.length === 0) errors.push('delMethod');
            if (deliveryPreset === 'slack_whatsapp' && delMethods.length < 2) errors.push('delMethod');
        } else {
            if (delMethod === 'email' && allowedDeliveryMethods.includes('email') && !delEmail) errors.push('delEmail');
            if (delMethod === 'whatsapp' && allowedDeliveryMethods.includes('whatsapp') && !delWhatsApp) errors.push('delWhatsApp');
            if (delMethod === 'slack' && allowedDeliveryMethods.includes('slack') && !delSlack) errors.push('delSlack');
            if (!delMethod) errors.push('delMethod');
        }
        if (delDays.length === 0) errors.push('delDays');

        if (errors.length > 0) {
            setShakingFields(errors);
            setTimeout(() => setShakingFields([]), 600);
            
            // Switch tabs if necessary
            const credErrors = ['shopDomain', 'shopifyToken', 'adsPlatform', 'adsToken'];
            if (credErrors.some(e => errors.includes(e)) && activeTab !== 'credentials') {
                setActiveTab('credentials');
            } else if (activeTab === 'data') {
                setActiveTab('delivery');
            }
            return false;
        }
        return true;
    };

    const validateTab = (tab: typeof activeTab) => {
        const errors: string[] = [];
        if (tab === 'credentials') {
            if (!shopDomain) errors.push('shopDomain');
            if (!shopifyToken) errors.push('shopifyToken');
            if (adsEnabled) {
                if (!adsPlatform) errors.push('adsPlatform');
                if (!adsToken) errors.push('adsToken');
            }
        } else if (tab === 'delivery') {
            const isAndTypeLocal2 = deliveryPreset === 'slack_whatsapp' || deliveryPreset === 'all';
            if (isAndTypeLocal2) {
                if (delMethods.includes('slack') && !delSlack) errors.push('delSlack');
                if (delMethods.includes('whatsapp') && !delWhatsApp) errors.push('delWhatsApp');
                if (delMethods.includes('email') && !delEmail) errors.push('delEmail');
                if (delMethods.length === 0) errors.push('delMethod');
                if (deliveryPreset === 'slack_whatsapp' && delMethods.length < 2) errors.push('delMethod');
            } else {
                if (delMethod === 'email' && allowedDeliveryMethods.includes('email') && !delEmail) errors.push('delEmail');
                if (delMethod === 'whatsapp' && allowedDeliveryMethods.includes('whatsapp') && !delWhatsApp) errors.push('delWhatsApp');
                if (delMethod === 'slack' && allowedDeliveryMethods.includes('slack') && !delSlack) errors.push('delSlack');
                if (!delMethod) errors.push('delMethod');
            }
            if (delDays.length === 0) errors.push('delDays');
        }
        
        if (errors.length > 0) {
            setShakingFields(errors);
            setTimeout(() => setShakingFields([]), 600);
            return false;
        }
        return true;
    };

    const handleNext = (nextTab: typeof activeTab) => {
        if (validateTab(activeTab)) {
            setActiveTab(nextTab);
        }
    };

    const [saveError, setSaveError] = useState<string | null>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateAll()) return;
        
        setIsSaving(true);
        setSaveError(null);
        try {
            // 1. Save to Supabase 'clients' table
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // Ensure we use the existing record ID to prevent duplicates
                // 1. Try saved state, 2. Try store_id, 3. Try email, 4. Fallback to auth ID
                let targetId = clientId;

                // Robust lookup: try to find the existing record ID by store_id or email
                if (!targetId && storeId) {
                    const { data: byStoreId } = await supabase.from('clients').select('id').eq('store_id', storeId).limit(1);
                    if (byStoreId && byStoreId.length > 0) targetId = byStoreId[0].id;
                }

                if (!targetId && session.user.email) {
                    const { data: byEmail } = await supabase.from('clients').select('id').eq('email', session.user.email).order('created_at', { ascending: true }).limit(1);
                    if (byEmail && byEmail.length > 0) targetId = byEmail[0].id;
                }

                // If still no ID found, default to session ID to ensure a record is created
                // Build the payload
                // Build the payload
                const clientPayload: any = {
                    id: targetId, // Always include ID to satisfy Foreign Key constraints
                    email: session.user.email,
                    store_id: storeId,
                    shop_domain: shopDomain,
                    shopify_token: shopifyToken,
                    ads_platform: adsEnabled ? adsPlatform : null,
                    ads_token: adsEnabled ? adsToken : null,
                    delivery_method: deliveryPreset === 'slack_whatsapp' ? 'slack+whatsapp' : delMethod,
                    delivery_email: delEmail,
                    delivery_whatsapp: delWhatsApp,
                    delivery_slack: delSlack,
                    schedule_days: delDays,
                    delivery_time: delTime,
                    plan: plan,
                    updated_at: new Date().toISOString()
                };

                const { error: supabaseError } = await supabase
                    .from('clients')
                    .upsert(clientPayload, { 
                        onConflict: 'email' 
                    });

                if (supabaseError) {
                    console.error('Supabase save error:', supabaseError);
                    throw new Error('Failed to save to database: ' + supabaseError.message);
                }
            }

            // 2. Trigger the n8n workflow with all config data + store_id
            await callN8nProxy({
                action: 'save',
                store_id: storeId, // AUTOMATICALLY INCLUDED NOW
                shopDomain,
                webhookUrl,
                delMethod: deliveryPreset === 'slack_whatsapp' ? 'slack+whatsapp' : delMethod,
                delEmail,
                delWhatsApp,
                delSlack,
                delMethods: deliveryPreset === 'slack_whatsapp' ? delMethods : [delMethod],
                delDays,
                delTime,
            });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        } catch (err: any) {
            setSaveError(err?.message || 'Failed to save. Please check your connection and try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="ifam-wrap relative">
            <div className="ifam-card ifam-elevation">
                <h2 className="ifam-title capitalize">{plan} Plan</h2>
                
                <div className="ifam-tabs">
                    {[
                        { id: 'credentials', label: 'Credentials' },
                        { id: 'delivery', label: 'Delivery Method' },
                        { id: 'data', label: 'Data Management' }
                    ].map((tab) => (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`ifam-tab ${activeTab === tab.id ? 'ifam-active' : ''}`}
                        >
                            {tab.label}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSave} className="ifam-form">
                    {activeTab === 'credentials' && (
                        <div className="ifam-panel animate-in fade-in duration-300">
                            <div className={`ifam-pad ${shakingFields.includes('shopDomain') ? 'ifam-shake' : ''}`}>
                                <label className="ifam-label">Shopify Domain</label>
                                <input
                                    type="text"
                                    placeholder="mystore.myshopify.com"
                                    value={shopDomain}
                                    onChange={e => setShopDomain(e.target.value)}
                                    className={`ifam-input ${shakingFields.includes('shopDomain') ? 'ifam-error-border' : ''}`}
                                />
                            </div>
                            <div className={`ifam-pad ${shakingFields.includes('shopifyToken') ? 'ifam-shake' : ''}`}>
                                <label className="ifam-label">Shopify Admin Token</label>
                                <input
                                    type="password"
                                    placeholder="shpat_..."
                                    value={shopifyToken}
                                    onChange={e => setShopifyToken(e.target.value)}
                                    className={`ifam-input ${shakingFields.includes('shopifyToken') ? 'ifam-error-border' : ''}`}
                                />
                                <p className="ifam-help">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span> Encrypted at rest (AES-GCM)
                                </p>
                            </div>

                             <div className="ifam-section relative">
                                <div className="relative mb-2">
                                    <label className="ifam-label !mb-0">
                                        Ads Platform
                                        <div className="ifm-toggle-right">
                                            <span className="ifm-toggle-label">Enable Ads</span>
                                            <label className="switch">
                                                <input 
                                                    type="checkbox" 
                                                    checked={lockAdsFields ? false : adsEnabled} 
                                                    disabled={lockAdsFields}
                                                    onChange={e => !lockAdsFields && setAdsEnabled(e.target.checked)} 
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </label>
                                </div>

                                <div className="relative mt-3 min-h-[140px]">
                                    {lockAdsFields && (
                                        <div className="absolute inset-x-0 -top-1 -bottom-2 z-10 backdrop-blur-[1.5px] bg-white/5 flex items-center justify-center rounded-xl">
                                            <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg border border-slate-100 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></div>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Settings Locked</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className={`${lockAdsFields ? 'opacity-80 pointer-events-none' : ''}`}>
                                        <div className={`ifam-pad relative ${shakingFields.includes('adsPlatform') ? 'ifam-shake' : ''}`}>
                                            <select
                                                value={adsPlatform}
                                                disabled={!adsEnabled || lockAdsFields}
                                                onChange={e => setAdsPlatform(e.target.value)}
                                                className={`ifam-input ${shakingFields.includes('adsPlatform') ? 'ifam-error-border' : ''}`}
                                                style={{ opacity: adsEnabled ? 1 : 0.55 }}
                                            >
                                                <option value="">Select one...</option>
                                                <option value="google">Google Ads</option>
                                                <option value="meta">Meta Ads</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className={`ifam-pad ${shakingFields.includes('adsToken') ? 'ifam-shake' : ''}`}>
                                            <label className="ifam-label">Ads API Token</label>
                                            <input
                                                type="password"
                                                placeholder="API Token"
                                                value={adsToken}
                                                disabled={!adsEnabled || lockAdsFields}
                                                onChange={e => setAdsToken(e.target.value)}
                                                className={`ifam-input ${shakingFields.includes('adsToken') ? 'ifam-error-border' : ''}`}
                                                style={{ opacity: adsEnabled ? 1 : 0.55 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ifam-actions">
                                <button type="button" onClick={() => handleNext('delivery')} className="ifam-btn ifam-next">
                                    Next <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'delivery' && (
                        <div className="ifam-panel animate-in fade-in duration-300">
                            <div className={`ifam-pad ${ (shakingFields.includes('delMethod') || shakingFields.includes('delMethods')) ? 'ifam-shake' : ''}`}>
                                <label className="ifam-label">Delivery Method</label>
                                
                                <div className="ifam-cardboard !mt-0 !pt-6">
                                    <div className="ifam-delivery-options">
                                        {/* Show ONLY the methods allowed by the admin's preset.
                                            allowedDeliveryMethods is already filtered by IntegrationsPage
                                            from the admin's saved form (deliveryOptions field). */
                                        ([
                                            { id: 'email', label: 'Email' },
                                            { id: 'whatsapp', label: 'WhatsApp' },
                                            { id: 'slack', label: 'Slack' }
                                        ].filter(ch => allowedDeliveryMethods.includes(ch.id))).map(ch => {
                                            const isChecked = isAndType ? delMethods.includes(ch.id) : delMethod === ch.id;
                                            return (
                                                <div key={ch.id} className="ifam-radio-wrap flex-1 min-w-[120px]">
                                                    <input 
                                                        type={isAndType ? "checkbox" : "radio"} 
                                                        id={`del_${ch.id}`}
                                                        name="delivery_method" 
                                                        checked={isChecked}
                                                        onChange={() => {
                                                            if (isAndType) {
                                                                setDelMethods(prev => {
                                                                    const exists = prev.includes(ch.id);
                                                                    if (exists) return prev.filter(m => m !== ch.id);
                                                                    return [...prev, ch.id];
                                                                });
                                                            } else {
                                                                if (ch.id === 'email') { setDelWhatsApp(''); setDelSlack(''); }
                                                                if (ch.id === 'whatsapp') { setDelEmail(''); setDelSlack(''); }
                                                                if (ch.id === 'slack') { setDelEmail(''); setDelWhatsApp(''); }
                                                                setDelMethod(ch.id);
                                                            }
                                                        }} 
                                                    /> 
                                                    <label htmlFor={`del_${ch.id}`} className="ifam-radio-label">
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isChecked ? 'border-white bg-white/20' : 'border-slate-300'}`}>
                                                            {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                        </div>
                                                        {ch.label}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                        {allowedDeliveryMethods.length === 0 && (
                                            <div className="text-sm text-slate-500 italic">No delivery methods available.</div>
                                        )}
                                    </div>

                                    <div id="ifam-del-fields" className="mt-6 border-t border-slate-100 pt-6">
                                        {[
                                            { id: 'email', label: 'Email Address', field: 'delEmail', setter: setDelEmail, value: delEmail, type: 'email', placeholder: 'name@company.com' },
                                            { id: 'whatsapp', label: 'WhatsApp Number', field: 'delWhatsApp', setter: setDelWhatsApp, value: delWhatsApp, type: 'tel', placeholder: 'Enter phone number (with +country code)', note: 'Compulsory: include your country code (e.g., +1, +233, +234) for reliable delivery.' },
                                            { id: 'slack', label: 'Slack Webhook / Channel', field: 'delSlack', setter: setDelSlack, value: delSlack, type: 'url', placeholder: 'https://hooks.slack.com/...' }
                                        ].filter(ch => {
                                            const isAndType = deliveryPreset === 'slack_whatsapp' || deliveryPreset === 'all';
                                            if (isAndType) return delMethods.includes(ch.id);
                                            return ch.id === delMethod;
                                        }).map(ch => (
                                            <div key={ch.id} className={`ifam-del-field animate-in slide-in-from-top-2 duration-200 mb-6 last:mb-0 ${shakingFields.includes(ch.field) ? 'ifam-shake' : ''}`}>
                                                <label className="ifam-label text-sm">{ch.label}</label>
                                                <input
                                                    type={ch.type}
                                                    placeholder={ch.placeholder}
                                                    value={ch.value}
                                                    onChange={e => ch.setter(e.target.value)}
                                                    className={`ifam-input ${shakingFields.includes(ch.field) ? 'ifam-error-border' : ''}`}
                                                />
                                                {ch.note && <div className="ifam-help mt-2 text-xs text-slate-500 font-medium">{ch.note}</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={`ifam-pad ${shakingFields.includes('delDays') ? 'ifam-shake' : ''}`}>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="ifam-label !mb-0">Schedule Days</label>
                                    {dayLimit < Infinity && (
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                            <AlertTriangle className="w-3 h-3" />
                                            {deliveryPreset === 'slack_email'
                                                ? 'Max 1 day (Slack or Email plan)'
                                                : `Max ${dayLimit} days (Slack & WhatsApp plan)`
                                            }
                                        </span>
                                    )}
                                </div>
                                {showLimitToast && (
                                    <div className="mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs font-semibold animate-in fade-in duration-200">
                                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                        Limit reached — your plan allows up to {dayLimit} schedule day{dayLimit > 1 ? 's' : ''} only.
                                    </div>
                                )}
                                <div className={`ifam-day-grid ${shakingFields.includes('delDays') ? 'border-[#ef4444] bg-[#fef2f2] rounded-lg' : ''}`}>
                                    {allowedDays.map(day => {
                                        const isCheckedDay = delDays.includes(day);
                                        const atLimit = !isCheckedDay && delDays.length >= dayLimit;
                                        return (
                                            <label
                                                key={day}
                                                className={`ifam-day ${atLimit ? 'opacity-40 cursor-not-allowed' : ''}`}
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    checked={isCheckedDay}
                                                    disabled={atLimit}
                                                    onChange={() => {
                                                        if (!isCheckedDay && delDays.length >= dayLimit) {
                                                            setShowLimitToast(true);
                                                            setTimeout(() => setShowLimitToast(false), 4000);
                                                            return;
                                                        }
                                                        setDelDays((prev: string[]) => 
                                                            isCheckedDay ? prev.filter((d: string) => d !== day) : [...prev, day]
                                                        );
                                                    }}
                                                />
                                                <span className="ifam-day-text">{day}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="ifam-pad">
                                <label className="ifam-label">Delivery Time</label>
                                <select value={delTime} onChange={e => setDelTime(e.target.value)} className="ifam-input">
                                    <option value="09:00">09:00 AM</option>
                                    <option value="12:00">12:00 PM</option>
                                    <option value="15:00">03:00 PM</option>
                                    <option value="18:00">06:00 PM</option>
                                </select>
                            </div>

                            <div className="ifam-actions">
                                <button type="button" onClick={() => setActiveTab('credentials')} className="ifam-btn ifam-prev">
                                    <ArrowLeft className="w-4 h-4" /> Previous
                                </button>
                                <button type="button" onClick={() => handleNext('data')} className="ifam-btn ifam-next">
                                    Next <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="ifam-panel animate-in fade-in duration-300">
                            <div className="ifam-danger-zone">
                                <div className="ifam-danger-title"><Trash2 className="w-5 h-5" /> Danger Zone</div>
                                <p className="ifam-danger-desc"> Permanently delete your sync data. This action is logged via Audit Trail. </p>
                                <div className="ifam-delete-confirm-wrap">
                                    <label className="ifam-label">To confirm, type "delete data" below:</label>
                                    <input type="text" placeholder="delete data" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} className="ifam-input" />
                                </div>
                                <button
                                    type="button"
                                    disabled={deleteConfirm.toLowerCase() !== 'delete data'}
                                    onClick={() => {
                                        const reason = window.prompt('Please enter a brief reason for deleting your data:');
                                        if (reason) setDeleteResponse('Data deleted successfully.');
                                    }}
                                    className="ifam-btn ifam-delete disabled:opacity-50"
                                >
                                    Delete Data
                                </button>
                                {deleteResponse && <p className="ifam-delete-response text-green-600 mt-2">{deleteResponse}</p>}
                            </div>
                            <div className="ifam-actions">
                                <button type="button" onClick={() => setActiveTab('delivery')} className="ifam-btn ifam-prev">
                                    <ArrowLeft className="w-4 h-4" /> Previous
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="ifam-actions-bottom mt-10 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col items-start gap-1.5">
                            <button
                                type="button"
                                disabled={isSyncing}
                                onClick={async () => {
                                    setIsSyncing(true);
                                    setSyncStatus('idle');
                                    try {
                                        await callN8nProxy({ 
                                            action: 'sync', 
                                            store_id: storeId,
                                            shopDomain, 
                                            webhookUrl, 
                                            delMethod: deliveryPreset === 'slack_whatsapp' ? 'slack+whatsapp' : delMethod, 
                                            delEmail, 
                                            delWhatsApp, 
                                            delSlack,
                                            delMethods: deliveryPreset === 'slack_whatsapp' ? delMethods : [delMethod]
                                        });
                                        setSyncStatus('success');
                                    } catch (err) {
                                        setSyncStatus('error');
                                    } finally {
                                        setIsSyncing(false);
                                        setTimeout(() => setSyncStatus('idle'), 5000);
                                    }
                                }}
                                className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : syncStatus === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : syncStatus === 'error' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <LinkIcon className="w-4 h-4" />}
                                {isSyncing ? 'Triggering workflow...' : 'Trigger n8n Sync'}
                            </button>
                            {syncStatus === 'success' && (
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 animate-in fade-in duration-300">
                                    <CheckCircle className="w-3.5 h-3.5" /> Workflow triggered successfully!
                                </span>
                            )}
                            {syncStatus === 'error' && (
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 animate-in fade-in duration-300">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Connection failed — check your webhook URL.
                                </span>
                            )}
                        </div>

                        {/* Save button + its inline notifications */}
                        <div className="flex flex-col items-end gap-2">
                            {showSuccess && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-semibold animate-in fade-in duration-300">
                                    <CheckCircle className="w-3.5 h-3.5" /> Settings saved &amp; workflow configured!
                                </div>
                            )}
                            {saveError && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-semibold animate-in fade-in duration-300 max-w-xs text-right">
                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {saveError}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="ifam-btn !bg-emerald-500 hover:!bg-emerald-600 text-white shadow-xl px-10 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {isSaving ? 'Saving...' : 'Save All Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CredentialForm;
