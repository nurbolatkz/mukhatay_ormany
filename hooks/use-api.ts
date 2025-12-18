// hooks/use-api.ts
// Custom hook for easier API integration

import { useState, useEffect } from "react";
import apiService from "@/services/api";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export function useApi<T>(endpoint: string, method: HttpMethod = "GET", body?: any) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        let response: T;
        
        switch (method) {
          case "GET":
            response = await apiService.request(endpoint, { method: "GET" });
            break;
          case "POST":
            response = await apiService.request(endpoint, {
              method: "POST",
              body: JSON.stringify(body),
            });
            break;
          case "PUT":
            response = await apiService.request(endpoint, {
              method: "PUT",
              body: JSON.stringify(body),
            });
            break;
          case "DELETE":
            response = await apiService.request(endpoint, { method: "DELETE" });
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        if (isMounted) {
          setState({ data: response, loading: false, error: null });
        }
      } catch (error: any) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error.message || "An error occurred",
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint, method, body]);

  const refetch = () => {
    // Trigger re-fetch by updating state
    setState(prev => ({ ...prev, loading: true, error: null }));
  };

  return { ...state, refetch };
}