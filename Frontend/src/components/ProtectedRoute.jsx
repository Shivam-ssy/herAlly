import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import ShowContext from '../context/ShowContext.js';
const AuthLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <i className="ri-loader-4-line text-6xl animate-spin text-red-500"></i>
      <p className="text-lg text-gray-600">Checking authentication...</p>
    </div>
  </div>
);
export const ProtectedRoute = () => {
  const { user, isAuthChecking } = useContext(ShowContext);
  
  // Show loader while checking authentication
  if (isAuthChecking) {
    return <AuthLoader />;
  }
  
  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user exists, render the child routes
  return <Outlet />;
};

// Public Route Component - Only for non-authenticated users
export const PublicRoute = () => {
  const { user, isAuthChecking } = useContext(ShowContext);
  
  // Show loader while checking authentication
  if (isAuthChecking) {
    return <AuthLoader />;
  }
  
  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  // If no user, render the child routes (login/register)
  return <Outlet />;
};
