import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import httpClient from "../Constant/API"; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const checkAuthenticated = useCallback(async () => {
    try {
      const response = await httpClient.get('/accounts/is-authenticated/');
      console.log(response.data);
      
      const isAuth = response?.data?.authenticated === true;
      setIsAuthenticated(isAuth);
      if (isAuth) {
        setUser(response.data.user || null);
      } else {
        setUser(null);
      }
      setError(null);
      return isAuth;
    } catch (error) {
      if (error.response?.status !== 401) {
        setError('Unexpected error occurred.');
      } else {
        setError(null);
      }
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.post("/accounts/admin/login/", { email, password });
      await checkAuthenticated();
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || "Login failed. Please check your credentials.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await httpClient.post("/accounts/logout/");
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuthCheck = async () => {
      setLoading(true);
      await checkAuthenticated();
      setLoading(false);
    };
    initAuthCheck();
  }, [checkAuthenticated]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      error,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
