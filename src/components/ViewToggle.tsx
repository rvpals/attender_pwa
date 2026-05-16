export default function ViewToggle({ mode, onToggle }: { mode: 'list' | 'card'; onToggle: () => void }) {
  return (
    <button className="btn view-toggle" onClick={onToggle} title={`Switch to ${mode === 'list' ? 'card' : 'list'} view`}>
      {mode === 'list' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="8" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
          <rect x="13" y="13" width="8" height="8" rx="2" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="4" width="18" height="4" rx="1" />
          <rect x="3" y="10" width="18" height="4" rx="1" />
          <rect x="3" y="16" width="18" height="4" rx="1" />
        </svg>
      )}
    </button>
  );
}
