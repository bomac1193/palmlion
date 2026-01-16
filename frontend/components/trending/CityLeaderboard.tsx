// CityLeaderboard - Trending creators and moments by city
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, TrendingUp, Zap, Music } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { trendingApi } from '@/lib/api';
import { cn, formatNumber } from '@/lib/utils';
import type { City, TrendingMoment, LeaderboardCreator } from '@/types';
import { CITY_CONFIG } from '@/types';

interface CityLeaderboardProps {
  city: City;
  onCreatorClick?: (creatorId: string) => void;
  onMomentClick?: (momentId: string) => void;
}

type Timeframe = 'day' | 'week' | 'month' | 'all';

export function CityLeaderboard({
  city,
  onCreatorClick,
  onMomentClick,
}: CityLeaderboardProps) {
  const [tab, setTab] = useState<'moments' | 'creators'>('moments');
  const [timeframe, setTimeframe] = useState<Timeframe>('day');
  const [moments, setMoments] = useState<TrendingMoment[]>([]);
  const [creators, setCreators] = useState<LeaderboardCreator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cityConfig = CITY_CONFIG[city];

  useEffect(() => {
    setIsLoading(true);

    if (tab === 'moments') {
      trendingApi
        .getMoments(city, timeframe)
        .then((data) => setMoments(data.moments))
        .finally(() => setIsLoading(false));
    } else {
      trendingApi
        .getLeaderboard(city, timeframe)
        .then((data) => setCreators(data.creators))
        .finally(() => setIsLoading(false));
    }
  }, [city, tab, timeframe]);

  return (
    <div className="bg-dash-dark rounded-2xl overflow-hidden">
      {/* Header */}
      <div
        className="p-4 border-b border-white/10"
        style={{ backgroundColor: `${cityConfig.color}20` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: cityConfig.color }}
          />
          <h2 className="text-lg font-bold text-white">{cityConfig.name}</h2>
          <TrendingUp size={16} className="text-dash-primary ml-auto" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('moments')}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
              tab === 'moments'
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            )}
          >
            <Music size={14} className="inline mr-1.5" />
            Moments
          </button>
          <button
            onClick={() => setTab('creators')}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
              tab === 'creators'
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            )}
          >
            <Crown size={14} className="inline mr-1.5" />
            Creators
          </button>
        </div>
      </div>

      {/* Timeframe Filter */}
      <div className="flex gap-2 p-4 border-b border-white/5">
        {(['day', 'week', 'month', 'all'] as Timeframe[]).map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-all',
              timeframe === t
                ? 'bg-dash-primary text-white'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            )}
          >
            {t === 'day' ? '24h' : t === 'week' ? '7d' : t === 'month' ? '30d' : 'All'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-dash-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'moments' ? (
          <div className="space-y-3">
            {moments.map((moment, index) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onMomentClick?.(moment.id)}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all"
              >
                {/* Rank */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                    index === 0
                      ? 'bg-yellow-500 text-black'
                      : index === 1
                      ? 'bg-gray-300 text-black'
                      : index === 2
                      ? 'bg-amber-600 text-white'
                      : 'bg-white/10 text-white/60'
                  )}
                >
                  {moment.rank}
                </div>

                {/* Thumbnail */}
                {moment.thumbnailUrl && (
                  <img
                    src={moment.thumbnailUrl}
                    alt={moment.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{moment.title}</p>
                  <p className="text-xs text-white/50">
                    @{moment.creator.username}
                  </p>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <p className="font-semibold text-dash-accent">
                    {moment.formattedTotal}
                  </p>
                  <p className="text-xs text-white/50">
                    {formatNumber(moment.dashCount)} dashes
                  </p>
                </div>
              </motion.div>
            ))}

            {moments.length === 0 && (
              <p className="text-center text-white/50 py-8">No trending moments yet</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {creators.map((creator, index) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onCreatorClick?.(creator.id)}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all"
              >
                {/* Rank */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                    index === 0
                      ? 'bg-yellow-500 text-black'
                      : index === 1
                      ? 'bg-gray-300 text-black'
                      : index === 2
                      ? 'bg-amber-600 text-white'
                      : 'bg-white/10 text-white/60'
                  )}
                >
                  {creator.rank}
                </div>

                {/* Avatar */}
                <Avatar
                  src={creator.avatarUrl}
                  name={creator.displayName}
                  size="md"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {creator.displayName}
                  </p>
                  <p className="text-xs text-white/50">
                    @{creator.username} · {formatNumber(creator.momentCount)} moments
                  </p>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <p className="font-semibold text-dash-accent">
                    {creator.formattedTotal}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-xs text-white/50">
                    <Zap size={10} />
                    {formatNumber(creator.dashCount)}
                  </div>
                </div>
              </motion.div>
            ))}

            {creators.length === 0 && (
              <p className="text-center text-white/50 py-8">No creators yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
