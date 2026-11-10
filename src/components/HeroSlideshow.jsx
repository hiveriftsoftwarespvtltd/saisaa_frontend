import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Parallax, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/parallax';
import { apiClient, API_ENDPOINTS, API_BASE_URL } from '../config';
import './HeroSlideshow.css';

const FALLBACK_HERO_SLIDES = [
  {
    id: 'welcome',
    image: '/images/hero/hero-slide-1.jpg',
    mobileImage: '',
    eyebrow: '',
    title: 'Welcome to Saisaa',
    subtitle: 'Timeless Heritage Couture',
    ctaText: '',
    ctaLink: '/shop',
    titleStyle: 'script',
    layoutPreset: 'bottom',
    overlayScrim: 'bottom',
    objectPosition: 'center 35%',
    displayOrder: 1,
    status: 'Active',
  },
  {
    id: 'boutique',
    image: '/images/hero/hero-slide-2.jpg',
    mobileImage: '',
    eyebrow: 'SAISAA ATELIER',
    title: 'Luxury Ethnic Couture',
    subtitle: '',
    ctaText: 'Explore Collection',
    ctaLink: '/shop',
    titleStyle: 'serif',
    layoutPreset: 'center',
    overlayScrim: 'dark',
    objectPosition: 'center',
    displayOrder: 2,
    status: 'Active',
  },
  {
    id: 'maheshwari',
    image: '/images/hero/hero-slide-3.jpg',
    mobileImage: '',
    eyebrow: '',
    title: 'Shop Traditional Maheshwari Sets',
    subtitle: '',
    ctaText: 'Click to Shop',
    ctaLink: '/unstitched-suits',
    titleStyle: 'serif',
    layoutPreset: 'bottom',
    overlayScrim: 'bottom',
    objectPosition: 'center',
    displayOrder: 3,
    status: 'Active',
  },
  {
    id: 'coord-sets',
    image: '/images/hero/hero-slide-4.jpg',
    mobileImage: '',
    eyebrow: 'COUTURE SUIT SETS',
    title: '',
    subtitle: '',
    ctaText: 'Shop here',
    ctaLink: '/stitched-suits',
    titleStyle: 'serif',
    layoutPreset: 'split-badge',
    overlayScrim: 'none',
    objectPosition: 'center 25%',
    displayOrder: 4,
    status: 'Active',
  },
  {
    id: 'aesthetics',
    image: '/images/hero/hero-slide-5.jpg',
    mobileImage: '',
    eyebrow: '',
    title: 'SHOP AESTHETICS',
    subtitle: 'Handwoven Banarasi & Royal Zari Weaves',
    ctaText: 'Shop collection',
    ctaLink: '/sarees',
    titleStyle: 'serif',
    layoutPreset: 'center',
    overlayScrim: 'light',
    objectPosition: 'center',
    displayOrder: 5,
    status: 'Active',
  },
];

const FALLBACK_MARQUEE_ITEMS = [
  { id: 'm1', text: 'Complimentary Shipping Pan-India', displayOrder: 1, status: 'Active' },
  { id: 'm2', text: 'Handcrafted Indian Ethnic Couture', displayOrder: 2, status: 'Active' },
  { id: 'm3', text: 'New Artisanal Updates Every Week', displayOrder: 3, status: 'Active' },
  { id: 'm4', text: 'Pure Silk, Chanderi & Maheshwari Weaves', displayOrder: 4, status: 'Active' },
];

const resolveHeroImageSrc = (raw) => {
  if (!raw) return '/images/hero/hero-slide-1.jpg';
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
      return 'bg-gradient-to-t from-[#09231A]/65 via-[#09231A]/35 to-[#09231A]/20';
    case 'bottom':
      return 'bg-gradient-to-t from-[#09231A]/85 via-[#09231A]/25 to-transparent';
    case 'light':
      return 'bg-[#09231A]/30';
    case 'none':
    default:
      return '';
  }
};

const getSlideAlignClass = (slide) => {
  switch (slide.layoutPreset) {
    case 'split-badge':
      return 'pt-4 sm:pt-8 lg:pt-10 pb-14 sm:pb-16 lg:pb-20';
    case 'bottom':
      return slide.ctaText
        ? 'justify-end pb-11 sm:pb-16 lg:pb-20'
        : 'justify-end pb-14 sm:pb-20 lg:pb-24';
    case 'clean':
    case 'center':
    default:
      return 'justify-center';
  }
};

const HeroCtaButton = ({ ctaText, ctaLink }) => {
  if (!ctaText) return null;
  const target = ctaLink || '/shop';
  const isExternal = /^https?:\/\//i.test(target);

  if (isExternal) {
    return (
      <a href={target} target="_blank" rel="noreferrer" className="saisaa-hero-btn">
        <span>{ctaText}</span>
      </a>
    );
  }

  return (
    <Link to={target} className="saisaa-hero-btn">
      <span>{ctaText}</span>
    </Link>
  );
};

const renderSlideOverlay = (slide, index) => {
  if (slide.layoutPreset === 'clean') {
    return null;
  }

  const HeadingTag = index === 0 ? 'h1' : 'h2';

  if (slide.layoutPreset === 'split-badge') {
    return (
      <div className="slide-animation fadeInLeft text-center flex flex-col items-center justify-between h-full">
        {slide.eyebrow && (
          <div>
            <span className="inline-block bg-[#09231A] text-[#E5C786] border border-[#D4AF37]/50 font-serif text-xs sm:text-xl lg:text-2xl tracking-[0.25em] uppercase px-5 sm:px-8 py-1.5 sm:py-2.5 shadow-lg">
              {slide.eyebrow}
            </span>
          </div>
        )}
        {slide.title && (
          <div>
            <HeadingTag
              className={
                slide.titleStyle === 'script'
                  ? 'font-script text-4xl sm:text-6xl text-[#F7E7BE] font-normal leading-none drop-shadow-[0_4px_20px_rgba(9,35,26,0.95)]'
                  : 'font-serif text-xl sm:text-3xl lg:text-4xl font-semibold text-[#FAF7F2] tracking-wide drop-shadow-[0_3px_16px_rgba(9,35,26,0.95)]'
              }
            >
              {slide.title}
            </HeadingTag>
          </div>
        )}
        {slide.ctaText && (
          <div className="mt-auto">
            <HeroCtaButton ctaText={slide.ctaText} ctaLink={slide.ctaLink} />
          </div>
        )}
      </div>
    );
  }

  const isBottom = slide.layoutPreset === 'bottom';
  const isScript = slide.titleStyle === 'script';

  return (
    <div className="slide-animation fadeInLeft text-center">
      {slide.eyebrow && (
        <div>
          <span className="inline-block text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-[0.45em] text-[#F7E7BE] mb-1.5 sm:mb-2 drop-shadow">
            {slide.eyebrow}
          </span>
        </div>
      )}

      {slide.title && (
        <div>
          <HeadingTag
            className={
              isScript
                ? 'font-script text-4xl sm:text-6xl lg:text-[84px] text-[#F7E7BE] font-normal leading-none drop-shadow-[0_4px_22px_rgba(9,35,26,0.95)]'
                : isBottom
                ? 'font-serif text-base sm:text-3xl lg:text-4xl font-semibold text-[#FAF7F2] tracking-wide drop-shadow-[0_3px_16px_rgba(9,35,26,0.95)]'
                : 'font-serif text-2xl sm:text-4xl lg:text-[56px] font-bold tracking-wider text-[#FAF7F2] uppercase leading-tight drop-shadow-[0_4px_24px_rgba(9,35,26,0.85)]'
            }
          >
            {slide.title}
          </HeadingTag>
        </div>
      )}

      {slide.subtitle && (
        <div>
          <p
            className={
              isScript
                ? 'inline-block mt-2 sm:mt-3 text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-[0.3em] sm:tracking-[0.42em] text-[#E5C786] bg-[#09231A]/70 border border-[#D4AF37]/45 px-4 py-1.5 rounded-sm backdrop-blur-xs'
                : 'hidden sm:block text-xs sm:text-sm tracking-[0.28em] uppercase text-[#F7E7BE] mt-2 drop-shadow'
            }
          >
            {slide.subtitle}
          </p>
        </div>
      )}

      {slide.ctaText && (
        <div className={isBottom ? 'mt-2 sm:mt-5' : 'mt-3 sm:mt-6'}>
          <HeroCtaButton ctaText={slide.ctaText} ctaLink={slide.ctaLink} />
        </div>
      )}
    </div>
  );
};

export const HeroSlideshow = () => {
  const [slides, setSlides] = useState(FALLBACK_HERO_SLIDES);
  const [marqueeItems, setMarqueeItems] = useState(FALLBACK_MARQUEE_ITEMS);

  const heroContainerRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const marqueeContainerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadHeroContent = async () => {
      const [slidesRes, marqueeRes] = await Promise.allSettled([
        apiClient.get(API_ENDPOINTS.HERO_BANNERS.ACTIVE),
        apiClient.get(API_ENDPOINTS.HERO_BANNERS.MARQUEE_ACTIVE),
      ]);

      if (!isMounted) return;

      if (slidesRes.status === 'fulfilled' && Array.isArray(slidesRes.value?.data)) {
        const sorted = [...slidesRes.value.data].sort(
          (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        );
        setSlides(sorted);
      }

      if (marqueeRes.status === 'fulfilled' && Array.isArray(marqueeRes.value?.data)) {
        const sortedMarquee = [...marqueeRes.value.data].sort(
          (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        );
        setMarqueeItems(sortedMarquee);
      }
    };

    loadHeroContent();
    return () => {
      isMounted = false;
    };
  }, []);

  // Visual signature prevents Swiper re-init flicker if DB matches default seeded visuals
  const slidesSignature = useMemo(
    () =>
      slides
        .map((s) =>
          [
            s.image,
            s.mobileImage || '',
            s.eyebrow || '',
            s.title || '',
            s.subtitle || '',
            s.ctaText || '',
            s.ctaLink || '',
            s.titleStyle || 'serif',
            s.layoutPreset || 'center',
            s.overlayScrim || 'bottom',
            s.objectPosition || 'center',
          ].join('|')
        )
        .join('::'),
    [slides]
  );

  const marqueeSignature = useMemo(
    () => marqueeItems.map((m) => m.text).join('::'),
    [marqueeItems]
  );

  useEffect(() => {
    if (!heroContainerRef.current || slides.length === 0) return undefined;

    const canLoop = slides.length > 1;
    const heroSwiper = new Swiper(heroContainerRef.current, {
      modules: [Navigation, Pagination, Autoplay, Parallax, Keyboard],
      slidesPerView: 1,
      loop: canLoop,
      parallax: true,
      speed: 3000,
      autoplay: canLoop
        ? {
            delay: 3000,
            disableOnInteraction: false,
          }
        : false,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      allowTouchMove: canLoop,
      navigation: canLoop
        ? {
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }
        : false,
      pagination: canLoop
        ? {
            el: paginationRef.current,
            clickable: true,
          }
        : false,
    });

    return () => {
      if (heroSwiper && !heroSwiper.destroyed) {
        heroSwiper.destroy(true, true);
      }
    };
  }, [slidesSignature, slides.length]);

  useEffect(() => {
    if (!marqueeContainerRef.current || marqueeItems.length === 0) return undefined;

    const marqueeSwiper = new Swiper(marqueeContainerRef.current, {
      modules: [Autoplay],
      slidesPerView: 'auto',
      spaceBetween: 0,
      speed: 10000,
      loop: true,
      allowTouchMove: false,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
    });

    return () => {
      if (marqueeSwiper && !marqueeSwiper.destroyed) {
        marqueeSwiper.destroy(true, true);
      }
    };
  }, [marqueeSignature, marqueeItems.length]);

  // Duplicate items enough times so infinite marquee fills wide desktop viewports cleanly
  const repeatedMarquee = useMemo(() => {
    if (marqueeItems.length === 0) return [];
    const repeatCount = marqueeItems.length <= 2 ? 8 : marqueeItems.length <= 4 ? 4 : 3;
    return Array.from({ length: repeatCount }).flatMap(() => marqueeItems);
  }, [marqueeItems]);

  return (
    <>
      {/* ========================================================= */}
      {/* 1. PARALLAX HERO SLIDESHOW (Manmayi Animation + Saisaa)   */}
      {/* ========================================================= */}
      {slides.length > 0 && (
        <section className="w-full" aria-label="Featured Collections Slideshow">
          <div className="saisaa-slideshow">
            <div key={slidesSignature} ref={heroContainerRef} className="swiper h-full">
              <div className="swiper-wrapper">
                {slides.map((slide, idx) => {
                  const scrimClass = getOverlayScrimClass(slide.overlayScrim);
                  const alignClass = getSlideAlignClass(slide);
                  const isSplitBadge = slide.layoutPreset === 'split-badge';
                  const desktopSrc = resolveHeroImageSrc(slide.image);
                  const mobileSrc = slide.mobileImage ? resolveHeroImageSrc(slide.mobileImage) : '';
                  const altText =
                    slide.title || slide.eyebrow || `Saisaa Featured Collection Slide ${idx + 1}`;

                  return (
                    <div key={idx} className="swiper-slide">
                      {/* Image layer with Parallax 800 */}
                      <div className="saisaa-slide-media" data-swiper-parallax="800">
                        {mobileSrc ? (
                          <picture>
                            <source media="(max-width: 767px)" srcSet={mobileSrc} />
                            <img
                              src={desktopSrc}
                              alt={altText}
                              style={{ objectPosition: slide.objectPosition || 'center' }}
                            />
                          </picture>
                        ) : (
                          <img
                            src={desktopSrc}
                            alt={altText}
                            style={{ objectPosition: slide.objectPosition || 'center' }}
                          />
                        )}
                        {scrimClass && (
                          <div className={`absolute inset-0 pointer-events-none ${scrimClass}`} />
                        )}
                      </div>

                      {/* Overlay Typography & CTA layer with Parallax 900 */}
                      <div className="slider-content" data-swiper-parallax="900">
                        <div className={`w-full h-full flex flex-col px-12 sm:px-20 lg:px-28 ${alignClass}`}>
                          <div className={`w-full max-w-4xl mx-auto ${isSplitBadge ? 'h-full' : ''}`}>
                            {renderSlideOverlay(slide, idx)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {slides.length > 1 && (
                <>
                  {/* Circular Navigation Arrows */}
                  <button
                    ref={prevRef}
                    type="button"
                    className="saisaa-nav-btn saisaa-nav-btn-prev"
                    aria-label="Previous slide"
                  >
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
                  </button>
                  <button
                    ref={nextRef}
                    type="button"
                    className="saisaa-nav-btn saisaa-nav-btn-next"
                    aria-label="Next slide"
                  >
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
                  </button>

                  {/* Pagination Halo Dots */}
                  <div ref={paginationRef} className="swiper-pagination" />
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 1B. CONTINUOUS LINEAR MARQUEE STRIP (Saisaa Theme)        */}
      {/* ========================================================= */}
      {repeatedMarquee.length > 0 && (
        <section className="saisaa-marquee" aria-label="Saisaa Brand Highlights">
          <div key={marqueeSignature} ref={marqueeContainerRef} className="swiper">
            <div className="swiper-wrapper">
              {repeatedMarquee.map((item, idx) => (
                <div key={`${item._id || item.id || item.text}-${idx}`} className="swiper-slide">
                  <div className="marquee-text">
                    <span className="dot-border" aria-hidden="true" />
                    <span>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HeroSlideshow;
