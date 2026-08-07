import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reviewAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ReviewOutput from '../components/ReviewOutput';

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState(null);
  const [prMeta, setPrMeta] = useState(null);

  useEffect(() => {
    reviewAPI
      .getById(id)
      .then((data) => {
        setReview(data.reviewData);
        setPrMeta({
          prTitle: data.prTitle,
          repoName: data.repoName,
          prNumber: data.prNumber,
          authorLogin: data.authorLogin,
          filesChanged: data.filesChanged,
          additions: data.additions,
          deletions: data.deletions,
          createdAt: data.createdAt,
          prUrl: data.prUrl,
        });
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('Review not found');
        } else {
          setError(err.response?.data?.message || 'Failed to load review');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewAPI.deleteReview(id);
      showToast('Review deleted', 'success');
      navigate('/dashboard', { replace: true });
    } catch {
      showToast('Failed to delete review', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#0d1117' }}>
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 52px)' }}>
          <LoadingSpinner message="Loading review..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ background: '#0d1117' }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center gap-4 px-4" style={{ minHeight: 'calc(100vh - 52px)' }}>
          <p style={{ color: '#8b949e' }}>{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#58a6ff',
              color: '#0d1117',
              border: 'none',
              borderRadius: 6,
              padding: '8px 18px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
            className="hover:brightness-110 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0d1117' }}>
      <Navbar />
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '24px 24px 48px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 transition hover:bg-[#161b22]"
            style={{
              background: 'transparent',
              border: '0.5px solid #30363d',
              color: '#e6edf3',
              borderRadius: 6,
              padding: '8px 18px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>

        {prMeta && (
          <p style={{ color: '#484f58', fontSize: 12, marginBottom: 16 }}>
            {new Date(review.createdAt || Date.now()).toLocaleString()}
          </p>
        )}

        {review && <ReviewOutput review={review} prMeta={prMeta} reviewId={id} />}

        <div style={{ marginTop: 24 }}>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 transition hover:bg-[#2d0f0f]"
            style={{
              background: 'transparent',
              border: '0.5px solid #f85149',
              color: '#f85149',
              borderRadius: 6,
              padding: '8px 18px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
