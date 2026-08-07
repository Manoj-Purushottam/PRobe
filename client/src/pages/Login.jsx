import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import logoImage from '../assets/cat.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, googleLogin, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0d1117' }}>
      <Navbar />
      <div className="flex items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 52px)' }}>
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            background: '#161b22',
            border: '0.5px solid #21262d',
            borderRadius: 12,
            padding: 32,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <img
              src={logoImage}
              alt="PRobe"
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                objectFit: 'cover',
                margin: '0 auto 8px',
              }}
            />
            <h2 style={{ color: '#cae3ff', fontSize: 18, fontWeight: 500, margin: 0 }}>
              PRobe
            </h2>
          </div>

          {error && (
            <p
              style={{
                color: '#f85149',
                fontSize: 13,
                background: '#2d0f0f',
                border: '0.5px solid #f85149',
                borderRadius: 6,
                padding: '8px 12px',
                marginBottom: 16,
              }}
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: '#8b949e', fontSize: 13, marginBottom: 4 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0d1117',
                  border: '0.5px solid #30363d',
                  color: '#e6edf3',
                  borderRadius: 6,
                  padding: '10px 14px',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#58a6ff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(88,166,255,0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#30363d';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#8b949e', fontSize: 13, marginBottom: 4 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0d1117',
                  border: '0.5px solid #30363d',
                  color: '#e6edf3',
                  borderRadius: 6,
                  padding: '10px 14px',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#58a6ff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(88,166,255,0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#30363d';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#58a6ff',
                color: '#0d1117',
                border: 'none',
                borderRadius: 6,
                padding: '10px 14px',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
              className="hover:brightness-110 transition"
            >
              Log in
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
            <div style={{ flex: 1, height: '0.5px', background: '#21262d' }} />
            <span style={{ color: '#484f58', fontSize: 12, whiteSpace: 'nowrap' }}>or continue with Google</span>
            <div style={{ flex: 1, height: '0.5px', background: '#21262d' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {googleLoading ? (
              <span style={{ color: '#8b949e', fontSize: 13 }}>Signing in...</span>
            ) : (
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  setGoogleLoading(true);
                  try {
                    await googleLogin(credentialResponse.credential);
                    navigate('/dashboard');
                  } catch (err) {
                    setError(err.response?.data?.message || 'Google sign-in failed');
                  } finally {
                    setGoogleLoading(false);
                  }
                }}
                onError={(error) => {
                  console.error('Google sign-in error:', error);
                  setError(
                    'Google sign-in failed. Make sure the deployed URL is in Google Cloud Console Authorized JavaScript origins.'
                  );
                }}
                size="large"
                shape="rectangular"
                theme="filled_black"
                text="continue_with"
              />
            )}
          </div>

          <p style={{ textAlign: 'center', color: '#8b949e', fontSize: 13, marginTop: 16 }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#58a6ff', textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
