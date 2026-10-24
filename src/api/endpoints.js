// Centralized API Endpoints for SAISAA E-Commerce Platform

export const API_ENDPOINTS = {
  // Authentication & Patron Profile
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },


  // Products Management & Showcase
  PRODUCTS: {
    BASE: '/products',
    LIST: (limit = 100) => `/products?limit=${limit}`,
    BY_ID: (id) => `/products/${id}`,
  },

  // Categories & Sub-Categories Taxonomy
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id) => `/categories/${id}`,
    SUBCATEGORIES: (catId) => `/categories/${catId}/subcategories`,
    SUBCATEGORY_BY_NAME: (catId, subName) =>
      `/categories/${catId}/subcategories/${encodeURIComponent(subName)}`,
  },

  // Orders & Fulfillment
  ORDERS: {
    BASE: '/orders',
    LIST: (limit = 100) => `/orders?limit=${limit}`,
    BY_ID: (id) => `/orders/${id}`,
    MY_ORDERS: (email) => `/orders/my-orders?email=${encodeURIComponent(email)}`,
    UPDATE_STATUS: (orderId) => `/orders/${orderId}/status`,
    RAZORPAY_KEY: '/orders/razorpay/key',
    RAZORPAY_CREATE_ORDER: '/orders/razorpay/create-order',
    RAZORPAY_VERIFY: '/orders/razorpay/verify',
  },

  // Customer Cart Engine
  CART: {
    GET: (email) => `/cart?email=${encodeURIComponent(email)}`,
    SYNC: '/cart/sync',
  },

  // Customer Wishlist
  WISHLIST: {
    BASE: '/wishlist',
    GET: (email) => `/wishlist?email=${encodeURIComponent(email)}`,
    SYNC: '/wishlist/sync',
    TOGGLE: '/wishlist/toggle',
    REMOVE: (productId, email) =>
      `/wishlist/${encodeURIComponent(productId)}${email ? `?email=${encodeURIComponent(email)}` : ''}`,
    CLEAR: (email) => `/wishlist${email ? `?email=${encodeURIComponent(email)}` : ''}`,
  },

  // Media Assets & Multi-File Uploads
  UPLOAD: {
    SINGLE: '/upload',
    MULTIPLE: '/upload/multiple',
  },

  // Patron Directory & Customers Management
  CUSTOMERS: {
    BASE: '/customers',
    LIST: '/customers',
    BY_ID: (id) => `/customers/${id}`,
  },

  // Promo Codes & Coupons Engine
  COUPONS: {
    BASE: '/coupons',
    LIST: '/coupons',
    BY_ID: (id) => `/coupons/${id}`,
    VALIDATE: '/coupons/validate',
  },

  // Patron Reviews & Ratings Engine
  REVIEWS: {
    BASE: '/reviews',
    LIST: '/reviews',
    BY_ID: (id) => `/reviews/${id}`,
    BY_PRODUCT: (productId) => `/reviews/product/${productId}`,
    ELIGIBILITY: (productId, email) =>
      `/reviews/eligibility?productId=${encodeURIComponent(productId)}&email=${encodeURIComponent(email)}`,
    UPDATE_STATUS: (id) => `/reviews/${id}/status`,
  },

  // Stock Control & Real-Time Inventory
  INVENTORY: {
    BASE: '/inventory',
    LIST: '/inventory',
    SUMMARY: '/inventory/summary',
    ADJUST: (sku) => `/inventory/${encodeURIComponent(sku)}`,
  },

  // Patron Inquiries & Consultation Requests
  INQUIRIES: {
    BASE: '/inquiries',
    LIST: '/inquiries',
    BY_ID: (id) => `/inquiries/${id}`,
    UPDATE_STATUS: (id) => `/inquiries/${id}/status`,
  },
};

export default API_ENDPOINTS;
