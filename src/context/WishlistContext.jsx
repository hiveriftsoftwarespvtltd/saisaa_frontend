import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { wishlistApi } from '../api';

const WishlistContext = createContext(null);

const GUEST_WISHLIST_KEY = 'saisaa_guest_wishlist';
const CACHED_WISHLIST_KEY = 'saisaa_wishlist';

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [wishlist, setWishlist] = useState(() => {
    try {
      // Prioritize patron cached wishlist, fallback to guest wishlist
      const saved = localStorage.getItem(CACHED_WISHLIST_KEY) || localStorage.getItem(GUEST_WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const lastSyncedEmailRef = useRef(null);

  // Normalize product ID comparison
  const matchesProductId = (item, targetId) => {
    if (!item || !targetId) return false;
    const tId = String(targetId);
    return (
      String(item.id) === tId ||
      String(item._id) === tId ||
      String(item.customId) === tId ||
      String(item.sku) === tId
    );
  };

  // Helper to extract active customer email
  const getActiveEmail = useCallback(() => {
    if (user?.email) return user.email.toLowerCase().trim();
    try {
      const stored = localStorage.getItem('saisaa_customer_user');
      if (stored) {
        const u = JSON.parse(stored);
        return u?.email ? u.email.toLowerCase().trim() : null;
      }
    } catch {
      return null;
    }
    return null;
  }, [user]);

  // Synchronize Guest Wishlist to Database upon Login or Patron Mount
  useEffect(() => {
    const activeEmail = getActiveEmail();

    // 1. If Patron is Logged In
    if (isAuthenticated && activeEmail) {
      // Avoid infinite redundant fetches for the exact same active email session
      if (lastSyncedEmailRef.current === activeEmail) return;

      const performAccountSync = async () => {
        setIsLoading(true);
        setIsSyncing(true);
        try {
          // Check if guest had accumulated items before signing in
          let guestItems = [];
          try {
            const guestSaved = localStorage.getItem(GUEST_WISHLIST_KEY);
            if (guestSaved) guestItems = JSON.parse(guestSaved);
          } catch {
            guestItems = [];
          }

          // If there are guest items, invoke merge-sync API
          if (Array.isArray(guestItems) && guestItems.length > 0) {
            const syncRes = await wishlistApi.sync(activeEmail, guestItems);
            const mergedProducts = syncRes?.data?.products || [];
            setWishlist(mergedProducts);
            localStorage.setItem(CACHED_WISHLIST_KEY, JSON.stringify(mergedProducts));
            // Clear guest items since they are safely merged into patron account
            localStorage.removeItem(GUEST_WISHLIST_KEY);
            addToast('Guest wishlist synchronized to your patron account.', 'wishlist');
          } else {
            // No new guest items, fetch current patron wishlist from MongoDB
            const res = await wishlistApi.get(activeEmail);
            const serverProducts = res?.data?.products || [];
            setWishlist(serverProducts);
            localStorage.setItem(CACHED_WISHLIST_KEY, JSON.stringify(serverProducts));
          }

          lastSyncedEmailRef.current = activeEmail;
        } catch (err) {
          console.warn('Patron wishlist sync skipped:', err.message);
        } finally {
          setIsLoading(false);
          setIsSyncing(false);
        }
      };

      performAccountSync();
    } else {
      // 2. Unauthenticated / Guest session
      lastSyncedEmailRef.current = null;
    }
  }, [isAuthenticated, user, getActiveEmail, addToast]);

  // Save changes locally
  useEffect(() => {
    try {
      if (isAuthenticated) {
        localStorage.setItem(CACHED_WISHLIST_KEY, JSON.stringify(wishlist));
      } else {
        localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlist));
        localStorage.setItem(CACHED_WISHLIST_KEY, JSON.stringify(wishlist));
      }
    } catch (e) {
      console.error('LocalStorage write error in wishlist:', e);
    }
  }, [wishlist, isAuthenticated]);

  // Toggle item in Wishlist
  const toggleWishlist = async (product) => {
    if (!product) return;

    const prodId = product.id || product._id || product.customId || product.sku;
    const exists = wishlist.some((item) => matchesProductId(item, prodId));

    if (exists) {
      // Optimistic removal
      const updated = wishlist.filter((item) => !matchesProductId(item, prodId));
      setWishlist(updated);
      addToast(`Removed "${(product.name || 'Item').slice(0, 24)}..." from Wishlist`, 'wishlist');

      const activeEmail = getActiveEmail();
      if (activeEmail && isAuthenticated) {
        try {
          await wishlistApi.remove(prodId, activeEmail);
        } catch (err) {
          console.warn('Backend wishlist remove failed:', err.message);
        }
      }
    } else {
      // Optimistic addition
      const updated = [...wishlist, product];
      setWishlist(updated);
      addToast(`Saved to Royal Wishlist: "${(product.name || 'Item').slice(0, 24)}..."`, 'wishlist');

      const activeEmail = getActiveEmail();
      if (activeEmail && isAuthenticated) {
        try {
          await wishlistApi.toggle(activeEmail, product);
        } catch (err) {
          console.warn('Backend wishlist toggle failed:', err.message);
        }
      }
    }
  };

  // Remove single item from Wishlist
  const removeFromWishlist = async (productId) => {
    if (!productId) return;

    const updated = wishlist.filter((item) => !matchesProductId(item, productId));
    setWishlist(updated);

    const activeEmail = getActiveEmail();
    if (activeEmail && isAuthenticated) {
      try {
        await wishlistApi.remove(productId, activeEmail);
      } catch (err) {
        console.warn('Backend wishlist remove failed:', err.message);
      }
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    setWishlist([]);
    const activeEmail = getActiveEmail();
    if (activeEmail && isAuthenticated) {
      try {
        await wishlistApi.clear(activeEmail);
      } catch (err) {
        console.warn('Backend wishlist clear failed:', err.message);
      }
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => matchesProductId(item, productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
        isLoading,
        isSyncing,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
