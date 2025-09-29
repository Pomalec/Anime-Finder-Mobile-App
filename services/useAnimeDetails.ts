import { useState, useEffect, useRef } from 'react';
import { fetchAnimeDetails } from './api';

// Cache for anime details
const animeDetailsCache = new Map<number, {
  data: any;
  timestamp: number;
  loading: boolean;
  error: Error | null;
}>();

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const subscribers = new Map<number, Set<(state: any) => void>>();
const fetchPromises = new Map<number, Promise<any>>();

const notifySubscribers = (animeId: number, state: any) => {
  const subs = subscribers.get(animeId);
  if (subs) {
    subs.forEach(callback => callback(state));
  }
};

export const useAnimeDetails = (animeId: number) => {
  const [state, setState] = useState(() => {
    const cached = animeDetailsCache.get(animeId);
    return {
      data: cached?.data || null,
      loading: cached?.loading || false,
      error: cached?.error || null,
    };
  });
  
  const isMountedRef = useRef(true);

  const fetchDetails = async () => {
    const now = Date.now();
    const cached = animeDetailsCache.get(animeId);
    
    // Check if we have valid cached data
    if (cached?.data && (now - cached.timestamp < CACHE_DURATION)) {
      console.log(`✅ Using cached details for anime ${animeId}`);
      return cached.data;
    }

    // If already fetching this anime, wait for the existing promise
    const existingPromise = fetchPromises.get(animeId);
    if (existingPromise) {
      console.log(`⏳ Already fetching details for anime ${animeId}, waiting...`);
      return await existingPromise;
    }

    console.log(`🔄 Fetching fresh details for anime ${animeId}`);
    
    // Update loading state
    const loadingState = {
      data: cached?.data || null,
      loading: true,
      error: null,
      timestamp: now,
    };
    
    animeDetailsCache.set(animeId, loadingState);
    notifySubscribers(animeId, {
      data: loadingState.data,
      loading: true,
      error: null,
    });

    // Create fetch promise
    const promise = fetchAnimeDetails(animeId);
    fetchPromises.set(animeId, promise);

    try {
      const data = await promise;
      
      const successState = {
        data,
        loading: false,
        error: null,
        timestamp: Date.now(),
      };
      
      animeDetailsCache.set(animeId, successState);
      notifySubscribers(animeId, {
        data,
        loading: false,
        error: null,
      });
      
      console.log(`✅ Successfully fetched details for anime ${animeId}`);
      return data;
    } catch (error) {
      const errorState = {
        data: cached?.data || null,
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to fetch anime details'),
        timestamp: Date.now(),
      };
      
      animeDetailsCache.set(animeId, errorState);
      notifySubscribers(animeId, {
        data: errorState.data,
        loading: false,
        error: errorState.error,
      });
      
      console.error(`❌ Failed to fetch details for anime ${animeId}:`, error);
      throw error;
    } finally {
      fetchPromises.delete(animeId);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    // Subscribe to updates for this anime
    if (!subscribers.has(animeId)) {
      subscribers.set(animeId, new Set());
    }
    
    const updateState = (newState: any) => {
      if (isMountedRef.current) {
        setState(newState);
      }
    };
    
    subscribers.get(animeId)!.add(updateState);
    
    // Fetch if we don't have cached data or it's expired
    const cached = animeDetailsCache.get(animeId);
    const now = Date.now();
    
    if (!cached?.data || (now - cached.timestamp > CACHE_DURATION)) {
      fetchDetails().catch(() => {
        // Error is already handled in fetchDetails
      });
    } else {
      // Use cached data immediately
      setState({
        data: cached.data,
        loading: false,
        error: cached.error,
      });
    }

    return () => {
      isMountedRef.current = false;
      const subs = subscribers.get(animeId);
      if (subs) {
        subs.delete(updateState);
        if (subs.size === 0) {
          subscribers.delete(animeId);
        }
      }
    };
  }, [animeId]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchDetails,
  };
};
