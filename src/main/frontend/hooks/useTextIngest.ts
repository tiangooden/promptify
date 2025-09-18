import { useState, useCallback } from 'react';
import { ingestText } from '../utils/api';

export function useTextIngest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ingestTextContent = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const document = await ingestText(content);
      return document;
    } catch (err) {
      console.error('Failed to ingest text:', err);
      setError('Failed to ingest text. Please try again.');
      return null;
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