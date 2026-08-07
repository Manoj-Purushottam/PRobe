import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, Shield, History } from 'lucide-react';
import Navbar from '../components/Navbar';
import logoImage from '../assets/cat.png';

export default function Landing() {
  const [prUrl, setPrUrl] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/dashboard', { state: { prUrl } });
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0d1117' }}>
      <Navbar />

      <section
        className="flex flex-col items-center px-4 text-center"
        style={{ paddingTop: 80 }}
      >
        <img
          src={logoImage}
          alt="PRobe"
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: 16,
          }}
        />
        <h1
          style={{
            fontSize: 52,
            fontWeight: 500,
            color: '#cae3ff',
            letterSpacing: '-1px',
            margin: 0,
          }}
        >
          PRobe
        </h1>
        <p
          style={{
            fontSize: 18,
            color: '#8b949e',
            marginTop: 8,
          }}
        >
          Probe every line. Ship with confidence.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            maxWidth: 560,
            marginTop: 32,
            display: 'flex',
            gap: 8,
          }}
        >
          <input
            type="text"
            placeholder="Paste a GitHub PR URL..."
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            style={{
              flex: 1,
              background: '#161b22',
              border: '0.5px solid #30363d',
              color: '#e6edf3',
              borderRadius: 8,
              padding: '12px 16px',
              fontSize: 14,
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#58a6ff';
              e.target.style.boxShadow = '0 0 0 3px rgba(88,166,255,0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#30363d';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            type="submit"
            style={{
              background: '#58a6ff',
              color: '#0d1117',
              border: 'none',
              borderRadius: 6,
              padding: '8px 18px',
              fontSize: 14,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
            className="hover:brightness-110 transition"
          >
            Try it free →
          </button>
        </form>
      </section>

      <section
        className="flex flex-wrap justify-center"
        style={{
          maxWidth: 700,
          margin: '64px auto 0',
          padding: '0 16px',
          gap: 16,
        }}
      >
        {[
          {
            icon: Code2,
            title: 'Instant AI Review',
            desc: 'Get a thorough code review powered by AI in seconds. Paste a PR URL and receive detailed feedback.',
          },
          {
            icon: Shield,
            title: 'Security Scanner',
            desc: 'Automatically identify security vulnerabilities, bugs, and performance issues before they ship.',
          },
          {
            icon: History,
            title: 'Review History',
            desc: 'All your past reviews are saved. Track improvements, revisit feedback, and monitor your code quality over time.',
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              flex: '1 1 200px',
              minWidth: 200,
              maxWidth: 340,
              background: '#161b22',
              border: '0.5px solid #21262d',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: '#1f2937',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#58a6ff',
                fontSize: 18,
              }}
            >
              <card.icon size={18} />
            </div>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#cae3ff',
                marginTop: 12,
                marginBottom: 0,
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                fontSize: 13,
                color: '#8b949e',
                lineHeight: 1.6,
                marginTop: 6,
              }}
            >
              {card.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
