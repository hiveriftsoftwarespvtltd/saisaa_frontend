import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Star,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Link as LinkIcon,
} from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '../../../config';

// Authentic Real Product Images from SAISAA Catalog (No AI stock photos)
export const REAL_CATALOG_IMAGES = [
  { name: 'Mustard Anarkali', url: '/images/05_shop_product_card_1.jpg' },
  { name: 'Indigo Kurti', url: '/images/06_shop_product_card_2.jpg' },
  { name: 'Gold Brocade Saree', url: '/images/07_shop_product_card_3.jpg' },
  { name: 'Emerald Chanderi', url: '/images/08_shop_product_card_4.jpg' },
  { name: 'Rani Pink Sharara', url: '/images/09_shop_product_card_5.jpg' },
  { name: 'Banarasi Organza', url: '/images/10_shop_product_card_6.jpg' },
  { name: 'Chikankari Kurti', url: '/images/11_shop_product_card_7.jpg' },
  { name: 'Crimson Velvet Suit', url: '/images/12_shop_product_card_8.jpg' },
];

export const ProductMediaUpload = ({
  coverImage = '/images/05_shop_product_card_1.jpg',
  onCoverChange,
  galleryImages = [],
  onGalleryChange,
}) => {
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlType, setUrlType] = useState('cover'); // 'cover' or 'gallery'
  const [urlInput, setUrlInput] = useState('');

  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Single Cover Upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image file must be under 10MB.');
      return;
    }

    setErrorMessage('');
    setIsUploadingCover(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiClient.post(API_ENDPOINTS.UPLOAD.SINGLE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const url = res?.data?.url || res?.url || res?.data?.path;
      if (url) {
        onCoverChange(url);
      } else {
        throw new Error('Upload succeeded but URL was not returned.');
      }
    } catch (err) {
      console.error('Cover upload error:', err);
      setErrorMessage(err.message || 'Failed to upload photo.');
    } finally {
      setIsUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // Multiple Gallery Upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((f) => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
    if (validFiles.length === 0) {
      setErrorMessage('Please select valid images under 10MB.');
      return;
    }

    setErrorMessage('');
    setIsUploadingGallery(true);

    try {
      let uploadedUrls = [];
      const formData = new FormData();
      validFiles.forEach((file) => formData.append('files', file));

      try {
        const res = await apiClient.post(API_ENDPOINTS.UPLOAD.MULTIPLE, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const data = res?.data || res;
        if (Array.isArray(data)) {
          uploadedUrls = data.map((d) => d.url || d.path).filter(Boolean);
        }
      } catch {
        // Fallback to parallel single upload
        const singlePromises = validFiles.map(async (file) => {
          const sfd = new FormData();
          sfd.append('file', file);
          const singleRes = await apiClient.post(API_ENDPOINTS.UPLOAD.SINGLE, sfd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return singleRes?.data?.url || singleRes?.url;
        });
        const results = await Promise.all(singlePromises);
        uploadedUrls = results.filter(Boolean);
      }

      if (uploadedUrls.length > 0) {
        const merged = Array.from(new Set([...galleryImages, ...uploadedUrls]));
        onGalleryChange(merged);
      }
    } catch (err) {
      console.error('Gallery upload error:', err);
      setErrorMessage(err.message || 'Failed to upload gallery photos.');
    } finally {
      setIsUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (urlType === 'cover') {
      onCoverChange(trimmed);
    } else {
      if (!galleryImages.includes(trimmed)) {
        onGalleryChange([...galleryImages, trimmed]);
      }
    }

    setUrlInput('');
    setShowUrlModal(false);
  };

  const handleRemoveGalleryImage = (urlToRemove) => {
    onGalleryChange(galleryImages.filter((img) => img !== urlToRemove));
  };

  const handleSetCoverFromGallery = (url) => {
    onCoverChange(url);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-5">
      {/* Header */}
      <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#0A261C]" />
            <span>Product Photos</span>
          </h3>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Add main cover photo and additional gallery photos
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setUrlType('cover');
            setShowUrlModal(!showUrlModal);
          }}
          className="text-[11px] text-[#0A261C] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          Paste URL
        </button>
      </div>

      {/* URL Input Bar */}
      {showUrlModal && (
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-700">Add by Image URL</span>
            <div className="flex gap-2 text-[10px] font-semibold">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="urlTarget"
                  checked={urlType === 'cover'}
                  onChange={() => setUrlType('cover')}
                />
                As Cover
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="urlTarget"
                  checked={urlType === 'gallery'}
                  onChange={() => setUrlType('gallery')}
                />
                To Gallery
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200 focus:outline-none focus:border-[#0A261C]"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3 py-1.5 bg-[#0A261C] text-[#F7E7BE] text-xs font-bold rounded-lg hover:bg-[#123D2E] cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverUpload}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleGalleryUpload}
        className="hidden"
      />

      {/* SECTION 1: COVER PHOTO (SIMPLE & CLEAR) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>1. Cover Photo</span>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-semibold normal-case">
              Main Card
            </span>
          </label>
          {coverImage && (
            <button
              type="button"
              onClick={() => onCoverChange('')}
              className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
            >
              Remove
            </button>
          )}
        </div>

        {coverImage ? (
          <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-50 group">
            <div className="aspect-[4/5] w-full max-h-64 overflow-hidden bg-stone-100 flex items-center justify-center">
              <img
                src={coverImage}
                alt="Product Cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/05_shop_product_card_1.jpg';
                }}
              />
            </div>

            {/* Quick Change Bar */}
            <div className="p-2.5 bg-white border-t border-stone-200 flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-stone-600 truncate max-w-[180px]">
                Active Cover Photo
              </span>
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
                className="px-3 py-1.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer transition-all"
              >
                {isUploadingCover ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Change Photo</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => coverInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 hover:border-[#0A261C] rounded-xl p-6 text-center cursor-pointer bg-stone-50/50 hover:bg-stone-50 transition-all flex flex-col items-center justify-center gap-2"
          >
            {isUploadingCover ? (
              <div className="flex flex-col items-center gap-1 text-stone-600">
                <Loader2 className="w-6 h-6 animate-spin text-[#0A261C]" />
                <span className="text-xs font-semibold">Uploading photo...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#0A261C]">
                  <Upload className="w-5 h-5 text-[#0A261C]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0A261C] block">
                    Upload Cover Photo
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Click to select from device (JPG, PNG)
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: ADDITIONAL GALLERY PHOTOS */}
      <div className="space-y-2 pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider whitespace-nowrap">
              2. Gallery Photos
            </label>
            <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full shrink-0">
              {galleryImages.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={isUploadingGallery}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#0A261C] bg-[#0A261C]/5 hover:bg-[#0A261C]/10 rounded-lg shrink-0 whitespace-nowrap cursor-pointer transition-colors"
          >
            {isUploadingGallery ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span>Add Photos</span>
          </button>
        </div>

        {/* Gallery Thumbnails Grid */}
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {galleryImages.map((imgUrl, idx) => {
              const isCover = coverImage === imgUrl;
              return (
                <div
                  key={`${imgUrl}-${idx}`}
                  className={`group relative aspect-square rounded-lg overflow-hidden border transition-all ${
                    isCover
                      ? 'border-[#0A261C] ring-2 ring-[#0A261C]/30'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/05_shop_product_card_1.jpg';
                    }}
                  />

                  {/* Actions on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-between p-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(imgUrl)}
                      className="self-end p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer"
                      title="Remove from gallery"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetCoverFromGallery(imgUrl)}
                        className="px-1.5 py-0.5 bg-white text-[9px] font-bold text-stone-900 rounded shadow-xs hover:bg-stone-100 cursor-pointer mb-0.5"
                        title="Set as cover photo"
                      >
                        Set Cover
                      </button>
                    )}
                  </div>

                  {isCover && (
                    <span className="absolute bottom-1 left-1 bg-[#0A261C] text-[#F7E7BE] text-[8px] font-bold px-1 py-0.2 rounded">
                      Cover
                    </span>
                  )}
                </div>
              );
            })}

            {/* Quick Add (+) square tile in the grid */}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={isUploadingGallery}
              className="aspect-square rounded-lg border-2 border-dashed border-stone-300 hover:border-[#0A261C] hover:bg-stone-50 flex flex-col items-center justify-center gap-1 text-stone-500 hover:text-[#0A261C] transition-all cursor-pointer group"
              title="Upload more photos from device"
            >
              {isUploadingGallery ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#0A261C]" />
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-[#0A261C] group-hover:text-white flex items-center justify-center transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-bold">Add</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div
            onClick={() => galleryInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 hover:border-[#0A261C] rounded-xl p-5 text-center cursor-pointer bg-stone-50/50 hover:bg-stone-50 transition-all flex flex-col items-center justify-center gap-1.5"
          >
            {isUploadingGallery ? (
              <div className="flex flex-col items-center gap-1 text-stone-600">
                <Loader2 className="w-5 h-5 animate-spin text-[#0A261C]" />
                <span className="text-xs font-semibold">Uploading photos...</span>
              </div>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#0A261C]">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0A261C] block">
                    Upload Gallery Photos
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Click to select multiple files from device
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* SECTION 3: QUICK SELECT FROM ACTUAL CATALOG PHOTOS (NOT AI) */}
      <div className="pt-2 border-t border-stone-100 space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
          Or pick from SAISAA Catalog Photos:
        </span>
        <div className="grid grid-cols-4 gap-2">
          {REAL_CATALOG_IMAGES.map((catImg, idx) => {
            const isSelectedAsCover = coverImage === catImg.url;
            return (
              <button
                type="button"
                key={idx}
                onClick={() => {
                  onCoverChange(catImg.url);
                  if (!galleryImages.includes(catImg.url)) {
                    onGalleryChange([...galleryImages, catImg.url]);
                  }
                }}
                className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  isSelectedAsCover
                    ? 'border-[#0A261C] ring-2 ring-[#0A261C]/20 opacity-100'
                    : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                }`}
                title={`Select ${catImg.name}`}
              >
                <img
                  src={catImg.url}
                  alt={catImg.name}
                  className="w-full h-full object-cover"
                />
                {isSelectedAsCover && (
                  <div className="absolute inset-0 bg-[#0A261C]/25 flex items-center justify-center">
                    <span className="bg-[#0A261C] text-[#F7E7BE] p-1 rounded-full shadow-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductMediaUpload;
