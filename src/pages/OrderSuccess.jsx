import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Check,
  ShoppingBag,
  Truck,
  Package,
  Home,
  Printer,
  MapPin,
  FileText,
  Mail,
  Download,
  ArrowRight,
  Heart,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { PRODUCTS } from '../data/products';

export const OrderSuccess = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const savedOrder = JSON.parse(sessionStorage.getItem('saisaa_last_order') || 'null');
  const customer = savedOrder?.customer;

  const customerName = customer?.fullName || customer?.name || user?.name || user?.fullName || 'Valued Patron';
  const customerEmail = customer?.email || user?.email || '';
  const customerPhone = customer?.phone || user?.phone || '';
  const customerAddress = customer?.address || 'Delivery Address Provided';
  const customerCityState = customer?.city && customer?.state
    ? `${customer.city}, ${customer.state}${customer.pincode ? ` - ${customer.pincode}` : ''}`
    : customer?.city || customer?.state || '';

  useEffect(() => {
    // Celebratory royal confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#09231A', '#F7E7BE'],
      });
    } catch (e) {
      // Graceful fallback if canvas-confetti is not available
    }
  }, []);

  const orderNumber = savedOrder?.orderId || '#SAI12568';
  const orderDate = savedOrder?.date || new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const orderItems = (savedOrder?.items && savedOrder.items.length > 0)
    ? savedOrder.items.map((it, idx) => ({
        id: it.id || it.product?.id || `ord-item-${idx}`,
        name: it.product?.name || it.name || 'Saisaa Luxury Creation',
        color: it.color || (it.size ? `Size: ${it.size}` : 'Standard Edition'),
        fabric: it.product?.fabric || 'Luxury Artisanal Blend',
        qty: it.quantity || 1,
        price: it.product?.price || it.price || 0,
        image: it.product?.cardImage || it.product?.image || it.product?.images?.[0] || it.image || '/images/hero-model.jpg',
      }))
    : [
        {
          id: 'saisaa-suit-01',
          name: 'Embroidered Unstitched Suit Set',
          color: 'Yellow',
          fabric: 'Georgette',
          qty: 1,
          price: 2499,
          image: '/images/05_shop_product_card_1.jpg',
        },
        {
          id: 'saisaa-kurti-01',
          name: 'Printed Unstitched Suit Set',
          color: 'Blue',
          fabric: 'Cotton',
          qty: 1,
          price: 1899,
          image: '/images/06_shop_product_card_2.jpg',
        },
        {
          id: 'saisaa-kurti-02',
          name: 'Elegant Unstitched Suit Set',
          color: 'Pink',
          fabric: 'Chanderi',
          qty: 1,
          price: 2299,
          image: '/images/09_shop_product_card_5.jpg',
        },
      ];

  const subtotal = savedOrder?.total || orderItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  const discount = savedOrder?.discount ?? 0;
  const totalAmount = savedOrder?.total || subtotal;

  // 4 "You May Also Like" items
  const suggestedProducts = PRODUCTS.slice(0, 4);

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen text-[#1E2922] pb-16">
      
      {/* ========================================================= */}
      {/* 1. HERO BANNER: "Thank You! Your Order Has Been Placed"   */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-[#FAF6F0] border-b border-[#D4AF37]/20 py-8 md:py-14">
        {/* Left Botanical Branch Vine Art */}
        <div className="absolute top-0 left-0 h-full pointer-events-none select-none opacity-35 z-0">
          <svg viewBox="0 0 240 380" className="h-full w-auto text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M10 380 C30 300, 20 200, 50 140 C70 90, 110 50, 170 20" strokeLinecap="round" />
            <path d="M35 300 C55 285, 75 300, 80 320 C60 325, 45 315, 35 300 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M45 220 C65 200, 90 215, 90 235 C70 240, 55 230, 45 220 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M55 150 C75 130, 100 140, 105 160 C85 165, 70 155, 55 150 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M90 90 C110 70, 135 80, 135 100 C115 105, 100 95, 90 90 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M130 45 C150 25, 175 35, 175 55 C155 60, 140 50, 130 45 Z" fill="currentColor" fillOpacity="0.2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Confirmation Text & Order Metadata */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              {/* Green Circle Checkmark Badge */}
              <div className="w-12 h-12 rounded-full bg-[#18523D] text-white flex items-center justify-center mx-auto lg:mx-0 shadow-md">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
                Thank You!
              </h1>

              <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-800">
                Your Order Has Been Placed Successfully.
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
                We're so happy to have you with us. Your order is confirmed and will be processed soon.
              </p>

              {/* Order Number & Date Metadata */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 pt-2 text-xs">
                <div>
                  <span className="text-stone-400 font-medium block">Order Number</span>
                  <span className="font-bold text-sm sm:text-base text-stone-900">
                    {orderNumber}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 font-medium block">Order Date</span>
                  <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base text-stone-900">
                    <Calendar className="w-4 h-4 text-[#A37F15]" />
                    <span>{orderDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Seated Model in Yellow Suit */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden shadow-sm">
                <img
                  src="/images/01_hero_banner.jpg"
                  alt="Saisaa Patron Order Confirmed"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/80 via-transparent to-transparent lg:block hidden pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF6F0] via-[#FAF6F0]/50 to-transparent pointer-events-none" />
              </div>

              {/* Floating "More Than Fashion" script caption */}
              <div className="absolute right-4 sm:right-8 top-10 text-right select-none pointer-events-none drop-shadow-xs">
                <span className="font-script text-2xl sm:text-3xl text-[#5C4A32] leading-tight block">
                  More <br />
                  Than <br />
                  Fashion
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. ORDER PROGRESS TIMELINE STEPPER                        */}
      {/* ========================================================= */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
          <div className="overflow-x-auto scrollbar-none pb-2">
            <div className="min-w-[680px] flex items-center justify-between relative">
              {/* Background Connecting Line */}
              <div className="absolute top-6 left-10 right-10 h-0.5 bg-stone-200 -z-0" />
              <div className="absolute top-6 left-10 w-1/4 h-0.5 bg-[#09231A] -z-0" />

              {/* Step 1: Order Placed */}
              <div className="flex flex-col items-center text-center space-y-2 z-10 w-36">
                <div className="w-12 h-12 rounded-full bg-[#09231A] text-[#F7E7BE] flex items-center justify-center shadow-md">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 leading-tight">Order Placed</h4>
                  <p className="text-[11px] text-stone-500 font-light mt-0.5">12 Sep, 4:32 PM</p>
                </div>
              </div>

              {/* Step 2: Processing */}
              <div className="flex flex-col items-center text-center space-y-2 z-10 w-36">
                <div className="w-12 h-12 rounded-full bg-[#09231A] text-[#F7E7BE] flex items-center justify-center shadow-md">
                  <Package className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 leading-tight">Processing</h4>
                  <p className="text-[11px] text-stone-500 font-light mt-0.5">We're preparing your order</p>
                </div>
              </div>

              {/* Step 3: Shipped */}
              <div className="flex flex-col items-center text-center space-y-2 z-10 w-36">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-stone-300 text-stone-400 flex items-center justify-center shadow-xs">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-700 leading-tight">Shipped</h4>
                  <p className="text-[11px] text-stone-400 font-light mt-0.5">You'll receive a tracking link soon</p>
                </div>
              </div>

              {/* Step 4: Out for Delivery */}
              <div className="flex flex-col items-center text-center space-y-2 z-10 w-36">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-stone-300 text-stone-400 flex items-center justify-center shadow-xs">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-700 leading-tight">Out for Delivery</h4>
                  <p className="text-[11px] text-stone-400 font-light mt-0.5">On the way to you</p>
                </div>
              </div>

              {/* Step 5: Delivered */}
              <div className="flex flex-col items-center text-center space-y-2 z-10 w-36">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-stone-300 text-stone-400 flex items-center justify-center shadow-xs">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-700 leading-tight">Delivered</h4>
                  <p className="text-[11px] text-stone-400 font-light mt-0.5">Estimated by 15 Sep 2026</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. ORDER DETAILS & ORDER SUMMARY 2-COLUMN SECTION         */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Order Items Card & Shipping/Billing Addresses */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Card: Order Details (3 Items) */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                  Order Details ({orderItems.length} Items)
                </h3>
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="inline-flex items-center gap-1.5 text-xs text-[#A37F15] hover:text-[#09231A] font-semibold transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>
              </div>

              <div className="divide-y divide-stone-100 p-4 sm:p-6 space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-stone-500">
                          Color: {item.color} &bull; Fabric: {item.fabric} &bull; Qty: {item.qty}
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-[#09231A]">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row: Shipping Address & Billing Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-2">
                <div className="flex items-center gap-2 text-stone-800">
                  <MapPin className="w-4 h-4 text-[#A37F15]" />
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900">
                    Shipping Address
                  </h4>
                </div>
                <div className="text-xs text-stone-600 space-y-0.5 leading-relaxed pt-1">
                  <p className="font-semibold text-stone-900">{customerName}</p>
                  <p>{customerAddress}</p>
                  {customerCityState && <p>{customerCityState}</p>}
                  {customerPhone && <p className="text-stone-500 pt-0.5">{customerPhone}</p>}
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-2">
                <div className="flex items-center gap-2 text-stone-800">
                  <FileText className="w-4 h-4 text-[#A37F15]" />
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900">
                    Billing Address
                  </h4>
                </div>
                <div className="text-xs text-stone-600 space-y-0.5 leading-relaxed pt-1">
                  <p className="font-semibold text-stone-900">{customerName}</p>
                  <p>{customerAddress}</p>
                  {customerCityState && <p>{customerCityState}</p>}
                  {customerPhone && <p className="text-stone-500 pt-0.5">{customerPhone}</p>}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary, Payment Info & Updates Card */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card 1: Order Summary */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 sm:p-6 space-y-4">
              <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal ({orderItems.length} items)</span>
                  <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping Charges</span>
                  <span className="text-[#18523D] font-bold uppercase text-[11px]">
                    {savedOrder?.shipping && savedOrder.shipping > 0 ? `₹${savedOrder.shipping}` : 'FREE'}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-[#18523D] font-semibold">
                    <span>Discount</span>
                    <span>- ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-stone-900 block">Total Amount</span>
                    <span className="text-[10px] text-stone-400">Inclusive of all taxes</span>
                  </div>
                  <span className="text-lg font-bold text-[#09231A]">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Payment Information */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 sm:p-6 space-y-3">
              <h3 className="font-serif text-xs sm:text-sm font-bold text-stone-900">
                Payment Information
              </h3>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-stone-200 flex items-center justify-center font-bold text-xs text-[#09231A]">
                    {savedOrder?.paymentMethod?.includes('Card') ? 'CARD' : savedOrder?.paymentMethod?.includes('COD') ? 'COD' : 'UPI'}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">{savedOrder?.paymentMethod || 'Prepaid Payment'}</span>
                    <span className="text-[11px] text-stone-500">{customerEmail || 'Authenticated Patron'}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-xs text-stone-900 block">₹{totalAmount.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
                    Confirmed
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-stone-400 text-right pt-1">
                {orderDate}
              </p>
            </div>

            {/* Card 3: You'll Receive Updates */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 sm:p-6 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 flex items-center justify-center text-[#A37F15] shrink-0 mt-0.5">
                <Mail className="w-5 h-5 text-[#A37F15]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900">
                  You'll Receive Updates
                </h4>
                <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                  We'll notify you at <strong className="text-stone-800">{customerEmail || 'your registered email'}</strong>{customerPhone ? <> and <strong className="text-stone-800">{customerPhone}</strong></> : null} with tracking details, shipping updates and delivery status.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* 4. Action Buttons Row matching screenshot */}
        <div className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Track Your Order */}
            <Link
              to="/account"
              className="bg-[#09231A] hover:bg-[#124231] text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all text-center"
            >
              <span>Track Your Order</span>
              <span>&rarr;</span>
            </Link>

            {/* Continue Shopping */}
            <Link
              to="/shop"
              className="bg-white hover:bg-stone-50 text-stone-800 py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center border border-stone-300 transition-colors text-center"
            >
              <span>Continue Shopping</span>
            </Link>

            {/* View Order Details */}
            <Link
              to="/account"
              className="bg-white hover:bg-stone-50 text-stone-800 py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center border border-stone-300 transition-colors text-center"
            >
              <span>View Order Details</span>
            </Link>

            {/* Download Invoice */}
            <button
              type="button"
              onClick={handlePrintInvoice}
              className="bg-white hover:bg-stone-50 text-stone-800 py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-stone-300 transition-colors text-center"
            >
              <Download className="w-4 h-4 text-stone-500" />
              <span>Download Invoice</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. "You May Also Like" Product Showcase Section           */}
      {/* ========================================================= */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-1 relative">
          <div className="flex items-center justify-center gap-3 text-[#D4AF37]">
            <span className="w-12 sm:w-16 h-px bg-[#D4AF37]/50" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              You May Also Like
            </h2>
            <span className="w-12 sm:w-16 h-px bg-[#D4AF37]/50" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {suggestedProducts.map((p) => {
            const isFav = isInWishlist(p.id);
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow flex flex-col group"
              >
                {/* Image */}
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
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xs ${
                      isFav
                        ? 'bg-[#8C271E] text-white'
                        : 'bg-white/90 text-stone-600 hover:bg-[#09231A] hover:text-[#F7E7BE]'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Info & Add to Cart Button */}
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
                    onClick={() => {
                      addToCart(p, p.sizes?.[0] || 'Standard', 1);
                    }}
                    className="w-full bg-[#E5C786] hover:bg-[#D4AF37] text-[#09231A] py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                  >
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
