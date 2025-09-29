import { useState, useEffect, useCallback } from 'react';
import { fetchAnime } from './api';

export const useInfiniteAnime = (query: string = '') => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const ITEMS_PER_PAGE = 20;

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setOffset(0);
      
      console.log(`🔄 Loading initial anime data${query ? ` for "${query}"` : ' (seasonal)'}`);
      
      const result = await fetchAnime({ 
        query, 
        limit: ITEMS_PER_PAGE, 
        offset: 0 
      });
      
      setData(result.data);
      setHasMore(result.data.length === ITEMS_PER_PAGE);
      setOffset(ITEMS_PER_PAGE);
      
      console.log(`✅ Loaded ${result.data.length} initial anime items`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch anime');
      setError(error);
      console.error('❌ Failed to fetch initial anime data:', error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      setError(null);
      
      console.log(`🔄 Loading more anime data (offset: ${offset})`);
      
      const result = await fetchAnime({ 
        query, 
        limit: ITEMS_PER_PAGE, 
        offset 
      });
      
      setData(prevData => [...prevData, ...result.data]);
      setHasMore(result.data.length === ITEMS_PER_PAGE);
      setOffset(prevOffset => prevOffset + ITEMS_PER_PAGE);
      
      console.log(`✅ Loaded ${result.data.length} more anime items (total: ${data.length + result.data.length})`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load more anime');
      setError(error);
      console.error('❌ Failed to load more anime data:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [query, offset, loadingMore, hasMore, data.length]);

  const reset = useCallback(() => {
    setData([]);
    setLoading(false);
    setLoadingMore(false);
    setError(null);
    setHasMore(true);
    setOffset(0);
  }, []);

  // Fetch initial data when query changes
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    data,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    reset,
    refetch: fetchInitialData,
  };
};
