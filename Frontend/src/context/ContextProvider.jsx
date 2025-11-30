import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import ShowContext from "./ShowContext.js";
import ApiService from "../services/apiServices.js";

const ShowContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [ngoList, setNgoList] = useState([]);
  const [stylesChange, setStyleChange] = useState(true);
  const [loader, setLoader] = useState(false);
  const [connectedUser, setConnectedUser] = useState([]);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  // const location = useLocation();

  // Fetch current user data
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await ApiService.getCurrentUser();
      if (response.data) {
        setUserData(response.data.data);
        
        // Auto-detect user type based on email presence
        if (response.data?.email) {
          setStyleChange(false); // NGO user
        } else {
          setStyleChange(true); // Regular user
        }
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUserData(null);
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  // Fetch NGO list
  const fetchNgoList = useCallback(async () => {
    try {
      const response = await ApiService.getNgoList();
      if (response.data) {
        setNgoList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching NGO list:", error);
      setNgoList([]);
    }
  }, []);

  // Fetch connected users
  const fetchConnectedUsers = useCallback(async () => {
    try {
      const response = await ApiService.getConnectedUsers();
      console.log("response for connected user", response);
      
      if (response.data) {
        setConnectedUser(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching connected users:", error);
      setConnectedUser([]);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoader(true);
      await ApiService.logoutUser();
      
      // Clear user data
      setUserData(null);
      setConnectedUser([]);
      setStyleChange(true);
      
      // Optionally redirect to login or home
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoader(false);
    }
  }, []);
useEffect(() => {
  if (userData) {
    fetchNgoList();    
  }
}, [userData]);

  // Refresh user data function
  const refreshUserData = useCallback(async () => {
    setLoader(true);
    await fetchCurrentUser();
    await fetchNgoList();
    if (userData) {
      await fetchConnectedUsers();
    }
    setLoader(false);
  }, [userData, fetchCurrentUser, fetchNgoList, fetchConnectedUsers]);

  // Initial data fetch on mount
  useEffect(() => {
    const initializeData = async () => {
      setLoader(true);
      await fetchCurrentUser();
      await fetchNgoList();
      setLoader(false);
    };

    initializeData();
  }, []);

  // Fetch connected users when user is authenticated
  useEffect(() => {
    if (userData) {
      fetchConnectedUsers();
    }
  }, [userData, fetchConnectedUsers]);

  // Context value with all state and functions
  const contextValue = {
    // User data
    userData,
    setUserData,
    user: userData, // Alias for consistency with protected routes
    setUser: setUserData, // Alias for consistency
    
    // NGO data
    ngoList,
    setNgoList,
    
    // Connected users
    connectedUser,
    setConnectedUser,
    
    // UI state
    stylesChange,
    setStyleChange,
    loader,
    setLoader,
    isAuthChecking,
    
    // Utility functions
    logout,
    refreshUserData,
    fetchCurrentUser,
    fetchNgoList,
    fetchConnectedUsers,
  };

  return (
    <ShowContext.Provider value={contextValue}>
      {children}
    </ShowContext.Provider>
  );
};

export default ShowContextProvider;