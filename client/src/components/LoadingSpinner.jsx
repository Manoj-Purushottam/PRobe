export default function LoadingSpinner({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className="animate-spin"
        style={{
          width: 32,
          height: 32,
          border: '3px solid #1f2937',
          borderTopColor: '#58a6ff',
          borderRadius: '50%',
        }}
      />
      {message && <p style={{ color: '#8b949e', fontSize: 13 }}>{message}</p>}
    </div>
  );
}
