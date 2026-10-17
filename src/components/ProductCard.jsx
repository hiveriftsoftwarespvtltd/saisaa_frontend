import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-[#D4AF37]/20 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image Container (Optimized 4:5 ratio with object-cover) */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#FAF7F2]">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
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
            onClick={() => addToCart(product, product?.sizes?.[0] || 'Standard', 1)}
            className="w-full bg-[#09231A]/95 hover:bg-[#09231A] text-[#F7E7BE] hover:text-white py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#D4AF37]/40 backdrop-blur-md shadow-lg transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span>Quick Bag (Size {product?.sizes?.[0] || 'Standard'})</span>
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

          <Link to={`/product/${product.id}`} className="block group-hover:text-[#18523D] transition-colors">
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, product?.sizes?.[0] || 'Standard', 1);
            }}
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
