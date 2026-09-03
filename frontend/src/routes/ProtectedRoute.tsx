import React from 'react';
import { Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  requiredRole?: 'CUSTOMER' | 'ADMIN';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  // Direct bypass: Allows viewing the UI without authentication check
  return <Outlet />;
};