// API client for Dasham backend
import type {
  Moment,
  User,
  DashPreset,
  TrendingMoment,
  LeaderboardCreator,
  AuthResponse,
  PaymentInitResponse,
  PaginatedResponse,
  City,
  Dash,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Token storage
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('dasham_token', token);
  } else {
    localStorage.removeItem('dasham_token');
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('dasham_token');
  }
  return authToken;
}

// Base fetch with auth
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth API
export const authApi = {
  register: (data: {
    email?: string;
    phone?: string;
    password: string;
    displayName: string;
    username: string;
    city?: City;
  }) => apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data: { email?: string; phone?: string; password: string }) =>
    apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  requestOtp: (phone: string) =>
    apiFetch<{ message: string }>('/api/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, code: string) =>
    apiFetch<AuthResponse>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    }),

  googleAuth: (idToken: string) =>
    apiFetch<AuthResponse>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    }),

  getMe: () => apiFetch<{ user: User }>('/api/auth/me'),
};

// Moments API
export const momentsApi = {
  getFeed: (params?: { city?: City; cursor?: string; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.set('city', params.city);
    if (params?.cursor) searchParams.set('cursor', params.cursor);
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    return apiFetch<PaginatedResponse<Moment> & { moments: Moment[] }>(
      `/api/moments?${searchParams}`
    );
  },

  getMoment: (id: string) =>
    apiFetch<{ moment: Moment & { dashes: Dash[] } }>(`/api/moments/${id}`),

  createMoment: (data: {
    title: string;
    description?: string;
    type: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    duration?: number;
    city: City;
    eventName?: string;
    venue?: string;
  }) =>
    apiFetch<{ moment: Moment }>('/api/moments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getDashes: (momentId: string, cursor?: string) => {
    const searchParams = new URLSearchParams();
    if (cursor) searchParams.set('cursor', cursor);

    return apiFetch<PaginatedResponse<Dash> & { dashes: Dash[] }>(
      `/api/moments/${momentId}/dashes?${searchParams}`
    );
  },
};

// Dash API
export const dashApi = {
  getPresets: () =>
    apiFetch<{ currency: string; presets: DashPreset[] }>('/api/dash/presets'),

  initializePayment: (data: { momentId: string; amount: number; message?: string }) =>
    apiFetch<PaymentInitResponse>('/api/dash/initialize-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getHistory: (cursor?: string) => {
    const searchParams = new URLSearchParams();
    if (cursor) searchParams.set('cursor', cursor);

    return apiFetch<PaginatedResponse<Dash> & { dashes: Dash[] }>(
      `/api/dash/history?${searchParams}`
    );
  },
};

// Trending API
export const trendingApi = {
  getStats: () =>
    apiFetch<{
      cities: Array<{
        city: City;
        currency: string;
        momentCount: number;
        topMoment: { id: string; title: string; formattedTotal: string } | null;
        totalDashed: number;
        formattedTotalDashed: string;
      }>;
    }>('/api/trending'),

  getMoments: (city: City, timeframe: 'day' | 'week' | 'month' | 'all' = 'day') =>
    apiFetch<{
      city: City;
      timeframe: string;
      currency: string;
      moments: TrendingMoment[];
    }>(`/api/trending/${city.toLowerCase()}?timeframe=${timeframe}`),

  getLeaderboard: (city: City, timeframe: 'day' | 'week' | 'month' | 'all' = 'day') =>
    apiFetch<{
      city: City;
      timeframe: string;
      currency: string;
      creators: LeaderboardCreator[];
    }>(`/api/trending/leaderboard/${city.toLowerCase()}?timeframe=${timeframe}`),
};

// Users API
export const usersApi = {
  getProfile: (identifier: string) =>
    apiFetch<{ user: User }>(`/api/users/${identifier}`),

  getMoments: (identifier: string, cursor?: string) => {
    const searchParams = new URLSearchParams();
    if (cursor) searchParams.set('cursor', cursor);

    return apiFetch<PaginatedResponse<Moment> & { moments: Moment[] }>(
      `/api/users/${identifier}/moments?${searchParams}`
    );
  },

  updateProfile: (data: Partial<{
    displayName: string;
    username: string;
    bio: string;
    avatarUrl: string;
    city: City;
  }>) =>
    apiFetch<{ user: User }>('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  becomeCreator: (bio: string) =>
    apiFetch<{ message: string; user: User }>('/api/users/become-creator', {
      method: 'POST',
      body: JSON.stringify({ bio }),
    }),
};
