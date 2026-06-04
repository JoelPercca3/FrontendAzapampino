// frontend/src/components/admin/ImageUploader.jsx

import { useState } from 'react';
import { IoCloudUploadOutline, IoCloseOutline, IoImageOutline } from 'react-icons/io5';

export function ImageUploader({ imageUrl, onImageChange, onImageRemove }) {
    const [uploading, setUploading] = useState(false);

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('pos_token');
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            onImageChange(data.url);
        } catch (err) {
            alert('Error subiendo imagen: ' + err.message);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                Imagen del plato
            </label>

            {imageUrl && (
                <div className="relative w-full h-36 rounded-lg overflow-hidden mb-2 bg-gray-50 border border-gray-200">
                    <img
                        src={imageUrl}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                    <button
                        type="button"
                        onClick={onImageRemove}
                        className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                        <IoCloseOutline size={14} />
                    </button>
                </div>
            )}

            {!imageUrl && (
                <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploading
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}>
                    <div className="flex flex-col items-center justify-center pt-3 pb-4">
                        {uploading ? (
                            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mb-2" />
                        ) : (
                            <IoCloudUploadOutline size={32} className="text-gray-400 mb-2" />
                        )}
                        <span className="text-xs text-gray-500 font-medium">
                            {uploading ? 'Subiendo...' : 'Haz clic para subir imagen'}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG o WEBP — máx 3MB</span>
                    </div>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={uploading}
                        onChange={handleImageUpload}
                    />
                </label>
            )}
        </div>
    );
}