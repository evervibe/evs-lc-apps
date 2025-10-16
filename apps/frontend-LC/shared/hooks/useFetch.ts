import { useState, useEffect } from "react";
import apiClient from "../lib/api";

interface UseFetchOptions {
  autoFetch?: boolean;
}

interface UseFetchReturn<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions = { autoFetch: true }
): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiClient.get<T>(url);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch) {
      fetchData();
    }
  }, [url, options.autoFetch]);

  return { data, error, isLoading, refetch: fetchData };
}
