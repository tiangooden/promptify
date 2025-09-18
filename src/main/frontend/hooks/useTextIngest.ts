import { useState, useCallback } from 'react';
import { ingestText } from '../utils/api';

export function useTextIngest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ingestTextContent = useCallback(async (content: string, name: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await ingestText(content, name);
    } catch (err) {
      console.error('Failed to ingest text:', err);
      setError('Failed to ingest text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    ingestTextContent,
    isLoading,
    error
  };
}