import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ExternalLink,
  CheckCheck,
  ChevronDown,
  ShieldCheck,
  ShoppingBag,
  Package,
  RotateCcw,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminTopbar = ({ onToggleSidebar }) => {
  const { adminUser, notifications, markAllNotificationsAsRead, logout } = useAdmin();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/admin/products?search=${encodeURIComponent(globalSearch.trim())}`);
      setGlobalSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* 1. Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors lg:hidden focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Quick Search Bar */}
        <form onSubmit={handleGlobalSearch} className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search orders, products, or customers..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:outline-none focus:border-[#0A261C] focus:ring-1 focus:ring-[#0A261C] text-stone-800 placeholder-stone-400 transition-all shadow-2xs"
          />
        </form>
      </div>

      {/* 2. Right: Store Link, Notifications, Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick View Live Store Link */}
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-[#0A261C] hover:border-[#0A261C]/30 text-xs font-semibold bg-white shadow-2xs transition-all"
        >
          <span>Live Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#D4AF37] text-[#0A261C] font-bold text-[10px] flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 py-3 z-50 animate-scale-up">
              <div className="flex items-center justify-between px-4 pb-2.5 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-sm font-bold text-stone-900">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-[#0A261C] hover:underline font-semibold flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-stone-50">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 hover:bg-stone-50 transition-colors flex items-start gap-3 ${
                      !notif.read ? 'bg-[#FAF7F2]/60' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${
                        notif.type === 'order'
                          ? 'bg-[#0A261C]'
                          : notif.type === 'inventory'
                          ? 'bg-amber-600'
                          : notif.type === 'return'
                          ? 'bg-rose-600'
                          : 'bg-blue-600'
                      }`}
                    >
                      {notif.type === 'order' && <ShoppingBag className="w-4 h-4" />}
                      {notif.type === 'inventory' && <Package className="w-4 h-4" />}
                      {notif.type === 'return' && <RotateCcw className="w-4 h-4" />}
                      {notif.type === 'review' && <User className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-xs font-bold text-stone-800 leading-snug">
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-stone-400 block pt-0.5">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 border-t border-stone-100 text-center">
                <Link
                  to="/admin/orders"
                  onClick={() => setNotifDropdownOpen(false)}
                  className="text-xs text-[#0A261C] font-semibold hover:underline"
                >
                  View All Activity &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-stone-100 transition-colors focus:outline-none"
            aria-label="Admin Profile Menu"
          >
            <div className="w-9 h-9 rounded-full bg-[#0A261C] text-[#F7E7BE] border border-[#D4AF37]/50 flex items-center justify-center font-bold text-xs shadow-2xs">
              SA
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-stone-900 leading-tight">
                {adminUser.name}
              </span>
              <span className="text-[10px] text-stone-500 font-medium leading-none">
                {adminUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-scale-up">
              <div className="px-4 py-2.5 border-b border-stone-100">
                <p className="text-xs font-bold text-stone-900">{adminUser.name}</p>
                <p className="text-[11px] text-stone-500 truncate">{adminUser.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {adminUser.role}
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/admin/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors font-medium"
                >
                  <User className="w-4 h-4 text-stone-400" />
                  <span>Admin Profile</span>
                </Link>

                <Link
                  to="/admin/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors font-medium"
                >
                  <Settings className="w-4 h-4 text-stone-400" />
                  <span>Store Settings</span>
                </Link>

                <Link
                  to="/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4 text-stone-400" />
                  <span>Customer Storefront</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-stone-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
