import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar, Footer } from './LandingPage';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, Calendar, User } from 'lucide-react';

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .eq('status', 'published')
                .single();

            if (error || !data) {
                navigate('/blog');
                return;
            }

            setPost(data);
            setIsLoading(false);
        };

        if (slug) fetchPost();
    }, [slug, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fafaf8] flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="min-h-screen bg-[#fafaf8] flex flex-col font-sans selection:bg-brand-500/30">
            <Helmet>
                <title>{post.meta_title || post.title} | Cluemetrics Blog</title>
                <meta name="description" content={post.meta_description || post.excerpt} />
            </Helmet>

            <div className="relative z-20">
                <Navbar />
            </div>

            <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 mt-8 md:mt-12 pb-24 relative z-10">
                <Link
                    to="/blog"
                    className="inline-flex items-center text-slate-500 hover:text-brand-600 font-medium mb-8 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to blog
                </Link>

                <article className="bg-white rounded-3xl p-6 sm:p-10 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80">
                    <header className="mb-10 sm:mb-14 text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-500 font-medium text-sm sm:text-base">
                            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                <User className="w-4 h-4 text-brand-500" />
                                {post.author_name || 'Admin'}
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                <Calendar className="w-4 h-4 text-brand-500" />
                                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </header>

                    {post.cover_image && (
                        <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-slate-100">
                            <img
                                src={post.cover_image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-brand-600 hover:prose-a:text-brand-700 prose-img:rounded-2xl prose-img:border prose-img:border-slate-100 selection:bg-brand-500/30 font-serif leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </main>

            {/* Subtle background glow */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[10%] content-center w-[60%] h-[60%] bg-brand-200/20 rounded-full blur-[120px]" />
            </div>

            <Footer />
        </div>
    );
};

export default BlogPost;
