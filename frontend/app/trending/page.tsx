// Trending page - City-based leaderboards
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin } from 'lucide-react';
import { CityLeaderboard } from '@/components/trending/CityLeaderboard';
import { cn } from '@/lib/utils';
import type { City } from '@/types';
import { CITY_CONFIG } from '@/types';

const CITIES: City[] = ['LAGOS', 'JOBURG', 'NAIROBI'];

export default function TrendingPage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<City>('LAGOS');

  const handleCreatorClick = (creatorId: string) => {
    router.push(`/profile/${creatorId}`);
  };

  const handleMomentClick = (momentId: string) => {
    // Navigate to moment detail or scroll to it in feed
    router.push(`/?moment=${momentId}`);
  };

  return (
    <main className="min-h-screen bg-dash-darker">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dash-darker/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Trending</h1>
          </div>

          {/* City Tabs */}
          <div className="flex items-center gap-2 mt-4">
            {CITIES.map((city) => {
              const config = CITY_CONFIG[city];
              const isSelected = selectedCity === city;
              return (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isSelected
                      ? 'text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  )}
                  style={
                    isSelected ? { backgroundColor: config.color } : undefined
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

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <CityLeaderboard
          city={selectedCity}
          onCreatorClick={handleCreatorClick}
          onMomentClick={handleMomentClick}
        />
      </div>
    </main>
  );
}
