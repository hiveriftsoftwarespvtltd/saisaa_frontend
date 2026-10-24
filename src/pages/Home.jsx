import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  ArrowRight,
  Truck,
  ShieldCheck,
  Clock,
  Heart,
  Eye,
  ShoppingBag,
  Send,
  Feather,
  Gem,
  CheckCircle2,
  Star,
  Award,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProductCarousel } from '../components/ProductCarousel';
import { QuickViewModal } from '../components/QuickViewModal';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { apiClient, API_ENDPOINTS, API_BASE_URL } from '../config';

export const Home = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [productsList, setProductsList] = useState(PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  // Fetch categories directly from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const res = await apiClient.get(API_ENDPOINTS.CATEGORIES.BASE);
        const serverItems = res?.data || res;
        if (Array.isArray(serverItems) && isMounted) {
          const active = serverItems.filter(
            (c) => !c.status || c.status === 'Active'
          );
          setCategories(active);
        }
      } catch (err) {
        console.error('Home page categories API fetch error:', err);
      } finally {
        if (isMounted) setIsLoadingCategories(false);
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch live products from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchStorefrontProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const res = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST(100));
        const serverItems = res?.data?.items || res?.data;
        if (Array.isArray(serverItems) && serverItems.length > 0 && isMounted) {
          const normalized = serverItems.map((p) => {
            const cover =
              p.cardImage ||
              p.coverImage ||
              (Array.isArray(p.images) && p.images[0]) ||
              '/images/05_shop_product_card_1.jpg';
            return {
              ...p,
              id: p.customId || p.id || p._id?.toString(),
              name: p.name || 'Artisanal Piece',
              price: Number(p.price) || 0,
              originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
              category: p.category || 'suits',
              subCategory:
                typeof p.subCategory === 'object' && p.subCategory !== null
                  ? p.subCategory.name
                  : p.subCategory || 'Artisanal Collection',
              cardImage: cover,
              coverImage: cover,
              homeImage: p.homeImage || cover,
              images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [cover],
              isFeatured: Boolean(p.isFeatured),
              isBestSeller: Boolean(p.isBestSeller),
              isNewArrival: Boolean(p.isNewArrival),
              rating: Number(p.rating) || 4.8,
              reviewCount: Number(p.reviewCount) || 0,
            };
          });
          setProductsList(normalized);
        }
      } catch (err) {
        console.warn('Home page using fallback products list:', err.message);
      } finally {
        if (isMounted) setIsLoadingProducts(false);
      }
    };

    fetchStorefrontProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      addToast(`Thank you! You'll be the first to know about our royal launch at ${newsletterEmail}`, 'success');
      setNewsletterEmail('');
    }
  };

  // 1. Featured Collection products (Driven by isFeatured checkbox in Admin)
  const featuredProducts = useMemo(() => {
    const explicitlyFeatured = productsList.filter(
      (p) => Boolean(p.isFeatured) && p.status !== 'Draft'
    );
    if (explicitlyFeatured.length > 0) {
      return explicitlyFeatured.slice(0, 8);
    }
    // Graceful fallback to initial items if none marked yet
    return productsList.slice(0, 8);
  }, [productsList]);

  // 2. Best Seller products (Driven by isBestSeller checkbox in Admin)
  const bestSellerProducts = useMemo(() => {
    const explicitlyBestSellers = productsList.filter(
      (p) => Boolean(p.isBestSeller) && p.status !== 'Draft'
    );
    if (explicitlyBestSellers.length > 0) {
      return explicitlyBestSellers.slice(0, 8);
    }
    // Graceful fallback to top-rated items
    return [...productsList]
      .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
      .slice(0, 8);
  }, [productsList]);

  return (
    <div className="bg-[#FAF7F2] text-[#1E2922] overflow-hidden">

      {/* ========================================================= */}
      {/* 1. HERO SECTION (MATCHING SCREENSHOT EXACTLY)             */}
      {/* ========================================================= */}
      <section className="relative bg-[#0A291E] text-white overflow-hidden border-b border-[#D4AF37]/25">
        {/* Botanical climbing vine on the far left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-28 sm:w-40 pointer-events-none opacity-25 overflow-hidden z-10">
          <svg viewBox="0 0 100 500" fill="none" stroke="#D4AF37" strokeWidth="1.2" className="w-full h-full">
            <path d="M-10,0 C20,60 10,120 30,180 C50,240 20,300 40,360 C60,420 30,480 20,520" />
            <path d="M20,60 C35,50 45,65 35,75 C25,85 15,70 20,60 Z" />
            <path d="M10,120 C-5,110 -15,125 -5,135 Z" />
            <path d="M30,180 C48,165 60,185 45,198 C30,210 20,195 30,180 Z" />
            <path d="M20,240 C5,225 -5,245 10,255 Z" />
            <path d="M40,300 C58,285 70,305 55,318 Z" />
            <path d="M25,360 C10,345 0,365 15,375 Z" />
            <path d="M40,420 C58,405 70,425 55,438 Z" />
            <circle cx="35" cy="75" r="3" fill="#D4AF37" />
            <circle cx="45" cy="198" r="3" fill="#D4AF37" />
            <circle cx="55" cy="318" r="3" fill="#D4AF37" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[620px] items-stretch">

            {/* Left Column: Heading, Subtitle, CTA, 3 Feature Pillars */}
            <div className="lg:col-span-6 py-12 lg:py-20 flex flex-col justify-center space-y-6 z-20 pr-0 lg:pr-6">

              {/* Coming Soon Label */}
              <div className="flex items-center gap-2.5 text-[#E5C786] text-xs font-semibold uppercase tracking-[0.3em]">
                <span className="text-sm">✦</span>
                <span>COMING SOON</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[58px] text-white font-normal leading-[1.1] tracking-tight">
                Timeless <br />
                Indian Elegance
              </h1>

              {/* Description */}
              <p className="text-stone-300 text-sm sm:text-base max-w-lg font-light leading-relaxed">
                A new destination for elegant Indian fashion is coming your way. Discover timeless style, beautiful tradition and everyday elegance with Saisaa.
              </p>

              {/* Explore Collection Button */}
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 bg-[#E5C786] hover:bg-[#F0D597] text-[#0A291E] font-bold text-xs uppercase tracking-[0.2em] py-3.5 px-7 rounded-sm shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <span>EXPLORE COLLECTION</span>
                  <span className="text-base font-normal">&rarr;</span>
                </Link>
              </div>

              {/* 3 Pillar Badges (Lotus, Diamond, Leaf) */}
              <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg">
                {/* 1: Tradition in every thread (Lotus) */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
                  <div className="w-8 h-8 flex items-center justify-center text-[#E5C786]">
                    <svg className="w-6 h-6 stroke-[#E5C786] fill-none stroke-[1.4]" viewBox="0 0 24 24">
                      <path d="M12 4c-1.5 3-4 6-8 7 3.5 1 6.5 4 8 9 1.5-5 4.5-8 8-9-4-1-6.5-4-8-7z" />
                      <path d="M12 9c-1 2-2.5 4-5 4.5 2 .8 4 2.8 5 6.5 1-3.7 3-5.7 5-6.5-2.5-.5-4-2.5-5-4.5z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-200">
                      TRADITION
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-stone-400">
                      IN EVERY THREAD
                    </span>
                  </div>
                </div>

                {/* 2: Modern Style For Today (Diamond) */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
                  <div className="w-8 h-8 flex items-center justify-center text-[#E5C786]">
                    <svg className="w-6 h-6 stroke-[#E5C786] fill-none stroke-[1.4]" viewBox="0 0 24 24">
                      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
                      <path d="M2 9h20M12 21L8 9l4-6 4 6-4 12z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-200">
                      MODERN STYLE
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-stone-400">
                      FOR TODAY
                    </span>
                  </div>
                </div>

                {/* 3: Made For Every You (Leaf) */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
                  <div className="w-8 h-8 flex items-center justify-center text-[#E5C786]">
                    <svg className="w-6 h-6 stroke-[#E5C786] fill-none stroke-[1.4]" viewBox="0 0 24 24">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c0 3 .5 5-1 10.5A7 7 0 0 1 11 20z" />
                      <path d="M2 22c1.25-.97 3.9-3.3 6-7" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-200">
                      MADE FOR
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-stone-400">
                      EVERY YOU
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Model (Seamless blend, no box) */}
            <div className="lg:col-span-6 relative flex items-end justify-center lg:justify-end overflow-hidden">
              <div className="relative w-full h-full min-h-[460px] lg:min-h-[620px] flex items-end justify-center">
                {/* Clean Model Photo with face & yellow suit */}
                <img
                  src="/images/hero-model.jpg"
                  alt="Saisaa Indian Elegance"
                  className="w-full h-full max-h-[640px] object-cover object-top"
                />

                {/* Left gradient blending smoothly into dark emerald background */}
                <div className="absolute inset-y-0 left-0 w-28 sm:w-36 bg-gradient-to-r from-[#0A291E] via-[#0A291E]/50 to-transparent pointer-events-none hidden lg:block" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A291E]/70 to-transparent pointer-events-none lg:hidden" />

                {/* Floating "Grace in Everyday Moments" script quote */}
                <div className="absolute right-4 sm:right-8 lg:right-10 top-1/4 sm:top-1/3 flex flex-col items-center text-center select-none pointer-events-none drop-shadow">
                  <span className="font-script text-3xl sm:text-4xl lg:text-5xl text-[#5C4A32] leading-none">
                    Grace
                  </span>
                  <span className="font-serif italic text-xs sm:text-sm text-[#735D3F] tracking-widest my-0.5">
                    in
                  </span>
                  <span className="font-script text-3xl sm:text-4xl lg:text-5xl text-[#5C4A32] leading-none">
                    Everyday
                  </span>
                  <span className="font-script text-3xl sm:text-4xl lg:text-5xl text-[#5C4A32] leading-none">
                    Moments
                  </span>
                  <div className="w-10 sm:w-12 h-[1.5px] bg-[#735D3F]/60 mt-3" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. TRINITY ARCHES (CATEGORIES API)                        */}
      {/* ========================================================= */}
      <section className="relative py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading Skeleton */}
        {isLoadingCategories ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-full aspect-[3/4.4] rounded-t-[140px] sm:rounded-t-[180px] bg-stone-200/60 animate-pulse border border-[#D4AF37]/20"
              />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div
            className={`grid grid-cols-1 ${
              categories.length === 1
                ? 'max-w-md mx-auto'
                : categories.length === 2
                ? 'md:grid-cols-2 max-w-3xl mx-auto'
                : 'md:grid-cols-3'
            } gap-8 lg:gap-10`}
          >
            {categories.map((cat, idx) => {
              const catId = cat.id || cat._id || cat.slug || idx;
              const targetLink = cat.slug
                ? `/${cat.slug}`
                : `/shop?category=${encodeURIComponent(cat.name)}`;
              const rawImage = cat.image || '';
              const resolvedImage =
                rawImage.startsWith('http') || rawImage.startsWith('data:')
                  ? rawImage
                  : rawImage.startsWith('/uploads/')
                  ? `${API_BASE_URL.replace(/\/api\/v1\/?$/, '')}${rawImage}`
                  : rawImage.includes('02_category_suits')
                  ? '/images/10_category_suits.jpg'
                  : rawImage.includes('03_category_kurtis')
                  ? '/images/11_category_kurtis.jpg'
                  : rawImage.includes('04_category_sarees')
                  ? '/images/12_category_sarees.jpg'
                  : rawImage || '/images/10_category_suits.jpg';

              return (
                <div key={catId} className="group relative flex flex-col items-center">
                  <Link
                    to={targetLink}
                    className="relative w-full aspect-[3/4.4] rounded-t-[140px] sm:rounded-t-[180px] overflow-hidden border border-[#D4AF37]/35 shadow-md group-hover:shadow-xl transition-all duration-500 block bg-[#EFE9DF]"
                  >
                    <img
                      src={resolvedImage}
                      alt={cat.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#082017]/85 via-black/20 to-transparent" />

                    {/* Bottom Card Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                      <div>
                        <h3 className="font-serif text-2xl font-bold tracking-wider text-white uppercase">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-[10px] uppercase tracking-[0.25em] text-[#E5C786] font-medium mt-0.5 line-clamp-1 max-w-[220px]">
                            {cat.description}
                          </p>
                        )}
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#E5C786] text-[#09231A] flex items-center justify-center shadow group-hover:scale-110 transition-transform shrink-0 ml-3">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : null}
      </section>

      {/* ========================================================= */}
      {/* 3. TRUST BAR (4 GUARANTEES)                               */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[#F6EFE3] border border-[#D4AF37]/30 rounded-xl px-6 py-6 sm:py-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">

            {/* 1 */}
            <div className="flex items-center gap-3.5">
              <div className="text-[#A37F15] shrink-0">
                <Truck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider font-serif">
                  FREE SHIPPING
                </h4>
                <p className="text-[11px] text-stone-600 font-light">
                  On your favourite styles
                </p>
              </div>
            </div>

            {/* 2 */}
            <div className="flex items-center gap-3.5">
              <div className="text-[#A37F15] shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider font-serif">
                  PREMIUM QUALITY
                </h4>
                <p className="text-[11px] text-stone-600 font-light">
                  Crafted with care
                </p>
              </div>
            </div>

            {/* 3 */}
            <div className="flex items-center gap-3.5">
              <div className="text-[#A37F15] shrink-0">
                <Clock className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider font-serif">
                  TIMELESS DESIGNS
                </h4>
                <p className="text-[11px] text-stone-600 font-light">
                  For every occasion
                </p>
              </div>
            </div>

            {/* 4 */}
            <div className="flex items-center gap-3.5">
              <div className="text-[#A37F15] shrink-0">
                <Crown className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider font-serif">
                  A MORE BEAUTIFUL YOU
                </h4>
                <p className="text-[11px] text-stone-600 font-light">
                  Everyday
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* 4. FEATURED COLLECTION CAROUSEL (DRIVEN BY CHECKBOX/API)  */}
      {/* ========================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200/80 pb-6 pr-0 sm:pr-24">
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[#A37F15] text-[11px] font-bold uppercase tracking-[0.25em]">
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>HANDPICKED SHOWCASE</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2922] tracking-tight">
              Featured Collection
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light italic">
              Exclusive creations curated for the discerning patron
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0A291E] hover:text-[#D4AF37] transition-colors group"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ProductCarousel
          products={featuredProducts}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
      </section>

      {/* ========================================================= */}
      {/* 5. ROYAL BEST SELLERS CAROUSEL (DRIVEN BY CHECKBOX/API)   */}
      {/* ========================================================= */}
      <section className="py-16 bg-[#F4EFE6]/60 border-y border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#D4AF37]/25 pb-6 pr-0 sm:pr-24">
            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-[#A37F15] text-[11px] font-bold uppercase tracking-[0.25em]">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>PATRON FAVOURITES</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A291E] tracking-tight">
                Royal Best Sellers
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-light italic">
                Our most coveted, highest-rated artisanal heirlooms
              </p>
            </div>

            <Link
              to="/shop?tag=bestseller"
              className="inline-flex items-center gap-2 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] text-xs font-bold uppercase tracking-[0.15em] py-2.5 px-5 rounded shadow-sm transition-all"
            >
              <span>Explore Best Sellers</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </Link>
          </div>

          <ProductCarousel
            products={bestSellerProducts}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SPLIT EDITORIAL BANNERS (SAREES & KURTIS)              */}
      {/* ========================================================= */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Banner 1: Tradition Lives On (Sarees) */}
          <div className="bg-[#F7EFE6] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-sm grid grid-cols-1 sm:grid-cols-12 items-center">
            {/* Left Photo */}
            <div className="sm:col-span-6 h-72 sm:h-96 overflow-hidden">
              <img
                src="/images/12_category_sarees.jpg"
                alt="Tradition Lives On Sarees"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Right Text */}
            <div className="sm:col-span-6 p-6 sm:p-8 space-y-4 text-left">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                Tradition <br />
                Lives On
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Graceful drapes for unforgettable moments. Our sarees celebrate timeless beauty and modern womanhood.
              </p>
              <div className="pt-2">
                <Link
                  to="/sarees"
                  className="inline-flex items-center gap-2 bg-[#E5C786] hover:bg-[#F3DC9B] text-[#09231A] text-[11px] font-bold uppercase tracking-wider py-2.5 px-5 rounded shadow-sm transition-all"
                >
                  <span>EXPLORE SAREES</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Banner 2: Everyday Elegance (Stitched Suits) */}
          <div className="bg-[#FBEAE3] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-sm grid grid-cols-1 sm:grid-cols-12 items-center">
            {/* Left Text */}
            <div className="sm:col-span-6 p-6 sm:p-8 space-y-4 text-left order-2 sm:order-1">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                Everyday <br />
                Elegance
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Tailored kurtis & stitched suits crafted for effortless grace and everyday celebrations.
              </p>
              <div className="pt-2">
                <Link
                  to="/stitched-suits"
                  className="inline-flex items-center gap-2 bg-[#E5C786] hover:bg-[#F3DC9B] text-[#09231A] text-[11px] font-bold uppercase tracking-wider py-2.5 px-5 rounded shadow-sm transition-all"
                >
                  <span>EXPLORE STITCHED SUITS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            {/* Right Photo */}
            <div className="sm:col-span-6 h-72 sm:h-96 overflow-hidden order-1 sm:order-2">
              <img
                src="/images/11_category_kurtis.jpg"
                alt="Everyday Elegance Stitched Suits"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. OUR STORY ("More Than Fashion")                        */}
      {/* ========================================================= */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8F2E8] rounded-2xl border border-[#D4AF37]/35 shadow-sm p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#A37F15] font-semibold">
                OUR STORY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                More Than Fashion
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                At Saisaa, we celebrate the timeless beauty of Indian heritage with contemporary designs for today's woman. Our collections are crafted to bring elegance, tradition and comfort into your everyday moments.
              </p>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-[#E5C786] hover:bg-[#F3DC9B] text-[#09231A] text-[11px] font-bold uppercase tracking-wider py-2.5 px-6 rounded shadow-sm transition-all"
                >
                  <span>OUR STORY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Center Decorative Calligraphy */}
            <div className="lg:col-span-3 hidden lg:flex flex-col items-center justify-center text-center space-y-1 text-[#A37F15]">
              <div className="w-8 h-8 rounded-full border border-[#D4AF37]/40 flex items-center justify-center mb-1">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="font-script text-3xl sm:text-4xl text-[#A37F15]/90">
                Traditional
              </span>
              <span className="font-script text-3xl sm:text-4xl text-[#A37F15]/90">
                Beautiful
              </span>
              <span className="font-script text-3xl sm:text-4xl text-[#A37F15]/90">
                You
              </span>
            </div>

            {/* Right Photo with Typography Accents */}
            <div className="lg:col-span-4 flex items-center justify-center gap-4">
              <div className="relative w-full max-w-xs aspect-[3/4] rounded-xl overflow-hidden shadow-md border border-[#D4AF37]/40">
                <img
                  src="/images/maroon-story.jpg"
                  alt="Saisaa - Style, Tradition, Confidence"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Vertical stacked words */}
              <div className="hidden sm:flex flex-col justify-center space-y-2 text-left font-serif text-sm tracking-wider text-stone-700">
                <span className="font-medium text-stone-800">Style</span>
                <span className="font-medium text-stone-800">Tradition</span>
                <span className="font-medium text-stone-800">Confidence</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. NEWSLETTER SECTION ("Be the First to Know")             */}
      {/* ========================================================= */}
      <section id="newsletter" className="relative bg-[#082017] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-[#D4AF37]/25">
        {/* Botanical leaf flourishes in corners */}
        <div className="absolute left-6 top-6 w-20 h-20 opacity-20 pointer-events-none text-[#D4AF37]">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M10,90 Q50,50 90,10 Q50,30 30,50 Z" />
          </svg>
        </div>
        <div className="absolute right-6 bottom-6 w-20 h-20 opacity-20 pointer-events-none text-[#D4AF37]">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M90,10 Q50,50 10,90 Q50,70 70,50 Z" />
          </svg>
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF7F2] tracking-tight">
            Be the First to Know
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-lg mx-auto">
            Subscribe to get updates on our launch, exclusive previews and special offers.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full sm:flex-1 bg-white text-stone-900 placeholder-stone-400 text-xs px-4 py-3 rounded border border-transparent focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#E5C786] hover:bg-[#F3DC9B] text-[#09231A] text-xs font-bold uppercase tracking-wider py-3 px-6 rounded transition-colors"
            >
              NOTIFY ME
            </button>
          </form>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

    </div>
  );
};
