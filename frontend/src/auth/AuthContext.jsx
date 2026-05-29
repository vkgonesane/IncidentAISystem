import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import incidentApi from "../api/incidentApi";

const AuthContext = createContext(null);

const TOKEN_KEY = "vendoriq_token";
const USER_KEY = "vendoriq_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = Boolean(token && user);

  useEffect(() => {
    if (token) {
      incidentApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete incidentApi.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = (authResponse) => {
    localStorage.setItem(TOKEN_KEY, authResponse.access_token);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(authResponse.user)
    );

    setToken(authResponse.access_token);
    setUser(authResponse.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);

    delete incidentApi.defaults.headers.common.Authorization;
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      logout,
    }),
    [token, user, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}