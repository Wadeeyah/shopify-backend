import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit, Trash2, Plus, FileText, ExternalLink, AlertTriangle } from 'lucide-react';
import PostEditor from './PostEditor';

interface PostManagerProps {
    authorName: string;
    type?: 'post' | 'page';
}

const PostManager: React.FC<PostManagerProps> = ({ authorName, type = 'post' }) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [waitlistActive, setWaitlistActive] = useState(true);
    const [dbError, setDbError] = useState<string | null>(null);

    useEffect(() => {
        if (!isCreating && !editingPostId) {
            fetchPosts();
        }
    }, [isCreating, editingPostId]);

    const fetchPosts = async () => {
        setIsLoading(true);
        setDbError(null);

        // Fetch Settings
        const { data: settingsData } = await supabase.from('site_settings').select('blog_waitlist_active').eq('id', 1).single();
        if (settingsData) {
            setWaitlistActive(settingsData.blog_waitlist_active);
        }

        // Fetch Posts
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('post_type', type)
            .order('created_at', { ascending: false });

        if (error) {
            if (error.code === '42P01') {
                setDbError('The required database tables are missing.');
            } else {
                setDbError(`Database Error: ${error.message} (${error.code})`);
            }
        } else if (data) {
            setPosts(data);
        }
        setIsLoading(false);
    };

    const toggleWaitlist = async () => {
        const newValue = !waitlistActive;
        setWaitlistActive(newValue);
        await supabase.from('site_settings').update({ blog_waitlist_active: newValue }).eq('id', 1);
    };

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            await supabase.from('posts').delete().eq('id', id);
            fetchPosts();
        }
    };

    if (isCreating) {
        return <PostEditor authorName={authorName} type={type} onBack={() => setIsCreating(false)} />;
    }

    if (editingPostId) {
        return <PostEditor postId={editingPostId} authorName={authorName} type={type} onBack={() => setEditingPostId(null)} />;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-800">{type === 'post' ? 'Blog Posts' : 'Pages'}</h2>
                    <p className="text-sm text-slate-500">{type === 'post' ? 'Manage your published articles and drafts.' : 'Manage your site pages and drafts.'}</p>
                </div>
                <div className="flex items-center gap-6">
                    {type === 'post' && (
                        <div className="flex items-center gap-3 border-r border-slate-200 pr-6">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-slate-800">Waitlist Mode</span>
                                <span className="text-xs text-slate-500">{waitlistActive ? 'Active' : 'Disabled'}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={waitlistActive}
                                    onChange={toggleWaitlist}
                                    disabled={!!dbError}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500 peer-disabled:opacity-50"></div>
                            </label>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCreating(true)}
                        disabled={!!dbError}
                        className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> {type === 'post' ? 'New Post' : 'New Page'}
                    </button>
                </div>
            </div>

            {dbError ? (
                <div className="p-8 m-6 bg-red-50 border border-red-200 rounded-xl flex flex-col items-center text-center">
                    <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
                    <h3 className="text-lg font-bold text-red-800 mb-2">Database Setup Required</h3>
                    <p className="text-red-600 max-w-lg mb-6">
                        You cannot create posts or toggle the waitlist because the Supabase tables don't exist yet.
                        Please run the <strong>supabase_setup_blog.sql</strong> script in your Supabase SQL Editor.
                    </p>
                    <button
                        onClick={fetchPosts}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        I've run the script, check again
                    </button>
                </div>
            ) : isLoading ? (
                <div className="p-12 pl-0 flex justify-center w-full">
                    <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4 text-slate-400">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 mb-1">{type === 'post' ? 'No posts yet' : 'No pages yet'}</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">{type === 'post' ? 'Create your first blog post to start sharing insights with your audience.' : 'Create your first page.'}</p>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="text-brand-600 font-medium text-sm hover:underline"
                    >
                        {type === 'post' ? 'Create a post' : 'Create a page'}
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {post.title}
                                        {post.slug && (
                                            <div className="text-xs text-slate-400 font-normal mt-0.5">/{post.slug}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                                            }`}>
                                            {post.status === 'published' ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {post.status === 'published' && (
                                                <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-600 transition-colors" title="View Post">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => setEditingPostId(post.id)}
                                                className="text-slate-400 hover:text-brand-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id, post.title)}
                                                className="text-slate-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PostManager;
