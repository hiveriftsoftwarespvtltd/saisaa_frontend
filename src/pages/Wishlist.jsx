import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Crown,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PageHeroBanner } from '../components/PageHeroBanner';

export const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist, isLoading, isSyncing } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const handleMoveToCart = (product) => {
    const defaultSize = (product.sizes && product.sizes[0]) || 'Standard';
    addToCart(product, defaultSize, 1);
    removeFromWishlist(product.id || product._id);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  };

  return (
    <div className="w-full space-y-10 pb-16">
      {/* Page Hero Banner */}
      <PageHeroBanner
        breadcrumb="Wishlist"
        titleLine1="Your Royal"
        titleLine2="Curated Wishlist"
        description="Save and curate your personal festive trousseau of heirloom suits, handcrafted sarees, and artisanal kurtis."
        modelImage="/images/07_product_6.jpg"
        modelAlt="Royal Curated Wishlist"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Sync & Account Status Header Notice */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 text-[#18523D]">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-xs sm:text-sm font-semibold text-stone-900">
                    Synced with Patron Account ({user?.email})
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-stone-900">
                    Guest Browsing Session
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Your selections are saved locally. Sign in to permanently save them across your devices.
                  </p>
                </div>
              )}
            </div>
          </div>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#09231A] hover:bg-[#154634] text-[#F7E7BE] text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 self-start sm:self-auto"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Sign In to Sync</span>
            </Link>
          )}

          {isSyncing && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 self-start sm:self-auto">
              <RotateCw className="w-3 h-3 animate-spin text-[#D4AF37]" />
              <span>Syncing with Cloud...</span>
            </div>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="max-w-xl mx-auto py-16 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#FAF7F2] border-2 border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#18523D] shadow-inner">
              <Heart className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Your Royal Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              Save your favorite heirloom suits, sarees, and kurtis to curate your personal festive trousseau.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#09231A] hover:bg-[#103B2C] text-[#F7E7BE] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#D4AF37]/50 shadow-lg transition-all"
              >
                <span>Explore The Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Saved Creations ({wishlist.length})
              </h3>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-stone-500 hover:text-red-700 transition-colors"
              >
                Clear Wishlist
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
              {wishlist.map((product) => {
                const prodKey = product.id || product._id || product.customId || product.sku;
                const prodImg =
                  (product.images && product.images[0]) ||
                  product.cardImage ||
                  product.image ||
                  '/images/hero-model.jpg';

                return (
                  <div
                    key={prodKey}
                    className="bg-white rounded-xl overflow-hidden border border-[#D4AF37]/25 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] bg-[#FAF7F2] overflow-hidden">
                      <Link to={`/product/${prodKey}`}>
                        <img
                          src={prodImg}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(prodKey)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-stone-500 hover:text-[#8C271E] flex items-center justify-center shadow transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 space-y-3 flex flex-col justify-between flex-grow">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                          {product.category || 'Atelier Collection'}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-stone-900 line-clamp-1 mt-0.5">
                          {product.name}
                        </h4>
                        <p className="text-sm font-semibold text-[#09231A] mt-1">
                          ₹{Number(product.price || 0).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="w-full py-2.5 px-4 bg-[#09231A] hover:bg-[#154634] text-[#F7E7BE] text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
