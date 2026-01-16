// Home page - Main feed with infinite card stack
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, TrendingUp, User, Plus } from 'lucide-react';
import { CardStack } from '@/components/feed/CardStack';
import { DashModal } from '@/components/payment/DashModal';
import { useMoments } from '@/hooks/useMoments';
import { useSocket, useCityUpdates } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';
import type { Moment, City } from '@/types';
import { CITY_CONFIG } from '@/types';

const CITIES: City[] = ['LAGOS', 'JOBURG', 'NAIROBI'];

export default function HomePage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<City | undefined>(undefined);
  const [dashingMoment, setDashingMoment] = useState<Moment | null>(null);
  const [isDashModalOpen, setIsDashModalOpen] = useState(false);

  // Initialize socket
  const { isConnected } = useSocket();

  // Fetch moments
  const { moments, isLoading, hasMore, loadMore, addMoment, updateMomentDashes } =
    useMoments({ city: selectedCity });

  // Listen for city updates
  const { newMoment, trendingUpdated, clearNewMoment } = useCityUpdates(
    selectedCity || null
  );

  // Add new moments from socket
  useEffect(() => {
    if (newMoment) {
      addMoment(newMoment);
      clearNewMoment();
    }
  }, [newMoment, addMoment, clearNewMoment]);

  const handleDash = useCallback((moment: Moment) => {
    setDashingMoment(moment);
    setIsDashModalOpen(true);
  }, []);

  const handleShare = useCallback((moment: Moment) => {
    if (navigator.share) {
      navigator.share({
        title: moment.title,
        text: `Check out this moment by ${moment.creator.displayName} on Dasham!`,
        url: `${window.location.origin}/moment/${moment.id}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${window.location.origin}/moment/${moment.id}`
      );
      alert('Link copied to clipboard!');
    }
  }, []);

  const handleRemix = useCallback((moment: Moment) => {
    // Future feature - navigate to remix page
    console.log('Remix:', moment.id);
    alert('Remix feature coming soon!');
  }, []);

  const handleCreatorClick = useCallback(
    (creatorId: string) => {
      router.push(`/profile/${creatorId}`);
    },
    [router]
  );

  return (
    <main className="min-h-screen bg-dash-darker">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-dash-darker/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-dash-primary to-dash-secondary bg-clip-text text-transparent">
              Dasham
            </h1>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/trending')}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <TrendingUp size={18} className="text-white" />
              </button>
              <button
                onClick={() => router.push('/profile/me')}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <User size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
            <button
              onClick={() => setSelectedCity(undefined)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                !selectedCity
                  ? 'bg-dash-primary text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              )}
            >
              All Cities
            </button>
            {CITIES.map((city) => {
              const config = CITY_CONFIG[city];
              return (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                    selectedCity === city
                      ? 'text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  )}
                  style={
                    selectedCity === city
                      ? { backgroundColor: config.color }
                      : undefined
                  }
                >
                  <MapPin size={14} />
                  {config.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-8 px-4">
        {/* Connection indicator */}
        {!isConnected && (
          <div className="fixed bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-full bg-yellow-600/20 text-yellow-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            Connecting...
          </div>
        )}

        {/* Loading state */}
        {isLoading && moments.length === 0 ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-dash-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-white/60">Loading moments...</p>
            </div>
          </div>
        ) : moments.length === 0 ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4 text-center px-8">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <Plus size={32} className="text-white/40" />
              </div>
              <h2 className="text-xl font-semibold text-white">No moments yet</h2>
              <p className="text-white/60">
                Be the first to share a cultural moment from{' '}
                {selectedCity
                  ? CITY_CONFIG[selectedCity].name
                  : 'Lagos, Joburg, or Nairobi'}
                !
              </p>
            </div>
          </div>
        ) : (
          <CardStack
            moments={moments}
            onDash={handleDash}
            onShare={handleShare}
            onRemix={handleRemix}
            onCreatorClick={handleCreatorClick}
            onLoadMore={loadMore}
            hasMore={hasMore}
          />
        )}
      </div>

      {/* Dash Modal */}
      <DashModal
        moment={dashingMoment}
        isOpen={isDashModalOpen}
        onClose={() => {
          setIsDashModalOpen(false);
          setDashingMoment(null);
        }}
      />
    </main>
  );
}
