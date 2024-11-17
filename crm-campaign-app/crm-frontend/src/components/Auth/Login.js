import { useEffect } from 'react';
import { Button, Box, Typography, Container } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function Login() {
  useEffect(() => {
    // Load Google API
    const loadGoogleAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };
    loadGoogleAPI();
  }, []);

  const handleGoogleLogin = () => {
    // Replace with your Google Client ID
    const client = google.accounts.oauth2.initTokenClient({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
      scope: 'email profile',
      callback: (response) => {
        if (response.access_token) {
          // Send token to your backend
          handleAuthToken(response.access_token);
        }
      },
    });
    client.requestAccessToken();
  };

  const handleAuthToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in to Mini CRM
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{ mt: 3, mb: 2 }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
}

export default Login;