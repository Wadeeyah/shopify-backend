import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Navbar, Footer } from './LandingPage';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const BlogIndex = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data } = await supabase
                .from('posts')
                .select('title, slug, excerpt, cover_image, status, created_at')
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (data) setPosts(data);
            setIsLoading(false);
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-[#fafaf8] flex flex-col font-sans selection:bg-brand-500/30">
            <Helmet>
                <title>Blog | Cluemetrics</title>
                <meta name="description" content="Thoughts, updates, and best practices on compliance, onboarding, risk, and building scalable businesses." />
            </Helmet>

            <div className="relative z-20">
                <Navbar />
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 mt-12 md:mt-20 relative z-10 pb-24">
                {/* Hero Section */}
                <div className="max-w-3xl mx-auto text-center mb-24 space-y-6 pt-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                        Insights for compliant growth
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 leading-relaxed">
                        Thoughts, updates, and best practices on compliance, onboarding, risk, and building scalable businesses.
                    </p>
                </div>

                {/* Posts Grid */}
                {isLoading ? (
                    <div className="flex justify-center w-full py-20">
                        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-medium text-slate-700">No posts published yet.</h3>
                        <p className="text-slate-500 mt-2">Check back later for new insights.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 w-full max-w-7xl mx-auto">
                        {posts.map((post) => (
                            <Link to={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col">
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-6 border border-slate-200/60 shadow-sm relative">
                                    {post.cover_image ? (
                                        <img
                                            src={post.cover_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-slate-500 mb-4 line-clamp-3 text-sm md:text-base leading-relaxed flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors mt-auto">
                                    Learn More <ArrowUpRight className="w-4 h-4 ml-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default BlogIndex;
