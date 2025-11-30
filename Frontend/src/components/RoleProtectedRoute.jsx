import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import ShowContext from '../context/ShowContext';

export const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthChecking } = useContext(ShowContext);

  // Show loader while checking token
  if (isAuthChecking) return <div>Loading...</div>;

  // If not logged in
  if (!user) return <Navigate to="/login" replace />;

  // If role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
        
  }

  return <Outlet />;
};
