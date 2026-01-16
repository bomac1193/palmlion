// Dasham MVP - TypeScript Types

// Cities
export type City = 'LAGOS' | 'JOBURG' | 'NAIROBI';

// Currencies
export type Currency = 'NGN' | 'ZAR' | 'KES';

// Moment types
export type MomentType = 'CLIP' | 'LIVE_EVENT' | 'AUDIO' | 'IMAGE';

// User types
export interface User {
  id: string;
  email?: string;
  phone?: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  city: City;
  country: string;
  isCreator: boolean;
  totalReceived?: number;
  formattedTotalReceived?: string;
  momentCount?: number;
  dashCount?: number;
  createdAt?: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  displayName: string;
  isCreator: boolean;
}

// Moment types
export interface Creator {
  id: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  isCreator: boolean;
}

export interface Moment {
  id: string;
  title: string;
  description?: string;
  type: MomentType;
  mediaUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  city: City;
  eventName?: string;
  venue?: string;
  totalDashes: number;
  dashCount: number;
  viewCount: number;
  creatorId: string;
  creator: Creator;
  createdAt: string;
  updatedAt: string;
  formattedTotal?: string;
}

// Dash types
export interface Dash {
  id: string;
  amount: number;
  currency: Currency;
  message?: string;
  createdAt: string;
  sender: {
    id: string;
    displayName: string;
    username: string;
    avatarUrl?: string;
  };
}

export interface DashPreset {
  amount: number;
  display: string;
}

// Trending types
export interface TrendingMoment extends Moment {
  rank: number;
}

export interface LeaderboardCreator {
  rank: number;
  id: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  totalReceived: number;
  formattedTotal: string;
  momentCount: number;
  dashCount: number;
}

// API Response types
export interface PaginatedResponse<T> {
  items?: T[];
  moments?: T[];
  dashes?: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaymentInitResponse {
  paymentUrl: string;
  reference: string;
}

// Socket event types
export interface NewDashEvent {
  dashId: string;
  momentId: string;
  amount: number;
  currency: Currency;
  message?: string;
  sender: {
    id: string;
    displayName: string;
    username: string;
    avatarUrl?: string;
  };
  formattedAmount: string;
}

export interface DashTotalUpdateEvent {
  momentId: string;
  totalDashes: number;
  dashCount: number;
}

// City configuration
export const CITY_CONFIG: Record<City, {
  name: string;
  country: string;
  currency: Currency;
  currencySymbol: string;
  color: string;
}> = {
  LAGOS: {
    name: 'Lagos',
    country: 'Nigeria',
    currency: 'NGN',
    currencySymbol: '₦',
    color: '#00A86B',
  },
  JOBURG: {
    name: 'Johannesburg',
    country: 'South Africa',
    currency: 'ZAR',
    currencySymbol: 'R',
    color: '#FFB81C',
  },
  NAIROBI: {
    name: 'Nairobi',
    country: 'Kenya',
    currency: 'KES',
    currencySymbol: 'KSh',
    color: '#BB0000',
  },
};
