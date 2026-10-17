import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
  Star,
  Plus,
  Trash2,
  Eye,
  Check,
  Crown,
} from 'lucide-react';
import { apiClient } from '../../../config';

export const MultiImageUpload = ({
  images = [],
  onChange,
  coverImage = '',
  onSetCover,
  label = 'Product Gallery Images',
  description = 'Upload high-resolution photography for detail views and gallery carousel.',
  presets = [
    '/images/hero-model.jpg',
    '/images/blue-kurti.jpg',
    '/images/pink-kurti.jpg',
    '/images/maroon-story.jpg',
    '/images/saree-arch.jpg',
    '/images/saree-editorial.jpg',
    '/images/lavender-suit.jpg',
    '/images/rani-pink.jpg',
  ],
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const fileInputRef = useRef(null);

  const handleFiles = async (filesList) => {
    if (!filesList || filesList.length === 0) return;

    const files = Array.from(filesList);
    const validFiles = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setUploadError(`"${file.name}" is not a valid image file.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds 10MB limit.`);
        return;
      }
      validFiles.push(file);
    }

    setUploadError('');
    setIsUploading(true);
    setUploadProgressText(`Uploading ${validFiles.length} photo${validFiles.length > 1 ? 's' : ''}...`);

    try {
      // First attempt multi-upload endpoint
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append('files', file);
      });

      let uploadedUrls = [];

      try {
        const res = await apiClient.post('/upload/multiple', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const data = res?.data || res;
        if (Array.isArray(data)) {
          uploadedUrls = data.map((item) => item.url || item.path).filter(Boolean);
        }
      } catch (multiErr) {
        // Fallback: upload individually in parallel
        console.warn('Batch upload failed, falling back to sequential/parallel upload:', multiErr);
        const singleUploadPromises = validFiles.map(async (file) => {
          const singleFormData = new FormData();
          singleFormData.append('file', file);
          const singleRes = await apiClient.post('/upload', singleFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return singleRes?.data?.url || singleRes?.url || singleRes?.data?.path;
        });

        const results = await Promise.all(singleUploadPromises);
        uploadedUrls = results.filter(Boolean);
      }

      if (uploadedUrls.length > 0) {
        const merged = Array.from(new Set([...images, ...uploadedUrls]));
        onChange(merged);
        // If no cover image yet, auto-set first uploaded image as cover
        if (!coverImage && onSetCover && merged.length > 0) {
          onSetCover(merged[0]);
        }
      } else {
        throw new Error('No image URLs returned from server');
      }
    } catch (err) {
      console.error('Multi image upload error:', err);
      setUploadError(err.message || 'Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isUploading) return;
    if (e.dataTransfer?.files?.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlDraft.trim();
    if (!trimmed) return;
    if (!images.includes(trimmed)) {
      const next = [...images, trimmed];
      onChange(next);
      if (!coverImage && onSetCover) {
        onSetCover(trimmed);
      }
    }
    setUrlDraft('');
    setShowUrlInput(false);
  };

  const handleRemove = (urlToRemove) => {
    const next = images.filter((img) => img !== urlToRemove);
    onChange(next);
    // If removed image was cover photo, re-assign cover photo to next available
    if (coverImage === urlToRemove && onSetCover) {
      onSetCover(next[0] || '');
    }
  };

  const handleAddPreset = (presetUrl) => {
    if (!images.includes(presetUrl)) {
      const next = [...images, presetUrl];
      onChange(next);
      if (!coverImage && onSetCover) {
        onSetCover(presetUrl);
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
            {label}
          </label>
          {description && (
            <p className="text-[11px] text-stone-500 mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-[#18523D] hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            {showUrlInput ? 'Hide URL Input' : 'Add by URL'}
          </button>
          <span className="text-xs font-bold px-2 py-0.5 bg-stone-100 text-stone-700 rounded-full border border-stone-200">
            {images.length} Attached
          </span>
        </div>
      </div>

      {/* URL Input Bar */}
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="Paste image URL (https://... or /images/...)"
            className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 text-xs font-bold bg-[#0A261C] text-[#F7E7BE] rounded-xl hover:bg-[#123D2E] transition-colors cursor-pointer"
          >
            Add Image
          </button>
        </div>
      )}

      {/* Hidden native multiple file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Gallery Grid */}
      <div className="space-y-3">
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => {
              const isCover = coverImage === img;
              return (
                <div
                  key={`${img}-${idx}`}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all bg-stone-50 ${
                    isCover
                      ? 'border-[#0A261C] ring-2 ring-[#0A261C]/20 shadow-sm'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className="aspect-[3/4] w-full overflow-hidden">
                    <img
                      src={img}
                      alt={`Gallery item ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/hero-model.jpg';
                      }}
                    />
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                    {isCover ? (
                      <span className="bg-[#0A261C] text-[#F7E7BE] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1 backdrop-blur-xs">
                        <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                        Cover
                      </span>
                    ) : (
                      <span className="bg-black/60 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-xs">
                        #{idx + 1}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemove(img)}
                      className="pointer-events-auto p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
                      title="Remove from gallery"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Bottom Action Bar on Hover */}
                  <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-1.5">
                    {!isCover && onSetCover && (
                      <button
                        type="button"
                        onClick={() => onSetCover(img)}
                        className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/95 hover:bg-white text-stone-900 rounded-md shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                        title="Set this image as primary product cover"
                      >
                        <Crown className="w-3 h-3 text-[#D4AF37]" />
                        Make Cover
                      </button>
                    )}
                    {img.startsWith('http') && (
                      <a
                        href={img}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 bg-white/80 hover:bg-white text-stone-800 rounded-md transition-colors"
                        title="View Full Preview"
                      >
                        <Eye className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Drop Zone / Button */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
            isUploading
              ? 'border-[#0A261C] bg-[#0A261C]/5'
              : 'border-stone-300 hover:border-[#0A261C] bg-stone-50/50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-3 text-stone-600">
              <Loader2 className="w-7 h-7 animate-spin text-[#0A261C]" />
              <span className="text-xs font-semibold">{uploadProgressText || 'Uploading photos...'}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#D4AF37]" />
                Select Multiple Photos From Device
              </button>
              <p className="text-[11px] text-stone-500 font-medium">
                or drag & drop one or multiple images here
              </p>
              <p className="text-[10px] text-stone-400">
                You can select multiple files at once • JPG, PNG, WEBP up to 10MB each
              </p>
            </div>
          )}
        </div>
      </div>

      {uploadError && (
        <p className="text-[11px] text-rose-600 font-medium">{uploadError}</p>
      )}

      {/* Luxury Preset Imagery Suggestions */}
      {presets && presets.length > 0 && (
        <div className="pt-2 border-t border-stone-100">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block mb-1.5">
            Quick Add Studio Presets:
          </span>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {presets.map((preset, idx) => {
              const isAdded = images.includes(preset);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleAddPreset(preset)}
                  disabled={isAdded}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                    isAdded
                      ? 'border-[#0A261C] opacity-40 cursor-not-allowed'
                      : 'border-stone-200 hover:border-[#0A261C] hover:scale-105 opacity-80 hover:opacity-100 cursor-pointer'
                  }`}
                  title={isAdded ? 'Already added' : 'Add preset photograph to gallery'}
                >
                  <img src={preset} alt="" className="w-full h-full object-cover" />
                  {isAdded && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
