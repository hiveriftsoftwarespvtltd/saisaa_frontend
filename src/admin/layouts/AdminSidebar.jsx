import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Boxes,
  ShoppingCart,
  RotateCcw,
  CreditCard,
  Users,
  Star,
  MessageSquare,
  TicketPercent,
  BarChart3,
  // Settings,
  LogOut,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminSidebar = ({ mobileOpen, onCloseMobile }) => {
  const { adminUser, logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navSections = [
    {
      title: null, // Top single item
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'CATALOG',
      items: [
        { label: 'Products', path: '/admin/products', icon: Package },
        { label: 'Categories', path: '/admin/categories', icon: FolderTree },
        { label: 'Sub-Categories', path: '/admin/subcategories', icon: Tag },
        { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
      ],
    },
    {
      title: 'SALES',
      items: [
        { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { label: 'Returns', path: '/admin/returns', icon: RotateCcw },
        { label: 'Payments', path: '/admin/payments', icon: CreditCard },
      ],
    },
    {
      title: 'CUSTOMERS',
      items: [
        { label: 'Customers', path: '/admin/customers', icon: Users },
        { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
        { label: 'Reviews', path: '/admin/reviews', icon: Star },
      ],
    },
    {
      title: 'MARKETING',
      items: [
        { label: 'Coupons', path: '/admin/coupons', icon: TicketPercent },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
      ],
    },
    // {
    //   title: 'SYSTEM',
    //   items: [
    //     { label: 'Settings', path: '/admin/settings', icon: Settings },
    //   ],
    // },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A261C] text-stone-200 border-r border-[#D4AF37]/25 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* 1. Brand Logo Header */}
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-[#D4AF37]/20 bg-[#061A13]">
            <Link to="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]/80 shadow-[0_0_10px_rgba(212,175,55,0.3)] shrink-0">
                <img
                  src="/saisaa-logo.jpg"
                  alt="Saisaa Admin"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-widest text-[#F7E7BE] font-bold">
                  SAISAA
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold -mt-1">
                  Atelier Backoffice
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-stone-400 hover:text-white p-1 rounded-lg"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick "Live Storefront" link */}
          <div className="px-4 py-2.5 bg-[#061A13]/60 border-b border-white/5 flex items-center justify-between text-[11px] text-[#E8D49E]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Storefront Online
            </span>
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-white underline transition-colors"
            >
              <span>View Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* 2. Navigation Links */}
          <div className="py-4 px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                {sec.title && (
                  <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80 font-bold mb-1.5">
                    {sec.title}
                  </p>
                )}
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => onCloseMobile && onCloseMobile()}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                          isActive
                            ? 'bg-[#123D2E] text-[#F7E7BE] border border-[#D4AF37]/40 shadow-sm font-bold'
                            : 'text-stone-300 hover:bg-white/5 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Bottom Admin Profile Footer */}
        <div className="p-3 border-t border-[#D4AF37]/20 bg-[#061A13]/90">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[#123D2E] border border-[#D4AF37]/60 flex items-center justify-center text-[#F7E7BE] font-bold text-xs shrink-0">
                SA
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-[#F7E7BE] truncate">
                  {adminUser.name}
                </span>
                <span className="text-[10px] text-stone-400 font-medium truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                  {adminUser.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
              title="Logout from Admin Panel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
