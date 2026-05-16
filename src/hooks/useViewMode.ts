import { useState } from 'react';

type ViewMode = 'list' | 'card';

export function useViewMode(key = 'viewMode'): [ViewMode, () => void] {
  const [mode, setMode] = useState<ViewMode>(() => {
    return (localStorage.getItem(key) as ViewMode) || 'list';
  });

  function toggle() {
    setMode(prev => {
      const next = prev === 'list' ? 'card' : 'list';
      localStorage.setItem(key, next);
      return next;
    });
  }

  return [mode, toggle];
}
