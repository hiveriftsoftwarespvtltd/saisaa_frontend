import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { RefreshCw, AlertTriangle, WifiOff } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { AdminProvider, useAdmin } from '../context/AdminContext';

const AdminLayoutInner = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isAuthenticated, isServerOnline, serverError, isRetryingAll, retryAll } = useAdmin();

  // If user explicitly logged out, redirect to admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex font-sans antialiased">
      {/* 1. Collapsible & Responsive Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <AdminTopbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Global Server Offline / Disconnected Alert Banner */}
        {!isServerOnline && (
          <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 text-white px-4 sm:px-6 py-3 border-b border-red-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
                <WifiOff className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold tracking-wide flex items-center gap-2">
                  <span>Backend Server Disconnected / Offline</span>
                  <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border border-white/20">
                    {serverError?.includes('502') ? '502 Bad Gateway' : 'Server Down'}
                  </span>
                </p>
                <p className="text-red-100 text-[11px] font-light mt-0.5">
                  {serverError || 'Live database se connect nahi ho pa raha. Check karein ki NestJS backend process port 6001 par running hai ya nahi.'}
                </p>
              </div>
            </div>

            <button
              onClick={retryAll}
              disabled={isRetryingAll}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 text-red-700 font-bold rounded-xl shadow transition-all active:scale-95 text-xs shrink-0 disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetryingAll ? 'animate-spin' : ''}`} />
              <span>{isRetryingAll ? 'Connecting...' : 'Retry Connection'}</span>
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const AdminLayout = () => {
  return (
    <AdminProvider>
      <AdminLayoutInner />
    </AdminProvider>
  );
};
