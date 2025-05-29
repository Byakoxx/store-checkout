import { useState } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (url: string, options?: RequestInit) => Promise<T>;
}

export function useApi<T>(): UseApiResponse<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = async (url: string, options: RequestInit = {}): Promise<T> => {
    if (state.loading) {
      console.log('Request already in progress, skipping...');
      return state.data as T;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const BASE_URL = 'https://store-backend-production-5e1b.up.railway.app';

      const response = await fetch(BASE_URL + url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      console.error('API Error:', error);
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Ha ocurrido un error'
      });
      throw error;
    }
  };

  return { ...state, execute };
}