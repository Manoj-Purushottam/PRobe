import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const borderColors = {
  critical: '#f85149',
  warning: '#e3b341',
  suggestion: '#3fb950',
};

const dotColors = {
  critical: '#f85149',
  warning: '#e3b341',
  suggestion: '#3fb950',
};

export default function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false);
  const borderColor = borderColors[issue.severity] || '#3fb950';
  const dotColor = dotColors[issue.severity] || '#3fb950';

  return (
    <div
      style={{
        background: '#161b22',
        border: '0.5px solid #21262d',
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
        borderLeft: `2px solid ${borderColor}`,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left flex items-center gap-2 transition hover:bg-[#161b22]/80"
        style={{
          padding: '12px 14px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: dotColor,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            background: '#1f2937',
            color: '#8b949e',
            fontSize: 10,
            padding: '2px 7px',
            borderRadius: 4,
            textTransform: 'uppercase',
          }}
        >
          {issue.category}
        </span>
        <span
          style={{
            flex: 1,
            fontSize: 13,
            color: '#e6edf3',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {issue.title}
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: '#484f58',
            flexShrink: 0,
          }}
        >
          {issue.file}{issue.line != null ? `:${issue.line}` : ''}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: '#484f58',
            flexShrink: 0,
            transition: 'transform 0.2s',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      {expanded && (
        <div
          style={{
            borderTop: '0.5px solid #21262d',
            padding: '0 14px 14px',
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: '#8b949e',
              lineHeight: 1.6,
              marginTop: 10,
              marginBottom: 12,
            }}
          >
            {issue.description}
          </p>
          <div
            style={{
              background: '#0d1117',
              borderRadius: 6,
              padding: '10px 14px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: '#58a6ff',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
            }}
          >
            {issue.suggestion}
          </div>
        </div>
      )}
    </div>
  );
}
