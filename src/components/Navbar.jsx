import React, { useState, useEffect, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { apiClient, API_ENDPOINTS } from '../config';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([
    { name: 'Stitched Suits', slug: 'stitched-suits' },
    { name: 'Unstitched Suits', slug: 'unstitched-suits' },
    { name: 'Sarees', slug: 'sarees' },
  ]);
  const { totalItemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch live categories from backend API
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = useMemo(() => {
    const categoryLinks = categories.map((cat) => ({
      label: cat.name,
      path: `/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`,
    }));

    return [
      { label: 'Home', path: '/' },
      ...categoryLinks,
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' },
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
          <Link to="/" className="flex items-center group py-1" aria-label="SAISAA Home">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-[#D4AF37]/80 shadow-[0_0_14px_rgba(212,175,55,0.4)] transition-transform duration-300 group-hover:scale-105">
              <img
                src="/saisaa-logo.jpg"
                alt="Saisaa"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-xs xl:text-sm tracking-wider uppercase transition-all duration-200 py-1 ${
                    isActive
                      ? 'text-[#F7E7BE] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D4AF37]'
                      : 'text-stone-300 hover:text-[#F7E7BE]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
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
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base uppercase tracking-widest py-2.5 border-b border-white/5 transition-colors ${
                    isActive ? 'text-[#F7E7BE] font-bold' : 'text-stone-300 hover:text-[#F7E7BE]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-base uppercase tracking-widest py-2.5 border-b border-white/5 transition-colors flex items-center justify-between ${
                      isActive ? 'text-[#F7E7BE] font-bold' : 'text-stone-300 hover:text-[#F7E7BE]'
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
