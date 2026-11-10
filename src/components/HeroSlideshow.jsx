import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Parallax, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/parallax';
import './HeroSlideshow.css';

const HERO_SLIDES = [
  {
    id: 'welcome',
    image: '/images/hero/hero-slide-1.jpg',
    alt: 'Welcome to Saisaa — Luxury Ethnic Boutique Showcase',
    objectPosition: 'center 35%',
    scrimClass: 'bg-gradient-to-t from-[#09231A]/80 via-[#09231A]/20 to-transparent',
    alignClass: 'justify-end pb-14 sm:pb-20 lg:pb-24',
    content: (
      <div className="slide-animation fadeInLeft text-center">
        <div>
          <h1 className="font-script text-4xl sm:text-6xl lg:text-[84px] text-[#F7E7BE] font-normal leading-none drop-shadow-[0_4px_22px_rgba(9,35,26,0.95)]">
            Welcome to Saisaa
          </h1>
        </div>
        <div>
          <p className="inline-block mt-2 sm:mt-3 text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-[0.3em] sm:tracking-[0.42em] text-[#E5C786] bg-[#09231A]/70 border border-[#D4AF37]/45 px-4 py-1.5 rounded-sm backdrop-blur-xs">
            Timeless Heritage Couture
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'boutique',
    image: '/images/hero/hero-slide-2.jpg',
    alt: 'Saisaa Curated Indian Couture Showroom Collection',
    objectPosition: 'center',
    scrimClass: 'bg-gradient-to-t from-[#09231A]/65 via-[#09231A]/35 to-[#09231A]/20',
    alignClass: 'justify-center',
    content: (
      <div className="slide-animation fadeInLeft text-center">
        <div>
          <span className="inline-block text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-[0.45em] text-[#F7E7BE] mb-1.5 sm:mb-2 drop-shadow">
            SAISAA ATELIER
          </span>
        </div>
        <div>
          <h2 className="font-serif text-2xl sm:text-5xl lg:text-[58px] font-bold tracking-wider text-[#FAF7F2] uppercase leading-tight drop-shadow-[0_4px_24px_rgba(9,35,26,0.85)]">
            Luxury Ethnic Couture
          </h2>
        </div>
        <div className="mt-3 sm:mt-6">
          <Link to="/shop" className="saisaa-hero-btn">
            <span>Explore Collection</span>
          </Link>
        </div>
      </div>
    ),
  },
  {
    id: 'maheshwari',
    image: '/images/hero/hero-slide-3.jpg',
    alt: 'Traditional Maheshwari Silk Sets by Saisaa',
    objectPosition: 'center',
    scrimClass: 'bg-gradient-to-t from-[#09231A]/85 via-[#09231A]/30 to-transparent',
    alignClass: 'justify-end pb-11 sm:pb-16 lg:pb-20',
    content: (
      <div className="slide-animation fadeInLeft text-center">
        <div>
          <h2 className="font-serif text-base sm:text-3xl lg:text-4xl font-semibold text-[#FAF7F2] tracking-wide drop-shadow-[0_3px_16px_rgba(9,35,26,0.95)]">
            Shop Traditional Maheshwari Sets
          </h2>
        </div>
        <div className="mt-2 sm:mt-5">
          <Link to="/unstitched-suits" className="saisaa-hero-btn">
            <span>Click to Shop</span>
          </Link>
        </div>
      </div>
    ),
  },
  {
    id: 'coord-sets',
    image: '/images/hero/hero-slide-4.jpg',
    alt: 'Saisaa Curated Stitched Suits & Co-ord Editorial Collage',
    objectPosition: 'center 25%',
    scrimClass: '',
    alignClass: 'pt-4 sm:pt-8 lg:pt-10 pb-14 sm:pb-16 lg:pb-20',
    fullHeightContent: true,
    content: (
      <div className="slide-animation fadeInLeft text-center flex flex-col items-center justify-between h-full">
        <div>
          <span className="inline-block bg-[#09231A] text-[#E5C786] border border-[#D4AF37]/50 font-serif text-xs sm:text-xl lg:text-2xl tracking-[0.25em] uppercase px-5 sm:px-8 py-1.5 sm:py-2.5 shadow-lg">
            COUTURE SUIT SETS
          </span>
        </div>
        <div className="mt-auto">
          <Link to="/stitched-suits" className="saisaa-hero-btn">
            <span>Shop here</span>
          </Link>
        </div>
      </div>
    ),
  },
  {
    id: 'aesthetics',
    image: '/images/hero/hero-slide-5.jpg',
    alt: 'Saisaa Handwoven Banarasi Brocade & Zari Silk Collection',
    objectPosition: 'center',
    scrimClass: 'bg-[#09231A]/30',
    alignClass: 'justify-center',
    content: (
      <div className="slide-animation fadeInLeft text-center">
        <div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-[56px] font-semibold tracking-[0.22em] text-[#FAF7F2] uppercase drop-shadow-[0_4px_20px_rgba(9,35,26,0.9)]">
            SHOP AESTHETICS
          </h2>
        </div>
        <div>
          <p className="hidden sm:block text-xs sm:text-sm tracking-[0.28em] uppercase text-[#F7E7BE] mt-2 drop-shadow">
            Handwoven Banarasi &amp; Royal Zari Weaves
          </p>
        </div>
        <div className="mt-3 sm:mt-6">
          <Link to="/sarees" className="saisaa-hero-btn">
            <span>Shop collection</span>
          </Link>
        </div>
      </div>
    ),
  },
];

const MARQUEE_ITEMS = [
  'Complimentary Shipping Pan-India',
  'Handcrafted Indian Ethnic Couture',
  'New Artisanal Updates Every Week',
  'Pure Silk, Chanderi & Maheshwari Weaves',
];

export const HeroSlideshow = () => {
  const heroContainerRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const marqueeContainerRef = useRef(null);

  useEffect(() => {
    let heroSwiper;
    let marqueeSwiper;

    if (heroContainerRef.current) {
      heroSwiper = new Swiper(heroContainerRef.current, {
        modules: [Navigation, Pagination, Autoplay, Parallax, Keyboard],
        slidesPerView: 1,
        loop: true,
        parallax: true,
        speed: 3000,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        allowTouchMove: true,
        navigation: {
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        },
        pagination: {
          el: paginationRef.current,
          clickable: true,
        },
      });
    }

    if (marqueeContainerRef.current) {
      marqueeSwiper = new Swiper(marqueeContainerRef.current, {
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
    }

    return () => {
      if (heroSwiper && !heroSwiper.destroyed) heroSwiper.destroy(true, true);
      if (marqueeSwiper && !marqueeSwiper.destroyed) marqueeSwiper.destroy(true, true);
    };
  }, []);

  // Duplicate items enough times for seamless infinite marquee on wide screens
  const repeatedMarquee = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. PARALLAX HERO SLIDESHOW (Manmayi Animation + Saisaa)   */}
      {/* ========================================================= */}
      <section className="w-full" aria-label="Featured Collections Slideshow">
        <div className="saisaa-slideshow">
          <div ref={heroContainerRef} className="swiper h-full">
            <div className="swiper-wrapper">
              {HERO_SLIDES.map((slide) => (
                <div key={slide.id} className="swiper-slide">
                  {/* Image layer with Parallax 800 */}
                  <div className="saisaa-slide-media" data-swiper-parallax="800">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      style={{ objectPosition: slide.objectPosition || 'center' }}
                    />
                    {slide.scrimClass && (
                      <div className={`absolute inset-0 pointer-events-none ${slide.scrimClass}`} />
                    )}
                  </div>

                  {/* Overlay Typography & CTA layer with Parallax 900 */}
                  <div className="slider-content" data-swiper-parallax="900">
                    <div className={`w-full h-full flex flex-col px-12 sm:px-20 lg:px-28 ${slide.alignClass}`}>
                      <div className={`w-full max-w-4xl mx-auto ${slide.fullHeightContent ? 'h-full' : ''}`}>
                        {slide.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 1B. CONTINUOUS LINEAR MARQUEE STRIP (Saisaa Theme)        */}
      {/* ========================================================= */}
      <section className="saisaa-marquee" aria-label="Saisaa Brand Highlights">
        <div ref={marqueeContainerRef} className="swiper">
          <div className="swiper-wrapper">
            {repeatedMarquee.map((text, idx) => (
              <div key={`${text}-${idx}`} className="swiper-slide">
                <div className="marquee-text">
                  <span className="dot-border" aria-hidden="true" />
                  <span>{text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSlideshow;
