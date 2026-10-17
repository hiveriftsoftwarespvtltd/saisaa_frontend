import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

// Customer Storefront Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Wishlist } from './pages/Wishlist';
import { Account } from './pages/Account';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

// Admin System Providers & Layouts
import { AdminProvider } from './admin/context/AdminContext';
import { AdminLayout } from './admin/layouts/AdminLayout';

// Admin Auth Pages
import { AdminLogin } from './admin/pages/auth/AdminLogin';
import { AdminRegister } from './admin/pages/auth/AdminRegister';
import { AdminForgotPassword } from './admin/pages/auth/AdminForgotPassword';

// Admin Dashboard & Domain Pages
import { AdminDashboard } from './admin/pages/dashboard/AdminDashboard';
import { AdminProducts } from './admin/pages/products/AdminProducts';
import { AdminProductForm } from './admin/pages/products/AdminProductForm';
import { AdminCategories } from './admin/pages/categories/AdminCategories';
import { AdminSubCategories } from './admin/pages/categories/AdminSubCategories';
import { AdminOrders } from './admin/pages/orders/AdminOrders';
import { AdminOrderDetails } from './admin/pages/orders/AdminOrderDetails';
import { AdminCustomers } from './admin/pages/customers/AdminCustomers';
import { AdminCustomerDetails } from './admin/pages/customers/AdminCustomerDetails';
import { AdminCoupons } from './admin/pages/coupons/AdminCoupons';
import { AdminInventory } from './admin/pages/inventory/AdminInventory';
import { AdminReviews } from './admin/pages/reviews/AdminReviews';
import { AdminEnquiries } from './admin/pages/enquiries/AdminEnquiries';
import { AdminReturns } from './admin/pages/returns/AdminReturns';
import { AdminPayments } from './admin/pages/payments/AdminPayments';
import { AdminAnalytics } from './admin/pages/analytics/AdminAnalytics';
import { AdminSettings } from './admin/pages/settings/AdminSettings';

// Customer Storefront Layout Wrapper (Preserves customer Navbar & Footer)
const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-[#1E2922]">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* ======================================================== */}
                {/* 1. CUSTOMER STOREFRONT ROUTES (With Navbar & Footer)     */}
                {/* ======================================================== */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/stitched-suits" element={<Shop forcedCategory="stitched-suits" />} />
                  <Route path="/unstitched-suits" element={<Shop forcedCategory="unstitched-suits" />} />
                  <Route path="/suits" element={<Shop forcedCategory="suits" />} />
                  <Route path="/sarees" element={<Shop forcedCategory="sarees" />} />
                  <Route path="/kurtis" element={<Shop forcedCategory="kurtis" />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/:categorySlug" element={<Shop />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

              {/* ======================================================== */}
              {/* 2. ADMIN AUTHENTICATION ROUTES (Standalone, No Customer UI) */}
              {/* ======================================================== */}
              <Route
                path="/admin/login"
                element={
                  <AdminProvider>
                    <AdminLogin />
                  </AdminProvider>
                }
              />
              <Route
                path="/admin/register"
                element={
                  <AdminProvider>
                    <AdminRegister />
                  </AdminProvider>
                }
              />
              <Route
                path="/admin/forgot-password"
                element={
                  <AdminProvider>
                    <AdminForgotPassword />
                  </AdminProvider>
                }
              />

              {/* ======================================================== */}
              {/* 3. ADMIN APPLICATION SUITE (Sidebar + Topbar + Content)  */}
              {/* ======================================================== */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/:id" element={<AdminProductForm />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="subcategories" element={<AdminSubCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetails />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="customers/:id" element={<AdminCustomerDetails />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="returns" element={<AdminReturns />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </ToastProvider>
);
}
