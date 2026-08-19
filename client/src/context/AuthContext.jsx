import { createContext, useContext, useState, useCallback } from "react";
import { login as apiLogin } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("admin_token") || null
  );

  const loginFn = useCallback(async (email, password) => {
    const res = await apiLogin(email, password);
    const t = res.data.access_token;
    localStorage.setItem("admin_token", t);
    setToken(t);
    return t;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login: loginFn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
