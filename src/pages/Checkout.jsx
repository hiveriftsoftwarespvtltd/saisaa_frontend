import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Crown,
  QrCode,
  Banknote,
  Tag,
  MapPin,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiClient, API_ENDPOINTS, RAZORPAY_KEY_ID } from '../config';


import {
  UpiLogo,
  GPayLogo,
  PhonePeLogo,
  PaytmLogo,
  VisaLogo,
  MastercardLogo,
  RuPayLogo,
  RazorpayBadge,
} from '../components/PaymentLogos';

export const Checkout = () => {
  const {
    items,
    subtotal,
    discountAmount,
    taxAmount,
    shippingFee,
    finalTotal,
    clearCart,
    couponCode,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon,
  } = useCart();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Extract saved addresses for the authenticated patron
  const activeUserEmail = (user?.email || '').toLowerCase();
  const savedAddresses = useMemo(() => {
    if (!activeUserEmail) return [];
    try {
      return JSON.parse(localStorage.getItem(`saisaa_addresses_${activeUserEmail}`) || '[]');
    } catch {
      return [];
    }
  }, [activeUserEmail]);

  // Dynamic Patron & Shipping Form State (Prefilled with user info, no mock/fake details)
  const [formData, setFormData] = useState(() => {
    const email = (user?.email || '').toLowerCase();
    let savedAddr = null;
    if (email) {
      try {
        const list = JSON.parse(localStorage.getItem(`saisaa_addresses_${email}`) || '[]');
        savedAddr = list.find((a) => a.isDefault) || list[0] || null;
      } catch {}
    }

    let defaultCity = '';
    let defaultState = '';
    let defaultPincode = '';
    if (savedAddr?.cityState) {
      const parts = savedAddr.cityState.split(',');
      defaultCity = parts[0]?.trim() || '';
      if (parts[1]) {
        const dashParts = parts[1].split('-');
        defaultState = dashParts[0]?.trim() || '';
        defaultPincode = dashParts[1]?.trim() || '';
      }
    }

    return {
      fullName: user?.name || user?.fullName || savedAddr?.name || '',
      email: user?.email || '',
      phone: user?.phone || savedAddr?.phone || '',
      address: savedAddr?.line1 || '',
      city: defaultCity,
      state: defaultState,
      pincode: defaultPincode,
    };
  });

  // Sync with logged-in user when authentication loads/changes
  useEffect(() => {
    if (user) {
      const email = (user.email || '').toLowerCase();
      let savedAddr = null;
      if (email) {
        try {
          const list = JSON.parse(localStorage.getItem(`saisaa_addresses_${email}`) || '[]');
          savedAddr = list.find((a) => a.isDefault) || list[0] || null;
        } catch {}
      }

      let defaultCity = '';
      let defaultState = '';
      let defaultPincode = '';
      if (savedAddr?.cityState) {
        const parts = savedAddr.cityState.split(',');
        defaultCity = parts[0]?.trim() || '';
        if (parts[1]) {
          const dashParts = parts[1].split('-');
          defaultState = dashParts[0]?.trim() || '';
          defaultPincode = dashParts[1]?.trim() || '';
        }
      }

      setFormData((prev) => ({
        fullName: prev.fullName || user.name || user.fullName || savedAddr?.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || savedAddr?.phone || '',
        address: prev.address || savedAddr?.line1 || '',
        city: prev.city || defaultCity,
        state: prev.state || defaultState,
        pincode: prev.pincode || defaultPincode,
      }));
    }
  }, [user]);

  const handleSelectSavedAddress = (addr) => {
    let city = '';
    let state = '';
    let pincode = '';
    if (addr.cityState) {
      const parts = addr.cityState.split(',');
      city = parts[0]?.trim() || '';
      if (parts[1]) {
        const dashParts = parts[1].split('-');
        state = dashParts[0]?.trim() || '';
        pincode = dashParts[1]?.trim() || '';
      }
    }
    setFormData((prev) => ({
      ...prev,
      fullName: addr.name || prev.fullName,
      phone: addr.phone || prev.phone,
      address: addr.line1 || prev.address,
      city: city || prev.city,
      state: state || prev.state,
      pincode: pincode || prev.pincode,
    }));
  };

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">No items to checkout</h2>
        <p className="text-xs text-stone-500 mb-6">Please add items to your shopping bag before proceeding.</p>
        <Link
          to="/shop"
          className="inline-block bg-[#09231A] text-[#F7E7BE] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider"
        >
          View Collections
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCheckoutCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!inputCoupon.trim()) return;
    const res = await applyCoupon(inputCoupon);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponSuccess(res.message);
      setInputCoupon('');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    // Ensure mandatory shipping fields
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      setIsProcessing(false);
      setErrorMessage('Please complete all patron and shipping address fields before proceeding.');
      return;
    }

    const orderPayload = {
      customer: {
        name: (formData.fullName || '').trim(),
        email: (formData.email || '').trim().toLowerCase(),
        phone: (formData.phone || '').trim(),
        address: (formData.address || '').trim(),
        city: (formData.city || '').trim(),
        state: (formData.state || '').trim(),
        pincode: (formData.pincode || '').trim(),
      },
      items: items.map((it) => ({
        id: it.product.id || it.product._id,
        name: it.product.name,
        size: it.size || 'Standard',
        quantity: it.quantity,
        price: it.product.price,
        image: it.product.cardImage || it.product.image || it.product.images?.[0] || '/images/hero-model.jpg',
        customStitching: it.customStitching,
        stitchingFee: it.stitchingFee || 0,
        gstRate: 5,
        gstAmount: Math.round(((it.product.price + (it.stitchingFee || 0)) * it.quantity) * 0.05),
      })),
      subtotal,
      discount: discountAmount,
      couponCode: couponCode || '',
      shipping: shippingFee,
      tax: taxAmount,
      grandTotal: finalTotal,
      amount: finalTotal,
      total: finalTotal,
      paymentMethod:
        paymentMethod === 'card'
          ? 'Credit / Debit Card (Razorpay)'
          : 'UPI Instant Transfer (Razorpay)',
      notes: `Placed on SAISAA Luxury Online Store`,
    };

    // SECURE ONLINE PAYMENT VIA RAZORPAY (UPI, Cards, NetBanking, Wallets)
    try {
      const isLoaded = await loadRazorpayScript();

      if (!isLoaded || !window.Razorpay) {
        throw new Error('Unable to connect to Razorpay payment gateway. Please check your network or try another method.');
      }

      // Step A: Create Order on Razorpay via NestJS Backend
      const res = await apiClient.post(API_ENDPOINTS.ORDERS.RAZORPAY_CREATE_ORDER, {
        amount: finalTotal,
        receipt: `rcpt_${Date.now().toString().slice(-8)}`,
      });

      const razorpayOrder = res?.data || res;
      if (!razorpayOrder?.id) {
        throw new Error('Failed to initiate secure payment session. Please try again.');
      }

      const keyId = razorpayOrder.keyId || RAZORPAY_KEY_ID;

      // Step B: Launch Razorpay Standard Checkout
      const options = {
        key: keyId,
        amount: razorpayOrder.amount, // in paise
        currency: razorpayOrder.currency || 'INR',
        name: 'SAISAA Haute Couture',
        description: `Order Acquisition • ${items.length} ${items.length === 1 ? 'Creation' : 'Creations'}`,
        image: '/saisaa-logo.jpg',
        order_id: razorpayOrder.id,
        prefill: {
          name: (formData.fullName || '').trim(),
          email: (formData.email || '').trim(),
          contact: (formData.phone || '').trim(),
        },
        theme: {
          color: '#09231A', // Royal Deep Green
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setErrorMessage('Payment window was closed. Your chosen items remain in your bag.');
          },
        },
        handler: async (response) => {
          try {
            // Step C: Verify signature on Backend
            const verificationPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderPayload: {
                ...orderPayload,
                grandTotal: finalTotal,
                amount: finalTotal,
                total: finalTotal,
                paymentMethod: paymentMethod === 'card' ? 'Credit / Debit Card (Razorpay)' : 'UPI (Razorpay)',
              },
            };

            const verifyRes = await apiClient.post(
              API_ENDPOINTS.ORDERS.RAZORPAY_VERIFY,
              verificationPayload
            );

            const verifiedOrder = verifyRes?.data || verifyRes;

            const orderSummary = {
              orderId: verifiedOrder?.orderId || `SAI-${Math.floor(100000 + Math.random() * 900000)}`,
              id: verifiedOrder?.id || verifiedOrder?.orderId,
              items: [...items],
              total: finalTotal,
              customer: {
                ...formData,
                name: (formData.fullName || '').trim(),
              },
              paymentMethod: verifiedOrder?.paymentMethod || 'Razorpay Online',
              transactionId: response.razorpay_payment_id,
              date: verifiedOrder?.date || new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
            };

            sessionStorage.setItem('saisaa_last_order', JSON.stringify(orderSummary));
            clearCart();
            setIsProcessing(false);
            navigate('/order-success');
          } catch (verifyErr) {
            console.error('Payment verification error:', verifyErr);
            setIsProcessing(false);
            setErrorMessage(
              verifyErr.message || 'Payment received but order confirmation failed. Please contact SAISAA concierge.'
            );
          }
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', function (failResp) {
        setIsProcessing(false);
        setErrorMessage(
          failResp?.error?.description || 'Payment authorization was declined. Please verify your details or try another card/UPI.'
        );
      });

      rzpInstance.open();
    } catch (err) {
      console.error('Razorpay initialization error:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment initiation failed. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Title */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#18523D] font-bold">
          Royal Concierge Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
          Finalize Your Acquisition
        </h1>
        <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-3" />
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Customer Details & Payment */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Step 1: Patron Information */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#09231A] text-[#F7E7BE] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="font-serif text-lg font-bold text-stone-900">
                  Patron & Shipping Details
                </h2>
              </div>
              {isAuthenticated && user && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#18523D] bg-[#18523D]/10 px-3 py-1 rounded-full self-start sm:self-auto">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Logged in as {user.name || user.email}
                </span>
              )}
            </div>

            {/* Saved Addresses quick-selection for logged in patron */}
            {savedAddresses.length > 0 && (
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#D4AF37]/30 space-y-2">
                <p className="text-[11px] font-bold text-[#09231A] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Select From Saved Addresses
                </p>
                <div className="flex flex-wrap gap-2">
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleSelectSavedAddress(addr)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:border-[#09231A] hover:bg-stone-50 text-stone-800 transition-colors shadow-2xs text-left"
                    >
                      <span className="font-bold text-stone-900">{addr.type || 'Address'}:</span>{' '}
                      <span className="text-stone-600">{addr.line1 ? addr.line1.slice(0, 26) + '...' : ''}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name (Merged from First & Last Name) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Phone (for Delivery & Updates)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Delivery Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Street name, bungalow / apartment number"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Postal Code (Pincode)
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-2xl p-4 sm:p-8 border border-[#D4AF37]/30 shadow-sm space-y-5 sm:space-y-6">
            
            {/* Step 2 Header with Official Razorpay Co-Branding */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#09231A] text-[#F7E7BE] flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-[#D4AF37]/40 shrink-0">
                  2
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-stone-900 leading-tight">
                    Payment Option
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    Select your payment rail &bull; All transactions are encrypted & 100% secure
                  </p>
                </div>
              </div>
              <RazorpayBadge className="self-start sm:self-auto" />
            </div>

            {/* Payment Method Cards */}
            <div className="space-y-3.5">
              
              {/* Option 1: UPI Instant Transfer (GPay, PhonePe, Paytm, QR) */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                  paymentMethod === 'upi'
                    ? 'border-[#09231A] bg-[#FAF8F5] shadow-sm ring-1 ring-[#D4AF37]/50'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div className="p-3.5 sm:p-5">
                  <div className="flex items-start gap-3">
                    {/* Custom Radio Button */}
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-[#09231A] bg-[#09231A]'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {paymentMethod === 'upi' && (
                        <div className="w-2 h-2 rounded-full bg-[#F7E7BE]" />
                      )}
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 min-w-0">
                      {/* Title + Badges Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-stone-900">
                            UPI Instant Transfer
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                            ⚡ Fastest
                          </span>
                        </div>

                        {/* Real Brand Badges (Desktop) */}
                        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                          <GPayLogo />
                          <PhonePeLogo />
                          <PaytmLogo />
                          <UpiLogo className="h-4.5 w-auto pl-1" />
                        </div>
                      </div>

                      {/* Description Text */}
                      <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                        Google Pay, PhonePe, Paytm, CRED & any UPI app via dynamic QR
                      </p>

                      {/* Real Brand Badges (Mobile - Full width row below description) */}
                      <div className="flex sm:hidden items-center gap-1.5 mt-2.5 flex-wrap">
                        <GPayLogo />
                        <PhonePeLogo />
                        <PaytmLogo />
                        <UpiLogo className="h-4 w-auto pl-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Accordion Details */}
                {paymentMethod === 'upi' && (
                  <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-4 pt-2.5 border-t border-[#D4AF37]/20 bg-stone-50/60 text-xs text-stone-600 space-y-1.5 animate-fade-in">
                    <div className="flex items-start gap-2 text-[11px] text-[#09231A] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Instant verification with zero additional payment gateway surcharges.</span>
                    </div>
                    <div className="flex items-start gap-2 text-[11px] text-stone-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Scan a live QR code or authorize seamlessly inside your UPI app via Razorpay.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Option 2: Credit / Debit Card & NetBanking */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                  paymentMethod === 'card'
                    ? 'border-[#09231A] bg-[#FAF8F5] shadow-sm ring-1 ring-[#D4AF37]/50'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div className="p-3.5 sm:p-5">
                  <div className="flex items-start gap-3">
                    {/* Custom Radio Button */}
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#09231A] bg-[#09231A]'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {paymentMethod === 'card' && (
                        <div className="w-2 h-2 rounded-full bg-[#F7E7BE]" />
                      )}
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 min-w-0">
                      {/* Title + Badges Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-stone-900">
                            Credit / Debit Card & NetBanking
                          </span>
                        </div>

                        {/* Real Card Badges (Desktop) */}
                        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                          <VisaLogo />
                          <MastercardLogo />
                          <RuPayLogo />
                          <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded">
                            +50 Banks
                          </span>
                        </div>
                      </div>

                      {/* Description Text */}
                      <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                        Visa, MasterCard, RuPay, Maestro, Amex & 50+ NetBanking options
                      </p>

                      {/* Real Card Badges (Mobile - Full width row below description) */}
                      <div className="flex sm:hidden items-center gap-1.5 mt-2.5 flex-wrap">
                        <VisaLogo />
                        <MastercardLogo />
                        <RuPayLogo />
                        <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded">
                          +50 Banks
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Accordion Details */}
                {paymentMethod === 'card' && (
                  <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-4 pt-2.5 border-t border-[#D4AF37]/20 bg-stone-50/60 text-xs text-stone-600 space-y-1.5 animate-fade-in">
                    <div className="flex items-start gap-2 text-[11px] text-[#09231A] font-medium">
                      <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Secured with 256-bit SSL via Razorpay's PCI-DSS Level 1 compliant vault.</span>
                    </div>
                    <div className="flex items-start gap-2 text-[11px] text-stone-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Supports domestic & international cards with frictionless bank OTP verification.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Place Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-md space-y-6 sticky top-28">
            <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Order Review ({items.length} {items.length === 1 ? 'Creation' : 'Creations'})
            </h3>

            {/* Items mini list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.itemKey} className="flex items-center gap-3 text-xs">
                  <img
                    src={
                      item.product?.image ||
                      item.product?.cardImage ||
                      item.product?.images?.[0] ||
                      '/images/hero-model.jpg'
                    }
                    alt={item.product?.name || 'Product'}
                    className="w-12 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 truncate">{item.product.name}</p>
                    <p className="text-stone-500 text-[11px]">
                      Size: {item.size} &bull; Qty: {item.quantity}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      GST (5%): ₹{Math.round(((item.product.price + (item.stitchingFee || 0)) * item.quantity) * 0.05).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className="font-bold text-stone-900">
                    ₹{((item.product.price + item.stitchingFee) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon / Promo Code Section */}
            <div className="pt-2 border-t border-stone-100">
              {couponCode ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/50">
                  <div className="flex items-center gap-1.5 text-xs text-[#09231A] font-bold">
                    <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>
                      {couponCode} ({activeCoupon?.discount || 'PROMO'})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeCoupon();
                      setCouponSuccess('');
                      setCouponError('');
                    }}
                    className="text-[11px] text-red-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => {
                          setInputCoupon(e.target.value);
                          setCouponError('');
                        }}
                        placeholder="Promo code (e.g. ROYAL10)"
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-stone-200 uppercase tracking-wider focus:outline-none focus:border-[#09231A]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCheckoutCoupon}
                      disabled={isApplyingCoupon || !inputCoupon.trim()}
                      className="bg-[#D4AF37] hover:bg-[#E5C786] text-[#09231A] px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {isApplyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                  {couponSuccess && <p className="text-[11px] text-emerald-600 font-medium">{couponSuccess}</p>}
                </div>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-4 border-t border-stone-200 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#18523D] font-semibold">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-semibold text-stone-900">₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-[#18523D]">
                  {shippingFee === 0 ? 'Free (Complimentary)' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-stone-200 text-base font-bold text-[#09231A]">
                <span>Payable Amount</span>
                <span className="text-xl">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 animate-fade-in shadow-2xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#09231A] hover:bg-[#103B2C] text-[#F7E7BE] hover:text-white py-4 px-6 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-[#D4AF37]/50 shadow-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Crown className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  <span>Authorizing Secure Payment Session...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Pay via Razorpay &bull; ₹{finalTotal.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>


            <div className="pt-2 text-center text-[11px] text-stone-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#18523D]" />
              <span>Razorpay Secured 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
