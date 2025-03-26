import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if there's a UID in the URL - redirect to signup if there is
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const uid = params.get('uid');
    if (uid) {
      navigate(`/signup?uid=${uid}`);
    }
  }, [location.search, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    try {
      setMessage({ type: '', text: '' });
      setLoading(true);

      await sendPasswordResetEmail(auth, email);

      setMessage({
        type: 'success',
        text: 'Check your email for password reset instructions'
      });

    } catch (err: any) {
      console.error('Password reset error:', err);

      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
            setMessage({
              type: 'error',
              text: 'No account found with this email address. Please check your email or sign up for a new account.'
            });
            break;
          case 'auth/invalid-email':
            setMessage({
              type: 'error',
              text: 'Please enter a valid email address.'
            });
            break;
          case 'auth/too-many-requests':
            setMessage({
              type: 'error',
              text: 'Too many requests. Please try again later.'
            });
            break;
          default:
            setMessage({
              type: 'error',
              text: err.message || 'Failed to send password reset email'
            });
        }
      } else {
        setMessage({
          type: 'error',
          text: err.message || 'Failed to send password reset email'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={11} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              Reset Your Password
            </Typography>

            {message.text && (
              <Alert severity={message.type as "error" | "success" | "info" | "warning"} sx={{ width: '100%', mb: 2 }}>
                {message.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
              </Button>

              <Grid container justifyContent="space-between">
                <Grid item>
                  <Link component={RouterLink} to="/signin" variant="body2">
                    Back to Sign In
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword; 