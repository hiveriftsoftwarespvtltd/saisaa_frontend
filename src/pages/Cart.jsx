import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Crown,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { PRODUCTS } from '../data/products';

export const Cart = () => {
  const {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    subtotal: cartSubtotal,
    discountAmount: cartDiscount,
    couponCode,
    activeCoupon,
    isApplyingCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Sync selectedItems when items change
  useEffect(() => {
    setSelectedItems(new Set(items.map((i) => i.itemKey)));
  }, [items.length]);

  const toggleSelectItem = (key) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const allSelected = items.length > 0 && selectedItems.size === items.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((i) => i.itemKey)));
    }
  };

  const removeSelectedItems = () => {
    selectedItems.forEach((key) => removeFromCart(key));
    setSelectedItems(new Set());
  };

  // Calculate pricing based on selected items
  const activeItems = items.filter((i) => selectedItems.has(i.itemKey));
  const subtotal = activeItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  let discountAmount = 0;
  if (activeCoupon) {
    const minOrder = activeCoupon.minimumOrder || 0;
    if (subtotal >= minOrder) {
      if (activeCoupon.type === 'Percentage' || activeCoupon.type === 'percent') {
        const calculated = Math.round((subtotal * activeCoupon.value) / 100);
        discountAmount = activeCoupon.maximumDiscount
          ? Math.min(calculated, activeCoupon.maximumDiscount)
          : calculated;
      } else if (activeCoupon.type === 'Fixed' || activeCoupon.type === 'flat') {
        discountAmount = Math.min(activeCoupon.value, subtotal);
      }
    }
  } else if (couponCode) {
    discountAmount = cartDiscount;
  }

  const shippingFee = 0; // Free as per screenshot
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) return;
    const res = await applyCoupon(inputCoupon);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setInputCoupon('');
    }
  };

  // Carousel items for "You May Also Like"
  const carouselProducts = PRODUCTS.slice(0, 4);

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, carouselProducts.length - 1)));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev < carouselProducts.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen pb-16">
      {/* 1. Header Banner matching reference screenshot */}
      <section className="relative overflow-hidden bg-[#FAF6F0] border-b border-[#D4AF37]/20 py-8 md:py-12">
        {/* Left Botanical Vine Art */}
        <div className="absolute top-0 left-0 h-full pointer-events-none select-none opacity-40 z-0">
          <svg viewBox="0 0 240 320" className="h-full w-auto text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M10 320 C30 260, 20 180, 50 120 C70 80, 110 50, 160 20" strokeLinecap="round" />
            <path d="M35 250 C55 240, 75 250, 80 270 C60 275, 45 265, 35 250 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M45 180 C65 165, 90 175, 90 195 C70 200, 55 190, 45 180 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M55 125 C75 105, 100 115, 105 135 C85 140, 70 130, 55 125 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M90 75 C110 55, 135 65, 135 85 C115 90, 100 80, 90 75 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M125 40 C145 20, 170 30, 170 50 C150 55, 135 45, 125 40 Z" fill="currentColor" fillOpacity="0.2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Text */}
          <div className="space-y-2 text-center md:text-left">
            <nav className="flex items-center justify-center md:justify-start gap-2 text-xs text-stone-500 font-medium">
              <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
              <span className="text-stone-400">&gt;</span>
              <span className="text-stone-900 font-semibold">Cart</span>
            </nav>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
              Your Cart
            </h1>
            <p className="text-stone-600 text-sm sm:text-base font-light">
              Beautiful choices, made for you.
            </p>
          </div>

          {/* Right: Model in green suit with caption */}
          <div className="relative flex items-center gap-4">
            <div className="relative h-28 sm:h-36 md:h-44 w-40 sm:w-56 md:w-64 rounded-2xl overflow-hidden shadow-sm">
              <img
                src="/images/01_hero_banner.jpg"
                alt="Premium Unstitched Suits"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-transparent to-transparent opacity-60" />
            </div>
            <div className="hidden sm:block max-w-[140px] text-right">
              <p className="font-serif text-xs md:text-sm font-semibold text-stone-800 leading-snug">
                Premium Unstitched Suits for Every You
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Cart Table & Order Summary Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl p-8 sm:p-14 text-center max-w-2xl mx-auto border border-[#D4AF37]/25 shadow-sm space-y-5">
            <div className="w-20 h-20 rounded-full bg-[#FAF6F0] border-2 border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#09231A]">
              <ShoppingBag className="w-9 h-9 text-[#D4AF37]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Your Cart is Empty
            </h2>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              Your cart is waiting for you to discover handcrafted luxury suits, sarees, and kurtis.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#09231A] hover:bg-[#103B2C] text-[#F7E7BE] px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest border border-[#D4AF37]/50 shadow-md transition-all active:scale-95"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items Table */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
              {/* Table Header Bar */}
              <div className="bg-[#FAF7F2] border-b border-stone-200 px-4 sm:px-6 py-3.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-700 select-none">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-[#09231A] cursor-pointer rounded"
                    id="selectAllHeader"
                  />
                  <label htmlFor="selectAllHeader" className="cursor-pointer">
                    Product ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </label>
                </div>
                <div className="hidden sm:grid grid-cols-3 gap-6 text-center text-[11px] text-stone-500 font-semibold w-72">
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-stone-100">
                {items.map((item) => {
                  const isChecked = selectedItems.has(item.itemKey);
                  return (
                    <div
                      key={item.itemKey}
                      className={`p-4 sm:p-6 transition-colors ${
                        isChecked ? 'bg-white' : 'bg-stone-50/50 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Checkbox, Thumbnail & Details */}
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectItem(item.itemKey)}
                            className="mt-1 sm:mt-0 w-4 h-4 accent-[#09231A] cursor-pointer rounded shrink-0"
                            aria-label={`Select ${item.product.name}`}
                          />

                          <Link
                            to={`/product/${item.product.id}`}
                            className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#FAF6F0] shrink-0 border border-stone-200"
                          >
                            <img
                              src={
                                item.product?.image ||
                                item.product?.cardImage ||
                                item.product?.images?.[0] ||
                                '/images/hero-model.jpg'
                              }
                              alt={item.product?.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          </Link>

                          <div className="space-y-1 min-w-0 flex-1">
                            <Link
                              to={`/product/${item.product.id}`}
                              className="font-serif text-sm sm:text-base font-bold text-stone-900 hover:text-[#18523D] transition-colors line-clamp-1 block"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-xs text-stone-500">
                              <span className="font-medium text-stone-700">Color:</span> {item.product.color || 'Royal'} &bull;{' '}
                              <span className="font-medium text-stone-700">Fabric:</span> {item.product.fabric || 'Pure Cotton'}
                            </p>
                            <p className="text-[11px] text-stone-400">
                              Size: <strong className="text-stone-700">{item.size}</strong>
                            </p>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.itemKey)}
                              className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-red-600 pt-1 transition-colors group"
                            >
                              <Trash2 className="w-3.5 h-3.5 group-hover:text-red-600" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>

                        {/* Price, Stepper & Total Column on Desktop */}
                        <div className="w-full sm:w-72 grid grid-cols-3 items-center gap-2 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                          {/* Unit Price */}
                          <div className="text-left sm:text-center">
                            <span className="sm:hidden text-[10px] text-stone-400 block">Price</span>
                            <span className="text-xs sm:text-sm font-semibold text-stone-800">
                              ₹{item.product.price.toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* Stepper */}
                          <div className="flex justify-center">
                            <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white shadow-xs h-8 sm:h-9 w-24">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.itemKey, item.quantity - 1)}
                                className="w-7 h-full bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-sm flex items-center justify-center transition-colors active:bg-stone-200"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="flex-1 text-center text-xs font-bold text-stone-900 select-none">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.itemKey, item.quantity + 1)}
                                className="w-7 h-full bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-sm flex items-center justify-center transition-colors active:bg-stone-200"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Line Total */}
                          <div className="text-right sm:text-center">
                            <span className="sm:hidden text-[10px] text-stone-400 block">Total</span>
                            <span className="text-xs sm:text-sm font-bold text-stone-900">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Action Bar */}
              <div className="bg-[#FAF7F2] border-t border-stone-200 px-4 sm:px-6 py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-[#09231A] cursor-pointer rounded"
                    id="selectAllFooter"
                  />
                  <label htmlFor="selectAllFooter" className="cursor-pointer font-medium text-stone-700">
                    Select All ({items.length} items)
                  </label>
                </div>

                <button
                  type="button"
                  onClick={removeSelectedItems}
                  disabled={selectedItems.size === 0}
                  className="inline-flex items-center gap-1.5 text-stone-500 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Selected</span>
                </button>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-5">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs text-stone-600">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span>Subtotal ({activeItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-stone-900">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Discount */}
                {discountAmount > 0 ? (
                  <div className="flex justify-between items-center text-[#18523D] font-semibold">
                    <span>Discount</span>
                    <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-stone-400">
                    <span>Discount</span>
                    <span>- ₹0</span>
                  </div>
                )}

                {/* Coupon Code Input */}
                <div className="pt-2">
                  {couponCode ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/40">
                      <div className="flex items-center gap-1.5 text-xs text-[#09231A] font-bold">
                        <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>
                          {couponCode} ({activeCoupon?.discount || 'PROMO'})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-[11px] text-red-600 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-1">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={inputCoupon}
                            onChange={(e) => setInputCoupon(e.target.value)}
                            placeholder="Enter coupon code"
                            className="w-full text-xs pl-8 pr-3 py-2.5 rounded-lg border border-stone-300 uppercase tracking-wider focus:outline-none focus:border-[#09231A]"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isApplyingCoupon}
                          className="bg-[#E5C786] hover:bg-[#D4AF37] text-[#09231A] px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                        >
                          {isApplyingCoupon ? '...' : 'Apply'}
                        </button>
                      </div>
                      {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                    </form>
                  )}
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center pt-2">
                  <span>Shipping</span>
                  <span className="text-[#18523D] font-bold uppercase text-[11px]">
                    Free
                  </span>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-stone-200">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-stone-900">Total</span>
                    <span className="text-xl font-bold text-[#09231A]">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 pt-0.5">
                    Inclusive of all taxes
                  </p>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                disabled={activeItems.length === 0}
                className="w-full bg-[#0A291E] hover:bg-[#124231] disabled:opacity-50 text-white py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <span className="text-sm">&rarr;</span>
              </button>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-stone-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-stone-400 uppercase tracking-widest absolute">
                  OR
                </span>
              </div>

              {/* Continue Shopping CTA */}
              <Link
                to="/shop"
                className="w-full bg-white hover:bg-stone-50 text-stone-800 py-3.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-stone-300 transition-colors text-center"
              >
                <ShoppingBag className="w-4 h-4 text-stone-600" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        )}

        {/* 3. Four Trust Badges Section matching reference screenshot */}
        <section className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Free Shipping */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">Free Shipping</h4>
                <p className="text-[11px] text-stone-500 font-light">On all orders</p>
              </div>
            </div>

            {/* Secure Payment */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">Secure Payment</h4>
                <p className="text-[11px] text-stone-500 font-light">100% Safe & Secure</p>
              </div>
            </div>

            {/* Easy Returns */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <RotateCcw className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">Easy Returns</h4>
                <p className="text-[11px] text-stone-500 font-light">Hassle free returns</p>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Headphones className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">24/7 Support</h4>
                <p className="text-[11px] text-stone-500 font-light">We're Here</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. "You May Also Like" Product Showcase Section */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-1 relative">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              You May Also Like
            </h2>
            <div className="flex items-center justify-center gap-2 text-[#D4AF37]">
              <span className="w-12 h-px bg-[#D4AF37]/40" />
              <Crown className="w-3.5 h-3.5" />
              <span className="w-12 h-px bg-[#D4AF37]/40" />
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              Explore more beautiful unstitched suits
            </p>

            {/* Carousel navigation arrows */}
            <div className="hidden sm:flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={handlePrevCarousel}
                className="w-8 h-8 rounded-full border border-stone-300 hover:border-[#09231A] text-stone-600 hover:text-[#09231A] flex items-center justify-center bg-white shadow-xs transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextCarousel}
                className="w-8 h-8 rounded-full border border-stone-300 hover:border-[#09231A] text-stone-600 hover:text-[#09231A] flex items-center justify-center bg-white shadow-xs transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {carouselProducts.map((p) => {
              const isFav = isInWishlist(p.id);
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col group"
                >
                  {/* Image with Heart Icon */}
                  <div className="relative aspect-[3/4] bg-[#FAF6F0] overflow-hidden">
                    <Link to={`/product/${p.id}`} className="block w-full h-full">
                      <img
                        src={
                          p.image ||
                          p.cardImage ||
                          p.images?.[0] ||
                          '/images/hero-model.jpg'
                        }
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(p)}
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
                        isFav
                          ? 'bg-[#8C271E] text-white'
                          : 'bg-white/90 text-stone-600 hover:bg-[#09231A] hover:text-[#F7E7BE]'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Info & Add to Cart Button matching screenshot */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <Link
                        to={`/product/${p.id}`}
                        className="font-serif text-xs sm:text-sm font-semibold text-stone-900 hover:text-[#18523D] transition-colors line-clamp-1 block"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs sm:text-sm font-bold text-[#09231A] pt-1">
                        ₹{p.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(p, p.sizes?.[0] || 'Standard', 1)}
                      className="w-full bg-[#E5C786] hover:bg-[#D4AF37] text-[#09231A] py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
