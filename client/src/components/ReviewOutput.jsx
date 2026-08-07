import { useToast } from '../context/ToastContext';
import SeverityBadge from './SeverityBadge';
import IssueCard from './IssueCard';
import { Share2, Sparkles, Check } from 'lucide-react';

const severityOrder = { critical: 0, warning: 1, suggestion: 2 };

export default function ReviewOutput({ review, prMeta, reviewId }) {
  const { showToast } = useToast();

  const handleShare = async () => {
    const url = `${window.location.origin}/share/${reviewId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    showToast('Link copied to clipboard!', 'success');
  };
  const issues = (review.issues || []).sort(
    (a, b) => (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99),
  );

  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const suggestionCount = issues.filter((i) => i.severity === 'suggestion').length;

  const scoreColor =
    review.overallScore > 7
      ? '#3fb950'
      : review.overallScore >= 4
        ? '#e3b341'
        : '#f85149';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* PR Metadata Bar */}
      {prMeta && (
        <div
          style={{
            background: '#161b22',
            border: '0.5px solid #21262d',
            borderRadius: 10,
            padding: '14px 16px',
          }}
        >
          <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: '#cae3ff',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {prMeta.prTitle}
          </span>
          {reviewId && (
            <button
              onClick={handleShare}
              title="Share review"
              style={{
                color: '#8b949e',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
              className="hover:text-[#e6edf3] transition"
            >
              <Share2 size={14} />
            </button>
          )}
        </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              style={{
                background: '#1f2937',
                color: '#8b949e',
                fontSize: 11,
                padding: '3px 8px',
                borderRadius: 4,
              }}
            >
              {prMeta.repoName}
            </span>
            <span
              style={{
                background: '#1f2937',
                color: '#8b949e',
                fontSize: 11,
                padding: '3px 8px',
                borderRadius: 4,
              }}
            >
              PR #{prMeta.prNumber}
            </span>
            <span
              style={{
                background: '#1f2937',
                color: '#8b949e',
                fontSize: 11,
                padding: '3px 8px',
                borderRadius: 4,
              }}
            >
              {prMeta.authorLogin}
            </span>
            <span
              style={{
                background: '#1f2937',
                color: '#8b949e',
                fontSize: 11,
                padding: '3px 8px',
                borderRadius: 4,
              }}
            >
              {prMeta.filesChanged} files
            </span>
            <span style={{ color: '#3fb950', fontSize: 12 }}>+{prMeta.additions}</span>
            <span style={{ color: '#f85149', fontSize: 12 }}>-{prMeta.deletions}</span>
          </div>
        </div>
      )}

      {/* Score + Summary */}
      <div className="flex gap-4" style={{ display: 'flex', gap: 16 }}>
        <div
          style={{
            width: 140,
            minWidth: 140,
            background: '#161b22',
            border: '0.5px solid #21262d',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span style={{ fontSize: 48, fontWeight: 500, color: scoreColor }}>
              {review.overallScore}
            </span>
            <span style={{ fontSize: 14, color: '#8b949e' }}>/10</span>
          </div>
          <span style={{ fontSize: 11, color: '#484f58', marginTop: 4 }}>Overall score</span>
        </div>
        <div
          style={{
            flex: 1,
            background: '#161b22',
            border: '0.5px solid #21262d',
            borderRadius: 10,
            padding: 16,
          }}
        >
          <p style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.7, margin: 0 }}>
            {review.summary}
          </p>
        </div>
      </div>

      {/* Severity Pills */}
      {(criticalCount > 0 || warningCount > 0 || suggestionCount > 0) && (
        <div className="flex gap-2.5" style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
          {criticalCount > 0 && (
            <SeverityBadge severity="critical" />
          )}
          {warningCount > 0 && (
            <SeverityBadge severity="warning" />
          )}
          {suggestionCount > 0 && (
            <SeverityBadge severity="suggestion" />
          )}
        </div>
      )}

      {/* No Issues Found */}
      {issues.length === 0 && (
        <div
          style={{
            background: '#161b22',
            border: '0.5px solid #21262d',
            borderRadius: 10,
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#3fb950', fontSize: 14, margin: 0 }}>
            No issues found. Clean code!
          </p>
        </div>
      )}

      {/* Issues List */}
      {issues.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}

      {/* Positives */}
      {review.positives && review.positives.length > 0 && (
        <div
          style={{
            background: '#0a2010',
            border: '0.5px solid #1a4a25',
            borderRadius: 10,
            padding: '14px 16px',
            marginTop: 4,
          }}
        >
          <div className="flex items-center gap-1.5" style={{ marginBottom: 10 }}>
            <Sparkles size={12} style={{ color: '#3fb950' }} />
            <span
              style={{
                fontSize: 10,
                color: '#3fb950',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Positives
            </span>
          </div>
          {review.positives.map((p, i) => (
            <div key={i} className="flex items-start gap-2" style={{ marginBottom: 6 }}>
              <Check size={12} style={{ color: '#3fb950', marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#3fb950' }}>{p}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
