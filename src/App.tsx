import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MemoriesPage from './pages/MemoriesPage';
import HealthPage from './pages/HealthPage';
import McpPage from './pages/McpPage';
import AccountPage from './pages/AccountPage';
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { theme } from './lib/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes */}
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/memories" element={<MemoriesPage />} />
              <Route path="/health" element={<HealthPage />} />
              <Route path="/mcp" element={<McpPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>

            {/* Landing page as default route */}
            <Route path="/" element={<LandingPage />} />

            {/* Catch all other routes and redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
