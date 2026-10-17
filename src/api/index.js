import { apiClient } from '../config';
import { API_ENDPOINTS } from './endpoints';

export { API_ENDPOINTS };

// Products API Service
export const productApi = {
  getAll: (limit = 100) => apiClient.get(API_ENDPOINTS.PRODUCTS.LIST(limit)),
  getById: (id) => apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id)),
  create: (data) => apiClient.post(API_ENDPOINTS.PRODUCTS.BASE, data),
  update: (id, data) => apiClient.put(API_ENDPOINTS.PRODUCTS.BY_ID(id), data),
  delete: (id) => apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id)),
};

// Categories & SubCategories API Service
export const categoryApi = {
  getAll: () => apiClient.get(API_ENDPOINTS.CATEGORIES.BASE),
  create: (data) => apiClient.post(API_ENDPOINTS.CATEGORIES.BASE, data),
  update: (id, data) => apiClient.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), data),
  delete: (id) => apiClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id)),
  addSubCategory: (parentId, data) =>
    apiClient.post(API_ENDPOINTS.CATEGORIES.SUBCATEGORIES(parentId), data),
};

// Orders API Service
export const orderApi = {
  getAll: (limit = 100) => apiClient.get(API_ENDPOINTS.ORDERS.LIST(limit)),
  getMyOrders: (email) => apiClient.get(API_ENDPOINTS.ORDERS.MY_ORDERS(email)),
  create: (orderData) => apiClient.post(API_ENDPOINTS.ORDERS.BASE, orderData),
  updateStatus: (id, statusData) =>
    apiClient.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), statusData),
};

// Authentication API Service
export const authApi = {
  login: (credentials) => apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),
};

// Uploads API Service
export const uploadApi = {
  single: (formData) =>
    apiClient.post(API_ENDPOINTS.UPLOAD.SINGLE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  multiple: (formData) =>
    apiClient.post(API_ENDPOINTS.UPLOAD.MULTIPLE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Customers & Patrons API Service
export const customerApi = {
  getAll: (query = {}) => apiClient.get(API_ENDPOINTS.CUSTOMERS.LIST, { params: query }),
  getById: (id) => apiClient.get(API_ENDPOINTS.CUSTOMERS.BY_ID(id)),
  update: (id, data) => apiClient.put(API_ENDPOINTS.CUSTOMERS.BY_ID(id), data),
};

// Coupons & Promo Codes API Service
export const couponApi = {
  getAll: (query = {}) => apiClient.get(API_ENDPOINTS.COUPONS.LIST, { params: query }),
  getById: (id) => apiClient.get(API_ENDPOINTS.COUPONS.BY_ID(id)),
  create: (data) => apiClient.post(API_ENDPOINTS.COUPONS.BASE, data),
  delete: (id) => apiClient.delete(API_ENDPOINTS.COUPONS.BY_ID(id)),
  validate: (code, orderAmount) =>
    apiClient.post(API_ENDPOINTS.COUPONS.VALIDATE, { code, orderAmount }),
};

// Patron Reviews & Ratings API Service
export const reviewApi = {
  getAll: (query = {}) => apiClient.get(API_ENDPOINTS.REVIEWS.BASE, { params: query }),
  getByProduct: (productId) => apiClient.get(API_ENDPOINTS.REVIEWS.BY_PRODUCT(productId)),
  checkEligibility: (productId, email) =>
    apiClient.get(API_ENDPOINTS.REVIEWS.ELIGIBILITY(productId, email)),
  create: (data) => apiClient.post(API_ENDPOINTS.REVIEWS.BASE, data),
  updateStatus: (id, status) =>
    apiClient.put(API_ENDPOINTS.REVIEWS.UPDATE_STATUS(id), { status }),
  delete: (id) => apiClient.delete(API_ENDPOINTS.REVIEWS.BY_ID(id)),
};

// Stock Control & Real-Time Inventory API Service
export const inventoryApi = {
  getAll: (query = {}) => apiClient.get(API_ENDPOINTS.INVENTORY.BASE, { params: query }),
  getSummary: () => apiClient.get(API_ENDPOINTS.INVENTORY.SUMMARY),
  adjustStock: (sku, data) => apiClient.put(API_ENDPOINTS.INVENTORY.ADJUST(sku), data),
};

// Customer Wishlist API Service
export const wishlistApi = {
  get: (email) => apiClient.get(API_ENDPOINTS.WISHLIST.GET(email)),
  sync: (userEmail, guestProducts) =>
    apiClient.post(API_ENDPOINTS.WISHLIST.SYNC, { userEmail, guestProducts, products: guestProducts }),
  replace: (userEmail, products) =>
    apiClient.put(API_ENDPOINTS.WISHLIST.BASE, { userEmail, products }),
  toggle: (userEmail, product) =>
    apiClient.post(API_ENDPOINTS.WISHLIST.TOGGLE, { userEmail, product }),
  remove: (productId, email) =>
    apiClient.delete(API_ENDPOINTS.WISHLIST.REMOVE(productId, email)),
  clear: (email) => apiClient.delete(API_ENDPOINTS.WISHLIST.CLEAR(email)),
};

export default {
  API_ENDPOINTS,
  productApi,
  categoryApi,
  orderApi,
  authApi,
  uploadApi,
  customerApi,
  couponApi,
  reviewApi,
  inventoryApi,
  wishlistApi,
};
