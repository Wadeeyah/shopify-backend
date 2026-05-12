import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Trash2, Copy, Upload, Image, Search, CheckCircle, X, ExternalLink } from 'lucide-react';

interface MediaFile {
    name: string;
    id: string;
    created_at: string;
    metadata: {
        size: number;
        mimetype: string;
    };
    publicUrl: string;
}

const MediaLibrary: React.FC = () => {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // List all files in the bucket recursively
            const folders = ['post-images', 'featured', ''];
            const allFiles: MediaFile[] = [];

            for (const folder of folders) {
                const { data, error: listError } = await supabase.storage
                    .from('blog-images')
                    .list(folder, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

                if (listError) {
                    console.warn(`Error listing ${folder}:`, listError.message);
                    continue;
                }

                if (data) {
                    for (const file of data) {
                        if (file.metadata && file.metadata.mimetype?.startsWith('image/')) {
                            const path = folder ? `${folder}/${file.name}` : file.name;
                            const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(path);
                            allFiles.push({
                                name: file.name,
                                id: file.id || path,
                                created_at: file.created_at || '',
                                metadata: {
                                    size: file.metadata?.size || 0,
                                    mimetype: file.metadata?.mimetype || 'image/unknown'
                                },
                                publicUrl
                            });
                        }
                    }
                }
            }

            setFiles(allFiles);
        } catch (err: any) {
            setError(err.message || 'Failed to load media');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) return;

        setIsUploading(true);
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `post-images/${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, file);
            if (uploadError) {
                alert(`Error uploading ${file.name}: ${uploadError.message}`);
            }
        }
        setIsUploading(false);
        fetchFiles();
    };

    const handleDelete = async (file: MediaFile) => {
        if (!window.confirm(`Delete "${file.name}"? This cannot be undone.`)) return;

        // Reconstruct the path from the publicUrl
        const urlParts = file.publicUrl.split('/blog-images/');
        const path = urlParts[1] ? decodeURIComponent(urlParts[1]) : file.name;

        const { error: delError } = await supabase.storage.from('blog-images').remove([path]);
        if (delError) {
            alert('Error deleting: ' + delError.message);
        } else {
            setFiles(prev => prev.filter(f => f.id !== file.id));
            if (selectedFile?.id === file.id) setSelectedFile(null);
        }
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return 'Unknown';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const filteredFiles = files.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-800">Media Library</h2>
                    <p className="text-sm text-slate-500">Manage your uploaded images and media files.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search files..."
                            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none w-48"
                        />
                    </div>
                    <label className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors shadow-sm">
                        <Upload className="w-4 h-4" />
                        Upload
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleUpload}
                        />
                    </label>
                </div>
            </div>

            {/* Content */}
            {error ? (
                <div className="p-8 text-center text-red-600">
                    <p className="font-medium">{error}</p>
                    <button onClick={fetchFiles} className="mt-3 text-sm text-brand-600 hover:underline">Retry</button>
                </div>
            ) : isLoading ? (
                <div className="p-12 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4 text-slate-400">
                        <Image className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 mb-1">
                        {searchTerm ? 'No matching files' : 'No media uploaded yet'}
                    </h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        {searchTerm ? 'Try a different search term.' : 'Upload images using the button above or through the Post Editor.'}
                    </p>
                </div>
            ) : (
                <div className="p-6">
                    {isUploading && (
                        <div className="mb-4 p-3 bg-brand-50 text-brand-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                            <Loader2 className="w-4 h-4 animate-spin" /> Uploading files...
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredFiles.map(file => (
                            <div
                                key={file.id}
                                className={`group relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${selectedFile?.id === file.id ? 'border-brand-500 ring-2 ring-brand-200' : 'border-slate-200 hover:border-slate-300'}`}
                                onClick={() => setSelectedFile(selectedFile?.id === file.id ? null : file)}
                            >
                                <div className="aspect-square bg-slate-100">
                                    <img
                                        src={file.publicUrl}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-2 bg-white">
                                    <p className="text-[11px] text-slate-700 font-medium truncate" title={file.name}>{file.name}</p>
                                    <p className="text-[10px] text-slate-400">{formatSize(file.metadata.size)}</p>
                                </div>

                                {/* Hover actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); copyUrl(file.publicUrl); }}
                                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                        title="Copy URL"
                                    >
                                        {copiedUrl === file.publicUrl ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                    <a
                                        href={file.publicUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        title="Open in new tab"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(file); }}
                                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Detail Sidebar */}
                    {selectedFile && (
                        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row gap-4">
                            <img
                                src={selectedFile.publicUrl}
                                alt={selectedFile.name}
                                className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                            />
                            <div className="flex-1 space-y-2 text-sm">
                                <h4 className="font-semibold text-slate-800">{selectedFile.name}</h4>
                                <p className="text-slate-500">Size: {formatSize(selectedFile.metadata.size)}</p>
                                <p className="text-slate-500">Type: {selectedFile.metadata.mimetype}</p>
                                {selectedFile.created_at && (
                                    <p className="text-slate-500">Uploaded: {new Date(selectedFile.created_at).toLocaleString()}</p>
                                )}
                                <div className="flex items-center gap-2 mt-3">
                                    <input
                                        type="text"
                                        value={selectedFile.publicUrl}
                                        readOnly
                                        className="flex-1 text-xs border border-slate-300 rounded px-2 py-1.5 bg-white"
                                    />
                                    <button
                                        onClick={() => copyUrl(selectedFile.publicUrl)}
                                        className="px-3 py-1.5 bg-brand-600 text-white rounded text-xs font-medium hover:bg-brand-700 transition-colors"
                                    >
                                        {copiedUrl === selectedFile.publicUrl ? 'Copied!' : 'Copy URL'}
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedFile(null)}
                                className="self-start text-slate-400 hover:text-slate-800"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <div className="mt-4 text-center text-xs text-slate-400">
                        {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} in library
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaLibrary;
