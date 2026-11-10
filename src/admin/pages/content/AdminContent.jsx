import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Columns2,
  Crown,
  Edit,
  Eye,
  EyeOff,
  ExternalLink,
  Link as LinkIcon,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminModal } from '../../components/common/AdminModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ImageUpload } from '../../components/common/ImageUpload';
import { API_BASE_URL } from '../../../config';

const EDITORIAL_PRESETS = [
  '/images/saree-arch.jpg',
  '/images/saree-editorial.jpg',
  '/images/pink-kurti.jpg',
  '/images/blue-kurti.jpg',
  '/images/rani-pink.jpg',
  '/images/lavender-suit.jpg',
  '/images/hero/hero-slide-2.jpg',
  '/images/hero/hero-slide-5.jpg',
];

const STORY_PRESETS = [
  '/images/maroon-story.jpg',
  '/images/saree-editorial.jpg',
  '/images/saree-arch.jpg',
  '/images/rani-pink.jpg',
  '/images/pink-kurti.jpg',
  '/images/hero/hero-slide-1.jpg',
];

const QUICK_ROUTES = [
  { label: 'Sarees', path: '/sarees' },
  { label: 'Stitched Suits', path: '/stitched-suits' },
  { label: 'Unstitched Suits', path: '/unstitched-suits' },
  { label: 'All Shop', path: '/shop' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const EDITORIAL_THEME_MAP = {
  ivory: {
    label: 'Warm Ivory',
    cardClass: 'bg-[#F7F1E6] border-[#D4AF37]/40 text-[#09231A]',
    eyebrowClass: 'text-[#9A7611]',
    descClass: 'text-stone-600',
    ctaClass: 'bg-[#09231A] text-[#F7E7BE]',
  },
  emerald: {
    label: 'Royal Emerald',
    cardClass: 'bg-[#09231A] border-[#D4AF37]/45 text-[#FAF7F2]',
    eyebrowClass: 'text-[#E5C786]',
    descClass: 'text-[#FAF7F2]/80',
    ctaClass: 'bg-gradient-to-r from-[#D4AF37] to-[#E5C786] text-[#09231A]',
  },
  blush: {
    label: 'Soft Blush',
    cardClass: 'bg-[#F9EAE4] border-[#D4AF37]/40 text-[#09231A]',
    eyebrowClass: 'text-[#9A7611]',
    descClass: 'text-stone-600',
    ctaClass: 'bg-[#09231A] text-[#F7E7BE]',
  },
};

const resolveMediaSrc = (raw, fallback = '/images/saree-arch.jpg') => {
  if (!raw) return fallback;
  if (raw.startsWith('/uploads/')) {
    return `${API_BASE_URL.replace(/\/api\/v1\/?$/, '')}${raw}`;
  }
  if (raw.startsWith('http://api.saisaa.com/')) {
    return raw.replace('http://api.saisaa.com/', 'https://api.saisaa.com/');
  }
  return raw;
};

const INITIAL_EDITORIAL_FORM = {
  image: '/images/saree-arch.jpg',
  eyebrow: 'HERITAGE DRAPES',
  title: '',
  description: '',
  ctaText: 'Explore Collection',
  ctaLink: '/sarees',
  theme: 'ivory',
  imagePosition: 'left',
  objectPosition: 'center top',
  displayOrder: 1,
  status: 'Active',
};

const INITIAL_STORY_FORM = {
  eyebrow: 'OUR STORY',
  title: '',
  scriptText: 'Traditional • Beautiful • You',
  description: '',
  ctaText: 'Our Story',
  ctaLink: '/about',
  image: '/images/maroon-story.jpg',
  objectPosition: 'center top',
  pillarsInput: 'Style, Tradition, Confidence',
  badgeLabel: 'SAISAA HERITAGE',
  displayOrder: 1,
  status: 'Active',
};

export const AdminContent = () => {
  const {
    editorialBanners,
    ourStories,
    isLoadingContent,
    contentError,
    refreshContent,
    addEditorialBanner,
    updateEditorialBanner,
    deleteEditorialBanner,
    reorderEditorialBanners,
    addOurStory,
    updateOurStory,
    deleteOurStory,
    reorderOurStories,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('editorial'); // 'editorial' | 'story'

  // Editorial Banner Modal State
  const [editorialModalOpen, setEditorialModalOpen] = useState(false);
  const [editingEditorial, setEditingEditorial] = useState(null);
  const [editorialToDelete, setEditorialToDelete] = useState(null);
  const [isSavingEditorial, setIsSavingEditorial] = useState(false);
  const [editorialForm, setEditorialForm] = useState(INITIAL_EDITORIAL_FORM);

  // Our Story Modal State
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [isSavingStory, setIsSavingStory] = useState(false);
  const [storyForm, setStoryForm] = useState(INITIAL_STORY_FORM);

  const sortedBanners = useMemo(
    () =>
      [...(editorialBanners || [])].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      ),
    [editorialBanners]
  );

  const sortedStories = useMemo(
    () =>
      [...(ourStories || [])].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      ),
    [ourStories]
  );

  const primaryActiveStoryId = useMemo(() => {
    const active = sortedStories.find((s) => s.status === 'Active');
    return active?.id || null;
  }, [sortedStories]);

  const editorialStats = useMemo(() => {
    const active = sortedBanners.filter((b) => b.status === 'Active').length;
    return {
      total: sortedBanners.length,
      active,
      inactive: sortedBanners.length - active,
    };
  }, [sortedBanners]);

  const storyStats = useMemo(() => {
    const active = sortedStories.filter((s) => s.status === 'Active').length;
    return {
      total: sortedStories.length,
      active,
      inactive: sortedStories.length - active,
    };
  }, [sortedStories]);

  const parsePillars = (inputStr) => {
    return (inputStr || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  };

  // ==================== EDITORIAL BANNER HANDLERS ====================

  const handleOpenAddEditorial = () => {
    setEditingEditorial(null);
    setEditorialForm({
      ...INITIAL_EDITORIAL_FORM,
      displayOrder: sortedBanners.length + 1,
      theme: sortedBanners.length % 2 === 1 ? 'emerald' : 'ivory',
      imagePosition: sortedBanners.length % 2 === 1 ? 'right' : 'left',
    });
    setEditorialModalOpen(true);
  };

  const handleOpenEditEditorial = (banner) => {
    setEditingEditorial(banner);
    setEditorialForm({
      image: banner.image || '/images/saree-arch.jpg',
      eyebrow: banner.eyebrow || '',
      title: banner.title || '',
      description: banner.description || '',
      ctaText: banner.ctaText || '',
      ctaLink: banner.ctaLink || '/shop',
      theme: banner.theme || 'ivory',
      imagePosition: banner.imagePosition || 'left',
      objectPosition: banner.objectPosition || 'center top',
      displayOrder: banner.displayOrder ?? 1,
      status: banner.status || 'Active',
    });
    setEditorialModalOpen(true);
  };

  const handleSaveEditorial = async (e) => {
    e.preventDefault();
    if (!editorialForm.image?.trim() || !editorialForm.title?.trim()) return;

    setIsSavingEditorial(true);
    try {
      const payload = {
        image: editorialForm.image.trim(),
        eyebrow: editorialForm.eyebrow?.trim() || '',
        title: editorialForm.title.trim(),
        description: editorialForm.description?.trim() || '',
        ctaText: editorialForm.ctaText?.trim() || '',
        ctaLink: editorialForm.ctaLink?.trim() || '/shop',
        theme: editorialForm.theme || 'ivory',
        imagePosition: editorialForm.imagePosition || 'left',
        objectPosition: editorialForm.objectPosition || 'center top',
        displayOrder: Number(editorialForm.displayOrder) || 1,
        status: editorialForm.status || 'Active',
      };

      if (editingEditorial) {
        await updateEditorialBanner(editingEditorial.id, payload);
      } else {
        await addEditorialBanner(payload);
      }
      setEditorialModalOpen(false);
    } finally {
      setIsSavingEditorial(false);
    }
  };

  const handleMoveEditorial = async (index, direction) => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sortedBanners.length) return;
    const nextOrder = [...sortedBanners];
    const [moved] = nextOrder.splice(index, 1);
    nextOrder.splice(targetIdx, 0, moved);
    await reorderEditorialBanners(nextOrder.map((item) => item.id));
  };

  const handleToggleEditorialStatus = async (banner) => {
    const nextStatus = banner.status === 'Active' ? 'Inactive' : 'Active';
    await updateEditorialBanner(banner.id, { status: nextStatus });
  };

  // ==================== OUR STORY HANDLERS ====================

  const handleOpenAddStory = () => {
    setEditingStory(null);
    setStoryForm({
      ...INITIAL_STORY_FORM,
      displayOrder: sortedStories.length + 1,
    });
    setStoryModalOpen(true);
  };

  const handleOpenEditStory = (story) => {
    setEditingStory(story);
    setStoryForm({
      eyebrow: story.eyebrow || 'OUR STORY',
      title: story.title || '',
      scriptText: story.scriptText || '',
      description: story.description || '',
      ctaText: story.ctaText || 'Our Story',
      ctaLink: story.ctaLink || '/about',
      image: story.image || '/images/maroon-story.jpg',
      objectPosition: story.objectPosition || 'center top',
      pillarsInput: Array.isArray(story.pillars)
        ? story.pillars.join(', ')
        : 'Style, Tradition, Confidence',
      badgeLabel: story.badgeLabel || 'SAISAA HERITAGE',
      displayOrder: story.displayOrder ?? 1,
      status: story.status || 'Active',
    });
    setStoryModalOpen(true);
  };

  const handleSaveStory = async (e) => {
    e.preventDefault();
    if (!storyForm.title?.trim() || !storyForm.image?.trim()) return;

    setIsSavingStory(true);
    try {
      const parsedPillars = parsePillars(storyForm.pillarsInput);
      const payload = {
        eyebrow: storyForm.eyebrow?.trim() || 'OUR STORY',
        title: storyForm.title.trim(),
        scriptText: storyForm.scriptText?.trim() || '',
        description: storyForm.description?.trim() || '',
        ctaText: storyForm.ctaText?.trim() || '',
        ctaLink: storyForm.ctaLink?.trim() || '/about',
        image: storyForm.image.trim(),
        objectPosition: storyForm.objectPosition || 'center top',
        pillars:
          parsedPillars.length > 0
            ? parsedPillars
            : ['Style', 'Tradition', 'Confidence'],
        badgeLabel: storyForm.badgeLabel?.trim() || 'SAISAA HERITAGE',
        displayOrder: Number(storyForm.displayOrder) || 1,
        status: storyForm.status || 'Active',
      };

      if (editingStory) {
        await updateOurStory(editingStory.id, payload);
      } else {
        await addOurStory(payload);
      }
      setStoryModalOpen(false);
    } finally {
      setIsSavingStory(false);
    }
  };

  const handleMoveStory = async (index, direction) => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sortedStories.length) return;
    const nextOrder = [...sortedStories];
    const [moved] = nextOrder.splice(index, 1);
    nextOrder.splice(targetIdx, 0, moved);
    await reorderOurStories(nextOrder.map((item) => item.id));
  };

  const handleToggleStoryStatus = async (story) => {
    const nextStatus = story.status === 'Active' ? 'Inactive' : 'Active';
    await updateOurStory(story.id, { status: nextStatus });
  };

  const editorialPreviewTheme =
    EDITORIAL_THEME_MAP[editorialForm.theme] || EDITORIAL_THEME_MAP.ivory;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader
        title="Homepage Content Studio"
        subtitle="Manage homepage Editorial Showcase Banners and the Our Story heritage block directly from one workspace."
        breadcrumbs={[
          { label: 'Storefront', path: '/admin/content' },
          { label: 'Content' },
        ]}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
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
              type="button"
              onClick={
                activeTab === 'editorial' ? handleOpenAddEditorial : handleOpenAddStory
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>
                {activeTab === 'editorial'
                  ? 'Add Editorial Banner'
                  : 'Add Story Section'}
              </span>
            </button>
          </div>
        }
      />

      {contentError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 flex items-center justify-between gap-4 text-xs">
          <span>{contentError}</span>
          <button
            type="button"
            onClick={refreshContent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-semibold hover:bg-amber-100 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* 2-TAB SWITCHER */}
      <div className="bg-white rounded-2xl border border-stone-200 p-2 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Homepage Content Sections"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'editorial'}
            onClick={() => setActiveTab('editorial')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === 'editorial'
                ? 'bg-[#0A261C] text-[#F7E7BE] shadow-sm border border-[#D4AF37]/40'
                : 'text-stone-600 hover:bg-stone-100 hover:text-[#0A261C]'
            }`}
          >
            <Columns2
              className={`w-4 h-4 ${
                activeTab === 'editorial' ? 'text-[#D4AF37]' : 'text-stone-400'
              }`}
            />
            <span>Editorial Banners</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'editorial'
                  ? 'bg-[#D4AF37]/20 text-[#F7E7BE]'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {sortedBanners.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'story'}
            onClick={() => setActiveTab('story')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === 'story'
                ? 'bg-[#0A261C] text-[#F7E7BE] shadow-sm border border-[#D4AF37]/40'
                : 'text-stone-600 hover:bg-stone-100 hover:text-[#0A261C]'
            }`}
          >
            <BookOpen
              className={`w-4 h-4 ${
                activeTab === 'story' ? 'text-[#D4AF37]' : 'text-stone-400'
              }`}
            />
            <span>Our Story</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'story'
                  ? 'bg-[#D4AF37]/20 text-[#F7E7BE]'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {sortedStories.length}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={refreshContent}
          disabled={isLoadingContent}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#0A261C] px-3 py-2 rounded-xl border border-stone-200 bg-white cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingContent ? 'animate-spin' : ''}`} />
          <span>Sync Server</span>
        </button>
      </div>

      {/* ================================================================= */}
      {/* TAB 1: EDITORIAL BANNERS ("Tradition Lives On / Everyday Elegance") */}
      {/* ================================================================= */}
      {activeTab === 'editorial' && (
        <div className="space-y-6">
          {/* KPI Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Total Editorial Banners
              </span>
              <p className="font-serif text-2xl font-bold text-stone-900 mt-1">
                {editorialStats.total}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-200/80 p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                Active on Homepage
              </span>
              <p className="font-serif text-2xl font-bold text-[#0A261C] mt-1">
                {editorialStats.active}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Hidden / Drafted
              </span>
              <p className="font-serif text-2xl font-bold text-stone-600 mt-1">
                {editorialStats.inactive}
              </p>
            </div>
          </div>

          {/* Editorial Banners Directory */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FCFBF8]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0A261C] text-[#F7E7BE] flex items-center justify-center shrink-0">
                  <Columns2 className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-stone-900">
                    Split Editorial Feature Cards ({sortedBanners.length})
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    Displayed in top-to-bottom order below Royal Best Sellers. Toggle Hide to pause a card without deleting.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpenAddEditorial}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#0A261C] hover:text-[#F7E7BE] text-[#0A261C] border border-[#D4AF37]/40 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                New Banner
              </button>
            </div>

            {isLoadingContent && sortedBanners.length === 0 ? (
              <div className="p-8 space-y-4">
                {[1, 2].map((n) => (
                  <div key={n} className="h-32 bg-stone-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : sortedBanners.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Columns2 className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-serif text-base font-bold text-stone-800">
                  No Editorial Banners Added Yet
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Create split editorial showcase banners with imagery, headline, short story, and destination CTA.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddEditorial}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A261C] text-[#F7E7BE] rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  Add First Editorial Banner
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {sortedBanners.map((banner, idx) => {
                  const themeStyle =
                    EDITORIAL_THEME_MAP[banner.theme] || EDITORIAL_THEME_MAP.ivory;
                  return (
                    <div
                      key={banner.id}
                      className={`p-4 sm:p-5 flex flex-col xl:flex-row items-start xl:items-center gap-4 transition-colors ${
                        banner.status === 'Inactive'
                          ? 'bg-stone-50/75 opacity-75'
                          : 'hover:bg-[#FAF7F2]/50'
                      }`}
                    >
                      {/* Reorder Controls + Rank Badge */}
                      <div className="flex xl:flex-col items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveEditorial(idx, 'up')}
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
                          onClick={() => handleMoveEditorial(idx, 'down')}
                          disabled={idx === sortedBanners.length - 1}
                          className="p-1 rounded-md border border-stone-200 text-stone-500 hover:bg-[#0A261C] hover:text-[#F7E7BE] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Mini Split Card Preview */}
                      <div
                        className={`w-full sm:w-80 h-32 rounded-xl overflow-hidden border grid grid-cols-12 shrink-0 shadow-xs ${themeStyle.cardClass}`}
                      >
                        <div
                          className={`col-span-5 h-full overflow-hidden ${
                            banner.imagePosition === 'right' ? 'order-2' : 'order-1'
                          }`}
                        >
                          <img
                            src={resolveMediaSrc(banner.image)}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                            style={{
                              objectPosition: banner.objectPosition || 'center top',
                            }}
                          />
                        </div>
                        <div
                          className={`col-span-7 p-3 flex flex-col justify-center gap-1 text-left ${
                            banner.imagePosition === 'right' ? 'order-1' : 'order-2'
                          }`}
                        >
                          {banner.eyebrow && (
                            <span
                              className={`text-[8px] font-bold uppercase tracking-[0.2em] truncate ${themeStyle.eyebrowClass}`}
                            >
                              {banner.eyebrow}
                            </span>
                          )}
                          <p className="font-serif text-sm font-bold leading-tight line-clamp-2">
                            {banner.title}
                          </p>
                          {banner.ctaText && (
                            <span
                              className={`mt-1 inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${themeStyle.ctaClass}`}
                            >
                              {banner.ctaText}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info & Metadata */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={banner.status} />
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                            Theme: {themeStyle.label}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#A37F15] border border-[#D4AF37]/30">
                            Photo: {banner.imagePosition === 'right' ? 'Right' : 'Left'}
                          </span>
                        </div>

                        {banner.eyebrow && (
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A37F15]">
                            {banner.eyebrow}
                          </p>
                        )}

                        <h3 className="font-serif text-base font-bold text-stone-900 truncate">
                          {banner.title}
                        </h3>

                        {banner.description && (
                          <p className="text-xs text-stone-500 line-clamp-2">
                            {banner.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[11px] text-stone-500">
                          {banner.ctaText ? (
                            <span className="inline-flex items-center gap-1 font-medium text-[#0A261C]">
                              <LinkIcon className="w-3 h-3 text-[#D4AF37]" />
                              CTA: <strong>{banner.ctaText}</strong> &rarr;{' '}
                              <code className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px]">
                                {banner.ctaLink || '/shop'}
                              </code>
                            </span>
                          ) : (
                            <span className="text-stone-400 italic">No CTA button</span>
                          )}
                        </div>
                      </div>

                      {/* Row Actions */}
                      <div className="flex items-center gap-2 shrink-0 w-full xl:w-auto justify-end pt-2 xl:pt-0 border-t xl:border-t-0 border-stone-100">
                        <button
                          type="button"
                          onClick={() => handleToggleEditorialStatus(banner)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                            banner.status === 'Active'
                              ? 'bg-white border-stone-200 text-stone-600 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          {banner.status === 'Active' ? (
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
                          onClick={() => handleOpenEditEditorial(banner)}
                          className="p-2 text-stone-500 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg border border-stone-200 bg-white transition-colors cursor-pointer"
                          title="Edit Editorial Banner"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditorialToDelete(banner)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-stone-200 bg-white transition-colors cursor-pointer"
                          title="Delete Editorial Banner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 2: OUR STORY ("More Than Fashion")                             */}
      {/* ================================================================= */}
      {activeTab === 'story' && (
        <div className="space-y-6">
          {/* KPI Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Total Story Entries
              </span>
              <p className="font-serif text-2xl font-bold text-stone-900 mt-1">
                {storyStats.total}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-200/80 p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                Active Stories
              </span>
              <p className="font-serif text-2xl font-bold text-[#0A261C] mt-1">
                {storyStats.active}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#D4AF37]/40 p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#A37F15]">
                Draft / Inactive
              </span>
              <p className="font-serif text-2xl font-bold text-stone-600 mt-1">
                {storyStats.inactive}
              </p>
            </div>
          </div>

          <div className="bg-[#FAF7F2] border border-[#D4AF37]/40 rounded-xl px-4 py-3 flex items-center gap-2.5 text-xs text-[#09231A]">
            <Crown className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>
              Homepage renders the first <strong>Active</strong> story entry ordered top-to-bottom. Keep seasonal brand stories saved here and toggle visibility anytime.
            </span>
          </div>

          {/* Our Story Directory */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FCFBF8]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0A261C] text-[#F7E7BE] flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-stone-900">
                    Our Story Heritage Showcases ({sortedStories.length})
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    Edit narrative copy, calligraphic accent, pillar badges, portrait image, and CTA link.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpenAddStory}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#0A261C] hover:text-[#F7E7BE] text-[#0A261C] border border-[#D4AF37]/40 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                New Story
              </button>
            </div>

            {isLoadingContent && sortedStories.length === 0 ? (
              <div className="p-8 space-y-4">
                <div className="h-36 bg-stone-100 rounded-xl animate-pulse" />
              </div>
            ) : sortedStories.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-serif text-base font-bold text-stone-800">
                  No Story Section Configured Yet
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Add your brand story block featuring narrative text, calligraphic signature, values, and portrait image.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddStory}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A261C] text-[#F7E7BE] rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  Create Story Section
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {sortedStories.map((story, idx) => {
                  const isLivePrimary = story.id === primaryActiveStoryId;
                  return (
                    <div
                      key={story.id}
                      className={`p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center gap-4 transition-colors ${
                        story.status === 'Inactive'
                          ? 'bg-stone-50/75 opacity-75'
                          : 'hover:bg-[#FAF7F2]/50'
                      }`}
                    >
                      {/* Reorder Controls + Rank */}
                      <div className="flex lg:flex-col items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveStory(idx, 'up')}
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
                          onClick={() => handleMoveStory(idx, 'down')}
                          disabled={idx === sortedStories.length - 1}
                          className="p-1 rounded-md border border-stone-200 text-stone-500 hover:bg-[#0A261C] hover:text-[#F7E7BE] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Portrait Thumbnail */}
                      <div className="relative w-28 sm:w-32 aspect-[3/4] rounded-xl overflow-hidden border border-[#D4AF37]/45 bg-[#EFE6D8] shrink-0 shadow-xs">
                        <img
                          src={resolveMediaSrc(story.image, '/images/maroon-story.jpg')}
                          alt={story.title}
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: story.objectPosition || 'center top',
                          }}
                        />
                        {story.badgeLabel && (
                          <span className="absolute bottom-1.5 left-1.5 right-1.5 text-center bg-[#09231A]/85 text-[#F7E7BE] text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                            {story.badgeLabel}
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={story.status} />
                          {isLivePrimary && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0A261C] text-[#F7E7BE] border border-[#D4AF37]/50 text-[10px] font-bold uppercase tracking-wider">
                              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                              Live on Homepage
                            </span>
                          )}
                        </div>

                        {story.eyebrow && (
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A37F15]">
                            {story.eyebrow}
                          </p>
                        )}

                        <div className="flex flex-wrap items-baseline gap-2.5">
                          <h3 className="font-serif text-lg font-bold text-stone-900">
                            {story.title}
                          </h3>
                          {story.scriptText && (
                            <span className="font-script text-xl text-[#A37F15]">
                              {story.scriptText}
                            </span>
                          )}
                        </div>

                        {story.description && (
                          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                            {story.description}
                          </p>
                        )}

                        {/* Pillars chips */}
                        {Array.isArray(story.pillars) && story.pillars.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {story.pillars.map((pillar, pIdx) => (
                              <span
                                key={pIdx}
                                className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 text-[10px] font-serif font-semibold text-[#09231A]"
                              >
                                {pillar}
                              </span>
                            ))}
                          </div>
                        )}

                        {story.ctaText && (
                          <div className="pt-0.5 text-[11px] text-stone-500">
                            <span className="inline-flex items-center gap-1 font-medium text-[#0A261C]">
                              <LinkIcon className="w-3 h-3 text-[#D4AF37]" />
                              CTA: <strong>{story.ctaText}</strong> &rarr;{' '}
                              <code className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px]">
                                {story.ctaLink || '/about'}
                              </code>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Row Actions */}
                      <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                        <button
                          type="button"
                          onClick={() => handleToggleStoryStatus(story)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                            story.status === 'Active'
                              ? 'bg-white border-stone-200 text-stone-600 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          {story.status === 'Active' ? (
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
                          onClick={() => handleOpenEditStory(story)}
                          className="p-2 text-stone-500 hover:text-[#0A261C] hover:bg-stone-100 rounded-lg border border-stone-200 bg-white transition-colors cursor-pointer"
                          title="Edit Story Entry"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setStoryToDelete(story)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-stone-200 bg-white transition-colors cursor-pointer"
                          title="Delete Story Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 1: ADD / EDIT EDITORIAL BANNER                              */}
      {/* ================================================================= */}
      <AdminModal
        isOpen={editorialModalOpen}
        onClose={() => setEditorialModalOpen(false)}
        title={editingEditorial ? 'Edit Editorial Banner' : 'Create Editorial Banner'}
        subtitle="Configure split showcase image, typography, color theme, and destination CTA link."
        maxWidth="max-w-3xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditorialModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="editorial-banner-form"
              disabled={
                isSavingEditorial ||
                !editorialForm.image?.trim() ||
                !editorialForm.title?.trim()
              }
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#0A261C] hover:bg-[#123D2E] disabled:opacity-50 text-[#F7E7BE] rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {isSavingEditorial
                ? 'Saving...'
                : editingEditorial
                ? 'Update Banner'
                : 'Publish Banner'}
            </button>
          </>
        }
      >
        <form
          id="editorial-banner-form"
          onSubmit={handleSaveEditorial}
          className="space-y-5"
        >
          {/* Live Split Card Preview */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Live Card Preview
            </span>
            <div
              className={`rounded-2xl overflow-hidden border grid grid-cols-1 sm:grid-cols-12 shadow-sm ${editorialPreviewTheme.cardClass}`}
            >
              <div
                className={`sm:col-span-6 h-48 sm:h-52 overflow-hidden ${
                  editorialForm.imagePosition === 'right' ? 'sm:order-2' : 'sm:order-1'
                }`}
              >
                <img
                  src={resolveMediaSrc(editorialForm.image)}
                  alt="Editorial preview"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: editorialForm.objectPosition || 'center top',
                  }}
                />
              </div>
              <div
                className={`sm:col-span-6 p-5 flex flex-col justify-center gap-2 text-left ${
                  editorialForm.imagePosition === 'right' ? 'sm:order-1' : 'sm:order-2'
                }`}
              >
                {editorialForm.eyebrow && (
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.22em] ${editorialPreviewTheme.eyebrowClass}`}
                  >
                    {editorialForm.eyebrow}
                  </span>
                )}
                <h4 className="font-serif text-xl font-bold leading-tight">
                  {editorialForm.title || 'Editorial Heading'}
                </h4>
                {editorialForm.description && (
                  <p className={`text-xs line-clamp-3 ${editorialPreviewTheme.descClass}`}>
                    {editorialForm.description}
                  </p>
                )}
                {editorialForm.ctaText && (
                  <span
                    className={`mt-1 inline-flex w-fit items-center px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${editorialPreviewTheme.ctaClass}`}
                  >
                    {editorialForm.ctaText} &rarr;
                  </span>
                )}
              </div>
            </div>
          </div>

          <ImageUpload
            label="Editorial Feature Image *"
            value={editorialForm.image}
            onChange={(url) =>
              setEditorialForm((prev) => ({ ...prev, image: url }))
            }
            aspectRatio="aspect-[4/3]"
            presets={EDITORIAL_PRESETS}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Eyebrow Tag
              </label>
              <input
                type="text"
                value={editorialForm.eyebrow}
                onChange={(e) =>
                  setEditorialForm((prev) => ({ ...prev, eyebrow: e.target.value }))
                }
                placeholder="e.g. HERITAGE DRAPES"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Headline Title *
              </label>
              <input
                type="text"
                required
                value={editorialForm.title}
                onChange={(e) =>
                  setEditorialForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Tradition Lives On"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
              Editorial Description
            </label>
            <textarea
              rows={3}
              value={editorialForm.description}
              onChange={(e) =>
                setEditorialForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Write a refined short narrative describing this collection..."
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                CTA Button Text
              </label>
              <input
                type="text"
                value={editorialForm.ctaText}
                onChange={(e) =>
                  setEditorialForm((prev) => ({ ...prev, ctaText: e.target.value }))
                }
                placeholder="e.g. Explore Sarees"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                CTA Destination Link
              </label>
              <input
                type="text"
                value={editorialForm.ctaLink}
                onChange={(e) =>
                  setEditorialForm((prev) => ({ ...prev, ctaLink: e.target.value }))
                }
                placeholder="/sarees"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_ROUTES.map((route) => (
                  <button
                    key={route.path}
                    type="button"
                    onClick={() =>
                      setEditorialForm((prev) => ({ ...prev, ctaLink: route.path }))
                    }
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border cursor-pointer transition-colors ${
                      editorialForm.ctaLink === route.path
                        ? 'bg-[#0A261C] text-[#F7E7BE] border-[#0A261C]'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-[#0A261C]/40'
                    }`}
                  >
                    {route.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Card Theme
              </label>
              <select
                value={editorialForm.theme}
                onChange={(e) =>
                  setEditorialForm((prev) => ({ ...prev, theme: e.target.value }))
                }
                className="w-full px-3 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              >
                <option value="ivory">Warm Ivory</option>
                <option value="emerald">Royal Emerald</option>
                <option value="blush">Soft Blush</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Photo Placement
              </label>
              <select
                value={editorialForm.imagePosition}
                onChange={(e) =>
                  setEditorialForm((prev) => ({
                    ...prev,
                    imagePosition: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              >
                <option value="left">Photo on Left</option>
                <option value="right">Photo on Right</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Display Order
              </label>
              <input
                type="number"
                min={1}
                value={editorialForm.displayOrder}
                onChange={(e) =>
                  setEditorialForm((prev) => ({
                    ...prev,
                    displayOrder: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Visibility Status
              </label>
              <select
                value={editorialForm.status}
                onChange={(e) =>
                  setEditorialForm((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              >
                <option value="Active">Active (Visible)</option>
                <option value="Inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>
        </form>
      </AdminModal>

      {/* ================================================================= */}
      {/* MODAL 2: ADD / EDIT OUR STORY                                     */}
      {/* ================================================================= */}
      <AdminModal
        isOpen={storyModalOpen}
        onClose={() => setStoryModalOpen(false)}
        title={editingStory ? 'Edit Our Story Showcase' : 'Create Our Story Showcase'}
        subtitle="Customize narrative copy, calligraphy signature, heritage pillars, portrait image & CTA."
        maxWidth="max-w-3xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setStoryModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="our-story-form"
              disabled={
                isSavingStory ||
                !storyForm.title?.trim() ||
                !storyForm.image?.trim()
              }
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#0A261C] hover:bg-[#123D2E] disabled:opacity-50 text-[#F7E7BE] rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {isSavingStory
                ? 'Saving...'
                : editingStory
                ? 'Update Story'
                : 'Publish Story'}
            </button>
          </>
        }
      >
        <form id="our-story-form" onSubmit={handleSaveStory} className="space-y-5">
          {/* Live Story Mini Preview */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Live Story Section Preview
            </span>
            <div className="bg-[#F7EFE3] rounded-2xl border border-[#D4AF37]/40 p-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-7 space-y-2 text-left">
                {storyForm.eyebrow && (
                  <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#9A7611] block">
                    {storyForm.eyebrow}
                  </span>
                )}
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#09231A]">
                  {storyForm.title || 'More Than Fashion'}
                </h4>
                {storyForm.scriptText && (
                  <p className="font-script text-2xl text-[#A37F15]">
                    {storyForm.scriptText}
                  </p>
                )}
                {storyForm.description && (
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {storyForm.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {parsePillars(storyForm.pillarsInput).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-white/85 border border-[#D4AF37]/40 text-[10px] font-serif font-semibold text-[#09231A]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-5">
                <div className="relative aspect-[4/4.5] rounded-xl overflow-hidden border border-[#D4AF37]/45 shadow-md">
                  <img
                    src={resolveMediaSrc(storyForm.image, '/images/maroon-story.jpg')}
                    alt="Story portrait preview"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: storyForm.objectPosition || 'center top',
                    }}
                  />
                  {storyForm.badgeLabel && (
                    <div className="absolute bottom-2 inset-x-2 bg-[#09231A]/85 border border-[#D4AF37]/45 rounded-lg px-2.5 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-[#F7E7BE]">
                      {storyForm.badgeLabel}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <ImageUpload
            label="Story Editorial Portrait Image *"
            value={storyForm.image}
            onChange={(url) => setStoryForm((prev) => ({ ...prev, image: url }))}
            aspectRatio="aspect-[4/3]"
            presets={STORY_PRESETS}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Section Eyebrow Tag
              </label>
              <input
                type="text"
                value={storyForm.eyebrow}
                onChange={(e) =>
                  setStoryForm((prev) => ({ ...prev, eyebrow: e.target.value }))
                }
                placeholder="OUR STORY"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Main Story Headline *
              </label>
              <input
                type="text"
                required
                value={storyForm.title}
                onChange={(e) =>
                  setStoryForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="More Than Fashion"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Calligraphic Script Signature
              </label>
              <input
                type="text"
                value={storyForm.scriptText}
                onChange={(e) =>
                  setStoryForm((prev) => ({ ...prev, scriptText: e.target.value }))
                }
                placeholder="Traditional • Beautiful • You"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Portrait Crest Badge Label
              </label>
              <input
                type="text"
                value={storyForm.badgeLabel}
                onChange={(e) =>
                  setStoryForm((prev) => ({ ...prev, badgeLabel: e.target.value }))
                }
                placeholder="SAISAA HERITAGE"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
              Story Narrative Copy
            </label>
            <textarea
              rows={3}
              value={storyForm.description}
              onChange={(e) =>
                setStoryForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="At Saisaa, we celebrate the timeless beauty of Indian heritage..."
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
              Brand Pillar Seals (Comma Separated)
            </label>
            <input
              type="text"
              value={storyForm.pillarsInput}
              onChange={(e) =>
                setStoryForm((prev) => ({ ...prev, pillarsInput: e.target.value }))
              }
              placeholder="Style, Tradition, Confidence"
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                CTA Button Text
              </label>
              <input
                type="text"
                value={storyForm.ctaText}
                onChange={(e) =>
                  setStoryForm((prev) => ({ ...prev, ctaText: e.target.value }))
                }
                placeholder="Our Story"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                CTA Destination Link
              </label>
              <input
                type="text"
                value={storyForm.ctaLink}
                onChange={(e) =>
                  setStoryForm((prev) => ({ ...prev, ctaLink: e.target.value }))
                }
                placeholder="/about"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_ROUTES.map((route) => (
                  <button
                    key={route.path}
                    type="button"
                    onClick={() =>
                      setStoryForm((prev) => ({ ...prev, ctaLink: route.path }))
                    }
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border cursor-pointer transition-colors ${
                      storyForm.ctaLink === route.path
                        ? 'bg-[#0A261C] text-[#F7E7BE] border-[#0A261C]'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-[#0A261C]/40'
                    }`}
                  >
                    {route.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Display Priority Order
              </label>
              <input
                type="number"
                min={1}
                value={storyForm.displayOrder}
                onChange={(e) =>
                  setStoryForm((prev) => ({
                    ...prev,
                    displayOrder: Number(e.target.value),
                  }))
                }
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Visibility Status
              </label>
              <select
                value={storyForm.status}
                onChange={(e) =>
                  setStoryForm((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F5] rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              >
                <option value="Active">Active (Eligible for Homepage)</option>
                <option value="Inactive">Inactive (Draft / Hidden)</option>
              </select>
            </div>
          </div>
        </form>
      </AdminModal>

      {/* CONFIRM DELETE DIALOGS */}
      <ConfirmDialog
        isOpen={Boolean(editorialToDelete)}
        onClose={() => setEditorialToDelete(null)}
        onConfirm={async () => {
          if (editorialToDelete) {
            await deleteEditorialBanner(editorialToDelete.id);
          }
        }}
        title="Delete Editorial Banner"
        message={`Are you sure you want to permanently remove "${editorialToDelete?.title || ''}"? This will immediately reflect on the storefront homepage.`}
        confirmText="Delete Banner"
      />

      <ConfirmDialog
        isOpen={Boolean(storyToDelete)}
        onClose={() => setStoryToDelete(null)}
        onConfirm={async () => {
          if (storyToDelete) {
            await deleteOurStory(storyToDelete.id);
          }
        }}
        title="Delete Our Story Entry"
        message={`Are you sure you want to permanently delete "${storyToDelete?.title || ''}" from your Story Showcase archive?`}
        confirmText="Delete Story"
      />
    </div>
  );
};

export default AdminContent;

