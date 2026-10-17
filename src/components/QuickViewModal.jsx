import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

export const QuickViewModal = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  const handleAdd = () => {
    addToCart(product, selectedSize, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#D4AF37]/40 max-h-[92vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-100 hover:bg-[#09231A] hover:text-[#F7E7BE] text-stone-700 flex items-center justify-center transition-colors shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media Gallery */}
        <div className="md:w-1/2 bg-[#FAF7F2] p-6 flex flex-col justify-between">
          <div className="aspect-[3/4] rounded-xl overflow-hidden border border-[#D4AF37]/20 shadow-inner mb-4">
            <img
              src={
                product?.images?.[activeImageIndex] ||
                product?.images?.[0] ||
                product?.image ||
                product?.cardImage ||
                '/images/hero-model.jpg'
              }
              alt={product?.name || 'Product'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {Array.isArray(product?.images) && product.images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#09231A] ring-2 ring-[#D4AF37]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#18523D] font-semibold mb-1">
              <span>{product.category}</span>
              <span>&bull;</span>
              <span>{product.subCategory}</span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-700">{product.rating}</span>
              <span className="text-xs text-stone-400">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5 pb-4 border-b border-stone-200">
              <span className="text-2xl font-bold text-[#09231A]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs font-bold text-[#18523D] bg-[#18523D]/10 px-2 py-0.5 rounded">
                Inclusive of all taxes
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Select Size
                </label>
                <span className="text-[11px] text-[#18523D] underline cursor-pointer">
                  Size Guide
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      selectedSize === sz
                        ? 'bg-[#09231A] text-[#F7E7BE] border-[#09231A] shadow-sm'
                        : 'border-stone-300 text-stone-700 hover:border-stone-400 bg-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>


            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">Qty</span>
              <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-semibold text-stone-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 bg-[#09231A] hover:bg-[#0F382A] text-[#F7E7BE] hover:text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-[#D4AF37]/50 shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>Add To Royal Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors flex items-center justify-center ${
                  isWishlisted
                    ? 'bg-[#8C271E] text-white border-[#8C271E]'
                    : 'border-stone-300 hover:border-stone-400 text-stone-700 bg-white'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="block text-center text-xs text-[#18523D] hover:underline font-semibold"
            >
              View Full Product Specifications &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
