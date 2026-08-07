export default function SeverityBadge({ severity }) {
  const styles = {
    critical: {
      background: '#2d0f0f',
      color: '#f85149',
    },
    warning: {
      background: '#2d1f0a',
      color: '#e3b341',
    },
    suggestion: {
      background: '#0a2010',
      color: '#3fb950',
    },
  };

  const labels = {
    critical: 'CRITICAL',
    warning: 'WARNING',
    suggestion: 'SUGGESTION',
  };

  const s = styles[severity] || styles.suggestion;

  return (
    <span
      style={{
        ...s,
        padding: '5px 14px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {labels[severity] || severity}
    </span>
  );
}
