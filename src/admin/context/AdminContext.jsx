import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, API_ENDPOINTS } from '../../config';
import {
  INITIAL_ADMIN_USER,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_COUPONS,
  INITIAL_INVENTORY,
  INITIAL_REVIEWS,
  INITIAL_RETURNS,
  INITIAL_PAYMENTS,
  INITIAL_ANALYTICS,
  INITIAL_INQUIRIES,
} from '../data/mockData';

const normalizeCategory = (cat) => ({
  ...cat,
  id: cat.id || cat._id,
  createdDate:
    cat.createdDate ||
    (cat.createdAt
      ? new Date(cat.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'Active'),
  subCategories: Array.isArray(cat.subCategories) ? cat.subCategories : [],
});

const normalizeProduct = (p) => {
  const pid = p.customId || p.id || (p._id ? p._id.toString() : '');
  const stockVal = p.stock !== undefined ? Number(p.stock) : 15;
  const priceVal = Number(p.price) || 0;
  const origPriceVal = p.originalPrice ? Number(p.originalPrice) : null;
  const calculatedDiscount =
    p.discount ||
    (origPriceVal && origPriceVal > priceVal
      ? Math.round(((origPriceVal - priceVal) / origPriceVal) * 100)
      : 0);

  return {
    ...p,
    id: pid,
    _id: p._id || pid,
    name: p.name || 'Artisanal Piece',
    category: p.category || 'suits',
    subCategory:
      typeof p.subCategory === 'object' && p.subCategory !== null
        ? p.subCategory.name || ''
        : p.subCategory || '',
    sku: p.sku || `SAI-${(p.category || 'IT').slice(0, 2).toUpperCase()}-${pid.slice(-4)}`,
    price: priceVal,
    originalPrice: origPriceVal,
    discount: calculatedDiscount,
    stock: stockVal,
    lowStockThreshold: p.lowStockThreshold || 5,
    status: p.status || (stockVal > 0 ? 'Active' : 'Out of Stock'),
    isFeatured: Boolean(p.isFeatured),
    isBestSeller: Boolean(p.isBestSeller),
    isNewArrival: Boolean(p.isNewArrival),
    rating: Number(p.rating) || 4.8,
    reviewCount: Number(p.reviewCount) || 0,
    unitsSold: p.unitsSold || 0,
    revenue: p.revenue || priceVal * (p.unitsSold || 0),
    fabric: p.fabric || 'Pure Silk',
    color: p.color || '',
    colorHex: p.colorHex || '#D4AF37',
    work: p.work || 'Handcrafted Karigari',
    care: p.care || 'Dry clean recommended.',
    sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['XS', 'S', 'M', 'L', 'XL'],
    sizeVariants: Array.isArray(p.sizeVariants) ? p.sizeVariants : [],
    images:
      Array.isArray(p.images) && p.images.length > 0
        ? p.images
        : [p.cardImage || '/images/05_shop_product_card_1.jpg'],
    cardImage:
      p.cardImage ||
      p.coverImage ||
      (Array.isArray(p.images) && p.images[0]) ||
      '/images/05_shop_product_card_1.jpg',
    coverImage:
      p.coverImage ||
      p.cardImage ||
      (Array.isArray(p.images) && p.images[0]) ||
      '/images/05_shop_product_card_1.jpg',
    description: p.description || '',
    features: Array.isArray(p.features) ? p.features : [],
    created:
      p.created ||
      (p.createdAt
        ? new Date(p.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : 'Today'),
  };
};

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  // Simulated Authentication State (persists across reloads via localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const stored = localStorage.getItem('saisaa_admin_logged_in');
      return stored !== null ? stored === 'true' : true; // default true for immediate developer preview
    } catch {
      return true;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('saisaa_admin_user');
      return stored ? JSON.parse(stored) : INITIAL_ADMIN_USER;
    } catch {
      return INITIAL_ADMIN_USER;
    }
  });

  // Reactive Domain Datasets
  const [products, setProducts] = useState(() => INITIAL_PRODUCTS.map(normalizeProduct));
  const [categories, setCategories] = useState(() => INITIAL_CATEGORIES.map(normalizeCategory));
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Fetch live products from NestJS Backend
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const res = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST(100));
      const items = res?.data?.items || res?.data;
      if (Array.isArray(items) && items.length > 0) {
        const normalized = items.map(normalizeProduct);
        setProducts(normalized);
        // Synchronize inventory state with live product items
        setInventory(
          normalized.map((p) => ({
            id: `inv-${p.id}`,
            productId: p.id,
            name: p.name,
            sku: p.sku,
            category: p.category,
            currentStock: Number(p.stock) || 0,
            reserved: 0,
            available: Number(p.stock) || 0,
            threshold: Number(p.lowStockThreshold) || 5,
            status:
              Number(p.stock) > 5
                ? 'In Stock'
                : Number(p.stock) > 0
                ? 'Low Stock'
                : 'Out of Stock',
          }))
        );
      }
    } catch (err) {
      console.warn('Backend products fetch failed, using fallback state:', err.message);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Fetch live categories from NestJS Backend
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      const res = await apiClient.get(API_ENDPOINTS.CATEGORIES.BASE);
      if (res && res.data && Array.isArray(res.data)) {
        setCategories(res.data.map(normalizeCategory));
      }
    } catch (err) {
      console.warn('Backend categories fetch failed, using fallback state:', err.message);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Fetch live orders from NestJS Backend
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoadingOrders(true);
      const res = await apiClient.get(API_ENDPOINTS.ORDERS.LIST(100));
      const items = res?.data?.items || res?.data;
      if (Array.isArray(items) && items.length > 0) {
        setOrders(items);
      }
    } catch (err) {
      console.warn('Backend orders fetch failed, using fallback state:', err.message);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  // Fetch live customers from NestJS Backend
  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoadingCustomers(true);
      const res = await apiClient.get(API_ENDPOINTS.CUSTOMERS.LIST);
      const items = res?.data || res;
      if (Array.isArray(items) && items.length > 0) {
        setCustomers(items);
      }
    } catch (err) {
      console.warn('Backend customers fetch failed, using fallback state:', err.message);
    } finally {
      setIsLoadingCustomers(false);
    }
  }, []);

  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  // Fetch live coupons from NestJS Backend
  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoadingCoupons(true);
      const res = await apiClient.get(API_ENDPOINTS.COUPONS.LIST);
      const items = res?.data || res;
      if (Array.isArray(items) && items.length > 0) {
        setCoupons(items);
      }
    } catch (err) {
      console.warn('Backend coupons fetch failed, using fallback state:', err.message);
    } finally {
      setIsLoadingCoupons(false);
    }
  }, []);

  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Fetch live reviews from NestJS Backend
  const fetchReviews = useCallback(async () => {
    try {
      setIsLoadingReviews(true);
      const res = await apiClient.get(API_ENDPOINTS.REVIEWS.BASE);
      const items = res?.data || res;
      if (Array.isArray(items) && items.length > 0) {
        setReviews(items);
      }
    } catch (err) {
      console.warn('Backend reviews fetch failed, using fallback state:', err.message);
    } finally {
      setIsLoadingReviews(false);
    }
  }, []);

  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  // Fetch live inventory directory from NestJS Backend
  const fetchInventory = useCallback(async () => {
    try {
      setIsLoadingInventory(true);
      const res = await apiClient.get(API_ENDPOINTS.INVENTORY.BASE);
      const items = res?.data || res;
      if (Array.isArray(items) && items.length > 0) {
        setInventory(items);
      }
    } catch (err) {
      console.warn('Backend inventory fetch failed, using fallback state:', err.message);
    } finally {
      setIsLoadingInventory(false);
    }
  }, []);

  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);

  // Fetch live inquiries from NestJS Backend
  const fetchInquiries = useCallback(async () => {
    try {
      setIsLoadingInquiries(true);
      const res = await apiClient.get(API_ENDPOINTS.INQUIRIES.BASE);
      const items = res?.data || res;
      if (Array.isArray(items)) {
        setInquiries(
          items.map((item) => ({
            ...item,
            id: item.id || item._id,
          }))
        );
      }
    } catch (err) {
      console.warn('Backend inquiries fetch failed, using fallback state:', err.message);
    } finally {
      setIsLoadingInquiries(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchOrders();
    fetchCustomers();
    fetchCoupons();
    fetchReviews();
    fetchInventory();
    fetchInquiries();
  }, [
    fetchCategories,
    fetchProducts,
    fetchOrders,
    fetchCustomers,
    fetchCoupons,
    fetchReviews,
    fetchInventory,
    fetchInquiries,
  ]);

  const updateCustomer = async (id, updatedFields) => {
    try {
      const res = await apiClient.put(API_ENDPOINTS.CUSTOMERS.BY_ID(id), updatedFields);
      const updated = res?.data || updatedFields;
      setCustomers((prev) =>
        prev.map((c) => (c.id === id || c._id === id ? { ...c, ...updated } : c))
      );
      showAdminToast('Patron profile updated successfully', 'success');
      return updated;
    } catch (err) {
      showAdminToast(err.message || 'Failed to update patron', 'error');
      throw err;
    }
  };

  const [returns, setReturns] = useState(INITIAL_RETURNS);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [analytics] = useState(INITIAL_ANALYTICS);

  // Administrative Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'High Value Order Received',
      message: 'Meera Singhania placed Order #SAI12567 (₹22,013)',
      time: '12m ago',
      read: false,
      type: 'order',
    },
    {
      id: 'notif-2',
      title: 'Low Stock Alert',
      message: 'Royal Tissue Metallic Saree has only 3 units remaining.',
      time: '45m ago',
      read: false,
      type: 'inventory',
    },
    {
      id: 'notif-3',
      title: 'New Return Request',
      message: 'Return #RET-108 requested by Sunita Mehra for Order #SAI12540',
      time: '2h ago',
      read: false,
      type: 'return',
    },
    {
      id: 'notif-4',
      title: 'New Review Submitted',
      message: 'Simran Jolly submitted a 2-star review on Royal Tissue Saree',
      time: '1d ago',
      read: true,
      type: 'review',
    },
  ]);

  // Admin In-App Toast Stack
  const [adminToasts, setAdminToasts] = useState([]);

  const showAdminToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setAdminToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAdminToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeAdminToast = (id) => {
    setAdminToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Operations
  const login = (_email, _password) => {
    // Static simulation: accepts any valid formatted credentials or mock default
    setIsAuthenticated(true);
    localStorage.setItem('saisaa_admin_logged_in', 'true');
    showAdminToast('Welcome back, Royal Administrator!', 'success');
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('saisaa_admin_logged_in', 'false');
    showAdminToast('You have logged out of SAISAA Admin', 'info');
  };

  const updateAdminProfile = (updated) => {
    const nextUser = { ...adminUser, ...updated };
    setAdminUser(nextUser);
    localStorage.setItem('saisaa_admin_user', JSON.stringify(nextUser));
    showAdminToast('Admin profile updated successfully', 'success');
  };

  // Notification Operations
  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showAdminToast('All notifications marked as read', 'info');
  };

  // Product CRUD
  const addProduct = async (newProduct) => {
    try {
      const res = await apiClient.post(API_ENDPOINTS.PRODUCTS.BASE, newProduct);
      const saved = normalizeProduct(res?.data || newProduct);
      setProducts((prev) => [saved, ...prev]);

      // Also add to inventory tracker
      setInventory((prev) => [
        {
          id: `inv-${Date.now()}`,
          productId: saved.id,
          name: saved.name,
          sku: saved.sku,
          category: saved.category,
          currentStock: Number(saved.stock) || 0,
          reserved: 0,
          available: Number(saved.stock) || 0,
          threshold: Number(saved.lowStockThreshold) || 5,
          status:
            Number(saved.stock) > 5
              ? 'In Stock'
              : Number(saved.stock) > 0
              ? 'Low Stock'
              : 'Out of Stock',
        },
        ...prev,
      ]);

      showAdminToast(`Product "${saved.name}" created successfully!`, 'success');
      return saved;
    } catch (err) {
      showAdminToast(err.message || 'Failed to create product', 'error');
      throw err;
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const res = await apiClient.put(API_ENDPOINTS.PRODUCTS.BY_ID(id), updatedFields);
      const updated = res?.data ? normalizeProduct(res.data) : null;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedFields, ...(updated || {}) } : p))
      );
      if (updatedFields.stock !== undefined) {
        setInventory((prev) =>
          prev.map((inv) =>
            inv.productId === id
              ? {
                  ...inv,
                  currentStock: Number(updatedFields.stock),
                  available: Number(updatedFields.stock),
                  status:
                    Number(updatedFields.stock) > (inv.threshold || 5)
                      ? 'In Stock'
                      : Number(updatedFields.stock) > 0
                      ? 'Low Stock'
                      : 'Out of Stock',
                }
              : inv
          )
        );
      }
      showAdminToast('Product specifications updated successfully', 'success');
    } catch (err) {
      showAdminToast(err.message || 'Failed to update product', 'error');
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setInventory((prev) => prev.filter((inv) => inv.productId !== id));
      showAdminToast('Product deleted successfully', 'info');
    } catch (err) {
      showAdminToast(err.message || 'Failed to delete product', 'error');
      throw err;
    }
  };

  // Category CRUD
  const addCategory = async (cat) => {
    try {
      const res = await apiClient.post(API_ENDPOINTS.CATEGORIES.BASE, cat);
      const created = normalizeCategory(res?.data || cat);
      setCategories((prev) => [created, ...prev]);
      showAdminToast(`Category "${cat.name}" added successfully`, 'success');
      return created;
    } catch (err) {
      showAdminToast(err.message || 'Failed to create category', 'error');
      throw err;
    }
  };

  const updateCategory = async (id, cat) => {
    try {
      const res = await apiClient.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), cat);
      const updated = res?.data ? normalizeCategory(res.data) : null;
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...cat, ...(updated || {}) } : c))
      );
      showAdminToast('Category updated successfully', 'success');
    } catch (err) {
      showAdminToast(err.message || 'Failed to update category', 'error');
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await apiClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showAdminToast('Category deleted successfully', 'info');
    } catch (err) {
      showAdminToast(err.message || 'Failed to delete category', 'error');
      throw err;
    }
  };

  const addSubCategory = async (parentCategoryName, newSubCategoryData) => {
    try {
      const parent = categories.find(
        (c) =>
          c.id === parentCategoryName ||
          c.name?.toLowerCase() === parentCategoryName?.toLowerCase() ||
          c.slug?.toLowerCase() === parentCategoryName?.toLowerCase()
      );
      const identifier = parent?.id || parent?.slug || parentCategoryName;
      const payload =
        typeof newSubCategoryData === 'object'
          ? newSubCategoryData
          : { name: newSubCategoryData };

      const res = await apiClient.post(
        API_ENDPOINTS.CATEGORIES.SUBCATEGORIES(identifier),
        payload
      );
      if (res?.data) {
        const updatedParent = normalizeCategory(res.data);
        setCategories((prev) =>
          prev.map((c) => (c.id === updatedParent.id ? updatedParent : c))
        );
      } else {
        setCategories((prev) =>
          prev.map((c) => {
            if (
              c.name?.toLowerCase() === parentCategoryName?.toLowerCase() ||
              c.slug?.toLowerCase() === parentCategoryName?.toLowerCase() ||
              c.id === parentCategoryName
            ) {
              const currentSubs = c.subCategories || [];
              return { ...c, subCategories: [...currentSubs, payload] };
            }
            return c;
          })
        );
      }
      showAdminToast(`Sub-category "${payload.name}" added`, 'success');
      return payload;
    } catch (err) {
      showAdminToast(err.message || 'Failed to add subcategory', 'error');
      throw err;
    }
  };

  const updateSubCategory = async (
    oldParentCategoryName,
    oldName,
    updatedSubData,
    newParentCategoryName
  ) => {
    try {
      const targetParentName = newParentCategoryName || oldParentCategoryName;
      const isParentChanged =
        newParentCategoryName &&
        oldParentCategoryName &&
        newParentCategoryName.toLowerCase() !== oldParentCategoryName.toLowerCase();

      const oldParent = categories.find(
        (c) =>
          c.id === oldParentCategoryName ||
          c.name?.toLowerCase() === oldParentCategoryName?.toLowerCase() ||
          c.slug?.toLowerCase() === oldParentCategoryName?.toLowerCase()
      );

      const newParent = isParentChanged
        ? categories.find(
            (c) =>
              c.id === targetParentName ||
              c.name?.toLowerCase() === targetParentName?.toLowerCase() ||
              c.slug?.toLowerCase() === targetParentName?.toLowerCase()
          )
        : oldParent;

      const newSubObj =
        typeof updatedSubData === 'object'
          ? updatedSubData
          : { name: updatedSubData };

      if (isParentChanged && oldParent && newParent) {
        // 1. Remove from old parent
        const oldParentSubs = (oldParent.subCategories || []).filter((s) => {
          const sName = typeof s === 'string' ? s : s?.name;
          return sName !== oldName;
        });

        // 2. Add/update in new parent
        const newParentExisting = (newParent.subCategories || []).filter((s) => {
          const sName = typeof s === 'string' ? s : s?.name;
          return sName !== newSubObj.name;
        });
        const newParentSubs = [...newParentExisting, newSubObj];

        // Save both to backend
        const [resOld, resNew] = await Promise.all([
          apiClient.put(`/categories/${oldParent.id}`, { subCategories: oldParentSubs }),
          apiClient.put(`/categories/${newParent.id}`, { subCategories: newParentSubs }),
        ]);

        const updatedOld = resOld?.data
          ? normalizeCategory(resOld.data)
          : { ...oldParent, subCategories: oldParentSubs };
        const updatedNew = resNew?.data
          ? normalizeCategory(resNew.data)
          : { ...newParent, subCategories: newParentSubs };

        setCategories((prev) =>
          prev.map((c) => {
            if (c.id === oldParent.id) return updatedOld;
            if (c.id === newParent.id) return updatedNew;
            return c;
          })
        );
      } else if (oldParent) {
        // Same parent: update in-place
        const nextSubs = (oldParent.subCategories || []).map((s) => {
          const sName = typeof s === 'string' ? s : s?.name;
          if (sName === oldName) {
            return newSubObj;
          }
          return s;
        });
        const res = await apiClient.put(`/categories/${oldParent.id}`, {
          subCategories: nextSubs,
        });
        const updatedParent = res?.data ? normalizeCategory(res.data) : null;
        setCategories((prev) =>
          prev.map((c) => (c.id === oldParent.id ? (updatedParent || { ...c, subCategories: nextSubs }) : c))
        );
      }

      // Sync products in state
      const newName = newSubObj.name;
      setProducts((prev) =>
        prev.map((p) => {
          const matchSub = p.subCategory === oldName;
          const matchCat =
            oldParent &&
            (p.category?.toLowerCase() === oldParent.name?.toLowerCase() ||
              p.category?.toLowerCase() === oldParent.slug?.toLowerCase());

          if (matchSub && matchCat) {
            return {
              ...p,
              subCategory: newName,
              ...(isParentChanged && newParent ? { category: newParent.slug || newParent.name } : {}),
            };
          }
          return p;
        })
      );

      showAdminToast(`Sub-category "${newName}" updated successfully`, 'success');
    } catch (err) {
      showAdminToast(err.message || 'Failed to update subcategory', 'error');
    }
  };

  const deleteSubCategory = async (parentCategoryName, subCategoryNameToDelete) => {
    try {
      const parent = categories.find(
        (c) =>
          c.id === parentCategoryName ||
          c.name?.toLowerCase() === parentCategoryName?.toLowerCase() ||
          c.slug?.toLowerCase() === parentCategoryName?.toLowerCase()
      );
      const identifier = parent?.id || parent?.slug || parentCategoryName;
      const res = await apiClient.delete(
        `/categories/${identifier}/subcategories/${encodeURIComponent(subCategoryNameToDelete)}`
      );
      if (res?.data) {
        const updatedParent = normalizeCategory(res.data);
        setCategories((prev) =>
          prev.map((c) => (c.id === updatedParent.id ? updatedParent : c))
        );
      } else {
        setCategories((prev) =>
          prev.map((c) => {
            if (
              c.name?.toLowerCase() === parentCategoryName?.toLowerCase() ||
              c.slug?.toLowerCase() === parentCategoryName?.toLowerCase() ||
              c.id === parentCategoryName
            ) {
              return {
                ...c,
                subCategories: (c.subCategories || []).filter((s) => {
                  const sName = typeof s === 'string' ? s : s?.name;
                  return sName !== subCategoryNameToDelete;
                }),
              };
            }
            return c;
          })
        );
      }
      showAdminToast(`Sub-category "${subCategoryNameToDelete}" removed`, 'info');
    } catch (err) {
      showAdminToast(err.message || 'Failed to remove subcategory', 'error');
      throw err;
    }
  };

  // Order Operations
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await apiClient.put(
        API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId),
        {
          orderStatus: newStatus,
        }
      );
      const updatedOrder = res?.data;
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId || ord.orderId === orderId) {
            return updatedOrder || {
              ...ord,
              orderStatus: newStatus,
              timeline: (ord.timeline || []).map((t) =>
                t.status === newStatus ? { ...t, done: true, date: 'Just now' } : t
              ),
            };
          }
          return ord;
        })
      );
      showAdminToast(`Order #${orderId} status changed to "${newStatus}"`, 'success');
    } catch (err) {
      showAdminToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // Coupon CRUD with NestJS Backend Sync
  const addCoupon = async (coupon) => {
    try {
      const res = await apiClient.post(API_ENDPOINTS.COUPONS.BASE, coupon);
      const created = res?.data || {
        ...coupon,
        id: `cpn-${Date.now().toString().slice(-4)}`,
        usedCount: 0,
        status: 'Active',
      };
      setCoupons((prev) => [created, ...prev]);
      showAdminToast(`Promo Code "${coupon.code}" created successfully`, 'success');
      return created;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create promo code';
      showAdminToast(msg, 'error');
      throw err;
    }
  };

  const deleteCoupon = async (id) => {
    try {
      await apiClient.delete(API_ENDPOINTS.COUPONS.BY_ID(id));
      setCoupons((prev) => prev.filter((c) => c.id !== id && c._id !== id));
      showAdminToast('Coupon deleted', 'info');
    } catch (err) {
      setCoupons((prev) => prev.filter((c) => c.id !== id && c._id !== id));
      showAdminToast('Coupon removed from directory', 'info');
    }
  };

  // Inventory Adjustment with Live Backend Sync
  const updateStock = async (sku, newStock) => {
    const parsedStock = Math.max(0, Number(newStock));
    try {
      const res = await apiClient.put(API_ENDPOINTS.INVENTORY.ADJUST(sku), {
        stock: parsedStock,
      });
      const updatedItem = res?.data || res;

      setInventory((prev) =>
        prev.map((inv) =>
          inv.sku === sku || inv.productId === sku || inv.id === sku
            ? { ...inv, ...updatedItem, currentStock: parsedStock, available: parsedStock }
            : inv
        )
      );

      // Sync product catalog state as well
      setProducts((prev) =>
        prev.map((p) => {
          if (p.sku === sku || p.id === sku || p._id === sku) {
            const status =
              parsedStock === 0
                ? 'Out of Stock'
                : parsedStock <= (p.lowStockThreshold || 5)
                ? 'Low Stock'
                : 'Active';
            return { ...p, stock: parsedStock, status, inStock: parsedStock > 0 };
          }
          return p;
        })
      );

      showAdminToast(`Stock for SKU ${sku} adjusted to ${parsedStock} units`, 'success');
      return updatedItem;
    } catch (err) {
      // Fallback local update
      setInventory((prev) =>
        prev.map((inv) => {
          if (inv.sku === sku) {
            const status =
              parsedStock === 0
                ? 'Out of Stock'
                : parsedStock <= inv.threshold
                ? 'Low Stock'
                : 'In Stock';
            return {
              ...inv,
              currentStock: parsedStock,
              available: Math.max(0, parsedStock - inv.reserved),
              status,
            };
          }
          return inv;
        })
      );
      showAdminToast(`Stock for SKU ${sku} adjusted to ${parsedStock} units (local)`, 'info');
    }
  };

  // Review Operations with Backend Sync
  const updateReviewStatus = async (id, status) => {
    try {
      const res = await apiClient.put(API_ENDPOINTS.REVIEWS.UPDATE_STATUS(id), { status });
      const updated = res?.data || { status };
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id || r._id === id ? { ...r, status: updated.status || status } : r
        )
      );
      fetchProducts();
      showAdminToast(`Review marked as "${status}"`, 'info');
    } catch (err) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id || r._id === id ? { ...r, status } : r))
      );
      showAdminToast(`Review marked as "${status}" locally`, 'info');
    }
  };

  const deleteReview = async (id) => {
    try {
      await apiClient.delete(API_ENDPOINTS.REVIEWS.BY_ID(id));
      setReviews((prev) => prev.filter((r) => r.id !== id && r._id !== id));
      fetchProducts();
      showAdminToast('Review deleted', 'info');
    } catch (err) {
      setReviews((prev) => prev.filter((r) => r.id !== id && r._id !== id));
      showAdminToast('Review removed from directory', 'info');
    }
  };

  // Return Operations
  const updateReturnStatus = (id, status) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    showAdminToast(`Return #${id} updated to "${status}"`, 'success');
  };

  // Inquiry & Consultation Operations
  const updateInquiryStatus = async (id, status, notes) => {
    try {
      const payload = { status };
      if (notes !== undefined) payload.notes = notes;
      const res = await apiClient.patch(API_ENDPOINTS.INQUIRIES.UPDATE_STATUS(id), payload);
      const updated = res?.data || { status, notes };
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id || item._id === id
            ? { ...item, status: updated.status || status, notes: updated.notes ?? notes }
            : item
        )
      );
      showAdminToast(`Inquiry updated to "${status}"`, 'success');
      return updated;
    } catch (err) {
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id || item._id === id
            ? { ...item, status, ...(notes !== undefined ? { notes } : {}) }
            : item
        )
      );
      showAdminToast(err.message || `Inquiry marked as "${status}" locally`, 'info');
    }
  };

  const deleteInquiry = async (id) => {
    try {
      await apiClient.delete(API_ENDPOINTS.INQUIRIES.BY_ID(id));
      setInquiries((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      showAdminToast('Inquiry record deleted successfully', 'success');
    } catch (err) {
      setInquiries((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      showAdminToast('Inquiry removed from list', 'info');
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        login,
        logout,
        updateAdminProfile,
        notifications,
        markAllNotificationsAsRead,
        products,
        isLoadingProducts,
        refreshProducts: fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        isLoadingCategories,
        refreshCategories: fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubCategory,
        updateSubCategory,
        deleteSubCategory,
        orders,
        isLoadingOrders,
        refreshOrders: fetchOrders,
        updateOrderStatus,
        customers,
        isLoadingCustomers,
        refreshCustomers: fetchCustomers,
        updateCustomer,
        coupons,
        isLoadingCoupons,
        refreshCoupons: fetchCoupons,
        addCoupon,
        deleteCoupon,
        inventory,
        isLoadingInventory,
        refreshInventory: fetchInventory,
        updateStock,
        reviews,
        isLoadingReviews,
        refreshReviews: fetchReviews,
        updateReviewStatus,
        deleteReview,
        inquiries,
        isLoadingInquiries,
        refreshInquiries: fetchInquiries,
        updateInquiryStatus,
        deleteInquiry,
        returns,
        updateReturnStatus,
        payments,
        analytics,
        showAdminToast,
      }}
    >
      {children}

      {/* Admin Floating Toast Portal */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
        {adminToasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 bg-[#0A261C] text-white border border-[#D4AF37]/50 shadow-2xl rounded-xl p-3.5 backdrop-blur-md animate-slide-in text-xs"
            style={{
              boxShadow: '0 10px 25px rgba(10, 38, 28, 0.4), 0 0 10px rgba(212, 175, 55, 0.25)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 animate-pulse" />
              <span className="font-medium text-stone-100">{toast.message}</span>
            </div>
            <button
              onClick={() => removeAdminToast(toast.id)}
              className="text-stone-400 hover:text-white p-1"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
