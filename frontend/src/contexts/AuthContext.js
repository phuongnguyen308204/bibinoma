import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async (name) => {},
  logout: () => {},
  logoutAll: () => {},
  refreshAuth: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const bcRef = useRef(null);

  useEffect(() => {
    refreshAuth();
    const onFocus = () => refreshAuth(true);
    window.addEventListener('focus', onFocus);
    if ('BroadcastChannel' in window) {
      bcRef.current = new BroadcastChannel('auth_sync');
      bcRef.current.onmessage = (event) => {
        if (event?.data?.type === 'auth-changed') {
          refreshAuth(true);
        }
      };
    }
    const onStorage = (e) => {
      if (e.key === 'AUTH_SYNC' && e.newValue) {
        refreshAuth(true);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
      try { bcRef.current?.close?.(); } catch (_) {}
    };
  }, []);

  function broadcastAuthChanged() {
    try { bcRef.current?.postMessage?.({ type: 'auth-changed', at: Date.now() }); } catch (_) {}
    try { localStorage.setItem('AUTH_SYNC', String(Date.now())); } catch (_) {}
  }

  async function refreshAuth(silent = false) {
    try {
      const res = await fetch('https://bibinoma.com/api/v1/auth/status', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        try {
          const infoRes = await fetch('https://bibinoma.com/api/v1/user/info', {
            method: 'GET',
            credentials: 'include',
            headers: { Accept: 'application/json' },
          });
          if (infoRes.ok) {
            const data = await infoRes.json();
            setUser({
              name: data?.username || 'User',
              email: data?.email || '',
              type: data?.type || 'free',
              money: typeof data?.money === 'number' ? data.money : 0,
            });
            if (!silent) broadcastAuthChanged();
          } else {
            setUser((prev) => prev || { name: 'User' });
            if (!silent) broadcastAuthChanged();
          }
        } catch (_err) {
          setUser((prev) => prev || { name: 'User' });
          if (!silent) broadcastAuthChanged();
        }
      } else {
        setUser(null);
        if (!silent) broadcastAuthChanged();
      }
    } catch (e) {
      setUser(null);
      if (!silent) broadcastAuthChanged();
    } finally {
      setLoading(false);
    }
  }

  async function login(name) {
    const trimmed = String(name || '').trim();
    if (!trimmed) return;
    setUser({ name: trimmed });
  }

  async function logout() {
    try {
      await fetch('https://bibinoma.com/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (_) {
    } finally {
      setUser(null);
      broadcastAuthChanged();
    }
  }

  async function logoutAll() {
    try {
      await fetch('https://bibinoma.com/api/v1/auth/logout-all', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (_) {
    } finally {
      setUser(null);
      broadcastAuthChanged();
    }
  }

  const value = useMemo(() => ({ user, loading, login, logout, logoutAll, refreshAuth }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}


