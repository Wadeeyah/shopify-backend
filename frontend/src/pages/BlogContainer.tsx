import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import BlogWaitlist from './BlogWaitlist';
import BlogIndex from './BlogIndex';

const BlogContainer = () => {
    const [waitlistActive, setWaitlistActive] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase.from('site_settings').select('blog_waitlist_active').eq('id', 1).single();
            if (data && !error) {
                setWaitlistActive(data.blog_waitlist_active);
            } else {
                setWaitlistActive(true); // Default to waitlist if no setting found or table missing
            }
        };
        fetchSettings();
    }, []);

    if (waitlistActive === null) {
        return (
            <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (waitlistActive) {
        return <BlogWaitlist />;
    }

    return <BlogIndex />;
};

export default BlogContainer;
