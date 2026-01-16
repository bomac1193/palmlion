// React hooks for fetching moments
'use client';

import { useState, useEffect, useCallback } from 'react';
import { momentsApi } from '@/lib/api';
import type { Moment, City } from '@/types';

interface UseMomentsOptions {
  city?: City;
  limit?: number;
  autoFetch?: boolean;
}

export function useMoments(options: UseMomentsOptions = {}) {
  const { city, limit = 20, autoFetch = true } = options;

  const [moments, setMoments] = useState<Moment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoments = useCallback(
    async (cursor?: string, append = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await momentsApi.getFeed({ city, cursor, limit });

        if (append) {
          setMoments((prev) => [...prev, ...response.moments]);
        } else {
          setMoments(response.moments);
        }

        setNextCursor(response.nextCursor);
        setHasMore(response.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch moments');
      } finally {
        setIsLoading(false);
      }
    },
    [city, limit]
  );

  const loadMore = useCallback(() => {
    if (nextCursor && !isLoading && hasMore) {
      fetchMoments(nextCursor, true);
    }
  }, [nextCursor, isLoading, hasMore, fetchMoments]);

  const refresh = useCallback(() => {
    setNextCursor(null);
    fetchMoments();
  }, [fetchMoments]);

  // Add a new moment to the feed (from socket)
  const addMoment = useCallback((moment: Moment) => {
    setMoments((prev) => [moment, ...prev]);
  }, []);

  // Update a moment's dash totals
  const updateMomentDashes = useCallback(
    (momentId: string, totalDashes: number, dashCount: number) => {
      setMoments((prev) =>
        prev.map((m) =>
          m.id === momentId ? { ...m, totalDashes, dashCount } : m
        )
      );
    },
    []
  );

  useEffect(() => {
    if (autoFetch) {
      fetchMoments();
    }
  }, [autoFetch, fetchMoments]);

  return {
    moments,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
    addMoment,
    updateMomentDashes,
  };
}

// Hook for single moment
export function useMoment(momentId: string | null) {
  const [moment, setMoment] = useState<Moment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMoment = useCallback(async () => {
    if (!momentId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await momentsApi.getMoment(momentId);
      setMoment(response.moment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch moment');
    } finally {
      setIsLoading(false);
    }
  }, [momentId]);

  useEffect(() => {
    if (momentId) {
      fetchMoment();
    }
  }, [momentId, fetchMoment]);

  // Update dash totals
  const updateDashes = useCallback((totalDashes: number, dashCount: number) => {
    setMoment((prev) =>
      prev ? { ...prev, totalDashes, dashCount } : null
    );
  }, []);

  return { moment, isLoading, error, refresh: fetchMoment, updateDashes };
}
