import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu } from 'lucide-react';
import logoImage from '../assets/cat.png';

export default function Navbar({ onMenuToggle, showMenuToggle, hideAuth }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '?';

  return (
    <nav
      style={{
        background: '#0d1117',
        borderBottom: '0.5px solid #21262d',
        height: 52,
        padding: '0 24px',
      }}
      className="flex items-center justify-between sticky top-0 z-50"
    >
      <div className="flex items-center gap-3">
        {showMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="text-[#8b949e] hover:text-[#e6edf3] transition p-1"
          >
            <Menu size={20} />
          </button>
        )}
        <Link to="/" className="flex items-center gap-[10px] no-underline">
          <img
            src={logoImage}
            alt="PRobe"
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ color: '#cae3ff', fontSize: 18, fontWeight: 500 }}>
            PRobe
          </span>
        </Link>
      </div>

      {!hideAuth && (
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span style={{ color: '#8b949e', fontSize: 14 }}>{user.username}</span>
              <div
                style={{
                  background: '#1f3a5c',
                  color: '#58a6ff',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {initials}
              </div>
              <button
                onClick={handleLogout}
                style={{ color: '#8b949e' }}
                className="hover:text-[#e6edf3] transition p-1"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  background: 'transparent',
                  border: '0.5px solid #30363d',
                  color: '#e6edf3',
                  borderRadius: 6,
                  padding: '8px 18px',
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
                className="hover:bg-[#161b22] transition"
              >
                Log in
              </Link>
              <Link
                to="/register"
                style={{
                  background: '#58a6ff',
                  color: '#0d1117',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 18px',
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
                className="hover:brightness-110 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
