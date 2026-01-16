// Profile page - Creator/user profile
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Zap, Music, Calendar, ExternalLink } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { usersApi, momentsApi } from '@/lib/api';
import { formatRelativeTime, formatNumber, cn } from '@/lib/utils';
import type { User, Moment, City } from '@/types';
import { CITY_CONFIG } from '@/types';

interface ProfilePageProps {
  params: { id: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [profileRes, momentsRes] = await Promise.all([
          usersApi.getProfile(params.id),
          usersApi.getMoments(params.id),
        ]);

        setUser(profileRes.user);
        setMoments(momentsRes.moments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-dash-darker flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-dash-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="min-h-screen bg-dash-darker flex items-center justify-center">
        <div className="text-center px-8">
          <p className="text-white/60 mb-4">{error || 'User not found'}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </main>
    );
  }

  const cityConfig = CITY_CONFIG[user.city];

  return (
    <main className="min-h-screen bg-dash-darker">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dash-darker/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <h1 className="text-lg font-bold text-white truncate">
            @{user.username}
          </h1>
        </div>
      </header>

      {/* Profile Header */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-start gap-4 mb-6">
          <Avatar
            src={user.avatarUrl}
            name={user.displayName}
            size="xl"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">
              {user.displayName}
            </h2>
            <p className="text-white/60">@{user.username}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <MapPin
                size={14}
                style={{ color: cityConfig.color }}
              />
              <span className="text-sm text-white/70">{cityConfig.name}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-white/80 mb-6">{user.bio}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">
              {formatNumber(user.momentCount || 0)}
            </p>
            <p className="text-xs text-white/50 mt-1">Moments</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-dash-accent">
              {user.formattedTotalReceived || `${cityConfig.currencySymbol}0`}
            </p>
            <p className="text-xs text-white/50 mt-1">Received</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">
              {formatNumber(user.dashCount || 0)}
            </p>
            <p className="text-xs text-white/50 mt-1">Dashes</p>
          </div>
        </div>

        {/* Creator Badge */}
        {user.isCreator && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dash-primary/20 mb-6">
            <Zap size={18} className="text-dash-primary" />
            <span className="text-sm font-medium text-dash-primary">
              Verified Creator
            </span>
          </div>
        )}

        {/* Moments Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Music size={18} />
            Moments
          </h3>

          {moments.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              No moments yet
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {moments.map((moment) => (
                <div
                  key={moment.id}
                  onClick={() => router.push(`/?moment=${moment.id}`)}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group"
                >
                  <img
                    src={moment.thumbnailUrl || moment.mediaUrl}
                    alt={moment.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-medium text-white line-clamp-2">
                      {moment.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
                      <Zap size={12} className="text-dash-accent" />
                      {formatNumber(moment.totalDashes / 100)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
