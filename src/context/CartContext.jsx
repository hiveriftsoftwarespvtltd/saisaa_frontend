import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import { apiClient, API_ENDPOINTS } from '../config';

const CartContext = createContext(null);

const VALID_COUPONS = {
  SAISAAFIRST: { type: 'percent', value: 15, label: '15% Royal Welcome Offer' },
  ROYAL10: { type: 'percent', value: 10, label: '10% Royal Heritage Club' },
  SHAHI500: { type: 'flat', value: 500, label: '₹500 Festive Delight' },
  FESTIVE20: { type: 'percent', value: 20, label: '20% Grand Celebration Offer' },
};

// Helper to ensure product always has images array and image URLs
const normalizeItem = (it) => {
  if (!it || !it.product) return it;
  const p = it.product;
  const img =
    p.image ||
    p.cardImage ||
    (Array.isArray(p.images) && p.images[0]) ||
    '/images/hero-model.jpg';
  const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : [img];
  return {
    ...it,
    product: {
      ...p,
      image: img,
      cardImage: p.cardImage || img,
      images,
    },
  };
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('saisaa_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(normalizeItem) : [];
    } catch (e) {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState(() => {
    try {
      return localStorage.getItem('saisaa_coupon') || '';
    } catch (e) {
      return '';
    }
  });

  const [couponDetails, setCouponDetails] = useState(() => {
    try {
      const saved = localStorage.getItem('saisaa_coupon_details');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const { addToast } = useToast();

  // Helper to extract active customer email
  const getCustomerEmail = useCallback(() => {
    try {
      const stored = localStorage.getItem('saisaa_customer_user');
      if (stored) {
        const u = JSON.parse(stored);
        return u?.email || null;
      }
    } catch {
      return null;
    }
    return null;
  }, []);

  // Fetch backend cart on mount if customer is logged in
  useEffect(() => {
    const fetchBackendCart = async () => {
      const email = getCustomerEmail();
      if (!email) return;
      try {
        const res = await apiClient.get(`/cart?email=${encodeURIComponent(email)}`);
        if (res?.data?.items && Array.isArray(res.data.items)) {
          if (res.data.items.length > 0) {
            const normalizedBackend = res.data.items.map(normalizeItem);
            setItems((prev) => {
              if (prev.length === 0) return normalizedBackend;
              const map = new Map();
              normalizedBackend.forEach((it) => map.set(it.itemKey, it));
              prev.forEach((it) => map.set(it.itemKey, normalizeItem(it)));
              return Array.from(map.values());
            });
          }
        }
      } catch (err) {
        console.warn('Initial cart sync fetch skipped:', err.message);
      }
    };
    fetchBackendCart();
  }, [getCustomerEmail]);

  // Sync to localStorage and backend
  useEffect(() => {
    try {
      localStorage.setItem('saisaa_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }

    const email = getCustomerEmail();
    if (email) {
      apiClient.post('/cart/sync', { userEmail: email, items }).catch((err) => {
        console.warn('Cart backend sync skipped:', err.message);
      });
    }
  }, [items, getCustomerEmail]);

  useEffect(() => {
    try {
      if (couponCode) {
        localStorage.setItem('saisaa_coupon', couponCode);
      } else {
        localStorage.removeItem('saisaa_coupon');
      }
      if (couponDetails) {
        localStorage.setItem('saisaa_coupon_details', JSON.stringify(couponDetails));
      } else {
        localStorage.removeItem('saisaa_coupon_details');
      }
    } catch (e) {
      console.error(e);
    }
  }, [couponCode, couponDetails]);

  const addToCart = (product, size = 'M', quantity = 1, customStitching = false) => {
    const itemKey = `${product.id}-${size}-${customStitching ? 'custom' : 'standard'}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.itemKey === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          normalizeItem({
            itemKey,
            product,
            size,
            quantity,
            customStitching,
            stitchingFee: customStitching ? 1200 : 0,
            addedAt: Date.now(),
          }),
        ];
      }
    });

    addToast(`Added "${product.name.slice(0, 24)}..." (Size: ${size}) to your Bag`, 'cart');
  };

  const removeFromCart = (itemKey) => {
    setItems((prev) => prev.filter((i) => i.itemKey !== itemKey));
  };

  const updateQuantity = (itemKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.itemKey === itemKey ? { ...i, quantity: newQuantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setCouponDetails(null);
  };

  const applyCoupon = async (code) => {
    const cleanCode = code ? code.trim().toUpperCase() : '';
    if (!cleanCode) {
      return { success: false, message: 'Please enter a promo code' };
    }

    setIsApplyingCoupon(true);
    try {
      const res = await apiClient.post(API_ENDPOINTS.COUPONS.VALIDATE, {
        code: cleanCode,
        orderAmount: subtotal,
      });

      const couponData = res?.data || res;
      if (couponData && couponData.valid) {
        setCouponCode(cleanCode);
        setCouponDetails(couponData);
        addToast(`Promo code "${cleanCode}" applied successfully!`, 'success');
        return {
          success: true,
          message: `Applied: ${couponData.label || `${cleanCode} discount`}`,
          discountAmount: couponData.discountAmount,
        };
      } else {
        return {
          success: false,
          message: couponData?.message || 'Invalid or expired royal promo code',
        };
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Invalid or expired royal promo code';

      // Fallback check against static VALID_COUPONS if backend was completely unreachable
      if (!err.response && VALID_COUPONS[cleanCode]) {
        const staticCpn = VALID_COUPONS[cleanCode];
        const simulated = {
          valid: true,
          code: cleanCode,
          label: staticCpn.label,
          coupon: {
            code: cleanCode,
            type: staticCpn.type === 'percent' ? 'Percentage' : 'Fixed',
            value: staticCpn.value,
            discount: staticCpn.type === 'percent' ? `${staticCpn.value}%` : `₹${staticCpn.value}`,
          },
        };
        setCouponCode(cleanCode);
        setCouponDetails(simulated);
        addToast(`Promo code "${cleanCode}" applied successfully!`, 'success');
        return { success: true, message: `Applied: ${staticCpn.label}` };
      }

      return { success: false, message: errorMsg };
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDetails(null);
    addToast('Coupon code removed', 'cart');
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => {
    const base = item.product.price * item.quantity;
    const stitching = item.stitchingFee * item.quantity;
    return sum + base + stitching;
  }, 0);

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  let discountAmount = 0;
  const activeCoupon = couponDetails?.coupon || VALID_COUPONS[couponCode] || null;

  if (couponDetails && couponDetails.coupon) {
    const cpn = couponDetails.coupon;
    const minOrder = cpn.minimumOrder || 0;
    if (subtotal >= minOrder) {
      if (cpn.type === 'Percentage' || cpn.type === 'percent') {
        const calculated = Math.round((subtotal * cpn.value) / 100);
        discountAmount = cpn.maximumDiscount ? Math.min(calculated, cpn.maximumDiscount) : calculated;
      } else if (cpn.type === 'Fixed' || cpn.type === 'flat') {
        discountAmount = Math.min(cpn.value, subtotal);
      }
    }
  } else if (activeCoupon) {
    if (activeCoupon.type === 'percent') {
      discountAmount = Math.round((subtotal * activeCoupon.value) / 100);
    } else if (activeCoupon.type === 'flat') {
      discountAmount = Math.min(activeCoupon.value, subtotal);
    }
  }

  // 5% GST on each product
  const gstRate = 0.05;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * gstRate);

  // Complimentary Free Shipping across all orders
  const freeShippingThreshold = 0;
  const isFreeShipping = true;
  const shippingFee = 0;
  const freeShippingNeeded = 0;
  const finalTotal = taxableAmount + taxAmount + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        activeCoupon,
        couponDetails,
        isApplyingCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        taxAmount,
        gstAmount: taxAmount,
        gstRate,
        shippingFee,
        finalTotal,
        totalItemCount,
        freeShippingThreshold,
        isFreeShipping,
        freeShippingNeeded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
