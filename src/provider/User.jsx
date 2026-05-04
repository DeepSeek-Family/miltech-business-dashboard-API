import React, { useContext, useEffect, useState } from "react";
import { useProfileQuery } from "../redux/apiSlices/authSlice";

export const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );

  // Listen for token changes in localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        setToken(e.newValue);
        // Clear user data when token is removed
        if (!e.newValue) {
          setUser(null);
        }
      }
    };

    // Also check for token changes periodically
    const checkToken = () => {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== token) {
        setToken(currentToken);
        // Clear user data when token is removed
        if (!currentToken) {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(checkToken, 500); // Check every 500ms

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [token]);

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (profile && !isLoading && !isError) {
      setUser(profile);
    } else if (isError) {
      setUser(null);
    }
  }, [profile, isLoading, isError]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, refetch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
