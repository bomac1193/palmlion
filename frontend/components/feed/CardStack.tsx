// CardStack - Infinite swipeable card stack (Tinder-style)
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { MomentCard } from './MomentCard';
import { DashButton } from './DashButton';
import { Share2, MessageCircle, Repeat } from 'lucide-react';
import { useMomentDashes } from '@/hooks/useSocket';
import type { Moment } from '@/types';

interface CardStackProps {
  moments: Moment[];
  onDash: (moment: Moment) => void;
  onShare: (moment: Moment) => void;
  onRemix: (moment: Moment) => void;
  onCreatorClick: (creatorId: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export function CardStack({
  moments,
  onDash,
  onShare,
  onRemix,
  onCreatorClick,
  onLoadMore,
  hasMore,
}: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const currentMoment = moments[currentIndex];
  const nextMoment = moments[currentIndex + 1];

  // Socket hook for live dash updates on current moment
  const { latestDash, totalDashes, dashCount } = useMomentDashes(
    currentMoment?.id || null
  );

  // Load more when near end
  useEffect(() => {
    if (currentIndex >= moments.length - 3 && hasMore) {
      onLoadMore();
    }
  }, [currentIndex, moments.length, hasMore, onLoadMore]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;
    const velocity = 500;

    if (
      Math.abs(info.offset.x) > threshold ||
      Math.abs(info.velocity.x) > velocity
    ) {
      setExitDirection(info.offset.x > 0 ? 'right' : 'left');
    }
  };

  const handleExitComplete = () => {
    setExitDirection(null);
    setCurrentIndex((prev) => {
      // Loop back to start for infinite scroll
      if (prev >= moments.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };

  if (!currentMoment) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/60">No moments to show</p>
      </div>
    );
  }

  // Use socket data if available, otherwise use moment data
  const displayTotalDashes = totalDashes ?? currentMoment.totalDashes;
  const displayDashCount = dashCount ?? currentMoment.dashCount;

  return (
    <div className="relative w-full h-full max-w-md mx-auto">
      {/* Card Stack */}
      <div className="relative w-full h-[70vh] max-h-[600px]">
        {/* Next card (behind) */}
        {nextMoment && (
          <div className="absolute inset-0 scale-95 opacity-50">
            <MomentCard moment={nextMoment} />
          </div>
        )}

        {/* Current card (front) */}
        <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
          <motion.div
            key={currentMoment.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              x: exitDirection === 'right' ? 300 : -300,
              rotate: exitDirection === 'right' ? 10 : -10,
              opacity: 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <MomentCard
              moment={currentMoment}
              isActive
              onCreatorClick={onCreatorClick}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 mt-4">
        {/* Remix Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemix(currentMoment)}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
        >
          <Repeat size={20} className="text-white" />
        </motion.button>

        {/* Dash Button (center, prominent) */}
        <DashButton
          totalDashes={displayTotalDashes}
          dashCount={displayDashCount}
          city={currentMoment.city}
          latestDash={latestDash}
          onDash={() => onDash(currentMoment)}
        />

        {/* Share Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onShare(currentMoment)}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
        >
          <Share2 size={20} className="text-white" />
        </motion.button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {moments.slice(0, 5).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex % 5
                ? 'bg-dash-primary w-4'
                : 'bg-white/30'
            }`}
          />
        ))}
        {moments.length > 5 && (
          <span className="text-xs text-white/50 ml-1">
            +{moments.length - 5}
          </span>
        )}
      </div>
    </div>
  );
}
