import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers & Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { RestaurantLayout } from './layouts/RestaurantLayout';

// Customer & Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { HomePage } from './pages/customer/HomePage';
import { SearchPage } from './pages/customer/SearchPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { RestaurantPage as RestaurantDetailsPage } from './pages/customer/RestaurantPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';

// Super Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminRestaurantsPage } from './pages/admin/AdminRestaurantsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { UsersPage } from './pages/admin/UsersPage';
import { SettingsPage } from './pages/admin/SettingsPage';

// Restaurant Portal Pages
import { RestaurantLoginPage } from './pages/restaurant/RestaurantLoginPage';
import { RestaurantOrdersPage } from './pages/restaurant/RestaurantOrdersPage';
import { RestaurantMenuPage } from './pages/restaurant/RestaurantMenuPage';
import { RestaurantEarningsPage } from './pages/restaurant/RestaurantEarningsPage';
import { RestaurantReviewsPage } from './pages/restaurant/RestaurantReviewsPage';
import { RestaurantProfilePage } from './pages/restaurant/RestaurantProfilePage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/restaurant/login" element={<RestaurantLoginPage />} />

          {/* 1. DEDICATED RESTAURANT DESK */}
          <Route path="/restaurant" element={<RestaurantLayout />}>
            <Route index element={<RestaurantOrdersPage />} />
            <Route path="menu" element={<RestaurantMenuPage />} />
            <Route path="earnings" element={<RestaurantEarningsPage />} />
            <Route path="reviews" element={<RestaurantReviewsPage />} />
            <Route path="profile" element={<RestaurantProfilePage />} />
          </Route>

          {/* 2. SUPER ADMIN DESK */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/restaurants" element={<AdminRestaurantsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />

          {/* 3. CUSTOMER PORTAL */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            
            {/* Dual casing support taaki click hone par route mismatch na ho */}
            <Route path="restaurants/:id" element={<RestaurantDetailsPage />} />
            <Route path="Restaurants/:id" element={<RestaurantDetailsPage />} />

            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;