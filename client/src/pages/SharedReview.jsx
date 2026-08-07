import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reviewAPI } from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ReviewOutput from '../components/ReviewOutput';

export default function SharedReview() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState(null);
  const [prMeta, setPrMeta] = useState(null);

  useEffect(() => {
    reviewAPI
      .shareGet(id)
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

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#0d1117' }}>
        <Navbar hideAuth />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 52px)' }}>
          <LoadingSpinner message="Loading review..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ background: '#0d1117' }}>
        <Navbar hideAuth />
        <div className="flex flex-col items-center justify-center gap-4 px-4" style={{ minHeight: 'calc(100vh - 52px)' }}>
          <p style={{ color: '#8b949e' }}>{error}</p>
          <Link
            to="/"
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
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0d1117' }}>
      <Navbar hideAuth />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 24px 48px' }}>
        {review && <ReviewOutput review={review} prMeta={prMeta} reviewId={id} />}

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link
            to="/register"
            style={{
              background: '#58a6ff',
              color: '#0d1117',
              border: 'none',
              borderRadius: 6,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-block',
            }}
            className="hover:brightness-110 transition"
          >
            Sign up to save your own reviews
          </Link>
        </div>
      </div>
    </div>
  );
}
