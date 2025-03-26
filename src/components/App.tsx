import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Dashboard from '../pages/Dashboard';
import ForgotPassword from './ForgotPassword';
import ProtectedRoute from './ProtectedRoute';
import { Container } from '@mui/material';
import '../App.css';
import { SidebarDemo } from './ui/sidebar-demo';
import PrivateRoute from './PrivateRoute';

// Import firebase to ensure initialization
import '../firebase';

const App: React.FC = () => {
  // Log that the app has started
  useEffect(() => {
    console.log('App initialized');
  }, []);

  return (
    <Container className="app-container" maxWidth={false} disableGutters>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<PrivateRoute><SidebarDemo /></PrivateRoute>} />
          </Routes>
        </AuthProvider>
      </Router>
    </Container>
  );
};

export default App; 