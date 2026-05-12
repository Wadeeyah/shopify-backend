import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, CheckCircle, AlertCircle, Loader2, ChevronDown, ChevronUp, Upload, X, Search } from 'lucide-react';

// Using react-quill-new for React 19 compatibility
const ReactQuill = lazy(() => import('react-quill-new'));
import 'react-quill-new/dist/quill.snow.css';

// Google Fonts we support in the editor
const GOOGLE_FONTS = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
    'Poppins', 'Playfair Display', 'Merriweather', 'Nunito', 'Raleway',
    'Source Sans Pro', 'PT Sans', 'Oswald', 'Quicksand'
];

// Inject Google Fonts stylesheet into <head>
const injectGoogleFonts = () => {
    if (document.getElementById('google-fonts-editor')) return;
    const link = document.createElement('link');
    link.id = 'google-fonts-editor';
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS.map(f => `family=${f.replace(/ /g, '+')}`).join('&')}&display=swap`;
    document.head.appendChild(link);
};

// Register custom fonts with Quill
const registerQuillFonts = async () => {
    const Quill = (await import('react-quill-new')).default.Quill || (await import('quill')).default;
    if (!Quill) return;
    const Font = Quill.import('formats/font') as any;
    Font.whitelist = ['', ...GOOGLE_FONTS.map(f => f.replace(/ /g, '-').toLowerCase())];
    Quill.register(Font, true);

    // Also try registering image resize
    try {
        const ImageResize = (await import('quill-resize-image')).default;
        Quill.register('modules/imageResize', ImageResize);
    } catch (e) {
        console.warn('Image resize module not available:', e);
    }
};

// Tooltip map for Quill toolbar buttons
const TOOLBAR_TOOLTIPS: Record<string, string> = {
    '.ql-bold': 'Bold',
    '.ql-italic': 'Italic',
    '.ql-underline': 'Underline',
    '.ql-strike': 'Strikethrough',
    '.ql-link': 'Insert Link',
    '.ql-image': 'Insert Image',
    '.ql-video': 'Insert Video',
    '.ql-clean': 'Clear Formatting',
    '.ql-code-block': 'Code Block',
    '.ql-blockquote': 'Blockquote',
    '.ql-list[value="ordered"]': 'Ordered List',
    '.ql-list[value="bullet"]': 'Bullet List',
    '.ql-indent[value="-1"]': 'Decrease Indent',
    '.ql-indent[value="+1"]': 'Increase Indent',
    '.ql-script[value="sub"]': 'Subscript',
    '.ql-script[value="super"]': 'Superscript',
    '.ql-align .ql-picker-label': 'Text Alignment',
    '.ql-color .ql-picker-label': 'Font Color',
    '.ql-background .ql-picker-label': 'Background Color',
    '.ql-font .ql-picker-label': 'Font Family',
    '.ql-size .ql-picker-label': 'Font Size',
    '.ql-header .ql-picker-label': 'Heading Level',
};

const applyToolbarTooltips = () => {
    Object.entries(TOOLBAR_TOOLTIPS).forEach(([selector, tooltip]) => {
        document.querySelectorAll(selector).forEach(el => {
            el.setAttribute('title', tooltip);
        });
    });
    // Also apply to align options
    document.querySelectorAll('.ql-align .ql-picker-item').forEach(el => {
        const val = el.getAttribute('data-value');
        el.setAttribute('title', val ? `Align ${val}` : 'Align left');
    });
    document.querySelectorAll('.ql-header .ql-picker-item').forEach(el => {
        const val = el.getAttribute('data-value');
        el.setAttribute('title', val ? `Heading ${val}` : 'Normal text');
    });
};

// ---- Simple Editor (HTML) Toolbar ----
const SIMPLE_TAGS = [
    { label: 'b', tag: 'strong', title: 'Bold' },
    { label: 'i', tag: 'em', title: 'Italic' },
    { label: 'link', tag: 'a', wrap: '<a href="">', close: '</a>', title: 'Hyperlink' },
    { label: 'b-quote', tag: 'blockquote', title: 'Blockquote' },
    { label: 'del', tag: 'del', title: 'Deleted text' },
    { label: 'ins', tag: 'ins', title: 'Inserted text' },
    { label: 'img', tag: 'img', selfClose: true, title: 'Image' },
    { label: 'ul', tag: 'ul', title: 'Unordered list' },
    { label: 'ol', tag: 'ol', title: 'Ordered list' },
    { label: 'li', tag: 'li', title: 'List item' },
    { label: 'code', tag: 'code', title: 'Code' },
    { label: 'h1', tag: 'h1', title: 'Heading 1' },
    { label: 'h2', tag: 'h2', title: 'Heading 2' },
    { label: 'h3', tag: 'h3', title: 'Heading 3' },
    { label: 'p', tag: 'p', title: 'Paragraph' },
    { label: 'hr', tag: 'hr', selfClose: true, title: 'Horizontal Rule' },
];

const SimpleEditorToolbar: React.FC<{
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    onInsert: (text: string) => void;
}> = ({ textareaRef, onInsert }) => {
    const insertTag = (item: typeof SIMPLE_TAGS[0]) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = ta.value.substring(start, end);

        let insertion = '';
        if (item.selfClose) {
            if (item.tag === 'img') {
                const url = prompt('Enter image URL:');
                if (url) insertion = `<img src="${url}" alt="" />`;
            } else {
                insertion = `<${item.tag} />`;
            }
        } else if (item.wrap) {
            insertion = `${item.wrap}${selected}${item.close}`;
        } else {
            insertion = `<${item.tag}>${selected}</${item.tag}>`;
        }

        if (insertion) {
            const newValue = ta.value.substring(0, start) + insertion + ta.value.substring(end);
            onInsert(newValue);
            setTimeout(() => {
                ta.focus();
                ta.selectionStart = ta.selectionEnd = start + insertion.length;
            }, 0);
        }
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 bg-white border-b border-slate-200">
            {SIMPLE_TAGS.map(item => (
                <button
                    key={item.label}
                    type="button"
                    title={item.title}
                    onClick={() => insertTag(item)}
                    className="px-2.5 py-1 text-xs font-mono border border-blue-400 text-blue-600 rounded hover:bg-blue-50 hover:border-blue-500 transition-colors"
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};

// ---- Tag Pill Input ----
const TagPillInput: React.FC<{
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}> = ({ value, onChange, placeholder }) => {
    const [inputVal, setInputVal] = useState('');
    const items = value.split(',').map(s => s.trim()).filter(Boolean);

    const addItem = () => {
        const trimmed = inputVal.trim();
        if (trimmed && !items.includes(trimmed)) {
            const newItems = [...items, trimmed];
            onChange(newItems.join(', '));
            setInputVal('');
        }
    };

    const removeItem = (idx: number) => {
        const newItems = items.filter((_, i) => i !== idx);
        onChange(newItems.join(', '));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addItem();
        }
    };

    return (
        <div>
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
                {items.map((item, idx) => (
                    <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-full text-xs font-medium"
                    >
                        {item}
                        <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="hover:text-red-500 transition-colors"
                            title={`Remove ${item}`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-1.5">
                <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 text-sm border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
                <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-1.5 text-xs font-medium bg-brand-600 text-white rounded hover:bg-brand-700 transition-colors"
                >
                    Add
                </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">Press Enter or comma to add. Click × to remove.</p>
        </div>
    );
};

// ---- Error Boundary ----
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, errorMsg: string }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, errorMsg: '' };
    }
    static getDerivedStateFromError(error: any) {
        return { hasError: true, errorMsg: error.message || String(error) };
    }
    componentDidCatch(error: any, errorInfo: any) {
        console.error("Quill Error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg whitespace-pre-wrap">
                    <h3 className="font-bold mb-2">Editor Crash</h3>
                    {this.state.errorMsg}
                </div>
            );
        }
        return this.props.children;
    }
}

// ---- AccordionWidget ----
const AccordionWidget = ({ title, defaultOpen = false, children }: { title: string, defaultOpen?: boolean, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div
                className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white font-semibold text-slate-700 text-sm flex justify-between items-center cursor-pointer select-none hover:bg-slate-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
            <div className={`transition-all duration-200 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

// ---- PostEditor Props ----
interface PostEditorProps {
    postId?: string;
    onBack: () => void;
    authorName: string;
    type?: 'post' | 'page';
}

// ==== MAIN COMPONENT ====
const PostEditor: React.FC<PostEditorProps> = ({ postId, onBack, authorName, type = 'post' }) => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [categories, setCategories] = useState('');
    const [tags, setTags] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [useRichText, setUseRichText] = useState(true);
    const [isEditingSlug, setIsEditingSlug] = useState(false);
    const [quillReady, setQuillReady] = useState(false);

    // Featured image state
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [coverDimensions, setCoverDimensions] = useState<{ w: number, h: number } | null>(null);
    const [coverSizeWarning, setCoverSizeWarning] = useState<string | null>(null);
    const [showResizeConfirm, setShowResizeConfirm] = useState(false);
    const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
    const [resizeWidth, setResizeWidth] = useState(1200);

    const simpleEditorRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        injectGoogleFonts();
        registerQuillFonts().then(() => {
            setIsMounted(true);
        });
        if (postId) fetchPost();
        // eslint-disable-next-line
    }, [postId]);

    // Apply tooltips after Quill renders
    useEffect(() => {
        if (quillReady) {
            setTimeout(applyToolbarTooltips, 300);
        }
    }, [quillReady, useRichText]);

    const fetchPost = async () => {
        const { data } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (data) {
            setTitle(data.title || '');
            setSlug(data.slug || '');
            setContent(data.content || '');
            setExcerpt(data.excerpt || '');
            setCoverImage(data.cover_image || '');
            setStatus(data.status || 'draft');
            setMetaTitle(data.meta_title || '');
            setMetaDescription(data.meta_description || '');
            setCategories(data.categories ? data.categories.join(', ') : '');
            setTags(data.tags ? data.tags.join(', ') : '');
        }
    };

    const generateSlug = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (!postId) setSlug(generateSlug(e.target.value));
    };

    const handleSave = async () => {
        if (!title || !slug) {
            setMessage({ type: 'error', text: 'Title and Slug are required.' });
            return;
        }
        setIsSaving(true);
        setMessage(null);

        const catArray = categories.split(',').map(c => c.trim()).filter(Boolean);
        const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);

        const postData = {
            title, slug, content, excerpt,
            cover_image: coverImage, status,
            meta_title: metaTitle, meta_description: metaDescription,
            author_name: authorName,
            published_at: status === 'published' ? new Date().toISOString() : null,
            categories: catArray, tags: tagArray, post_type: type
        };

        try {
            if (postId) {
                const { error } = await supabase.from('posts').update(postData).eq('id', postId);
                if (error) throw error;
                setMessage({ type: 'success', text: 'Post updated successfully!' });
            } else {
                const { error } = await supabase.from('posts').insert([postData]);
                if (error) throw error;
                setMessage({ type: 'success', text: 'Post created successfully!' });
                setTimeout(() => onBack(), 1500);
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Error saving post' });
        } finally {
            setIsSaving(false);
        }
    };

    // ---- Image upload handler for Quill toolbar ----
    const imageHandler = React.useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            const file = input.files ? input.files[0] : null;
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `post-images/${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
                const { error } = await supabase.storage.from('blog-images').upload(fileName, file);
                if (error) { alert('Error uploading image: ' + error.message); return; }
                const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(fileName);
                setContent(prev => prev + `<p><img src="${publicUrl}" alt="uploaded image" style="max-width:100%;height:auto;" /></p>`);
            }
        };
    }, []);

    // Quill modules
    const modules = React.useMemo(() => ({
        toolbar: {
            container: [
                [{ 'font': ['', ...GOOGLE_FONTS.map(f => f.replace(/ /g, '-').toLowerCase())] }, { 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'align': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image', 'video'],
                ['clean', 'code-block', 'blockquote']
            ],
            handlers: { image: imageHandler }
        },
        imageResize: { displayStyles: { backgroundColor: 'black', border: 'none', color: 'white' }, modules: ['Resize', 'DisplaySize'] }
    }), [imageHandler]);

    // Drag and drop image handler
    const handleImageDrop = async (e: React.DragEvent) => {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                e.preventDefault();
                e.stopPropagation();
                const fileExt = file.name.split('.').pop();
                const fileName = `post-images/${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
                const { error } = await supabase.storage.from('blog-images').upload(fileName, file);
                if (!error) {
                    const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(fileName);
                    setContent(prev => prev + `<p><img src="${publicUrl}" alt="dropped image" style="max-width:100%;height:auto;" /></p>`);
                } else {
                    alert('Failed to upload image: ' + error.message);
                }
            }
        }
    };

    // ---- Featured Image Upload ----
    const handleCoverUpload = async (file: File) => {
        // Check dimensions first
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
        await new Promise(resolve => { img.onload = resolve; });
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        URL.revokeObjectURL(objectUrl);

        setCoverDimensions({ w, h });

        if (w < 400 || h < 200) {
            setCoverSizeWarning(`⚠ Image is too small (${w}×${h}px). Recommended minimum: 400×200px.`);
        } else if (w > 2000) {
            setCoverSizeWarning(`ℹ Image is large (${w}×${h}px). Consider resizing to 1200px wide for faster loading.`);
            setPendingCoverFile(file);
            setResizeWidth(1200);
            setShowResizeConfirm(true);
            return;
        } else {
            setCoverSizeWarning(null);
        }

        await uploadCoverFile(file);
    };

    const uploadCoverFile = async (file: File) => {
        setIsUploadingCover(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `featured/${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from('blog-images').upload(fileName, file);
        if (error) {
            alert('Error uploading cover image: ' + error.message);
            setIsUploadingCover(false);
            return;
        }
        const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(fileName);
        setCoverImage(publicUrl);
        setIsUploadingCover(false);
    };

    const resizeAndUploadCover = async () => {
        if (!pendingCoverFile) return;
        setIsUploadingCover(true);

        const img = new Image();
        const objectUrl = URL.createObjectURL(pendingCoverFile);
        img.src = objectUrl;
        await new Promise(resolve => { img.onload = resolve; });

        const canvas = document.createElement('canvas');
        const ratio = resizeWidth / img.naturalWidth;
        canvas.width = resizeWidth;
        canvas.height = Math.round(img.naturalHeight * ratio);
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(objectUrl);

        const blob = await new Promise<Blob>((resolve) => canvas.toBlob(b => resolve(b!), 'image/jpeg', 0.9));
        const resizedFile = new File([blob], `resized-${pendingCoverFile.name}`, { type: 'image/jpeg' });

        setCoverDimensions({ w: canvas.width, h: canvas.height });
        setCoverSizeWarning(null);
        setShowResizeConfirm(false);
        setPendingCoverFile(null);
        await uploadCoverFile(resizedFile);
    };

    // ---- Google Preview for SEO ----
    const seoPreviewTitle = metaTitle || title || 'Page Title';
    const seoPreviewUrl = `yourdomain.com/blog/${slug || 'post-slug'}`;
    const seoPreviewDesc = metaDescription || excerpt || 'Your meta description will appear here...';

    return (
        <div className="bg-slate-100 rounded-lg border border-slate-200 overflow-hidden text-sm">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
                >
                    <ChevronLeft className="w-5 h-5" /> Back to {type === 'post' ? 'Posts' : 'Pages'}
                </button>
            </div>

            {message && (
                <div className={`mx-6 mt-4 p-4 rounded-md flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-medium text-sm">{message.text}</p>
                </div>
            )}

            <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left: Editor */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Title + Permalink */}
                    <div>
                        <input
                            type="text"
                            placeholder="Add title"
                            value={title}
                            onChange={handleTitleChange}
                            className="w-full text-3xl font-bold border border-slate-200 rounded-sm focus:ring-1 focus:ring-brand-500 px-4 py-3 placeholder:text-slate-300 shadow-inner bg-white"
                        />
                        {title && (
                            <div className="mt-2 text-sm text-slate-600 flex items-center gap-2">
                                <strong>Permalink:</strong>
                                {isEditingSlug ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-brand-600">/blog/</span>
                                        <input
                                            type="text"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            className="border border-slate-300 rounded px-2 py-0.5 text-sm h-7 focus:ring-brand-500 w-48"
                                        />
                                        <button onClick={() => setIsEditingSlug(false)} className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs hover:bg-slate-200 font-medium h-7">OK</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <a href={`/blog/${slug}`} className="text-brand-600 hover:underline" target="_blank" rel="noreferrer">/blog/{slug}</a>
                                        <button onClick={() => setIsEditingSlug(true)} className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs hover:bg-slate-200 font-medium">Edit</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Editor Area */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-semibold text-slate-700">Post Content</label>
                            <button
                                onClick={() => setUseRichText(!useRichText)}
                                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                            >
                                {useRichText ? 'Switch to Simple Editor' : 'Switch to Visual Editor'}
                            </button>
                        </div>

                        <div
                            className="min-h-[400px] mb-12 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
                            onDropCapture={handleImageDrop}
                        >
                            {useRichText && isMounted ? (
                                <ErrorBoundary>
                                    <Suspense fallback={
                                        <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400 bg-slate-50">
                                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                            <p className="text-sm">Loading rich editor...</p>
                                        </div>
                                    }>
                                        <ReactQuill
                                            theme="snow"
                                            value={content}
                                            onChange={(val: string) => { setContent(val); if (!quillReady) setQuillReady(true); }}
                                            modules={modules}
                                            className="h-full bg-white quill-custom-fonts"
                                        />
                                    </Suspense>
                                </ErrorBoundary>
                            ) : (
                                <div>
                                    <SimpleEditorToolbar textareaRef={simpleEditorRef} onInsert={setContent} />
                                    <textarea
                                        ref={simpleEditorRef}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full h-full p-4 font-mono text-sm focus:ring-brand-500 min-h-[400px] outline-none resize-y border-0"
                                        placeholder="Write your post content here (HTML supported)..."
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Sidebar Widgets */}
                <div className="space-y-4">
                    {/* Publish Widget (always open) */}
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white font-semibold text-slate-700 text-sm">
                            Publish
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => { setStatus('draft'); setTimeout(() => handleSave(), 50); }}
                                    disabled={isSaving}
                                    className="px-3 py-1 bg-slate-100 border border-slate-300 rounded text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
                                >
                                    Save Draft
                                </button>
                                <a
                                    href={slug ? `/blog/${slug}` : '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1 bg-slate-100 border border-slate-300 rounded text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors"
                                    onClick={(e) => { if (!slug) { e.preventDefault(); alert('Add a title first.'); } }}
                                >
                                    Preview
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 pt-2 border-t border-slate-100">
                                <AlertCircle className="w-4 h-4" /> Status: <strong>{status === 'published' ? 'Published' : 'Draft'}</strong>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                                    className="border-slate-300 rounded text-sm py-1.5 px-2 font-medium bg-slate-50 focus:ring-brand-500"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? 'Working...' : (postId ? 'Update' : 'Publish')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    {type === 'post' && (
                        <>
                            <AccordionWidget title="Categories" defaultOpen={true}>
                                <TagPillInput
                                    value={categories}
                                    onChange={setCategories}
                                    placeholder="Add a category..."
                                />
                            </AccordionWidget>

                            <AccordionWidget title="Tags" defaultOpen={false}>
                                <TagPillInput
                                    value={tags}
                                    onChange={setTags}
                                    placeholder="Add a tag..."
                                />
                            </AccordionWidget>
                        </>
                    )}

                    {/* Featured Image */}
                    <AccordionWidget title="Featured Image" defaultOpen={true}>
                        <div className="space-y-3">
                            {coverImage ? (
                                <div className="relative group">
                                    <img src={coverImage} alt="Cover preview" className="w-full h-auto rounded-lg border border-slate-200 shadow-sm" />
                                    {coverDimensions && (
                                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                                            {coverDimensions.w} × {coverDimensions.h}px
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => { setCoverImage(''); setCoverDimensions(null); setCoverSizeWarning(null); }}
                                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        title="Remove image"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <label
                                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-colors"
                                >
                                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                    <span className="text-sm font-medium text-slate-600">Click to upload image</span>
                                    <span className="text-[11px] text-slate-400 mt-1">or drag and drop</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) handleCoverUpload(f);
                                        }}
                                    />
                                </label>
                            )}

                            {isUploadingCover && (
                                <div className="flex items-center gap-2 text-sm text-brand-600">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                                </div>
                            )}

                            {coverSizeWarning && (
                                <div className={`text-xs p-2 rounded ${coverSizeWarning.startsWith('⚠') ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                    {coverSizeWarning}
                                </div>
                            )}

                            {showResizeConfirm && (
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                                    <p className="text-xs text-slate-700 font-medium">Resize image before uploading?</p>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-slate-500">Max width:</label>
                                        <input
                                            type="number"
                                            value={resizeWidth}
                                            onChange={(e) => setResizeWidth(Number(e.target.value))}
                                            className="w-20 text-xs border border-slate-300 rounded px-2 py-1"
                                        />
                                        <span className="text-xs text-slate-400">px</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={resizeAndUploadCover}
                                            className="flex-1 text-xs font-medium bg-brand-600 text-white py-1.5 rounded hover:bg-brand-700 transition-colors"
                                        >
                                            Resize & Upload
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowResizeConfirm(false);
                                                if (pendingCoverFile) uploadCoverFile(pendingCoverFile);
                                                setPendingCoverFile(null);
                                            }}
                                            className="flex-1 text-xs font-medium bg-slate-200 text-slate-700 py-1.5 rounded hover:bg-slate-300 transition-colors"
                                        >
                                            Upload Original
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* URL input fallback */}
                            {!coverImage && (
                                <div className="pt-2 border-t border-slate-100">
                                    <input
                                        type="text"
                                        value={coverImage}
                                        onChange={(e) => setCoverImage(e.target.value)}
                                        placeholder="Or paste image URL..."
                                        className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </AccordionWidget>

                    {/* SEO Meta Setup */}
                    <AccordionWidget title="SEO Meta" defaultOpen={false}>
                        <div className="space-y-4">
                            {/* Google Preview */}
                            <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1">
                                    <Search className="w-3 h-3" /> Google Preview
                                </p>
                                <div className="text-[13px] text-blue-700 font-medium leading-snug truncate hover:underline cursor-pointer">
                                    {seoPreviewTitle}
                                </div>
                                <div className="text-[11px] text-green-700 truncate">
                                    {seoPreviewUrl}
                                </div>
                                <div className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mt-0.5">
                                    {seoPreviewDesc}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-semibold text-slate-700">Excerpt</label>
                                    <span className={`text-[10px] ${excerpt.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>{excerpt.length}/160</span>
                                </div>
                                <textarea
                                    rows={3}
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none px-3 py-2"
                                    placeholder="A brief summary of the post..."
                                />
                            </div>

                            <hr className="border-slate-100" />

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-semibold text-slate-700">Meta Title</label>
                                    <span className={`text-[10px] ${(metaTitle || title).length > 60 ? 'text-red-500' : 'text-slate-400'}`}>{(metaTitle || title).length}/60</span>
                                </div>
                                <input
                                    type="text"
                                    value={metaTitle}
                                    onChange={(e) => setMetaTitle(e.target.value)}
                                    placeholder={title || 'SEO Title'}
                                    className="w-full rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none px-3 py-2"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-semibold text-slate-700">Meta Description</label>
                                    <span className={`text-[10px] ${(metaDescription || excerpt).length > 160 ? 'text-red-500' : 'text-slate-400'}`}>{(metaDescription || excerpt).length}/160</span>
                                </div>
                                <textarea
                                    rows={2}
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    placeholder={excerpt || 'SEO Description'}
                                    className="w-full rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none px-3 py-2"
                                />
                            </div>
                        </div>
                    </AccordionWidget>
                </div>
            </div>
        </div>
    );
};

export default PostEditor;
