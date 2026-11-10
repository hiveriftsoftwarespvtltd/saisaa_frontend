import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, API_ENDPOINTS, API_BASE_URL } from '../config';
import './HeroSlideshow.css';

const DEFAULT_PAGE_HEROES = {
  'stitched-suits': {
    pageKey: 'stitched-suits',
    pageLabel: 'Stitched Suits',
    image: '/images/hero/hero-slide-2.jpg',
    mobileImage: '',
    eyebrow: 'TAILORED COUTURE',
    title: 'Stitched Suits',
    subtitle:
      'Explore our latest collection of premium tailored & stitched suit sets crafted for timeless style and modern womanhood.',
    ctaText: '',
    ctaLink: '/stitched-suits',
    titleStyle: 'serif',
    overlayScrim: 'dark',
    objectPosition: 'center',
    status: 'Active',
  },
  'unstitched-suits': {
    pageKey: 'unstitched-suits',
    pageLabel: 'Unstitched Suits',
    image: '/images/hero/hero-slide-3.jpg',
    mobileImage: '',
    eyebrow: 'ARTISANAL WEAVES',
    title: 'Unstitched Suits',
    subtitle:
      'Explore our curated unstitched suit sets giving you the bespoke freedom to style and tailor to your exact grace.',
    ctaText: '',
    ctaLink: '/unstitched-suits',
    titleStyle: 'serif',
    overlayScrim: 'dark',
    objectPosition: 'center',
    status: 'Active',
  },
  sarees: {
    pageKey: 'sarees',
    pageLabel: 'Sarees',
    image: '/images/hero/hero-slide-5.jpg',
    mobileImage: '',
    eyebrow: 'SIX YARDS OF GRACE',
    title: 'Heirloom Sarees',
    subtitle:
      'Six yards of timeless royal grace woven in pure mulberry silk, antique gold tissue, and gossamer organza.',
    ctaText: '',
    ctaLink: '/sarees',
    titleStyle: 'serif',
    overlayScrim: 'dark',
    objectPosition: 'center',
    status: 'Active',
  },
  about: {
    pageKey: 'about',
    pageLabel: 'About Us',
    image: '/images/hero/hero-slide-1.jpg',
    mobileImage: '',
    eyebrow: 'ABOUT SAISAA',
    title: 'More Than Fashion',
    subtitle:
      "Unstitched Suits for Every Story — bringing together Indian craftsmanship and the grace of today's modern woman.",
    ctaText: 'Our Story',
    ctaLink: '#our-story',
    titleStyle: 'serif',
    overlayScrim: 'dark',
    objectPosition: 'center 35%',
    status: 'Active',
  },
  contact: {
    pageKey: 'contact',
    pageLabel: 'Contact Us',
    image: '/images/hero/hero-slide-2.jpg',
    mobileImage: '',
    eyebrow: 'ROYAL CONCIERGE',
    title: 'Flagship Couture Studio',
    subtitle:
      'Book a private styling consultation, inquire about bespoke bridal trousseau sets, or consult our master couturiers.',
    ctaText: '',
    ctaLink: '/contact',
    titleStyle: 'serif',
    overlayScrim: 'dark',
    objectPosition: 'center',
    status: 'Active',
  },
};

const resolveHeroImageSrc = (raw) => {
  if (!raw) return '/images/hero/hero-slide-2.jpg';
  if (raw.startsWith('/uploads/')) {
    return `${API_BASE_URL.replace(/\/api\/v1\/?$/, '')}${raw}`;
  }
  if (raw.startsWith('http://api.saisaa.com/')) {
    return raw.replace('http://api.saisaa.com/', 'https://api.saisaa.com/');
  }
  return raw;
};

const getOverlayScrimClass = (scrim) => {
  switch (scrim) {
    case 'dark':
      return 'bg-gradient-to-t from-[#09231A]/85 via-[#09231A]/55 to-[#09231A]/45';
    case 'bottom':
      return 'bg-gradient-to-t from-[#09231A]/90 via-[#09231A]/40 to-[#09231A]/15';
    case 'light':
      return 'bg-[#09231A]/35';
    case 'none':
      return '';
    default:
      return 'bg-gradient-to-t from-[#09231A]/85 via-[#09231A]/55 to-[#09231A]/45';
  }
};

export const PageHeroBanner = ({
  pageKey,
  breadcrumb = 'Shop',
  eyebrow,
  titleLine1 = 'Shop',
  titleLine2 = '',
  description = '',
  backgroundImage,
  modelImage,
  modelAlt = 'Saisaa Collection',
  ctaText,
  ctaLink,
  objectPosition = 'center',
}) => {
  const normalizedKey = pageKey ? pageKey.toLowerCase().trim() : '';
  const presetConfig = normalizedKey ? DEFAULT_PAGE_HEROES[normalizedKey] : null;

  const [remoteConfig, setRemoteConfig] = useState(null);

  useEffect(() => {
    if (!normalizedKey || !DEFAULT_PAGE_HEROES[normalizedKey]) {
      return undefined;
    }

    let isMounted = true;
    const loadPageHero = async () => {
      try {
        const res = await apiClient.get(
          API_ENDPOINTS.HERO_BANNERS.PAGE_BY_KEY(normalizedKey)
        );
        const data = res?.data || res;
        if (isMounted && data && data.pageKey === normalizedKey) {
          setRemoteConfig(data);
        }
      } catch {
        // Silently fall back to built-in default configuration
      }
    };

    loadPageHero();
    return () => {
      isMounted = false;
    };
  }, [normalizedKey]);

  const activeConfig =
    (remoteConfig && remoteConfig.pageKey === normalizedKey ? remoteConfig : null) ||
    presetConfig;

  const fallbackTitle = [titleLine1, titleLine2].filter(Boolean).join(' ').trim();
  const displayEyebrow =
    activeConfig !== null && activeConfig !== undefined
      ? activeConfig.eyebrow
      : eyebrow || 'SAISAA ATELIER';
  const displayTitle =
    (activeConfig && activeConfig.title) || fallbackTitle || 'Saisaa Collection';
  const displaySubtitle =
    activeConfig !== null && activeConfig !== undefined
      ? activeConfig.subtitle
      : description;
  const displayImage =
    (activeConfig && activeConfig.image) ||
    backgroundImage ||
    modelImage ||
    '/images/hero/hero-slide-2.jpg';
  const displayMobileImage = (activeConfig && activeConfig.mobileImage) || '';
  const displayCtaText =
    activeConfig !== null && activeConfig !== undefined
      ? activeConfig.ctaText
      : ctaText || '';
  const displayCtaLink =
    (activeConfig && activeConfig.ctaLink) || ctaLink || '/shop';
  const titleStyle = (activeConfig && activeConfig.titleStyle) || 'serif';
  const overlayScrim = (activeConfig && activeConfig.overlayScrim) || 'dark';
  const focalPosition =
    (activeConfig && activeConfig.objectPosition) || objectPosition || 'center';
  const isImageActive = !activeConfig || activeConfig.status !== 'Inactive';

  const desktopSrc = resolveHeroImageSrc(displayImage);
  const mobileSrc = displayMobileImage ? resolveHeroImageSrc(displayMobileImage) : '';
  const scrimClass = getOverlayScrimClass(overlayScrim);

  const renderCta = () => {
    if (!displayCtaText) return null;
    const target = displayCtaLink || '/shop';
    if (target.startsWith('#')) {
      return (
        <a href={target} className="saisaa-hero-btn">
          <span>{displayCtaText}</span>
        </a>
      );
    }
    if (/^https?:\/\//i.test(target)) {
      return (
        <a href={target} target="_blank" rel="noreferrer" className="saisaa-hero-btn">
          <span>{displayCtaText}</span>
        </a>
      );
    }
    return (
      <Link to={target} className="saisaa-hero-btn">
        <span>{displayCtaText}</span>
      </Link>
    );
  };

  return (
    <section
      key={normalizedKey || displayTitle}
      className="relative w-full bg-[#09231A] border-b border-[#D4AF37]/35 overflow-hidden min-h-[290px] sm:min-h-[380px] lg:min-h-[450px] flex items-center"
      aria-label={`${displayTitle} Hero Banner`}
    >
      {/* Full-bleed Background Image (Single static widescreen banner — no slider) */}
      {isImageActive && (
        <div className="absolute inset-0 w-full h-full">
          {mobileSrc ? (
            <picture className="w-full h-full block">
              <source media="(max-width: 767px)" srcSet={mobileSrc} />
              <img
                src={desktopSrc}
                alt={displayTitle || modelAlt}
                className="w-full h-full object-cover block"
                style={{ objectPosition: focalPosition }}
              />
            </picture>
          ) : (
            <img
              src={desktopSrc}
              alt={displayTitle || modelAlt}
              className="w-full h-full object-cover block"
              style={{ objectPosition: focalPosition }}
            />
          )}
          {scrimClass && (
            <div className={`absolute inset-0 pointer-events-none ${scrimClass}`} />
          )}
        </div>
      )}

      {/* Subtle Royal Gold top & bottom frame accents */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/55 to-transparent pointer-events-none" />

      {/* Centered Editorial Content Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-12 sm:py-16 text-center">
        {/* Breadcrumb Pill */}
        <nav
          aria-label="Breadcrumb"
          className="inline-flex items-center gap-2 text-[11px] sm:text-xs text-[#F7E7BE]/85 bg-[#09231A]/60 border border-[#D4AF37]/35 backdrop-blur-xs px-3.5 py-1 rounded-full mb-3 sm:mb-4"
        >
          <Link to="/" className="hover:text-[#D4AF37] transition-colors">
            Home
          </Link>
          <span className="text-[#D4AF37]/70">&gt;</span>
          <span className="text-[#F7E7BE] font-semibold">{breadcrumb}</span>
        </nav>

        {/* Eyebrow Label */}
        {displayEyebrow && (
          <p className="text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-[0.38em] text-[#E5C786] mb-2 drop-shadow">
            {displayEyebrow}
          </p>
        )}

        {/* Main Page Headline */}
        <h1
          className={
            titleStyle === 'script'
              ? 'font-script text-4xl sm:text-6xl lg:text-[74px] text-[#F7E7BE] font-normal leading-none drop-shadow-[0_4px_22px_rgba(9,35,26,0.95)]'
              : 'font-serif text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-wide text-[#FAF7F2] leading-[1.12] drop-shadow-[0_4px_24px_rgba(9,35,26,0.9)]'
          }
        >
          {displayTitle}
        </h1>

        {/* Subtitle / Description */}
        {displaySubtitle && (
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-[#F7E7BE]/90 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(9,35,26,0.9)]">
            {displaySubtitle}
          </p>
        )}

        {/* Optional CTA Button */}
        {displayCtaText && (
          <div className="mt-5 sm:mt-6">{renderCta()}</div>
        )}
      </div>
    </section>
  );
};

export default PageHeroBanner;
