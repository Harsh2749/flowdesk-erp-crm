import { useState } from 'react';
import { useDebounce } from './useDebounce';

export function useSearch(delayMs = 400) {
  const [term, setTerm] = useState('');
  const debouncedTerm = useDebounce(term, delayMs);

  return { term, setTerm, debouncedTerm };
}
