import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  ArrowUpRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { apiClient, API_ENDPOINTS } from '../config';

const DEFAULT_HEADER_CATEGORIES = [
  {
    name: 'Stitched Suits',
    slug: 'stitched-suits',
    subCategories: ['3 pcs set', '2 pcs set', 'long kurtis', 'Short kurtis'],
  },
  {
    name: 'Unstitched Suits',
    slug: 'unstitched-suits',
    subCategories: [
      'Jamdani',
      'Banarasi silk',
      'Kanjivaram silk',
      'Pure cotton',
      'Muslin silk',
      'Linen fabric',
    ],
  },
  {
    name: 'Sarees',
    slug: 'sarees',
    subCategories: [
      'Cotton sarees',
      'Chiffon sarees',
      'Silk sarees',
      'Kota sarees',
    ],
  },
];

const normalizeSubCategories = (rawSubs) => {
  if (!Array.isArray(rawSubs)) return [];
  const seen = new Set();
  const result = [];
  for (const item of rawSubs) {
    if (typeof item === 'string') {
      const name = item.trim();
      if (name && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        result.push({ name });
      }
    } else if (item && typeof item === 'object') {
      const name = (item.name || '').trim();
      const isInactive = (item.status || 'Active').toLowerCase() === 'inactive';
      if (name && !isInactive && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        result.push({ name, image: item.image || '' });
      }
    }
  }
  return result;
};

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdownPath, setOpenDropdownPath] = useState(null);
  const [mobileExpandedPath, setMobileExpandedPath] = useState(null);
  const [categories, setCategories] = useState(DEFAULT_HEADER_CATEGORIES);
  const closeTimerRef = useRef(null);

  const { totalItemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const activeSubCategoryParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('subCategory') || '').trim().toLowerCase();
  }, [location.search]);

  // Fetch live categories & subcategories from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchHeaderCategories = async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.CATEGORIES.BASE);
        const data = res?.data || res;
        if (Array.isArray(data) && data.length > 0 && isMounted) {
          const active = data.filter(
            (c) => (c.status || 'Active').toLowerCase() === 'active'
          );
          if (active.length > 0) {
            setCategories(active);
          }
        }
      } catch (err) {
        console.warn('Navbar categories API fetch error:', err.message);
      }
    };

    fetchHeaderCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close open dropdown on Escape key or cleanup hover timer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdownPath(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleOpenDropdown = (path) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdownPath(path);
  };

  const handleScheduleCloseDropdown = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdownPath(null);
    }, 150);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = useMemo(() => {
    const categoryLinks = categories.map((cat) => {
      const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
      return {
        label: cat.name,
        path: `/${slug}`,
        subCategories: normalizeSubCategories(cat.subCategories),
      };
    });

    return [
      { label: 'Home', path: '/', subCategories: [] },
      ...categoryLinks,
      { label: 'About', path: '/about', subCategories: [] },
      { label: 'Contact', path: '/contact', subCategories: [] },
    ];
  }, [categories]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A291E] text-stone-100 border-b border-[#D4AF37]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Mobile Menu & Search Icon */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#E8D49E] hover:text-white rounded-lg focus:outline-none transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#E8D49E] hover:text-white rounded-lg transition-colors ml-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Laurel Logo */}
          <Link to="/" className="flex items-center gap-3 group py-1" aria-label="SAISAA Home">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-[#D4AF37]/80 shadow-[0_0_14px_rgba(212,175,55,0.4)] transition-transform duration-300 group-hover:scale-105 shrink-0">
              <img
                src="/saisaa-logo.jpg"
                alt="Saisaa"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span
                className="text-2xl sm:text-3xl font-bold tracking-normal text-[#F7E7BE] leading-none group-hover:text-white transition-colors"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Saisaa
              </span>
              <span
                className="text-[9px] sm:text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-semibold mt-1"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
               
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Luxury Sub-Category Dropdowns */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => {
              const hasSubs = link.subCategories && link.subCategories.length > 0;
              const isOpen = openDropdownPath === link.path;

              return (
                <div
                  key={link.path}
                  className="relative py-2"
                  onMouseEnter={() => hasSubs && handleOpenDropdown(link.path)}
                  onMouseLeave={() => hasSubs && handleScheduleCloseDropdown()}
                >
                  <NavLink
                    to={link.path}
                    onClick={() => setOpenDropdownPath(null)}
                    onFocus={() => hasSubs && handleOpenDropdown(link.path)}
                    aria-expanded={hasSubs ? isOpen : undefined}
                    aria-haspopup={hasSubs ? 'true' : undefined}
                    className={({ isActive }) =>
                      `relative inline-flex items-center gap-1.5 text-xs xl:text-sm tracking-wider uppercase transition-all duration-200 py-1 ${
                        isActive
                          ? 'text-[#F7E7BE] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D4AF37]'
                          : 'text-stone-300 hover:text-[#F7E7BE]'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    {hasSubs && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#D4AF37]' : 'text-[#D4AF37]/80'
                        }`}
                      />
                    )}
                  </NavLink>

                  {/* Sub-Categories Dropdown Panel */}
                  {hasSubs && isOpen && (
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 ${
                        link.subCategories.length >= 4 ? 'w-[410px]' : 'w-64'
                      }`}
                      role="menu"
                      aria-label={`${link.label} subcategories`}
                    >
                      <div className="bg-[#071F17]/98 backdrop-blur-md border border-[#D4AF37]/35 border-t-2 border-t-[#D4AF37] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.55)] overflow-hidden">
                        {/* Dropdown Header */}
                        <div className="px-5 py-3 bg-[#0A291E]/90 border-b border-[#D4AF37]/20 flex items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                            Explore {link.label}
                          </span>
                          <Link
                            to={link.path}
                            onClick={() => setOpenDropdownPath(null)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#F7E7BE] hover:text-white transition-colors"
                          >
                            <span>View All</span>
                            <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
                          </Link>
                        </div>

                        {/* Sub-Categories Grid */}
                        <div
                          className={`p-3 grid ${
                            link.subCategories.length >= 4
                              ? 'grid-cols-2 gap-1.5'
                              : 'grid-cols-1 gap-1'
                          }`}
                        >
                          {link.subCategories.map((sub) => {
                            const isSubActive =
                              location.pathname === link.path &&
                              activeSubCategoryParam === sub.name.toLowerCase();

                            return (
                              <Link
                                key={sub.name}
                                to={`${link.path}?subCategory=${encodeURIComponent(sub.name)}`}
                                role="menuitem"
                                onClick={() => setOpenDropdownPath(null)}
                                className={`group/sub flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 ${
                                  isSubActive
                                    ? 'bg-[#D4AF37]/15 text-[#F7E7BE] font-semibold border border-[#D4AF37]/40'
                                    : 'text-stone-200 hover:bg-white/5 hover:text-[#F7E7BE] border border-transparent'
                                }`}
                              >
                                <span className="flex items-center gap-2.5 truncate">
                                  <span
                                    className={`w-1.5 h-1.5 rotate-45 shrink-0 transition-colors ${
                                      isSubActive
                                        ? 'bg-[#D4AF37]'
                                        : 'bg-[#D4AF37]/45 group-hover/sub:bg-[#D4AF37]'
                                    }`}
                                  />
                                  <span className="capitalize truncate">{sub.name}</span>
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37] opacity-0 -translate-x-1 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all shrink-0" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Utility Action Icons: Search, Wishlist, Bag */}
          <div className="flex items-center space-x-4 sm:space-x-5 text-stone-300">
            {/* Search Icon (Desktop only, mobile has it on the left) */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden lg:flex p-1.5 hover:text-[#F7E7BE] transition-colors rounded-full hover:bg-white/5"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-1.5 hover:text-[#F7E7BE] transition-colors rounded-full hover:bg-white/5"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-0 right-0 bg-[#D4AF37] text-[#09231A] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Profile / Account Icon */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="relative p-1.5 hover:text-[#F7E7BE] transition-colors rounded-full hover:bg-white/5 group"
              aria-label={isAuthenticated ? 'My Account' : 'Sign In'}
              title={isAuthenticated ? `Account (${user?.name || 'Patron'})` : 'Sign In / Register'}
            >
              <User className="w-5 h-5" />
              {isAuthenticated && (
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#071F17]" />
              )}
            </Link>

            {/* Cart / Bag Icon */}
            <Link
              to="/cart"
              className="relative p-1.5 hover:text-[#F7E7BE] transition-colors rounded-full hover:bg-white/5"
              aria-label="Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute 0 top-0 right-0 bg-[#D4AF37] text-[#09231A] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {totalItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Search Input Dropdown */}
      {searchOpen && (
        <div className="bg-[#051711] border-t border-b border-[#D4AF37]/30 px-4 py-3 transition-all animate-in fade-in duration-200">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suits, kurtis, sarees..."
                className="w-full bg-[#0B2B20] text-stone-100 placeholder-stone-400 pl-10 pr-4 py-2 rounded-lg border border-[#D4AF37]/40 focus:outline-none focus:border-[#D4AF37] text-sm"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-[#D4AF37] text-[#09231A] px-4 py-2 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-[#F7E7BE] transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-stone-400 hover:text-white p-1.5"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071F17] border-b border-[#D4AF37]/25 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const hasSubs = link.subCategories && link.subCategories.length > 0;
              const isExpanded = mobileExpandedPath === link.path;

              return (
                <div key={link.path} className="border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <NavLink
                      to={link.path}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileExpandedPath(null);
                      }}
                      className={({ isActive }) =>
                        `flex-1 text-base uppercase tracking-widest py-2.5 transition-colors ${
                          isActive
                            ? 'text-[#F7E7BE] font-bold'
                            : 'text-stone-300 hover:text-[#F7E7BE]'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>

                    {hasSubs && (
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpandedPath((prev) =>
                            prev === link.path ? null : link.path
                          )
                        }
                        aria-expanded={isExpanded}
                        aria-label={`Toggle ${link.label} subcategories`}
                        className="p-2 text-[#D4AF37] hover:text-[#F7E7BE] transition-colors"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {hasSubs && isExpanded && (
                    <div className="pl-4 pb-3 pt-1 ml-1 border-l border-[#D4AF37]/30 flex flex-col space-y-1.5">
                      <Link
                        to={link.path}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileExpandedPath(null);
                        }}
                        className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold py-1.5"
                      >
                        All {link.label} &rarr;
                      </Link>
                      {link.subCategories.map((sub) => {
                        const isSubActive =
                          location.pathname === link.path &&
                          activeSubCategoryParam === sub.name.toLowerCase();

                        return (
                          <Link
                            key={sub.name}
                            to={`${link.path}?subCategory=${encodeURIComponent(sub.name)}`}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileExpandedPath(null);
                            }}
                            className={`flex items-center gap-2 text-sm capitalize py-1.5 transition-colors ${
                              isSubActive
                                ? 'text-[#F7E7BE] font-semibold'
                                : 'text-stone-300 hover:text-[#F7E7BE]'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/70 shrink-0" />
                            <span>{sub.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-base uppercase tracking-widest py-2.5 border-b border-white/5 transition-colors flex items-center justify-between ${isActive ? 'text-[#F7E7BE] font-bold' : 'text-stone-300 hover:text-[#F7E7BE]'
                    }`
                  }
                >
                  <div className="flex flex-col">
                    <span>My Account</span>
                    <span className="text-[10px] tracking-normal text-stone-400 capitalize -mt-0.5">
                      {user?.name || 'Patron'}
                    </span>
                  </div>
                  <User className="w-4 h-4 text-[#D4AF37]" />
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="text-left text-xs uppercase tracking-widest py-2 text-rose-300 hover:text-rose-200 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs uppercase tracking-wider font-semibold bg-[#D4AF37] text-[#09231A] rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-xs uppercase tracking-wider font-semibold border border-white/20 text-[#FAF7F2] rounded-xl hover:bg-white/5"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
