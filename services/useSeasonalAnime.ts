import { useState, useEffect, useRef } from 'react';
import { fetchAnime } from './api';

// Shared cache for seasonal anime data
let seasonalAnimeCache: {
  data: any[] | null;
  loading: boolean;
  error: Error | null;
  timestamp: number | null;
  isInitialized: boolean;
} = {
  data: null,
  loading: false,
  error: null,
  timestamp: null,
  isInitialized: false,
};

// Keep track of all subscribers to notify them of state changes
const subscribers = new Set<(state: typeof seasonalAnimeCache) => void>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to notify all subscribers when cache updates
const notifySubscribers = () => {
  subscribers.forEach(callback => callback({ ...seasonalAnimeCache }));
};

let fetchPromise: Promise<void> | null = null;

export const useSeasonalAnime = () => {
  const [state, setState] = useState(() => ({ ...seasonalAnimeCache }));
  const isMountedRef = useRef(true);

  const fetchSeasonalAnime = async () => {
    // Check if we have valid cached data
    const now = Date.now();
    if (
      seasonalAnimeCache.data && 
      seasonalAnimeCache.timestamp && 
      (now - seasonalAnimeCache.timestamp < CACHE_DURATION)
    ) {
      console.log('✅ Using cached seasonal anime data (cache hit)');
      return;
    }

    // If already fetching, wait for the existing promise
    if (fetchPromise) {
      console.log('⏳ Already fetching, waiting for existing request...');
      await fetchPromise;
      return;
    }

    console.log('🔄 Fetching fresh seasonal anime data (cache miss or expired)');
    
    // Update loading state
    seasonalAnimeCache.loading = true;
    seasonalAnimeCache.error = null;
    notifySubscribers();

    // Create fetch promise
    fetchPromise = (async () => {
      try {
        const result = await fetchAnime({ query: '', limit: 30, offset: 0 });
        
        seasonalAnimeCache.data = result.data;
        seasonalAnimeCache.loading = false;
        seasonalAnimeCache.error = null;
        seasonalAnimeCache.timestamp = Date.now();
        seasonalAnimeCache.isInitialized = true;
        
        console.log('✅ Successfully fetched seasonal anime data');
        notifySubscribers();
      } catch (error) {
        seasonalAnimeCache.loading = false;
        seasonalAnimeCache.error = error instanceof Error ? error : new Error('Failed to fetch seasonal anime');
        seasonalAnimeCache.isInitialized = true;
        
        console.error('❌ Failed to fetch seasonal anime:', error);
        notifySubscribers();
      } finally {
        fetchPromise = null;
      }
    })();

    await fetchPromise;
  };

  useEffect(() => {
    isMountedRef.current = true;
    console.log('📱 Component subscribed to seasonal anime cache');
    
    // Subscribe to cache updates
    const updateState = (newState: typeof seasonalAnimeCache) => {
      if (isMountedRef.current) {
        setState(newState);
      }
    };
    
    subscribers.add(updateState);
    
    // Set initial state
    setState({ ...seasonalAnimeCache });
    
    // Fetch if not initialized or data is expired
    if (!seasonalAnimeCache.isInitialized || 
        !seasonalAnimeCache.data || 
        !seasonalAnimeCache.timestamp || 
        (Date.now() - seasonalAnimeCache.timestamp > CACHE_DURATION)) {
      fetchSeasonalAnime();
    }

    return () => {
      isMountedRef.current = false;
      subscribers.delete(updateState);
      console.log('📱 Component unsubscribed from seasonal anime cache');
    };
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchSeasonalAnime,
  };
};
