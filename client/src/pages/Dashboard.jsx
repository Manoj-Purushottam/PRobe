import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { reviewAPI, userAPI } from '../services/api';
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  GitPullRequest,
  PawPrint,
  Search,
  Sparkles,
  Check,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ReviewOutput from '../components/ReviewOutput';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [prUrl, setPrUrl] = useState(location.state?.prUrl || '');
  const [githubToken, setGithubToken] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [currentReview, setCurrentReview] = useState(null);
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const [currentPrMeta, setCurrentPrMeta] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, totalIssues: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const [h, s] = await Promise.all([reviewAPI.getHistory(), userAPI.getStats()]);
      setHistory(h);
      setStats(s);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!prUrl.trim()) return;

    setError('');
    setCurrentReview(null);
    setCurrentReviewId(null);
    setCurrentPrMeta(null);
    setLoading(true);
    setLoadingStep(0);

    const stepTimer = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, 2));
    }, 2000);

    try {
      const result = await reviewAPI.analyze(prUrl.trim(), githubToken || undefined);
      setCurrentReview(result);
      setCurrentReviewId(result.id);
      setCurrentPrMeta(result.prMeta);
      setLoadingStep(3);
      showToast('Review saved!', 'success');

      const newHistoryItem = {
        id: result.id,
        prUrl: prUrl.trim(),
        prTitle: result.prMeta.prTitle,
        repoName: result.prMeta.repoName,
        prNumber: result.prMeta.prNumber,
        issueCount: (result.issues || []).length,
        criticalCount: (result.issues || []).filter((i) => i.severity === 'critical').length,
        warningCount: (result.issues || []).filter((i) => i.severity === 'warning').length,
        suggestionCount: (result.issues || []).filter((i) => i.severity === 'suggestion').length,
        createdAt: new Date().toISOString(),
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
      setStats((prev) => ({
        totalReviews: prev.totalReviews + 1,
        totalIssues: prev.totalIssues + newHistoryItem.issueCount,
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Analysis failed');
      showToast(err.response?.data?.message || 'Analysis failed', 'error');
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewAPI.deleteReview(id);
      if (currentReviewId === id) {
        setCurrentReview(null);
        setCurrentReviewId(null);
        setCurrentPrMeta(null);
      }
      fetchHistory();
      showToast('Review deleted', 'success');
    } catch {
      showToast('Failed to delete review', 'error');
    }
  };

  const loadReview = async (id) => {
    try {
      const review = await reviewAPI.getById(id);
      setCurrentReview(review.reviewData);
      setCurrentReviewId(review.id);
      setCurrentPrMeta({
        prTitle: review.prTitle,
        repoName: review.repoName,
        prNumber: review.prNumber,
        authorLogin: review.authorLogin,
        filesChanged: review.filesChanged,
        additions: review.additions,
        deletions: review.deletions,
      });
      setSidebarOpen(false);
    } catch {
      // silently fail
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const steps = [
    { icon: Search, text: 'Fetching PR data...' },
    { icon: Sparkles, text: 'Running AI analysis...' },
    { icon: Check, text: 'Review complete!' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* User section */}
      <div
        style={{
          padding: '16px',
          borderBottom: '0.5px solid #21262d',
        }}
      >
        <div className="flex items-center gap-2" style={{ color: '#cae3ff', fontSize: 14, fontWeight: 500 }}>
          <PawPrint size={14} />
          <span>Hello, {user?.username}</span>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          padding: '12px 16px',
          borderBottom: '0.5px solid #21262d',
        }}
      >
        <div
          style={{
            background: '#1f2937',
            borderRadius: 8,
            padding: 10,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 500, color: '#58a6ff' }}>{stats.totalReviews}</div>
          <div style={{ fontSize: 10, color: '#8b949e', marginTop: 2, textTransform: 'uppercase' }}>
            Reviews
          </div>
        </div>
        <div
          style={{
            background: '#1f2937',
            borderRadius: 8,
            padding: 10,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 500, color: '#58a6ff' }}>{stats.totalIssues}</div>
          <div style={{ fontSize: 10, color: '#8b949e', marginTop: 2, textTransform: 'uppercase' }}>
            Issues
          </div>
        </div>
      </div>

      {/* Review history */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '8px 0' }}>
        <div
          style={{
            fontSize: 10,
            color: '#484f58',
            letterSpacing: '0.8px',
            fontWeight: 500,
            textTransform: 'uppercase',
            padding: '4px 16px 8px',
          }}
        >
          Review History
        </div>

        {history.length === 0 && (
          <p style={{ color: '#484f58', fontSize: 12, padding: '0 16px' }}>
            No reviews yet
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 8px' }}>
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => loadReview(item.id)}
              style={{
                background: currentReviewId === item.id ? '#1f3a5c' : '#161b22',
                border: currentReviewId === item.id
                  ? '0.5px solid #58a6ff'
                  : '0.5px solid #21262d',
                borderRadius: 8,
                padding: '10px 12px',
                cursor: 'pointer',
                position: 'relative',
              }}
              className="group hover:border-[#30363d] transition"
            >
              <div className="flex items-center gap-2">
                <GitPullRequest size={12} style={{ color: '#8b949e', flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: 13,
                    color: '#e6edf3',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                >
                  {item.repoName}
                </span>
              </div>
              <div className="flex items-center gap-2" style={{ marginTop: 2 }}>
                <span style={{ color: '#8b949e', fontSize: 11 }}>PR #{item.prNumber}</span>
                <span
                  style={{
                    background: '#1f2937',
                    color: '#8b949e',
                    fontSize: 9,
                    padding: '1px 6px',
                    borderRadius: 8,
                  }}
                >
                  {item.issueCount}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition"
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: '#8b949e',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 2,
                }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const inputStyle = {
    background: '#161b22',
    border: '0.5px solid #30363d',
    color: '#e6edf3',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
    outline: 'none',
  };

  const inputFocus = (e) => {
    e.target.style.borderColor = '#58a6ff';
    e.target.style.boxShadow = '0 0 0 3px rgba(88,166,255,0.15)';
  };

  const inputBlur = (e) => {
    e.target.style.borderColor = '#30363d';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen" style={{ background: '#0d1117', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        showMenuToggle
        onMenuToggle={() => setSidebarOpen(true)}
      />

      <div className="flex" style={{ flex: 1, overflow: 'hidden' }}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile drawer */}
        <aside
          className="md:hidden fixed top-0 left-0 z-50 h-full"
          style={{
            width: 220,
            background: '#161b22',
            borderRight: '0.5px solid #21262d',
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 200ms',
            paddingTop: 52,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 8 }}>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ color: '#8b949e', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>
          <div style={{ height: 'calc(100% - 52px)' }}>
            {sidebarContent}
          </div>
        </aside>

        {/* Desktop sidebar */}
        <aside
          className="hidden md:flex flex-col shrink-0"
          style={{
            width: 220,
            background: '#161b22',
            borderRight: '0.5px solid #21262d',
            height: 'calc(100vh - 52px)',
          }}
        >
          {sidebarContent}
        </aside>

        {/* Main content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: '20px 24px', maxWidth: 840 }}
        >
          {/* PR Input */}
          <form onSubmit={handleAnalyze} style={{ marginBottom: 24 }}>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste a GitHub PR URL..."
                value={prUrl}
                onChange={(e) => setPrUrl(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#58a6ff',
                  color: '#0d1117',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 18px',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  opacity: loading ? 0.6 : 1,
                }}
                className="hover:brightness-110 transition"
              >
                <Search size={14} />
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                marginTop: 8,
                color: '#8b949e',
                fontSize: 12,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
              className="hover:text-[#e6edf3] transition"
            >
              {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Advanced
            </button>

            {showAdvanced && (
              <div style={{ marginTop: 6 }}>
                <label style={{ display: 'block', color: '#8b949e', fontSize: 11, marginBottom: 4 }}>
                  GitHub Token (for private repos)
                </label>
                <input
                  type="password"
                  placeholder="ghp_..."
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>
            )}
          </form>

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: 24,
                padding: '10px 14px',
                background: '#2d0f0f',
                border: '0.5px solid #f85149',
                borderRadius: 10,
                color: '#f85149',
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div
              style={{
                marginBottom: 24,
                background: '#161b22',
                border: '0.5px solid #21262d',
                borderRadius: 10,
                padding: 20,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 500,
                        background:
                          loadingStep > i
                            ? '#3fb950'
                            : loadingStep === i
                              ? '#58a6ff'
                              : '#1f2937',
                        color:
                          loadingStep > i
                            ? '#0d1117'
                            : loadingStep === i
                              ? '#fff'
                              : '#484f58',
                        animation: loadingStep === i ? 'pulse 1.5s infinite' : 'none',
                      }}
                    >
                      {loadingStep > i ? <Check size={12} /> : i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        color: loadingStep >= i ? '#e6edf3' : '#484f58',
                      }}
                    >
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Output */}
          {currentReview && !loading && (
            <ReviewOutput review={currentReview} prMeta={currentPrMeta} reviewId={currentReviewId} />
          )}
        </main>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
