// Socket.io React hook for real-time updates
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  initSocket,
  disconnectSocket,
  joinCity,
  leaveCity,
  joinMoment,
  leaveMoment,
  onNewDash,
  onDashTotalUpdate,
  onTrendingUpdate,
  onNewMoment,
} from '@/lib/socket';
import type { City, NewDashEvent, DashTotalUpdateEvent, Moment } from '@/types';

// Hook for socket connection
export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = initSocket();

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    setIsConnected(socket.connected);

    return () => {
      // Don't disconnect on unmount - socket is shared
    };
  }, []);

  return { isConnected };
}

// Hook for city-based updates
export function useCityUpdates(city: City | null) {
  const [trendingUpdated, setTrendingUpdated] = useState<string | null>(null);
  const [newMoment, setNewMoment] = useState<Moment | null>(null);

  useEffect(() => {
    if (!city) return;

    initSocket();
    joinCity(city);

    const unsubTrending = onTrendingUpdate((event) => {
      setTrendingUpdated(event.momentId);
    });

    const unsubNewMoment = onNewMoment((event) => {
      setNewMoment(event.moment);
    });

    return () => {
      leaveCity(city);
      unsubTrending();
      unsubNewMoment();
    };
  }, [city]);

  const clearTrendingUpdate = useCallback(() => {
    setTrendingUpdated(null);
  }, []);

  const clearNewMoment = useCallback(() => {
    setNewMoment(null);
  }, []);

  return { trendingUpdated, newMoment, clearTrendingUpdate, clearNewMoment };
}

// Hook for moment-specific dash updates
export function useMomentDashes(momentId: string | null) {
  const [latestDash, setLatestDash] = useState<NewDashEvent | null>(null);
  const [totalDashes, setTotalDashes] = useState<number | null>(null);
  const [dashCount, setDashCount] = useState<number | null>(null);

  useEffect(() => {
    if (!momentId) return;

    initSocket();
    joinMoment(momentId);

    const unsubNewDash = onNewDash((event) => {
      if (event.momentId === momentId) {
        setLatestDash(event);
      }
    });

    const unsubTotal = onDashTotalUpdate((event) => {
      if (event.momentId === momentId) {
        setTotalDashes(event.totalDashes);
        setDashCount(event.dashCount);
      }
    });

    return () => {
      leaveMoment(momentId);
      unsubNewDash();
      unsubTotal();
    };
  }, [momentId]);

  const clearLatestDash = useCallback(() => {
    setLatestDash(null);
  }, []);

  return { latestDash, totalDashes, dashCount, clearLatestDash };
}
