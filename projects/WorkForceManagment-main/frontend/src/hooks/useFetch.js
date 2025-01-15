import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useFetch = (uri, options = {}) => {
  const { initialLoading = true, cacheTime = 0, debounceTime = 0 } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(uri, {
        params: options.params ? options.params : null,
      });
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [options.params, uri]);

  useEffect(() => {
    let isMounted = true;

    if (debounceTime > 0) {
      const timer = setTimeout(() => {
        if (isMounted) {
          fetchData();
        }
      }, debounceTime);
      return () => clearTimeout(timer);
    } else {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchData, debounceTime]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Cache handling
  useEffect(() => {
    let cacheTimeout;
    if (cacheTime > 0) {
      cacheTimeout = setTimeout(() => {
        refetch();
      }, cacheTime);
    }

    return () => clearTimeout(cacheTimeout);
  }, [cacheTime, refetch]);

  return { data, loading, error, fetchData };
};

export default useFetch;
