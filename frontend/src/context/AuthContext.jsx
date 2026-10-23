import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, ROLES } from '../constants';
import { authService } from '../services';

/**
 * SECURITY NOTE ON JWT STORAGE:
 * Browser Web Storage (localStorage) is utilized here to persist user sessions across page reloads.
 * IMPORTANT SECURITY CAVEATS:
 * 1. Web Storage is susceptible to Cross-Site Scripting (XSS) attacks; any malicious script injected into
 *    the application origin can read items from localStorage.
 * 2. Never store raw passwords, payment instruments, or sensitive PII in localStorage.
 * 3. In enterprise production environments with custom domain origins, httpOnly SameSite secure cookies
 *    are recommended for token transport to mitigate token exfiltration via client-side script execution.
 * 4. Tokens are short-lived on the backend (24h) and cleared immediately on 401 response or explicit logout.
 */

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Initialize and verify existing session with backend /api/auth/me
  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      const existingToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!existingToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const freshUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(freshUser);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(freshUser));
        }
      } catch (err) {
        console.warn('Session verification failed, resetting credentials:', err?.message);
        if (isMounted) {
          setToken(null);
          setUser(null);
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    const receivedToken = data.token;
    const receivedUser = data.user;

    setToken(receivedToken);
    setUser(receivedUser);

    localStorage.setItem(STORAGE_KEYS.TOKEN, receivedToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(receivedUser));

    return receivedUser;
  }, []);

  const register = useCallback(async (formData) => {
    const createdUser = await authService.register(formData);
    return createdUser;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUserData };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(merged));
      return merged;
    });
  }, []);

  const isAdmin = useMemo(() => {
    if (!user || !user.role) return false;
    const roleUpper = String(user.role).toUpperCase();
    return roleUpper === ROLES.ADMIN || roleUpper === ROLES.ROLE_ADMIN;
  }, [user]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin,
      login,
      register,
      logout,
      updateUser,
    }),
    [token, user, loading, isAdmin, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
