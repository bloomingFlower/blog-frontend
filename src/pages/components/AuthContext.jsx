import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedIsLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const storedUser = JSON.parse(sessionStorage.getItem("user"));

    setIsLoggedIn(storedIsLoggedIn);
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = useCallback((userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};