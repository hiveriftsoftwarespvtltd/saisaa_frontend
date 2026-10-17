import React, { useState } from 'react';
import {
  Store,
  User,
  Bell,
  CreditCard,
  Truck,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PageHeader } from '../../components/common/PageHeader';

export const AdminSettings = () => {
  const { adminUser, updateAdminProfile, showAdminToast } = useAdmin();

  const [activeTab, setActiveTab] = useState('store');

  // Form states
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'SAISAA Haute Couture',
    tagline: 'Luxury Ethnic Wear — Suits, Sarees & Kurtis',
    supportEmail: 'pooja.vishwakarma84@gmail.com',
    supportPhone: '+91 9116863306',
    address: 'Saisaa Mansion, 42 Heritage Boulevard, New Delhi, 110003',
    currency: 'INR (₹)',
    gstNumber: '07AAACS1429B1Z8',
  });

  const [profileSettings, setProfileSettings] = useState({
    name: adminUser.name,
    email: adminUser.email,
    phone: adminUser.phone,
    role: adminUser.role,
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 4999,
    standardShippingFee: 350,
    expressShippingFee: 650,
    enableCod: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    upiVpa: 'saisaa@icici',
    razorpayKeyId: 'rzp_live_893849102834',
    codAvailable: true,
    autoRefundApproval: false,
  });

  const [notificationToggles, setNotificationToggles] = useState({
    orderEmails: true,
    lowStockAlerts: true,
    returnRequestSms: true,
    dailyDigest: false,
  });

  const handleSaveStore = (e) => {
    e.preventDefault();
    showAdminToast('Storefront configurations saved successfully', 'success');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateAdminProfile(profileSettings);
  };

  const handleSaveShipping = (e) => {
    e.preventDefault();
    showAdminToast('Shipping thresholds & freight rules updated', 'success');
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    showAdminToast('Payment rail configurations saved', 'success');
  };

  const settingsTabs = [
    { id: 'store', label: 'Store Settings', icon: Store },
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'payments', label: 'Payment Settings', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Auth', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <PageHeader
        title="Settings & System Configurations"
        subtitle="Manage atelier brand metadata, staff profiles, payment credentials, and shipping thresholds."
        breadcrumbs={[{ label: 'System' }, { label: 'Settings' }]}
      />

      {/* Settings Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-2">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#0A261C] text-[#F7E7BE] shadow-2xs font-bold'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 bg-white border border-stone-200/60'
              }`}
            >
              <Icon className="w-4 h-4 text-[#D4AF37]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Store Settings */}
      {activeTab === 'store' && (
        <form onSubmit={handleSaveStore} className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-6 max-w-3xl">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
            Atelier Brand & Legal Coordinates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Storefront Display Name
              </label>
              <input
                type="text"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                GSTIN / Tax Identification
              </label>
              <input
                type="text"
                value={storeSettings.gstNumber}
                onChange={(e) => setStoreSettings({ ...storeSettings, gstNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Concierge Email
              </label>
              <input
                type="email"
                value={storeSettings.supportEmail}
                onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Concierge Helpline
              </label>
              <input
                type="text"
                value={storeSettings.supportPhone}
                onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Flagship Studio Address
            </label>
            <textarea
              rows={2}
              value={storeSettings.address}
              onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>Save Store Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Admin Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-6 max-w-2xl">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
            Administrator Staff Profile
          </h3>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#0A261C] text-[#F7E7BE] border-2 border-[#D4AF37] flex items-center justify-center font-bold text-lg shadow-sm">
              SA
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-stone-900">{profileSettings.name}</h4>
              <p className="text-xs text-stone-500">{profileSettings.role}</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={profileSettings.name}
                onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Work Email
              </label>
              <input
                type="email"
                value={profileSettings.email}
                onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Telephone
              </label>
              <input
                type="tel"
                value={profileSettings.phone}
                onChange={(e) => setProfileSettings({ ...profileSettings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Shipping & Delivery */}
      {activeTab === 'shipping' && (
        <form onSubmit={handleSaveShipping} className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-6 max-w-2xl">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
            Royal Logistics & Courier Thresholds
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Complimentary Shipping Minimum Basket (₹)
              </label>
              <input
                type="number"
                value={shippingSettings.freeShippingThreshold}
                onChange={(e) =>
                  setShippingSettings({ ...shippingSettings, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-bold focus:outline-none focus:border-[#0A261C]"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Orders equal or exceeding this value receive zero delivery surcharges.
              </span>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Standard Shipping Flat Fee (₹)
              </label>
              <input
                type="number"
                value={shippingSettings.standardShippingFee}
                onChange={(e) =>
                  setShippingSettings({ ...shippingSettings, standardShippingFee: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-bold focus:outline-none focus:border-[#0A261C]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>Save Freight Rules</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Payment Settings */}
      {activeTab === 'payments' && (
        <form onSubmit={handleSavePayment} className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-6 max-w-2xl">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
            Settlement Rails & Gateway Credentials
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Primary UPI VPA Collector
              </label>
              <input
                type="text"
                value={paymentSettings.upiVpa}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, upiVpa: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Payment Gateway Public Key ID
              </label>
              <input
                type="text"
                value={paymentSettings.razorpayKeyId}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayKeyId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono focus:outline-none focus:border-[#0A261C]"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentSettings.codAvailable}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, codAvailable: e.target.checked })}
                  className="rounded border-stone-300 text-[#0A261C] focus:ring-[#0A261C] w-4 h-4"
                />
                <span className="font-semibold text-stone-800">
                  Enable Cash on Delivery (COD) for eligible pincodes
                </span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A261C] hover:bg-[#123D2E] text-[#F7E7BE] text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>Save Payment Rails</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 5: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-5 max-w-2xl text-xs">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
            System & Dispatch Notifications
          </h3>

          <div className="space-y-4">
            {[
              { key: 'orderEmails', label: 'Real-time order confirmation alerts', desc: 'Notify staff when orders exceed ₹15,000' },
              { key: 'lowStockAlerts', label: 'Inventory threshold alerts', desc: 'Trigger daily report when SKUs fall below 5 units' },
              { key: 'returnRequestSms', label: 'Reverse logistics SMS alerts', desc: 'Notify warehouse manager upon customer return requests' },
            ].map((item) => (
              <label key={item.key} className="flex items-start justify-between p-3.5 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                <div>
                  <span className="font-bold text-stone-900 block">{item.label}</span>
                  <span className="text-stone-500 text-[11px] font-light">{item.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationToggles[item.key]}
                  onChange={(e) =>
                    setNotificationToggles({ ...notificationToggles, [item.key]: e.target.checked })
                  }
                  className="mt-1 rounded border-stone-300 text-[#0A261C] focus:ring-[#0A261C] w-4 h-4"
                />
              </label>
            ))}
          </div>

          <button
            onClick={() => showAdminToast('Notification preferences saved', 'success')}
            className="px-5 py-2.5 bg-[#0A261C] text-[#F7E7BE] text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      )}

      {/* Tab 6: Security */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-5 max-w-2xl text-xs">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
            Security & Authentication Control
          </h3>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
            <strong className="block font-bold">Two-Factor Authentication (2FA) Active</strong>
            <p className="text-[11px] leading-relaxed">
              SMS and Authenticator App verification are currently simulated for all staff logins.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                New Security Password
              </label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0A261C]"
              />
            </div>
          </div>

          <button
            onClick={() => showAdminToast('Security credentials updated', 'success')}
            className="px-5 py-2.5 bg-[#0A261C] text-[#F7E7BE] text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm"
          >
            Change Password
          </button>
        </div>
      )}
    </div>
  );
};
