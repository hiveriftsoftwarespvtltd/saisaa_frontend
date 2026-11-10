import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Crown } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const ProductCard = ({
  product,
  onQuickView,
  variant = 'default',
  rank = null,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const defaultSize =
    product?.isFreeSize ||
    (Array.isArray(product?.sizes) && product.sizes.includes('Free Size'))
      ? 'Free Size'
      : product?.sizes?.[0] || 'Standard';

  const quickSizeLabel = defaultSize === 'Free Size' ? 'Free Size' : `Size ${defaultSize}`;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultSize, 1);
  };

  // =========================================================================
  // 0A. ATELIER SPOTLIGHT VARIANT (Wide Editorial Lead Card)
  // =========================================================================
  if (variant === 'atelier-spotlight') {
    return (
      <article className="group relative bg-white rounded-2xl overflow-hidden border border-[#E6DEC8] shadow-[0_12px_36px_rgba(9,35,26,0.06)] hover:shadow-[0_24px_56px_rgba(9,35,26,0.12)] hover:border-[#D4AF37]/70 transition-all duration-400 grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-5 relative h-[320px] sm:h-[360px] lg:h-[390px] overflow-hidden bg-[#F7F3EB]">
          <Link to={`/product/${product.id}`} state={{ product }} className="block w-full h-full">
            <img
              src={product.homeImage || product.cardImage || product.images?.[0] || '/images/05_shop_product_card_1.jpg'}
              alt={product.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/05_shop_product_card_1.jpg';
              }}
            />
          </Link>

          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="bg-[#09231A]/88 backdrop-blur-sm text-[#F7E7BE] text-[10px] font-bold tracking-[0.22em] uppercase px-3.5 py-1.5 rounded-full border border-[#D4AF37]/50 shadow-sm">
              ✦ Featured Spotlight
            </span>
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-sm cursor-pointer ${
                isWishlisted
                  ? 'bg-[#8C271E] text-white'
                  : 'bg-white/90 text-stone-700 hover:bg-[#09231A] hover:text-[#F7E7BE]'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="w-9 h-9 rounded-full bg-white/90 text-stone-700 hover:bg-[#09231A] hover:text-[#F7E7BE] flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-sm cursor-pointer"
                aria-label="Quick View"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-white via-white to-[#FAF7F2]">
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="uppercase tracking-[0.24em] text-[11px] font-bold text-[#9B7B1C]">
                {product.subCategory || 'Handcrafted Couture'}
              </span>
              <div className="inline-flex items-center gap-1.5 bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                <Star className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                <span className="font-bold text-[#09231A] text-xs">{product.rating}</span>
                {product.reviewCount > 0 && (
                  <span className="text-stone-400 text-[11px]">({product.reviewCount} reviews)</span>
                )}
              </div>
            </div>

            <Link
              to={`/product/${product.id}`}
              state={{ product }}
              className="block group-hover:text-[#18523D] transition-colors"
            >
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#09231A] leading-tight">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2">
              {product.description || 'Crafted in our atelier with artisanal embroidery, heritage silhouettes, and breathable heirloom textiles.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {product.fabric && (
                <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#F6EFE3] text-[#09231A] border border-[#D4AF37]/30">
                  {product.fabric}
                </span>
              )}
              {product.work && (
                <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#F6EFE3] text-[#09231A] border border-[#D4AF37]/30">
                  {product.work}
                </span>
              )}
              <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-emerald-50 text-[#18523D] border border-emerald-200/70">
                {defaultSize === 'Free Size' ? 'Free Size Ready' : 'Ready to Ship'}
              </span>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#09231A]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[11px] font-bold text-[#8C271E] bg-[#8C271E]/10 px-2.5 py-0.5 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#09231A] hover:bg-[#144734] text-[#F7E7BE] text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>Add to Bag</span>
              </button>
              <Link
                to={`/product/${product.id}`}
                state={{ product }}
                className="px-5 py-2.5 rounded-full border border-[#09231A]/25 hover:border-[#09231A] text-[#09231A] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // =========================================================================
  // 0B. ROYAL SPOTLIGHT VARIANT (Reversed Split Deep Emerald Lead Card)
  // =========================================================================
  if (variant === 'royal-spotlight') {
    return (
      <article className="group relative bg-[#0E2F23] rounded-2xl overflow-hidden border border-[#D4AF37]/35 shadow-[0_16px_44px_rgba(0,0,0,0.3)] hover:border-[#D4AF37]/85 transition-all duration-400 grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#0E2F23] via-[#0B271D] to-[#082017] order-2 lg:order-1">
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F3DC9B] text-[#09231A] text-[10px] font-extrabold tracking-[0.2em] uppercase px-3.5 py-1 rounded-full shadow">
                <Crown className="w-3.5 h-3.5" />
                <span>#1 Royal Best Seller</span>
              </span>
              <div className="inline-flex items-center gap-1.5 bg-[#09231A] px-3 py-1 rounded-full border border-[#D4AF37]/35">
                <Star className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                <span className="font-bold text-[#F7E7BE] text-xs">{product.rating}</span>
                {product.reviewCount > 0 && (
                  <span className="text-[#F7E7BE]/65 text-[11px]">({product.reviewCount} reviews)</span>
                )}
              </div>
            </div>

            <Link
              to={`/product/${product.id}`}
              state={{ product }}
              className="block group-hover:text-[#F7E7BE] transition-colors"
            >
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F2] leading-tight">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs sm:text-sm text-stone-300/85 leading-relaxed line-clamp-2">
              {product.description || 'Our most treasured patron favourite — timeless festive heritage woven for unforgettable occasions.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {product.subCategory && (
                <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#09231A] text-[#E5C786] border border-[#D4AF37]/35">
                  {product.subCategory}
                </span>
              )}
              {product.fabric && (
                <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#09231A] text-[#F7E7BE]/90 border border-[#D4AF37]/30">
                  {product.fabric}
                </span>
              )}
              {product.work && (
                <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#09231A] text-[#F7E7BE]/90 border border-[#D4AF37]/30">
                  {product.work}
                </span>
              )}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#F7E7BE]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400/75 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[11px] font-bold text-white bg-[#8C271E] px-2.5 py-0.5 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E5C786] to-[#F7E7BE] hover:from-[#F3DC9B] hover:to-white text-[#09231A] text-xs font-extrabold uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
              <Link
                to={`/product/${product.id}`}
                state={{ product }}
                className="px-5 py-2.5 rounded-full border border-[#D4AF37]/45 hover:border-[#F7E7BE] text-[#F7E7BE] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Details
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative h-[320px] sm:h-[360px] lg:h-[390px] overflow-hidden bg-[#071F17] order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-[#D4AF37]/25">
          <Link to={`/product/${product.id}`} state={{ product }} className="block w-full h-full">
            <img
              src={product.homeImage || product.cardImage || product.images?.[0] || '/images/05_shop_product_card_1.jpg'}
              alt={product.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/05_shop_product_card_1.jpg';
              }}
            />
          </Link>

          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-md border cursor-pointer ${
                isWishlisted
                  ? 'bg-[#8C271E] text-white border-[#8C271E]'
                  : 'bg-[#09231A]/80 text-[#F7E7BE] border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#09231A]'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="w-9 h-9 rounded-full bg-[#09231A]/80 text-[#F7E7BE] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#09231A] flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-md cursor-pointer"
                aria-label="Quick View"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }

  // =========================================================================
  // 1. ATELIER EDITORIAL VARIANT (Featured Collection Light Showcase)
  // =========================================================================
  if (variant === 'atelier') {
    return (
      <article className="group relative bg-white rounded-2xl overflow-hidden border border-[#E6DEC8] shadow-[0_8px_28px_rgba(9,35,26,0.05)] hover:shadow-[0_22px_50px_rgba(9,35,26,0.12)] hover:border-[#D4AF37]/65 hover:-translate-y-1 transition-all duration-400 flex flex-col">
        <div className="relative aspect-[4/4.6] overflow-hidden bg-[#F7F3EB]">
          <Link to={`/product/${product.id}`} state={{ product }} className="block w-full h-full">
            <img
              src={product.cardImage || product.images?.[0] || '/images/05_shop_product_card_1.jpg'}
              alt={product.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/05_shop_product_card_1.jpg';
              }}
            />
          </Link>

          {/* Subtle Inner Atelier Frame on Hover */}
          <div className="absolute inset-2.5 rounded-xl border border-[#F7E7BE]/45 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Single Compact Editorial Pill Top-Left */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="bg-[#09231A]/85 backdrop-blur-sm text-[#F7E7BE] text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border border-[#D4AF37]/45 shadow-sm">
              ✦ Featured
            </span>
          </div>

          {/* Floating Glass Action Stack Top-Right */}
          <div className="absolute top-3.5 right-3.5 flex flex-col gap-2 z-10">
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-sm cursor-pointer ${
                isWishlisted
                  ? 'bg-[#8C271E] text-white'
                  : 'bg-white/90 text-stone-700 hover:bg-[#09231A] hover:text-[#F7E7BE]'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="w-9 h-9 rounded-full bg-white/90 text-stone-700 hover:bg-[#09231A] hover:text-[#F7E7BE] flex items-center justify-center backdrop-blur-md transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm cursor-pointer"
                aria-label="Quick View"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Slide-Up Pill Quick Bag on Hover */}
          <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full bg-[#09231A]/95 hover:bg-[#09231A] text-[#F7E7BE] hover:text-white py-2.5 px-4 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 border border-[#D4AF37]/50 backdrop-blur-md shadow-lg transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Quick Bag ({quickSizeLabel})</span>
            </button>
          </div>
        </div>

        {/* Clean Atelier Details */}
        <div className="p-5 flex flex-col flex-grow justify-between bg-white">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-[#9B7B1C] truncate">
                {product.subCategory || 'Handcrafted Couture'}
              </span>
              <div className="inline-flex items-center gap-1 bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#D4AF37]/25 shrink-0">
                <Star className="w-3 h-3 fill-current text-[#D4AF37]" />
                <span className="font-bold text-[#09231A] text-[11px]">{product.rating}</span>
              </div>
            </div>

            <Link
              to={`/product/${product.id}`}
              state={{ product }}
              className="block group-hover:text-[#18523D] transition-colors"
            >
              <h3 className="font-serif text-lg font-bold text-[#09231A] line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-stone-500 line-clamp-1 mt-1">
              {[product.fabric, product.work].filter(Boolean).join(' • ') || 'Pure Artisanal Weave'}
            </p>
          </div>

          {/* Inline Price & Sleek Pill CTA */}
          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-serif text-lg font-bold text-[#09231A]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[10px] font-bold text-[#8C271E] bg-[#8C271E]/10 px-1.5 py-0.5 rounded">
                    -{discountPercent}%
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-[#18523D]">Ready to Ship</span>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#09231A] hover:bg-[#144734] text-[#F7E7BE] text-[11px] font-bold uppercase tracking-wider shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  // =========================================================================
  // 2. ROYAL HERITAGE VARIANT (Royal Best Sellers Dark Emerald Showcase)
  // =========================================================================
  if (variant === 'royal') {
    return (
      <article className="group relative bg-[#0E2F23] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-[0_12px_36px_rgba(0,0,0,0.28)] hover:border-[#D4AF37]/85 hover:shadow-[0_22px_54px_rgba(212,175,55,0.18)] hover:-translate-y-1.5 transition-all duration-400 flex flex-col">
        <div className="relative aspect-[4/4.6] overflow-hidden bg-[#071F17] border-b border-[#D4AF37]/20">
          <Link to={`/product/${product.id}`} state={{ product }} className="block w-full h-full">
            <img
              src={product.cardImage || product.images?.[0] || '/images/05_shop_product_card_1.jpg'}
              alt={product.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/05_shop_product_card_1.jpg';
              }}
            />
          </Link>

          {/* Subtle Royal Gold Corner Glow Frame on Hover */}
          <div className="absolute inset-2.5 rounded-xl border border-[#D4AF37]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Single Compact Metallic Gold Rank Crest Top-Left */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#D4AF37] to-[#F3DC9B] text-[#09231A] text-[9px] font-extrabold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full shadow-md">
              <Crown className="w-3 h-3" />
              <span>{rank ? `#${rank} Best Seller` : 'Best Seller'}</span>
            </span>
          </div>

          {/* Dark-Emerald Floating Glass Action Dock */}
          <div className="absolute top-3.5 right-3.5 flex flex-col gap-2 z-10">
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-md border cursor-pointer ${
                isWishlisted
                  ? 'bg-[#8C271E] text-white border-[#8C271E]'
                  : 'bg-[#09231A]/80 text-[#F7E7BE] border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#09231A]'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="w-9 h-9 rounded-full bg-[#09231A]/80 text-[#F7E7BE] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#09231A] flex items-center justify-center backdrop-blur-md transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
                aria-label="Quick View"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Champagne Gold Quick Bag Dock on Hover */}
          <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full bg-gradient-to-r from-[#E5C786] to-[#F7E7BE] hover:from-[#F3DC9B] hover:to-white text-[#09231A] py-2.5 px-4 rounded-full text-[11px] font-extrabold uppercase tracking-[0.18em] flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Quick Bag ({quickSizeLabel})</span>
            </button>
          </div>
        </div>

        {/* Luxury Dark Emerald Details */}
        <div className="p-5 flex flex-col flex-grow justify-between bg-gradient-to-b from-[#0E2F23] to-[#082017]">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="uppercase tracking-[0.2em] text-[10px] font-semibold text-[#D4AF37] truncate">
                {product.subCategory || 'Royal Archive'}
              </span>
              <div className="inline-flex items-center gap-1 bg-[#09231A] px-2 py-0.5 rounded-full border border-[#D4AF37]/35 shrink-0">
                <Star className="w-3 h-3 fill-current text-[#D4AF37]" />
                <span className="font-bold text-[#F7E7BE] text-[11px]">{product.rating}</span>
                {product.reviewCount > 0 && (
                  <span className="text-[#F7E7BE]/60 text-[10px]">({product.reviewCount})</span>
                )}
              </div>
            </div>

            <Link
              to={`/product/${product.id}`}
              state={{ product }}
              className="block group-hover:text-[#F7E7BE] transition-colors"
            >
              <h3 className="font-serif text-lg font-bold text-[#FAF7F2] line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-stone-300/75 line-clamp-1 mt-1">
              {[product.fabric, product.work].filter(Boolean).join(' • ') || 'Heirloom Craftsmanship'}
            </p>
          </div>

          {/* Luminous Price & Gold Add Pill */}
          <div className="pt-4 mt-4 border-t border-[#D4AF37]/20 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-serif text-lg font-bold text-[#F7E7BE]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-stone-400/75 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[10px] font-bold text-white bg-[#8C271E] px-1.5 py-0.5 rounded">
                    -{discountPercent}%
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-[#D4AF37]/85">Signature Piece</span>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E5C786] hover:bg-[#F7E7BE] text-[#09231A] text-[11px] font-extrabold uppercase tracking-wider shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  // =========================================================================
  // 3. DEFAULT STOREFRONT CARD (Shop / ProductDetails / Related)
  // =========================================================================

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-[#D4AF37]/20 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image Container (Optimized 4:5 ratio with object-cover) */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#FAF7F2]">
        <Link to={`/product/${product.id}`} state={{ product }} className="block w-full h-full">
          <img
            src={product.cardImage || product.images?.[0] || '/images/05_shop_product_card_1.jpg'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/05_shop_product_card_1.jpg';
            }}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestSeller && (
            <span className="bg-[#09231A] text-[#F7E7BE] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm border border-[#D4AF37]/50 shadow-sm">
              Royal Best Seller
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-[#18523D] text-[#F7E7BE] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm border border-[#D4AF37]/50 shadow-sm">
              ✦ Featured
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#D4AF37] text-[#09231A] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm shadow-sm">
              New Arrival
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#8C271E] text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm shadow-sm w-fit">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Action Buttons: Wishlist & Quick View */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-md ${
              isWishlisted
                ? 'bg-[#8C271E] text-white'
                : 'bg-white/85 text-stone-700 hover:bg-[#09231A] hover:text-[#F7E7BE]'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="w-9 h-9 rounded-full bg-white/85 text-stone-700 hover:bg-[#09231A] hover:text-[#F7E7BE] flex items-center justify-center backdrop-blur-md transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md"
              aria-label="Quick View"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleAdd}
            className="w-full bg-[#09231A]/95 hover:bg-[#09231A] text-[#F7E7BE] hover:text-white py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#D4AF37]/40 backdrop-blur-md shadow-lg transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span>Quick Bag ({quickSizeLabel})</span>
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="uppercase tracking-wider text-[11px] font-medium text-[#18523D]">
              {product.subCategory}
            </span>
            <div className="flex items-center gap-1 text-[#D4AF37]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-semibold text-stone-700 text-xs">{product.rating}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} state={{ product }} className="block group-hover:text-[#18523D] transition-colors">
            <h3 className="font-serif text-base font-semibold text-stone-900 line-clamp-1 mb-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-stone-500 line-clamp-1 mb-3">
            {product.fabric} &bull; {product.work}
          </p>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-2.5 border-t border-stone-100 space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-[#09231A]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#18523D] font-medium">
              In Stock
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="w-full bg-[#E5C786] hover:bg-[#D4AF37] text-[#09231A] py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
