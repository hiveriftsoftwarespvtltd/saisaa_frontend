import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon, Check, Eye } from 'lucide-react';
import { apiClient } from '../../../config';

export const ImageUpload = ({
  value,
  onChange,
  label = 'Cover Photo',
  aspectRatio = 'aspect-[4/3]',
  presets = [
    '/images/hero-model.jpg',
    '/images/blue-kurti.jpg',
    '/images/saree-arch.jpg',
    '/images/maroon-story.jpg',
  ],
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Unified response handler: res or res.data
      const uploadedUrl = res?.data?.url || res?.url || res?.data?.path;
      if (uploadedUrl) {
        onChange(uploadedUrl);
      } else {
        throw new Error('Image URL not received from server');
      }
    } catch (err) {
      console.error('File upload failed:', err);
      setUploadError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isUploading) return;
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setUrlDraft('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-[#18523D] hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            {showUrlInput ? 'Hide URL Input' : 'Paste Image URL'}
          </button>
        </div>
      )}

      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://... or /images/..."
            className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 text-xs font-bold bg-[#0A261C] text-[#F7E7BE] rounded-xl hover:bg-[#123D2E] transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload & Preview Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
          value
            ? 'border-stone-300 bg-stone-50'
            : 'border-stone-300 hover:border-[#0A261C] bg-stone-50/60'
        }`}
      >
        {isUploading ? (
          <div className="py-10 flex flex-col items-center justify-center gap-2 text-stone-600">
            <Loader2 className="w-7 h-7 animate-spin text-[#0A261C]" />
            <span className="text-xs font-semibold">Uploading photo to server...</span>
          </div>
        ) : value ? (
          <div>
            <div
              className={`w-full ${aspectRatio} max-h-52 overflow-hidden bg-stone-100 flex items-center justify-center border-b border-stone-200 relative group`}
            >
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/hero-model.jpg';
                }}
              />
            </div>

            {/* Persistent Control Bar */}
            <div className="p-2.5 bg-white flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-[11px] font-medium text-stone-600 truncate max-w-[200px]" title={value}>
                  {value.startsWith('http') || value.startsWith('/uploads') ? 'Photo Uploaded' : 'Selected Image'}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {value.startsWith('http') && (
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-stone-500 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg transition-colors"
                    title="View Full Size"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#0A261C] text-[#F7E7BE] rounded-lg hover:bg-[#123D2E] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Upload New
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  title="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="py-8 px-4 flex flex-col items-center justify-center gap-3 cursor-pointer text-stone-500 hover:text-[#0A261C] transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-[#0A261C] group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer mb-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                Select Photo From Device
              </button>
              <p className="text-[11px] text-stone-500 font-medium">
                or drag & drop file here
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                PNG, JPG, JPEG, WEBP up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <p className="text-[11px] text-rose-600 font-medium">{uploadError}</p>
      )}

      {/* Preset Suggestions */}
      {presets && presets.length > 0 && !value && (
        <div className="pt-1">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block mb-1.5">
            Or choose luxury gallery preset:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((presetImg, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => onChange(presetImg)}
                className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-stone-200 opacity-70 hover:opacity-100 hover:border-[#0A261C] transition-all cursor-pointer"
              >
                <img
                  src={presetImg}
                  alt={`Preset ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
