'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/** Returns a debounced version of the given value */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/**
 * Returns a stable debounced callback.
 * The callback is only invoked after `delay` ms of inactivity.
 */
export function useDebouncedCallback(callback, delay = 300) {
  const timerRef = useRef(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
  }, [delay]);
}
