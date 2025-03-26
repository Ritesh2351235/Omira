import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/signin'
}) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (currentUser === undefined) {
    // You might want to show a loading spinner here
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    // Redirect to sign in page, but save the current location they were trying to access
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 