import { useEffect, useState } from 'react';

export function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.warn(`Error parsing stored value for key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
    localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Error saving state for key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState] as const;
};
