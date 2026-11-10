import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  ArrowRight,
  Award,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProductCarousel } from '../components/ProductCarousel';
import { HeroSlideshow } from '../components/HeroSlideshow';
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
      {/* 1. HERO SLIDESHOW + MARQUEE TICKER (SAISAA EDITION)       */}
      {/* ========================================================= */}
      <HeroSlideshow />

      {/* ========================================================= */}
      {/* 2. TRINITY ARCHES (CATEGORIES API)                        */}
      {/* ========================================================= */}
      <section className="relative pt-12 pb-8 lg:pt-16 lg:pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      {/* 3. FEATURED COLLECTION CAROUSEL (DRIVEN BY CHECKBOX/API)  */}
      {/* ========================================================= */}
      <section className="pt-4 pb-12 lg:pt-6 lg:pb-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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
      {/* 4. ROYAL BEST SELLERS CAROUSEL (DRIVEN BY CHECKBOX/API)   */}
      {/* ========================================================= */}
      <section className="py-12 lg:py-14 bg-[#F4EFE6]/60 border-y border-[#D4AF37]/20">
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
      <section className="pt-12 pb-6 lg:pt-14 lg:pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <section className="pt-6 pb-12 lg:pt-8 lg:pb-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
