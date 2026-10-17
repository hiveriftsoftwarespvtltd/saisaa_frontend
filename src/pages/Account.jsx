import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Heart,
  CreditCard,
  User,
  Bell,
  LogOut,
  Gift,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  Crown,
  Edit2,
  Trash2,
  Plus,
  X,
  ChevronRight,
  ShieldCheck,
  Eye,
  Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { PRODUCTS } from '../data/products';
import { apiClient, API_ENDPOINTS } from '../config';

export const Account = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const { user, isAuthenticated, logout, loginDemo, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');

  // Helper to derive initials dynamically
  const getInitials = (name) => {
    if (!name) return 'SP';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const isDemoPatron = (user?.email || '').toLowerCase() === 'ravinder@example.com';

  // User Profile state (hydrated from AuthContext)
  const [userProfile, setUserProfile] = useState({
    name: user?.name || user?.fullName || (isDemoPatron ? 'Ravinder Singh' : 'Valued Patron'),
    email: user?.email || (isDemoPatron ? 'ravinder@example.com' : ''),
    phone: user?.phone || (isDemoPatron ? '+91 88149 30229' : ''),
  });

  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.name || user.fullName || (isDemoPatron ? 'Ravinder Singh' : 'Valued Patron'),
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, isDemoPatron]);

  // Orders State (defaults to empty array for real users)
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Fetch customer's real orders from backend
  useEffect(() => {
    const fetchUserOrders = async () => {
      const email = user?.email || userProfile.email;
      if (!email) {
        setOrders([]);
        setIsLoadingOrders(false);
        return;
      }

      setIsLoadingOrders(true);
      try {
        const res = await apiClient.get(API_ENDPOINTS.ORDERS.MY_ORDERS(email));
        const serverOrders = res?.data;

        if (Array.isArray(serverOrders) && serverOrders.length > 0) {
          const mapped = serverOrders.map((ord) => {
            const firstItem = ord.items?.[0];
            const isDelivered = ord.orderStatus === 'Delivered';
            const isShipped = ord.orderStatus === 'Shipped';
            return {
              id: ord.orderId || ord.id,
              date: ord.date || new Date(ord.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              productName: firstItem?.name || 'Luxury Ethnic Piece',
              color: firstItem?.color || 'Artisanal Weave',
              qty: ord.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 1,
              price: ord.grandTotal || ord.amount,
              status: ord.orderStatus || 'Processing',
              statusText: isDelivered
                ? `Delivered on ${ord.date || 'Fulfillment'}`
                : isShipped
                ? 'Out for delivery'
                : `Order ${ord.orderStatus || 'Processing'}`,
              badgeColor: isDelivered
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isShipped
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-amber-50 text-amber-700 border-amber-200',
              dotColor: isDelivered
                ? 'bg-emerald-500'
                : isShipped
                ? 'bg-blue-500'
                : 'bg-amber-500',
              image: firstItem?.image || firstItem?.cardImage || '/images/05_shop_product_card_1.jpg',
              canBuyAgain: true,
              rawOrder: ord,
            };
          });
          setOrders(mapped);
        } else if (isDemoPatron) {
          // Demo fallback orders strictly for the demo patron account
          setOrders([
            {
              id: 'SAI12568',
              date: '12 Sep 2026',
              productName: 'Embroidered Unstitched Suit Set',
              color: 'Yellow',
              qty: 1,
              price: 2499,
              status: 'Delivered',
              statusText: 'Delivered on 15 Sep 2026',
              badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              dotColor: 'bg-emerald-500',
              image: '/images/05_shop_product_card_1.jpg',
              canBuyAgain: true,
            },
            {
              id: 'SAI12512',
              date: '5 Sep 2026',
              productName: 'Printed Unstitched Suit Set',
              color: 'Blue',
              qty: 1,
              price: 1899,
              status: 'Shipped',
              statusText: 'Expected by 8 Sep 2026',
              badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
              dotColor: 'bg-blue-500',
              image: '/images/06_shop_product_card_2.jpg',
              canBuyAgain: false,
            },
            {
              id: 'SAI12458',
              date: '28 Aug 2026',
              productName: 'Elegant Unstitched Suit Set',
              color: 'Pink',
              qty: 2,
              price: 4598,
              status: 'Processing',
              statusText: 'Estimated by 31 Aug 2026',
              badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
              dotColor: 'bg-amber-500',
              image: '/images/09_shop_product_card_5.jpg',
              canBuyAgain: false,
            },
          ]);
        } else {
          // Real customer with 0 orders placed yet
          setOrders([]);
        }
      } catch (err) {
        console.warn('Could not load user live orders:', err.message);
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    fetchUserOrders();
  }, [user?.email, userProfile.email, isDemoPatron]);

  // Saved Addresses (Scoped to user account)
  const [addresses, setAddresses] = useState(() => {
    const activeEmail = (user?.email || '').toLowerCase();
    if (!activeEmail) return [];
    if (activeEmail === 'ravinder@example.com') {
      return [
        {
          id: 1,
          type: 'Home',
          isDefault: true,
          name: 'Ravinder Singh',
          line1: '255/5 - 1, Karol Bagh',
          cityState: 'New Delhi, Delhi - 110005',
          phone: '+91 88149 30229',
        },
        {
          id: 2,
          type: 'Office',
          isDefault: false,
          name: 'Ravinder Singh',
          line1: 'NX One, 13th Floor, Tower 3, Office No. A-1310 & A-1312',
          cityState: 'Greater Noida West - 201306',
          phone: '+91 88149 30229',
        },
      ];
    }
    try {
      const saved = localStorage.getItem(`saisaa_addresses_${activeEmail}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Payment Methods (Scoped to user account)
  const [paymentMethods, setPaymentMethods] = useState(() => {
    const activeEmail = (user?.email || '').toLowerCase();
    if (!activeEmail) return [];
    if (activeEmail === 'ravinder@example.com') {
      return [
        {
          id: 1,
          type: 'UPI',
          details: 'ravinder@okaxis',
          isDefault: true,
        },
        {
          id: 2,
          type: 'Visa',
          details: '•••• •••• •••• 4242',
          expiry: '12/28',
          isDefault: false,
        },
      ];
    }
    try {
      const saved = localStorage.getItem(`saisaa_payments_${activeEmail}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Re-hydrate addresses and payments upon user switch
  useEffect(() => {
    const activeEmail = (user?.email || '').toLowerCase();
    if (!activeEmail) {
      setAddresses([]);
      setPaymentMethods([]);
      return;
    }
    if (activeEmail === 'ravinder@example.com') {
      setAddresses([
        {
          id: 1,
          type: 'Home',
          isDefault: true,
          name: 'Ravinder Singh',
          line1: '255/5 - 1, Karol Bagh',
          cityState: 'New Delhi, Delhi - 110005',
          phone: '+91 88149 30229',
        },
        {
          id: 2,
          type: 'Office',
          isDefault: false,
          name: 'Ravinder Singh',
          line1: 'NX One, 13th Floor, Tower 3, Office No. A-1310 & A-1312',
          cityState: 'Greater Noida West - 201306',
          phone: '+91 88149 30229',
        },
      ]);
      setPaymentMethods([
        { id: 1, type: 'UPI', details: 'ravinder@okaxis', isDefault: true },
        { id: 2, type: 'Visa', details: '•••• •••• •••• 4242', expiry: '12/28', isDefault: false },
      ]);
    } else {
      try {
        const savedAddr = localStorage.getItem(`saisaa_addresses_${activeEmail}`);
        setAddresses(savedAddr ? JSON.parse(savedAddr) : []);
      } catch {
        setAddresses([]);
      }
      try {
        const savedPay = localStorage.getItem(`saisaa_payments_${activeEmail}`);
        setPaymentMethods(savedPay ? JSON.parse(savedPay) : []);
      } catch {
        setPaymentMethods([]);
      }
    }
  }, [user?.email]);

  // Persist non-demo addresses and payment methods locally
  useEffect(() => {
    const activeEmail = (user?.email || '').toLowerCase();
    if (activeEmail && activeEmail !== 'ravinder@example.com') {
      try {
        localStorage.setItem(`saisaa_addresses_${activeEmail}`, JSON.stringify(addresses));
      } catch (e) {
        console.error(e);
      }
    }
  }, [addresses, user?.email]);

  useEffect(() => {
    const activeEmail = (user?.email || '').toLowerCase();
    if (activeEmail && activeEmail !== 'ravinder@example.com') {
      try {
        localStorage.setItem(`saisaa_payments_${activeEmail}`, JSON.stringify(paymentMethods));
      } catch (e) {
        console.error(e);
      }
    }
  }, [paymentMethods, user?.email]);

  // Tracking Modal State
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    type: 'Home',
    name: user?.name || user?.fullName || '',
    line1: '',
    cityState: '',
    phone: user?.phone || '',
  });

  // Handle Set Default Address
  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    addToast('Default address updated', 'cart');
  };

  // Handle Remove Address
  const handleRemoveAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    addToast('Address removed', 'cart');
  };

  // Handle Add Address
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.line1 || !addressForm.cityState) return;
    const newAddr = {
      id: Date.now(),
      type: addressForm.type,
      isDefault: addresses.length === 0,
      name: addressForm.name,
      line1: addressForm.line1,
      cityState: addressForm.cityState,
      phone: addressForm.phone,
    };
    setAddresses([...addresses, newAddr]);
    setShowAddressModal(false);
    setAddressForm({ type: 'Home', name: userProfile.name, line1: '', cityState: '', phone: userProfile.phone });
    addToast('New address saved', 'cart');
  };

  // Handle Reorder / Buy Again
  const handleBuyAgain = (order) => {
    const matchedProduct = PRODUCTS.find((p) => p.name.toLowerCase().includes(order.productName.toLowerCase().slice(0, 10))) || PRODUCTS[0];
    addToCart(matchedProduct, 'M', order.qty);
    navigate('/cart');
  };

  // Handle Cancel Order
  const handleCancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Cancelled',
              statusText: 'Cancelled by Patron',
              badgeColor: 'bg-red-50 text-red-700 border-red-200',
              dotColor: 'bg-red-500',
            }
          : o
      )
    );
    addToast(`Order #${orderId} has been cancelled`, 'cart');
  };

  // Wishlist preview items
  const wishlistProducts = wishlist.slice(0, 4);

  const navMenuItems = [
    { id: 'overview', label: 'Account Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: orders.length },
    { id: 'addresses', label: 'My Addresses', icon: MapPin, count: addresses.length },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart, count: wishlist.length },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard, count: paymentMethods.length },
    { id: 'details', label: 'Account Details', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: isDemoPatron ? 3 : 0 },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  if (!isAuthenticated) {
    return (
      <div className="w-full bg-[#FAF6F0] min-h-[75vh] flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#D4AF37]/30 shadow-xl p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D4AF37] shadow-md mx-auto mb-4">
            <img src="/saisaa-logo.jpg" alt="Saisaa" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
            SAISAA MAISON PRIVÉ
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1 mb-2">
            Patron Dressing Suite
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed font-light mb-6">
            Please sign in to access your handcrafted orders, saved delivery addresses, bridal wishlist, and bespoke atelier appointments.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full py-3 px-4 bg-[#09231A] hover:bg-[#0c3125] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Sign In to Privé</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="w-full py-2.5 px-4 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>Create New Account</span>
            </Link>
            <div className="pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={loginDemo}
                className="w-full py-2 px-3 text-[11px] text-[#09231A] font-semibold bg-[#F5EEDB] hover:bg-[#ede1c7] rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Explore as Demo Patron (Ravinder Singh)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen pb-16">
      {/* 1. Hero Banner matching reference screenshot */}
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
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
              My Account
            </h1>
            <p className="text-stone-600 text-sm sm:text-base font-light max-w-lg">
              Manage your orders, addresses, wishlist and account details all in one place.
            </p>
          </div>

          {/* Right: Model in mustard suit smoothly fading into cream */}
          <div className="relative flex items-center">
            <div className="relative h-28 sm:h-36 md:h-44 w-40 sm:w-56 md:w-64 rounded-2xl overflow-hidden shadow-sm">
              <img
                src="/images/01_hero_banner.jpg"
                alt="Saisaa Patron Profile"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Account Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Mobile Horizontal Navigation Pills Bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {navMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'logout') {
                    if (window.confirm('Are you sure you want to log out?')) {
                      logout();
                      navigate('/');
                    }
                  } else if (item.id === 'wishlist') {
                    navigate('/wishlist');
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#09231A] text-[#F7E7BE] shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-stone-500'}`} />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#D4AF37] text-[#09231A]' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar (Desktop / Tablet) - Sticky on Desktop */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 lg:sticky lg:top-24 self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#F5EEDB] text-[#09231A] font-serif font-bold text-base flex items-center justify-center shrink-0 border border-[#D4AF37]/50 shadow-inner">
                {getInitials(userProfile.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-stone-900 truncate">
                    {userProfile.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className="p-1 text-stone-400 hover:text-[#18523D] transition-colors"
                    title="Edit Account Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-stone-500 truncate">{userProfile.email}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden py-2 divide-y divide-stone-100">
              {navMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isLogout = item.id === 'logout';
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (isLogout) {
                        if (window.confirm('Are you sure you want to log out?')) {
                          logout();
                          navigate('/');
                        }
                      } else if (item.id === 'wishlist') {
                        navigate('/wishlist');
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-5 py-3 text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-[#F5EEDB] text-[#09231A] font-bold border-l-4 border-[#09231A]'
                        : isLogout
                        ? 'text-red-600 hover:bg-red-50/50'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-[#09231A]'
                            : isLogout
                            ? 'text-red-500'
                            : 'text-stone-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-[#09231A] text-[#F7E7BE]'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Exclusive Offers Promo Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#FAF7F2] to-[#F5EEDB] rounded-2xl border border-[#D4AF37]/35 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#09231A]">
                <div className="w-8 h-8 rounded-full bg-[#09231A] text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-xs text-stone-900 leading-tight">
                  Exclusive Offers Just for You!
                </h4>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Be the first to know about new arrivals, special offers and festive collections.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 bg-[#09231A] hover:bg-[#124231] text-[#F7E7BE] px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="lg:col-span-9 space-y-8">
            {/* TAB 1: ACCOUNT OVERVIEW (Matches Reference Screenshot) */}
            {activeTab === 'overview' && (
              <>
                {/* 1. Welcome Greeting & Stat Counters */}
                <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h2 className="font-serif text-2xl font-bold text-stone-900">
                      Welcome Back, {userProfile.name ? userProfile.name.split(' ')[0] : 'Valued Patron'}!
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 font-light">
                      Thank you for being a part of Saisaa. Discover elegance in every thread.
                    </p>
                  </div>

                  {/* 3 Metric Badges */}
                  <div className="grid grid-cols-3 gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="group hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#09231A] mx-auto flex items-center justify-center mb-1 border border-[#D4AF37]/30">
                        <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <span className="font-serif text-xl font-bold text-stone-900 block">
                        {orders.length}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
                        Total Orders
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/wishlist')}
                      className="group hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#09231A] mx-auto flex items-center justify-center mb-1 border border-[#D4AF37]/30">
                        <Heart className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <span className="font-serif text-xl font-bold text-stone-900 block">
                        {wishlist.length}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
                        Wishlist Items
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('addresses')}
                      className="group hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#09231A] mx-auto flex items-center justify-center mb-1 border border-[#D4AF37]/30">
                        <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <span className="font-serif text-xl font-bold text-stone-900 block">
                        {addresses.length}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
                        Saved Addresses
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. Promotional Mini Banner: Timeless Unstitched Suits */}
                <div className="relative overflow-hidden bg-[#F5EEDB] rounded-2xl border border-[#D4AF37]/40 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Left Content */}
                  <div className="space-y-3 z-10 text-center sm:text-left max-w-md">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                      Timeless Unstitched Suits
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      Explore our latest collection of elegant fabrics, beautiful prints and embroidery.
                    </p>
                    <div>
                      <Link
                        to="/suits"
                        className="inline-flex items-center gap-2 bg-[#E5C786] hover:bg-[#D4AF37] text-[#09231A] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95"
                      >
                        <span>Shop New Arrivals</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right Model & Watermark */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <div className="relative h-32 sm:h-40 w-44 sm:w-56 rounded-2xl overflow-hidden shadow-sm">
                      <img
                        src="/images/01_hero_banner.jpg"
                        alt="Unstitched Suits"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#F5EEDB] via-transparent to-transparent opacity-50" />
                    </div>
                    <div className="hidden sm:block absolute -right-2 bottom-2 text-right">
                      <span className="font-serif italic text-xs text-[#09231A]/70 font-semibold block">
                        More Than Fashion
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Recent Orders Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      Recent Orders
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#18523D] hover:underline"
                    >
                      View All Orders &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-8 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#09231A]">
                          <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <h4 className="font-serif text-base font-bold text-stone-900">
                          No Orders Placed Yet
                        </h4>
                        <p className="text-xs text-stone-500 max-w-sm mx-auto">
                          You haven't placed any orders yet. Discover our latest royal collections and place your first order.
                        </p>
                        <div className="pt-2">
                          <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 bg-[#09231A] hover:bg-[#154634] text-[#F7E7BE] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                          >
                            <span>Explore Collections</span>
                            <span>&rarr;</span>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                        >
                          {/* Thumbnail & Order Details */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <img
                              src={order.image}
                              alt={order.productName}
                              className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-stone-900">
                                  Order #{order.id}
                                </span>
                                <span className="text-[11px] text-stone-400">
                                  &bull; Placed on {order.date}
                                </span>
                              </div>
                              <h4 className="font-serif text-sm font-bold text-stone-900 truncate">
                                {order.productName}
                              </h4>
                              <p className="text-xs text-stone-500">
                                Color: {order.color} &bull; Qty: {order.qty}
                              </p>
                              <p className="text-sm font-bold text-[#09231A]">
                                ₹{order.price.toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>

                          {/* Status Badge & Actions */}
                          <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between md:justify-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                            {/* Status Badge */}
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border ${order.badgeColor} shrink-0`}
                            >
                              <span className={`w-2 h-2 rounded-full ${order.dotColor}`} />
                              <span className="whitespace-nowrap">{order.statusText}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <button
                                type="button"
                                onClick={() => setTrackingOrder(order)}
                                className="flex-1 sm:flex-none text-center px-3.5 py-1.5 border border-stone-300 hover:border-stone-400 text-stone-700 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                              >
                                Track Order
                              </button>

                              {order.canBuyAgain ? (
                                <button
                                  type="button"
                                  onClick={() => handleBuyAgain(order)}
                                  className="flex-1 sm:flex-none text-center px-4 py-1.5 bg-[#09231A] hover:bg-[#124231] text-[#F7E7BE] rounded-lg text-xs font-bold transition-all shadow-xs whitespace-nowrap"
                                >
                                  Buy Again
                                </button>
                              ) : order.status === 'Processing' ? (
                                <button
                                  type="button"
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="flex-1 sm:flex-none text-center px-3.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                                >
                                  Cancel Order
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setTrackingOrder(order)}
                                  className="flex-1 sm:flex-none text-center px-3.5 py-1.5 border border-stone-300 hover:border-stone-400 text-stone-700 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                                >
                                  View Details
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 4. Two-Column Row: Saved Addresses & Payment Methods */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Saved Addresses (2) */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <h4 className="font-serif text-base font-bold text-stone-900">
                        Saved Addresses ({addresses.length})
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveTab('addresses')}
                        className="text-xs font-bold text-[#18523D] hover:underline"
                      >
                        Manage Addresses &rarr;
                      </button>
                    </div>

                    <div className="space-y-3">
                      {addresses.length === 0 ? (
                        <div className="p-6 text-center border border-dashed border-stone-200 rounded-xl space-y-2">
                          <MapPin className="w-6 h-6 text-stone-300 mx-auto" />
                          <p className="text-xs text-stone-500">No delivery address saved yet</p>
                          <button
                            type="button"
                            onClick={() => {
                              setAddressForm({
                                type: 'Home',
                                name: userProfile.name,
                                line1: '',
                                cityState: '',
                                phone: userProfile.phone,
                              });
                              setShowAddressModal(true);
                            }}
                            className="text-xs font-bold text-[#09231A] hover:underline"
                          >
                            + Add New Address
                          </button>
                        </div>
                      ) : (
                        addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 space-y-2 relative"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#18523D]" />
                                <span className="font-bold text-xs text-stone-900">{addr.type}</span>
                                {addr.isDefault && (
                                  <span className="text-[10px] bg-[#E5C786]/30 text-[#09231A] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                                    Default
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-xs text-stone-600 leading-relaxed">
                              <p className="font-medium text-stone-800">{addr.name}</p>
                              <p>{addr.line1}</p>
                              <p>{addr.cityState}</p>
                              <p className="text-stone-500 pt-0.5">{addr.phone}</p>
                            </div>

                            <div className="flex items-center gap-3 pt-1 text-[11px] text-[#18523D] font-semibold">
                              {!addr.isDefault && (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="hover:underline"
                                >
                                  Set as Default
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setAddressForm(addr);
                                  setShowAddressModal(true);
                                }}
                                className="hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveAddress(addr.id)}
                                className="text-red-600 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Payment Methods (2) */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <h4 className="font-serif text-base font-bold text-stone-900">
                          Payment Methods ({paymentMethods.length})
                        </h4>
                        <button
                          type="button"
                          onClick={() => setActiveTab('payments')}
                          className="text-xs font-bold text-[#18523D] hover:underline"
                        >
                          Manage &rarr;
                        </button>
                      </div>

                      <div className="space-y-3 pt-3">
                        {paymentMethods.length === 0 ? (
                          <div className="p-6 text-center border border-dashed border-stone-200 rounded-xl space-y-1">
                            <CreditCard className="w-6 h-6 text-stone-300 mx-auto" />
                            <p className="text-xs text-stone-500">No saved payment methods</p>
                            <p className="text-[11px] text-stone-400">Cards and UPI can be safely added during checkout</p>
                          </div>
                        ) : (
                          paymentMethods.map((pm) => (
                            <div
                              key={pm.id}
                              className="p-3.5 rounded-xl border border-stone-200/80 bg-stone-50/50 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-[#09231A] font-bold text-xs shrink-0 shadow-xs">
                                  {pm.type === 'UPI' ? 'UPI' : 'VISA'}
                                </div>
                                <div className="text-xs">
                                  <span className="font-bold text-stone-900 block">{pm.type}</span>
                                  <span className="text-stone-500 text-[11px]">{pm.details}</span>
                                  {pm.expiry && (
                                    <span className="text-stone-400 text-[10px] block">
                                      Expires {pm.expiry}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {pm.isDefault && (
                                <span className="text-[10px] bg-[#E5C786]/30 text-[#09231A] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                                  Default
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToast('Payment gateway securely connected', 'cart')}
                      className="w-full py-2.5 px-4 rounded-xl border border-dashed border-stone-300 hover:border-[#09231A] text-stone-700 hover:text-[#09231A] text-xs font-bold flex items-center justify-center gap-2 transition-colors mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Payment Method</span>
                    </button>
                  </div>
                </div>

                {/* 5. "Your Wishlist" Product Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      Your Wishlist ({wishlist.length})
                    </h3>
                    {wishlist.length > 0 && (
                      <Link
                        to="/wishlist"
                        className="text-xs font-bold text-[#18523D] hover:underline"
                      >
                        View Wishlist &rarr;
                      </Link>
                    )}
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-stone-200/80 p-8 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37]">
                        <Heart className="w-5 h-5" />
                      </div>
                      <p className="font-serif text-base font-semibold text-stone-900">
                        Your Wishlist is Empty
                      </p>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        Explore our handcrafted heirloom creations and curate your personal festive trousseau.
                      </p>
                      <div className="pt-1">
                        <Link
                          to="/shop"
                          className="inline-block px-5 py-2 bg-[#09231A] text-[#F7E7BE] text-xs font-bold rounded-lg hover:bg-[#154634] transition-colors"
                        >
                          Explore Collections
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {wishlistProducts.map((p) => {
                        const prodKey = p.id || p._id || p.customId || p.sku;
                        const isFav = isInWishlist(prodKey);
                        const pImg =
                          (p.images && p.images[0]) ||
                          p.cardImage ||
                          p.image ||
                          '/images/hero-model.jpg';

                        return (
                          <div
                            key={prodKey}
                            className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col group"
                          >
                            {/* Image */}
                            <div className="relative aspect-[3/4] bg-[#FAF6F0] overflow-hidden">
                              <Link to={`/product/${prodKey}`} className="block w-full h-full">
                                <img
                                  src={pImg}
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

                            {/* Info & Add to Cart Button */}
                            <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
                              <div>
                                <Link
                                  to={`/product/${prodKey}`}
                                  className="font-serif text-xs font-semibold text-stone-900 hover:text-[#18523D] transition-colors line-clamp-1 block"
                                >
                                  {p.name}
                                </Link>
                                <p className="text-xs font-bold text-[#09231A] pt-1">
                                  ₹{Number(p.price || 0).toLocaleString('en-IN')}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  addToCart(p, (p.sizes && p.sizes[0]) || 'Standard', 1);
                                }}
                                className="w-full bg-[#E5C786] hover:bg-[#D4AF37] text-[#09231A] py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                              >
                                <span>Add to Cart</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB 2: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-stone-900">My Orders</h2>
                    <p className="text-xs text-stone-500">Track and manage all your past couture acquisitions</p>
                  </div>
                  <span className="text-xs font-bold bg-[#FAF7F2] text-[#09231A] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                    {orders.length} Total Orders
                  </span>
                </div>

                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="py-16 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#09231A]">
                        <ShoppingBag className="w-7 h-7 text-[#D4AF37]" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-stone-900">
                        No Orders in Your Account
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                        All your bespoke couture orders and tracking details will appear here once placed.
                      </p>
                      <div className="pt-2">
                        <Link
                          to="/shop"
                          className="inline-flex items-center gap-2 bg-[#09231A] hover:bg-[#154634] text-[#F7E7BE] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                        >
                          <span>Start Shopping</span>
                          <span>&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-stone-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={order.image}
                            alt={order.productName}
                            className="w-20 h-24 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-stone-900">Order #{order.id}</span>
                            <h4 className="font-serif text-base font-bold text-stone-900">{order.productName}</h4>
                            <p className="text-xs text-stone-500">Ordered on {order.date} &bull; Qty: {order.qty}</p>
                            <p className="text-sm font-bold text-[#09231A]">₹{order.price.toLocaleString('en-IN')}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2.5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border ${order.badgeColor} shrink-0`}>
                            <span className={`w-2 h-2 rounded-full ${order.dotColor}`} />
                            <span className="whitespace-nowrap">{order.statusText}</span>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => setTrackingOrder(order)}
                              className="flex-1 sm:flex-none text-center px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded-xl hover:bg-stone-50 transition-colors whitespace-nowrap"
                            >
                              Track Package
                            </button>
                            <button
                              type="button"
                              onClick={() => handleBuyAgain(order)}
                              className="flex-1 sm:flex-none text-center px-4 py-2 bg-[#09231A] text-[#F7E7BE] text-xs font-bold rounded-xl hover:bg-[#124231] transition-colors whitespace-nowrap shadow-xs"
                            >
                              Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: MY ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-stone-900">My Addresses</h2>
                    <p className="text-xs text-stone-500">Manage your shipping and delivery sanctuaries</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAddressForm({ type: 'Home', name: userProfile.name, line1: '', cityState: '', phone: userProfile.phone });
                      setShowAddressModal(true);
                    }}
                    className="flex items-center gap-1.5 bg-[#09231A] text-[#F7E7BE] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#124231] transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <MapPin className="w-8 h-8 text-stone-300 mx-auto" />
                    <p className="text-sm font-semibold text-stone-800">No Saved Delivery Addresses</p>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Add your preferred delivery address for seamless couture dispatches.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAddressForm({
                          type: 'Home',
                          name: userProfile.name,
                          line1: '',
                          cityState: '',
                          phone: userProfile.phone,
                        });
                        setShowAddressModal(true);
                      }}
                      className="px-4 py-2 bg-[#09231A] text-[#F7E7BE] rounded-xl text-xs font-bold hover:bg-[#154634] transition-colors"
                    >
                      + Add Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-stone-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#18523D]" />
                            {addr.type}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-[#E5C786]/40 text-[#09231A] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/40">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-stone-700 space-y-1">
                          <p className="font-semibold text-stone-900">{addr.name}</p>
                          <p>{addr.line1}</p>
                          <p>{addr.cityState}</p>
                          <p className="text-stone-500">{addr.phone}</p>
                        </div>

                        <div className="flex items-center gap-4 pt-2 border-t border-stone-200/60 text-xs font-semibold text-[#18523D]">
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="hover:underline"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setAddressForm(addr);
                              setShowAddressModal(true);
                            }}
                            className="hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveAddress(addr.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PAYMENT METHODS */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-stone-900">Payment Methods</h2>
                    <p className="text-xs text-stone-500">Secure 256-bit encrypted gateways on file</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToast('Payment gateway securely connected', 'cart')}
                    className="flex items-center gap-1.5 bg-[#09231A] text-[#F7E7BE] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#124231] transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Payment</span>
                  </button>
                </div>

                {paymentMethods.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <CreditCard className="w-8 h-8 text-stone-300 mx-auto" />
                    <p className="text-sm font-semibold text-stone-800">No Payment Methods Saved</p>
                    <p className="text-xs text-stone-500">
                      You can securely save cards or UPI handles during checkout.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods.map((pm) => (
                      <div
                        key={pm.id}
                        className="p-4 rounded-xl border border-stone-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <CreditCard className="w-6 h-6 text-[#18523D]" />
                          <div>
                            <span className="font-bold text-xs text-stone-900 block">{pm.type}</span>
                            <span className="text-xs text-stone-500">{pm.details}</span>
                          </div>
                        </div>
                        {pm.isDefault && (
                          <span className="text-[10px] bg-[#E5C786]/30 text-[#09231A] font-bold px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                            Primary Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: ACCOUNT DETAILS */}
            {activeTab === 'details' && (
              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <h2 className="font-serif text-2xl font-bold text-stone-900">Account Details</h2>
                  <p className="text-xs text-stone-500">Update your personal royal patron information</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (updateProfile) {
                      updateProfile({ name: userProfile.name, email: userProfile.email, phone: userProfile.phone });
                    }
                    addToast('Profile updated successfully', 'cart');
                  }}
                  className="space-y-4 max-w-xl"
                >
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      className="w-full text-xs px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#09231A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                      className="w-full text-xs px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#09231A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                      className="w-full text-xs px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#09231A]"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#09231A] hover:bg-[#124231] text-[#F7E7BE] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-md transition-all active:scale-95"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 6: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <h2 className="font-serif text-2xl font-bold text-stone-900">Notifications</h2>
                  <p className="text-xs text-stone-500">Stay informed about orders, exclusive trunk shows and releases</p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/30 flex items-start gap-3">
                    <Crown className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <h4 className="font-bold text-stone-900">Festive Autumn Zari Collection is Live!</h4>
                      <p className="text-stone-600 mt-0.5">Explore 45 new hand-woven banarasi and pure silk silhouettes.</p>
                      <span className="text-[10px] text-stone-400 mt-1 block">2 hours ago</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-start gap-3">
                    <Truck className="w-5 h-5 text-[#18523D] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <h4 className="font-bold text-stone-900">Order #SAI12512 Dispatched</h4>
                      <p className="text-stone-600 mt-0.5">Your package is en route via Express BlueDart delivery.</p>
                      <span className="text-[10px] text-stone-400 mt-1 block">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Track Package Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 border border-[#D4AF37]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Tracking Order #{trackingOrder.id}
                </h3>
                <p className="text-xs text-stone-500">{trackingOrder.productName}</p>
              </div>
              <button
                type="button"
                onClick={() => setTrackingOrder(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tracking Progress Stepper */}
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h5 className="font-bold text-stone-900">Order Placed & Confirmed</h5>
                  <p className="text-stone-500">{trackingOrder.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h5 className="font-bold text-stone-900">Handcrafted & Quality Checked</h5>
                  <p className="text-stone-500">Saisaa Atelier, New Delhi</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    trackingOrder.status === 'Processing'
                      ? 'bg-amber-400 text-white animate-pulse'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h5 className="font-bold text-stone-900">Shipped with BlueDart Express</h5>
                  <p className="text-stone-500">Waybill #BLU88291039IN</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    trackingOrder.status === 'Delivered'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h5 className="font-bold text-stone-900">Delivered to Patron Silhouette</h5>
                  <p className="text-stone-500">{trackingOrder.statusText}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTrackingOrder(null)}
              className="w-full bg-[#09231A] text-[#F7E7BE] py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#124231] transition-all"
            >
              Close Tracking Details
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-[#D4AF37]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {addressForm.id ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Address Type
                </label>
                <div className="flex gap-2">
                  {['Home', 'Office', 'Other'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAddressForm({ ...addressForm, type: t })}
                      className={`flex-1 py-2 rounded-lg border font-semibold ${
                        addressForm.type === t
                          ? 'bg-[#09231A] text-[#F7E7BE] border-[#09231A]'
                          : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                  required
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Street Address / Flat / Floor
                </label>
                <input
                  type="text"
                  value={addressForm.line1}
                  onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                  placeholder="e.g. 255/5 - 1, Karol Bagh"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                  required
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  City, State & Pincode
                </label>
                <input
                  type="text"
                  value={addressForm.cityState}
                  onChange={(e) => setAddressForm({ ...addressForm, cityState: e.target.value })}
                  placeholder="e.g. New Delhi, Delhi - 110005"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                  required
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2.5 border border-stone-300 text-stone-700 rounded-xl font-bold uppercase tracking-wider hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#09231A] text-[#F7E7BE] rounded-xl font-bold uppercase tracking-wider hover:bg-[#124231] shadow-md"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
