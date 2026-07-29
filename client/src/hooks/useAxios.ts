import { useCallback, useState } from 'react';
import { AxiosError } from 'axios';

interface UseAxiosState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useAxios<T, Args extends unknown[]>(
  requestFn: (...args: Args) => Promise<{ data: { data?: T; message: string } }>
) {
  const [state, setState] = useState<UseAxiosState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      setState({ data: null, isLoading: true, error: null });
      try {
        const response = await requestFn(...args);
        setState({ data: response.data.data ?? null, isLoading: false, error: null });
        return response.data.data;
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || 'Something went wrong';
        setState({ data: null, isLoading: false, error: message });
        throw err;
      }
    },
    [requestFn]
  );

  return { ...state, execute };
}
