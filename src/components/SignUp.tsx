import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import Lucide icons
import { Loader2, AlertCircle, Info, CalendarClock, Smartphone } from 'lucide-react';

// Import Shadcn components
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uidFromUrl, setUidFromUrl] = useState<string | null>(null);

  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract UID from query parameters if present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');
    if (uid) {
      setUidFromUrl(uid);
      console.log('📌 Found UID in URL:', uid);
    } else {
      console.log('⚠️ No UID found in URL');
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!email || !password) {
      setError('Please fill out all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setError('');
      setLoading(true);
      console.log('🔐 Attempting to sign up with:', {
        email,
        name,
        manualUid: uidFromUrl || 'NONE'
      });

      // Pass the UID from URL as the manual UID parameter
      if (uidFromUrl) {
        console.log(`📝 Using manual UID from URL: ${uidFromUrl}`);
        await signUp(email, password, uidFromUrl);
      } else {
        console.log('📝 No manual UID available, creating standard account');
        await signUp(email, password);
      }

      console.log('✅ Sign up successful, redirecting to dashboard');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Signup error:', err);

      // Handle specific Firebase auth errors
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('This email is already in use. Please sign in instead.');
            break;
          case 'auth/invalid-email':
            setError('Please enter a valid email address.');
            break;
          case 'auth/operation-not-allowed':
            setError('Email/password authentication is not enabled. Please contact support.');
            break;
          case 'auth/weak-password':
            setError('Password is too weak. Please choose a stronger password.');
            break;
          default:
            setError(err.message || 'Failed to create an account.');
        }
      } else {
        setError(err.message || 'Failed to create an account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Your Omira Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to sign up for an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-neutral-200 bg-neutral-50 text-neutral-800 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <h4 className="text-neutral-800 font-medium text-sm">Recommended: Sign Up via Omi App</h4>
            </div>
            <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
              For the best experience and to ensure your memories sync correctly, we recommend signing up through the Omi mobile app first.
            </p>
          </div>

          {uidFromUrl && (
            <div className="bg-primary/15 text-primary text-sm p-3 rounded-md flex items-center gap-2 mb-4">
              <Info className="h-4 w-4" />
              <span>Your account will be linked with Omi ID: <strong>{uidFromUrl}</strong></span>
            </div>
          )}

          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name (optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <RouterLink to="/signin" className="text-primary font-medium hover:underline underline-offset-4">
              Sign in
            </RouterLink>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp; 