import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  loadAuthState,
  saveAuthState,
  clearAuthState,
} from "../utils/authStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    uid: null,
    profileCompleted: false,
    isAuthenticated: false,
    loading: true,
  });

  // 🔹 Hydrate from localStorage on app load
  useEffect(() => {
    try {
      const stored = loadAuthState();
      if (stored?.uid) {
        setAuthState({
          uid: stored.uid,
          profileCompleted: stored.profileCompleted ?? false,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    } catch {
      clearAuthState();
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  // 🔹 Login handler (called after backend auth)
  const login = ({ uid, profileCompleted }) => {
    saveAuthState({ uid, profileCompleted });

    setAuthState({
      uid,
      profileCompleted,
      isAuthenticated: true,
      loading: false,
    });
  };

  // 🔹 Logout handler
  const logout = () => {
    clearAuthState();
    setAuthState({
      uid: null,
      profileCompleted: false,
      isAuthenticated: false,
      loading: false,
    });
  };

  // 🔹 Memoize context value
  const value = useMemo(
    () => ({ authState, login, logout }),
    [authState]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
