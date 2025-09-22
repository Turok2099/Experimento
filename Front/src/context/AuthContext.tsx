"use client";
import { IUserSession } from "@/types";
import { useContext, createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export interface IAuthContextProps {
  userData: IUserSession | null;
  setUserData: (userData: IUserSession | null) => void;
  logout: () => void;
  loadingSession: boolean;
}

export const AuthContext = createContext<IAuthContextProps>({
  userData: null,
  setUserData: () => {},
  logout: () => {},
  loadingSession: true,
});

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<IUserSession | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // cargar sesion desde el localStorage/cookies al iniciar
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userSession");
      if (stored) {
        const parsed: IUserSession = JSON.parse(stored);
        setUserData(parsed);
        console.log("🔍 Sesión cargada desde localStorage:", {
          token: parsed.token ? "Presente" : "Ausente",
          user: parsed.user?.email || "No disponible",
        });
      } else {
        setUserData(null);
        console.log("❌ No hay sesión almacenada");
      }
    } catch (err) {
      console.error("Error cargando userSession:", err);
      setUserData(null);
    } finally {
      setLoadingSession(false); // 🔹 muy importante
    }
  }, []);

  useEffect(() => {
    if (userData) {
      const sessionData = JSON.stringify({
        token: userData.token,
        user: userData.user,
      });
      localStorage.setItem("userSession", sessionData);
      Cookies.set("userSession", sessionData);
      // console.log("Sesión guardada/persistida:", userData.token);
    } else {
      localStorage.removeItem("userSession");
      Cookies.remove("userSession");
      // console.log("Sesión eliminada");
    }
  }, [userData]);

  const logout = () => {
    setUserData(null);
    localStorage.removeItem("userSession");
    Cookies.remove("userSession");
  };

  return (
    <AuthContext.Provider
      value={{ userData, setUserData, logout, loadingSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
