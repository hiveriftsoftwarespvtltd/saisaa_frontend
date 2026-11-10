import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Images,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Check,
  X,
  Link as LinkIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminModal } from '../../components/common/AdminModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ImageUpload } from '../../components/common/ImageUpload';
import { API_BASE_URL } from '../../../config';

const HERO_PRESETS = [
  '/images/hero/hero-slide-1.jpg',
  '/images/hero/hero-slide-2.jpg',
  '/images/hero/hero-slide-3.jpg',
  '/images/hero/hero-slide-4.jpg',
  '/images/hero/hero-slide-5.jpg',
];

const QUICK_ROUTES = [
  { label: 'All Shop', path: '/shop' },
  { label: 'Stitched Suits', path: '/stitched-suits' },
  { label: 'Unstitched Suits', path: '/unstitched-suits' },
  { label: 'Sarees', path: '/sarees' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const INITIAL_SLIDE_FORM = {
  image: '',
  mobileImage: '',
  eyebrow: '',
  title: '',
  subtitle: '',
  ctaText: 'Explore Collection',
  ctaLink: '/shop',
  titleStyle: 'serif',
  layoutPreset: 'center',
  overlayScrim: 'dark',
  objectPosition: 'center',
  displayOrder: 1,
  status: 'Active',
};

const resolveBannerSrc = (raw) => {
  if (!raw) return '/images/hero/hero-slide-1.jpg';
  if (raw.startsWith('/uploads/')) {
    return `${API_BASE_URL.replace(/\/api\/v1\/?$/, '')}${raw}`;
  }
  if (raw.startsWith('http://api.saisaa.com/')) {
    return raw.replace('http://api.saisaa.com/', 'https://api.saisaa.com/');
  }
  return raw;
};

const getScrimPreviewClass = (scrim) => {
  switch (scrim) {
    case 'dark':
      return 'bg-gradient-to-t from-[#09231A]/70 via-[#09231A]/35 to-[#09231A]/20';
    case 'bottom':
      return 'bg-gradient-to-t from-[#09231A]/80 via-[#09231A]/25 to-transparent';
    case 'light':
      return 'bg-[#09231A]/30';
    default:
      return '';
  }
};

export const AdminHeroBanners = () => {
  const {
    heroBanners,
    heroMarquee,
    isLoadingHeroBanners,
    heroBannerError,
    refreshHeroBanners,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
    reorderHeroBanners,
    addHeroMarquee,
    updateHeroMarquee,
    deleteHeroMarquee,
  } = useAdmin();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [slideToDelete, setSlideToDelete] = useState(null);
  const [isSavingSlide, setIsSavingSlide] = useState(false);
  const [showMobileImageField, setShowMobileImageField] = useState(false);
  const [formState, setFormState] = useState(INITIAL_SLIDE_FORM);

  // Marquee controls state
  const [newMarqueeText, setNewMarqueeText] = useState('');
  const [editingMarqueeId, setEditingMarqueeId] = useState(null);
  const [editingMarqueeText, setEditingMarqueeText] = useState('');
  const [marqueeToDelete, setMarqueeToDelete] = useState(null);

  const sortedSlides = useMemo(
    () =>
      [...(heroBanners || [])].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      ),
    [heroBanners]
  );

  const sortedMarquee = useMemo(
    () =>
      [...(heroMarquee || [])].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      ),
    [heroMarquee]
  );

  const stats = useMemo(() => {
    const activeSlides = sortedSlides.filter((s) => s.status === 'Active').length;
    const inactiveSlides = sortedSlides.length - activeSlides;
    const activeMarquee = sortedMarquee.filter((m) => m.status === 'Active').length;
    return {
      totalSlides: sortedSlides.length,
      activeSlides,
      inactiveSlides,
      activeMarquee,
    };
  }, [sortedSlides, sortedMarquee]);

  const handleOpenAdd = () => {
    setEditingSlide(null);
    setShowMobileImageField(false);
    setFormState({
      ...INITIAL_SLIDE_FORM,
      displayOrder: sortedSlides.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (slide) => {
    setEditingSlide(slide);
    setShowMobileImageField(Boolean(slide.mobileImage));
    setFormState({
      image: slide.image || '',
      mobileImage: slide.mobileImage || '',
      eyebrow: slide.eyebrow || '',
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      ctaText: slide.ctaText || '',
      ctaLink: slide.ctaLink || '/shop',
      titleStyle: slide.titleStyle || 'serif',
      layoutPreset: slide.layoutPreset || 'center',
      overlayScrim: slide.overlayScrim || 'bottom',
      objectPosition: slide.objectPosition || 'center',
      displayOrder: slide.displayOrder ?? 1,
      status: slide.status || 'Active',
    });
    setModalOpen(true);
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    if (!formState.image?.trim()) return;

    setIsSavingSlide(true);
    try {
      const payload = {
        ...formState,
        image: formState.image.trim(),
        mobileImage: formState.mobileImage?.trim() || '',
        eyebrow: formState.eyebrow?.trim() || '',
        title: formState.title?.trim() || '',
        subtitle: formState.subtitle?.trim() || '',
        ctaText: formState.ctaText?.trim() || '',
        ctaLink: formState.ctaLink?.trim() || '/shop',
        displayOrder: Number(formState.displayOrder) || 1,
      };

      if (editingSlide) {
        await updateHeroBanner(editingSlide.id, payload);
      } else {
        await addHeroBanner(payload);
      }
      setModalOpen(false);
    } finally {
      setIsSavingSlide(false);
    }
  };

  const handleMoveSlide = async (index, direction) => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sortedSlides.length) return;
    const nextOrder = [...sortedSlides];
    const [moved] = nextOrder.splice(index, 1);
    nextOrder.splice(targetIdx, 0, moved);
    await reorderHeroBanners(nextOrder.map((s) => s.id));
  };

  const handleToggleSlideStatus = async (slide) => {
    const nextStatus = slide.status === 'Active' ? 'Inactive' : 'Active';
    await updateHeroBanner(slide.id, { status: nextStatus });
  };

  const handleCreateMarquee = async (e) => {
    e.preventDefault();
    if (!newMarqueeText.trim()) return;
    await addHeroMarquee({
      text: newMarqueeText.trim(),
      displayOrder: sortedMarquee.length + 1,
      status: 'Active',
    });
    setNewMarqueeText('');
  };

  const handleSaveMarqueeEdit = async (id) => {
    if (!editingMarqueeText.trim()) return;
    await updateHeroMarquee(id, { text: editingMarqueeText.trim() });
    setEditingMarqueeId(null);
    setEditingMarqueeText('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <PageHeader
        title="Hero Section & Marquee Studio"
        subtitle="Manage storefront parallax hero banners, headlines, CTA links, slide order, and marquee ticker highlights."
        breadcrumbs={[{ label: 'Storefront', path: '/admin/hero-banners' }, { label: 'Hero Banners' }]}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-stone-50 text-[#0A261C] border border-stone-200 rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs transition-all"
            >
              <span>Preview Live</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            </Link>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Add Hero Slide</span>
            </button>
          </div>
        }
      />

      {heroBannerError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 flex items-center justify-between gap-4 text-xs">
          <span>{heroBannerError}</span>
          <button
            onClick={refreshHeroBanners}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-semibold hover:bg-amber-100 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Total Slides
          </span>
          <p className="font-serif text-2xl font-bold text-stone-900 mt-1">
            {stats.totalSlides}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200/80 p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
            Active on Homepage
          </span>
          <p className="font-serif text-2xl font-bold text-[#0A261C] mt-1">
            {stats.activeSlides}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Hidden / Inactive
          </span>
          <p className="font-serif text-2xl font-bold text-stone-600 mt-1">
            {stats.inactiveSlides}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[#D4AF37]/40 p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A37F15]">
            Live Marquee Items
          </span>
          <p className="font-serif text-2xl font-bold text-[#0A261C] mt-1">
            {stats.activeMarquee}
          </p>
        </div>
      </div>

      {/* SECTION 1: HERO SLIDES LIST & ORDER CONTROLS */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FCFBF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0A261C] text-[#F7E7BE] flex items-center justify-center shrink-0">
              <Images className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-stone-900">
                Parallax Hero Slideshow ({sortedSlides.length})
              </h2>
              <p className="text-[11px] text-stone-500">
                Slides appear on homepage in exact top-to-bottom order. Disabled slides are hidden without deleting.
              </p>
            </div>
          </div>

          <button
            onClick={refreshHeroBanners}
            disabled={isLoadingHeroBanners}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#0A261C] px-3 py-1.5 rounded-lg border border-stone-200 bg-white cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHeroBanners ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {isLoadingHeroBanners && sortedSlides.length === 0 ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 bg-stone-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : sortedSlides.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Images className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-serif text-base font-bold text-stone-800">
              No Hero Slides Configured Yet
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Add your first full-width hero slide with image, headline, and CTA link to showcase on your homepage.
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A261C] text-[#F7E7BE] rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              Add First Slide
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {sortedSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center gap-4 transition-colors ${
                  slide.status === 'Inactive' ? 'bg-stone-50/70 opacity-75' : 'hover:bg-[#FAF7F2]/50'
                }`}
              >
                {/* Order Controls + Number */}
                <div className="flex lg:flex-col items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveSlide(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded-md border border-stone-200 text-stone-500 hover:bg-[#0A261C] hover:text-[#F7E7BE] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 h-7 rounded-lg bg-[#0A261C] text-[#F7E7BE] font-mono text-xs font-bold flex items-center justify-center shadow-2xs">
                    {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleMoveSlide(idx, 'down')}
                    disabled={idx === sortedSlides.length - 1}
                    className="p-1 rounded-md border border-stone-200 text-stone-500 hover:bg-[#0A261C] hover:text-[#F7E7BE] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Widescreen Banner Thumbnail with Live Scrim Overlay Preview */}
                <div className="relative w-full lg:w-64 aspect-[2/1] rounded-xl overflow-hidden border border-[#D4AF37]/40 bg-[#09231A] shrink-0 shadow-xs">
                  <img
                    src={resolveBannerSrc(slide.image)}
                    alt={slide.title || slide.eyebrow || `Hero slide ${idx + 1}`}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: slide.objectPosition || 'center' }}
                  />
                  <div className={`absolute inset-0 ${getScrimPreviewClass(slide.overlayScrim)}`} />
                  {slide.ctaText && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#09231A]/90 border border-[#D4AF37]/70 text-[#F7E7BE] text-[9px] font-bold uppercase tracking-wider">
                      {slide.ctaText}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={slide.status} />
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                      Layout: {slide.layoutPreset}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#A37F15] border border-[#D4AF37]/30">
                      {slide.titleStyle === 'script' ? 'Script Font' : 'Serif Font'}
                    </span>
                  </div>

                  {slide.eyebrow && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A37F15]">
                      {slide.eyebrow}
                    </p>
                  )}

                  <h3 className="font-serif text-base font-bold text-stone-900 truncate">
                    {slide.title || slide.eyebrow || 'Visual Banner Slide (No Title)'}
                  </h3>

                  {slide.subtitle && (
                    <p className="text-xs text-stone-500 line-clamp-1">{slide.subtitle}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-stone-500">
                    {slide.ctaText ? (
                      <span className="inline-flex items-center gap-1 font-medium text-[#0A261C]">
                        <LinkIcon className="w-3 h-3 text-[#D4AF37]" />
                        Button: <strong>{slide.ctaText}</strong> &rarr;{' '}
                        <code className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px]">
                          {slide.ctaLink || '/shop'}
                        </code>
                      </span>
                    ) : (
                      <span className="text-stone-400 italic">No CTA button (visual showcase)</span>
                    )}
                  </div>
                </div>

                {/* Row Actions */}
                <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                  <button
                    type="button"
                    onClick={() => handleToggleSlideStatus(slide)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                      slide.status === 'Active'
                        ? 'bg-white border-stone-200 text-stone-600 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                    }`}
                    title={slide.status === 'Active' ? 'Hide from Storefront' : 'Publish to Storefront'}
                  >
                    {slide.status === 'Active' ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(slide)}
                    className="p-2 text-stone-500 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg border border-stone-200 bg-white transition-colors cursor-pointer"
                    title="Edit Hero Slide"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSlideToDelete(slide)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-stone-200 bg-white transition-colors cursor-pointer"
                    title="Delete Hero Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: MARQUEE HIGHLIGHTS STRIP CRUD */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FCFBF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/50 text-[#0A261C] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-stone-900">
                Hero Marquee Ticker Highlights ({sortedMarquee.length})
              </h2>
              <p className="text-[11px] text-stone-500">
                Scrolling text strip displayed directly beneath the Hero Slideshow.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Quick Add Highlight Form */}
          <form onSubmit={handleCreateMarquee} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={newMarqueeText}
              onChange={(e) => setNewMarqueeText(e.target.value)}
              placeholder="Add marquee text (e.g. Complimentary Shipping Pan-India)..."
              className="flex-1 px-4 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
            />
            <button
              type="submit"
              disabled={!newMarqueeText.trim()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] disabled:opacity-50 text-[#F7E7BE] rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Add Highlight</span>
            </button>
          </form>

          {/* Marquee Items List */}
          <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
            {sortedMarquee.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-400 italic">
                No marquee highlights configured yet.
              </div>
            ) : (
              sortedMarquee.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-[#FAF7F2]/40"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-[#D4AF37] shrink-0" />
                    {editingMarqueeId === item.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingMarqueeText}
                          onChange={(e) => setEditingMarqueeText(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs border border-[#0A261C] rounded-lg focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveMarqueeEdit(item.id)}
                          className="p-1.5 bg-[#0A261C] text-[#F7E7BE] rounded-lg cursor-pointer"
                          title="Save"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingMarqueeId(null)}
                          className="p-1.5 bg-stone-100 text-stone-500 rounded-lg cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`text-xs font-semibold truncate ${
                          item.status === 'Inactive'
                            ? 'text-stone-400 line-through'
                            : 'text-[#09231A]'
                        }`}
                      >
                        {item.text}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 justify-end">
                    <StatusBadge status={item.status} />
                    <button
                      type="button"
                      onClick={() =>
                        updateHeroMarquee(item.id, {
                          status: item.status === 'Active' ? 'Inactive' : 'Active',
                        })
                      }
                      className="p-1.5 text-stone-500 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg border border-stone-200 cursor-pointer"
                      title={item.status === 'Active' ? 'Disable' : 'Enable'}
                    >
                      {item.status === 'Active' ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMarqueeId(item.id);
                        setEditingMarqueeText(item.text);
                      }}
                      className="p-1.5 text-stone-500 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg border border-stone-200 cursor-pointer"
                      title="Edit text"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMarqueeToDelete(item)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-stone-200 cursor-pointer"
                      title="Delete highlight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ADD / EDIT HERO SLIDE MODAL */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSlide ? 'Edit Hero Slide' : 'Create Hero Slide'}
        subtitle="Configure widescreen banner visual, overlay typography, CTA destination & animation style."
        maxWidth="max-w-3xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="hero-slide-form"
              disabled={isSavingSlide || !formState.image?.trim()}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#0A261C] hover:bg-[#123D2E] disabled:opacity-50 text-[#F7E7BE] rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {isSavingSlide
                ? 'Saving...'
                : editingSlide
                ? 'Update Hero Slide'
                : 'Publish Hero Slide'}
            </button>
          </>
        }
      >
        <form id="hero-slide-form" onSubmit={handleSaveSlide} className="space-y-5">
          {/* Live Miniature Visual Preview */}
          {formState.image && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Live Storefront Preview
              </span>
              <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border border-[#D4AF37]/50 bg-[#09231A] shadow-sm">
                <img
                  src={resolveBannerSrc(formState.image)}
                  alt="Hero preview"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: formState.objectPosition || 'center' }}
                />
                <div
                  className={`absolute inset-0 pointer-events-none ${getScrimPreviewClass(
                    formState.overlayScrim
                  )}`}
                />

                {formState.layoutPreset !== 'clean' && (
                  <div
                    className={`absolute inset-0 flex flex-col px-8 text-center ${
                      formState.layoutPreset === 'split-badge'
                        ? 'justify-between py-4'
                        : formState.layoutPreset === 'bottom'
                        ? 'justify-end pb-6'
                        : 'justify-center'
                    }`}
                  >
                    {formState.layoutPreset === 'split-badge' ? (
                      <>
                        {formState.eyebrow && (
                          <div>
                            <span className="inline-block bg-[#09231A] text-[#E5C786] border border-[#D4AF37]/50 font-serif text-xs tracking-[0.25em] uppercase px-4 py-1 shadow">
                              {formState.eyebrow}
                            </span>
                          </div>
                        )}
                        {formState.ctaText && (
                          <div className="mt-auto">
                            <span className="inline-block bg-[#09231A] border border-[#D4AF37] text-[#F7E7BE] text-[10px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded">
                              {formState.ctaText}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-1.5">
                        {formState.eyebrow && (
                          <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#F7E7BE]">
                            {formState.eyebrow}
                          </p>
                        )}
                        {formState.title && (
                          <p
                            className={
                              formState.titleStyle === 'script'
                                ? 'font-script text-3xl text-[#F7E7BE] leading-none drop-shadow'
                                : 'font-serif text-xl sm:text-2xl font-bold text-[#FAF7F2] drop-shadow'
                            }
                          >
                            {formState.title}
                          </p>
                        )}
                        {formState.subtitle && (
                          <p className="text-[10px] uppercase tracking-[0.22em] text-[#E5C786]">
                            {formState.subtitle}
                          </p>
                        )}
                        {formState.ctaText && (
                          <div className="pt-1.5">
                            <span className="inline-block bg-[#09231A] border border-[#D4AF37] text-[#F7E7BE] text-[10px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded">
                              {formState.ctaText}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Desktop Image Upload */}
          <ImageUpload
            label="Desktop Hero Banner Image (Recommended 16:9 / 2:1 Widescreen) *"
            value={formState.image}
            onChange={(url) => setFormState((prev) => ({ ...prev, image: url }))}
            aspectRatio="aspect-[21/9]"
            presets={HERO_PRESETS}
          />

          {/* Optional Mobile Banner Override */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowMobileImageField(!showMobileImageField)}
              className="text-[11px] font-semibold text-[#18523D] hover:underline cursor-pointer"
            >
              {showMobileImageField
                ? '- Hide Optional Mobile Banner Override'
                : '+ Optional: Upload Separate Mobile Banner Image'}
            </button>

            {showMobileImageField && (
              <ImageUpload
                label="Mobile Banner Override (Optional)"
                value={formState.mobileImage}
                onChange={(url) =>
                  setFormState((prev) => ({ ...prev, mobileImage: url }))
                }
                aspectRatio="aspect-[21/9]"
                presets={HERO_PRESETS}
              />
            )}
          </div>

          {/* Text Content Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Eyebrow / Top Badge
              </label>
              <input
                type="text"
                value={formState.eyebrow}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, eyebrow: e.target.value }))
                }
                placeholder="e.g. SAISAA ATELIER or COUTURE SUIT SETS"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Headline Font Style
              </label>
              <select
                value={formState.titleStyle}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, titleStyle: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#0A261C]"
              >
                <option value="serif">Luxury Classic Serif (Playfair)</option>
                <option value="script">Signature Gold Script (Alex Brush)</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Main Headline
              </label>
              <input
                type="text"
                value={formState.title}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Welcome to Saisaa / Luxury Ethnic Couture"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Subtitle / Tagline
              </label>
              <input
                type="text"
                value={formState.subtitle}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                placeholder="e.g. Timeless Heritage Couture / Handwoven Banarasi Weaves"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>
          </div>

          {/* CTA Configuration */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/30 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Button Label (Leave blank for no button)
                </label>
                <input
                  type="text"
                  value={formState.ctaText}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, ctaText: e.target.value }))
                  }
                  placeholder="e.g. Explore Collection / Click to Shop"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#0A261C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Button Destination Path / URL
                </label>
                <input
                  type="text"
                  value={formState.ctaLink}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, ctaLink: e.target.value }))
                  }
                  placeholder="/shop or https://..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#0A261C]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1">
                Quick Links:
              </span>
              {QUICK_ROUTES.map((r) => (
                <button
                  key={r.path}
                  type="button"
                  onClick={() =>
                    setFormState((prev) => ({ ...prev, ctaLink: r.path }))
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors cursor-pointer ${
                    formState.ctaLink === r.path
                      ? 'bg-[#0A261C] text-[#F7E7BE] border-[#0A261C]'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-[#0A261C]'
                  }`}
                >
                  {r.label} ({r.path})
                </button>
              ))}
            </div>
          </div>

          {/* Layout, Scrim, Alignment & Order */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-700">
                Overlay Layout
              </label>
              <select
                value={formState.layoutPreset}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, layoutPreset: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#0A261C]"
              >
                <option value="center">Center Showcase</option>
                <option value="bottom">Bottom Above Dots</option>
                <option value="split-badge">Top Badge + Bottom CTA</option>
                <option value="clean">Clean Image Only</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-700">
                Scrim Contrast
              </label>
              <select
                value={formState.overlayScrim}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, overlayScrim: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#0A261C]"
              >
                <option value="bottom">Emerald Bottom Fade</option>
                <option value="dark">Full Emerald Gradient</option>
                <option value="light">Soft Emerald Tint</option>
                <option value="none">None (Bright/Collage)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-700">
                Focal Crop
              </label>
              <select
                value={formState.objectPosition}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    objectPosition: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#0A261C]"
              >
                <option value="center">Center</option>
                <option value="center 25%">Upper Center (Collage)</option>
                <option value="center 35%">Slightly Upper (Group)</option>
                <option value="top">Top Edge</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-700">
                Status & Order
              </label>
              <div className="flex gap-2">
                <select
                  value={formState.status}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="flex-1 px-2.5 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#0A261C]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <input
                  type="number"
                  min={1}
                  value={formState.displayOrder}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      displayOrder: Number(e.target.value) || 1,
                    }))
                  }
                  className="w-16 px-2.5 py-2 text-xs text-center font-mono rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
                  title="Display Order"
                />
              </div>
            </div>
          </div>
        </form>
      </AdminModal>

      {/* Delete Hero Slide Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(slideToDelete)}
        onClose={() => setSlideToDelete(null)}
        onConfirm={() => {
          if (slideToDelete) deleteHeroBanner(slideToDelete.id);
        }}
        title="Delete Hero Slide"
        message={`Are you sure you want to remove "${
          slideToDelete?.title || slideToDelete?.eyebrow || 'this hero slide'
        }" from the homepage slideshow?`}
        confirmText="Delete Slide"
      />

      {/* Delete Marquee Highlight Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(marqueeToDelete)}
        onClose={() => setMarqueeToDelete(null)}
        onConfirm={() => {
          if (marqueeToDelete) deleteHeroMarquee(marqueeToDelete.id);
        }}
        title="Delete Marquee Highlight"
        message={`Remove "${marqueeToDelete?.text}" from the homepage marquee strip?`}
        confirmText="Delete Highlight"
      />
    </div>
  );
};

export default AdminHeroBanners;
