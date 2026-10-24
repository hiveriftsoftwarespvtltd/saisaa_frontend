import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { apiClient, API_ENDPOINTS } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();

  // Load customer state from localStorage (strictly real users, purge any legacy demo user)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('saisaa_customer_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email === 'ravinder@example.com') {
          localStorage.removeItem('saisaa_customer_user');
          localStorage.setItem('saisaa_customer_logged_in', 'false');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const token = localStorage.getItem('saisaa_token');
      const stored = localStorage.getItem('saisaa_customer_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email === 'ravinder@example.com') {
          return false;
        }
      }
      const loggedInFlag = localStorage.getItem('saisaa_customer_logged_in');
      if (loggedInFlag === 'false') return false;
      return Boolean(stored || token);
    } catch {
      return false;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (isAuthenticated && user) {
        localStorage.setItem('saisaa_customer_user', JSON.stringify(user));
        localStorage.setItem('saisaa_customer_logged_in', 'true');
      } else {
        localStorage.setItem('saisaa_customer_logged_in', 'false');
      }
    } catch {
      // storage unavailable
    }
  }, [isAuthenticated, user]);

  // Real Customer Login via Axios POST /auth/login
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: cleanEmail,
        password,
      });

      // Unified response shape: { success: true, message: "...", data: { user, token } }
      const backendUser = response.data?.user || response.data;
      const token = response.data?.token;

      if (token) {
        localStorage.setItem('saisaa_token', token);
      }

      const activeUser = {
        id: backendUser.id || backendUser._id,
        name: backendUser.fullName || backendUser.name || 'Valued Patron',
        email: backendUser.email || cleanEmail,
        role: backendUser.role || 'customer',
        tier: backendUser.tier || 'Royal Privé Member',
        loyaltyPoints: backendUser.loyaltyPoints ?? 500,
        memberSince: backendUser.createdAt
          ? new Date(backendUser.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })
          : 'October 2026',
        avatar: backendUser.avatar || null,
      };

      setUser(activeUser);
      setIsAuthenticated(true);
      addToast(response.message || `Welcome back, ${activeUser.name}!`, 'cart');
      return { success: true, user: activeUser };
    } catch (error) {
      addToast(error.message, 'error');
      throw error;
    }
  };

  // Real Customer Registration via Axios POST /auth/register (Does not auto-login)
  const register = async ({ fullName, email, password }) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        fullName: fullName.trim(),
        email: cleanEmail,
        password,
      });

      const backendUser = response.data?.user || response.data;

      addToast(
        response.message ||
          `Account created for ${backendUser.fullName || fullName.trim()}! Please sign in.`,
        'success',
      );
      return { success: true, email: cleanEmail, user: backendUser };
    } catch (error) {
      addToast(error.message, 'error');
      throw error;
    }
  };

  // Customer Logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('saisaa_token');
    localStorage.setItem('saisaa_customer_logged_in', 'false');
    addToast('You have been signed out.', 'cart');
  };

  // Update Profile
  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('saisaa_customer_user', JSON.stringify(next));
      return next;
    });
    addToast('Profile updated successfully.', 'cart');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
