// Socket.io client setup for real-time updates
import { io, Socket } from 'socket.io-client';
import type { NewDashEvent, DashTotalUpdateEvent, Moment, City } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

let socket: Socket | null = null;

// Socket events (must match server)
export const SOCKET_EVENTS = {
  // Client → Server
  JOIN_CITY: 'join-city',
  LEAVE_CITY: 'leave-city',
  JOIN_MOMENT: 'join-moment',
  LEAVE_MOMENT: 'leave-moment',

  // Server → Client
  NEW_DASH: 'new-dash',
  DASH_TOTAL_UPDATE: 'dash-total-update',
  TRENDING_UPDATE: 'trending-update',
  NEW_MOMENT: 'new-moment',
};

// Initialize socket connection
export function initSocket(): Socket {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error);
  });

  return socket;
}

// Get socket instance
export function getSocket(): Socket | null {
  return socket;
}

// Disconnect socket
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Join city room for trending updates
export function joinCity(city: City): void {
  socket?.emit(SOCKET_EVENTS.JOIN_CITY, city.toLowerCase());
}

// Leave city room
export function leaveCity(city: City): void {
  socket?.emit(SOCKET_EVENTS.LEAVE_CITY, city.toLowerCase());
}

// Join moment room for live dash updates
export function joinMoment(momentId: string): void {
  socket?.emit(SOCKET_EVENTS.JOIN_MOMENT, momentId);
}

// Leave moment room
export function leaveMoment(momentId: string): void {
  socket?.emit(SOCKET_EVENTS.LEAVE_MOMENT, momentId);
}

// Event listeners
export function onNewDash(callback: (event: NewDashEvent) => void): () => void {
  socket?.on(SOCKET_EVENTS.NEW_DASH, callback);
  return () => socket?.off(SOCKET_EVENTS.NEW_DASH, callback);
}

export function onDashTotalUpdate(
  callback: (event: DashTotalUpdateEvent) => void
): () => void {
  socket?.on(SOCKET_EVENTS.DASH_TOTAL_UPDATE, callback);
  return () => socket?.off(SOCKET_EVENTS.DASH_TOTAL_UPDATE, callback);
}

export function onTrendingUpdate(
  callback: (event: { momentId: string }) => void
): () => void {
  socket?.on(SOCKET_EVENTS.TRENDING_UPDATE, callback);
  return () => socket?.off(SOCKET_EVENTS.TRENDING_UPDATE, callback);
}

export function onNewMoment(
  callback: (event: { moment: Moment }) => void
): () => void {
  socket?.on(SOCKET_EVENTS.NEW_MOMENT, callback);
  return () => socket?.off(SOCKET_EVENTS.NEW_MOMENT, callback);
}
