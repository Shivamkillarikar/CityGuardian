// import React, { createContext, useContext, useEffect, useState } from "react";
// import api from "../lib/api";

// type User = {
//   _id: string;
//   name: string;
//   surname: string;
//   email: string;
//   address?: string;
//   isAdmin?: boolean;
// };

// type AuthContextType = {
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (payload: Record<string, any>) => Promise<void>;
//   logout: () => void;
//   token: string | null;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(() => {
//     try {
//       const s = localStorage.getItem("user");
//       return s ? JSON.parse(s) : null;
//     } catch {
//       return null;
//     }
//   });
//   const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

//   useEffect(() => {
//     if (token) api.setToken(token);
//     else api.clearToken();
//   }, [token]);

//   const login = async (email: string, password: string) => {
//     const res = await api.post("/auth/login", { email, password });
//     const { user: u, token: t } = res.data;
//     setUser(u);
//     setToken(t);
//     localStorage.setItem("user", JSON.stringify(u));
//     localStorage.setItem("token", t);
//     api.setToken(t);
//   };

//   const register = async (payload: Record<string, any>) => {
//     const res = await api.post("/auth/register", payload);
//     // Optionally auto-login after registration:
//     const { user: u, token: t } = res.data;
//     setUser(u);
//     setToken(t);
//     localStorage.setItem("user", JSON.stringify(u));
//     localStorage.setItem("token", t);
//     api.setToken(t);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     api.clearToken();
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, token }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };



import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

type User = {
  _id: string;
  name: string;
  surname: string;
  email: string;
  address?: string;
  isAdmin?: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: Record<string, any>) => Promise<void>;
  logout: () => void;
  token: string | null;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem("user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      api.setToken(token);
      setIsAuthenticated(true);
    } else {
      api.clearToken();
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { user: u, token: t } = res.data;

    setUser(u);
    setToken(t);
    setIsAuthenticated(true);

    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", t);

    api.setToken(t);
  };

  const register = async (payload: Record<string, any>) => {
    const res = await api.post("/auth/register", payload);
    const { user: u, token: t } = res.data;

    setUser(u);
    setToken(t);
    setIsAuthenticated(true);

    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", t);

    api.setToken(t);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    api.clearToken();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, token, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
