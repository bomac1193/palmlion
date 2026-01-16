// DashButton - Prominent tipping button overlay
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import type { Currency, NewDashEvent } from '@/types';
import { CITY_CONFIG, City } from '@/types';

interface DashButtonProps {
  totalDashes: number;
  dashCount: number;
  city: City;
  latestDash?: NewDashEvent | null;
  onDash: () => void;
  disabled?: boolean;
}

export function DashButton({
  totalDashes,
  dashCount,
  city,
  latestDash,
  onDash,
  disabled,
}: DashButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const cityConfig = CITY_CONFIG[city];

  // Format total for display
  const formattedTotal = `${cityConfig.currencySymbol}${formatNumber(
    Math.floor(totalDashes / 100) // Convert from minor units
  )}`;

  const handleClick = () => {
    if (disabled) return;
    setIsAnimating(true);
    onDash();
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="relative flex flex-col items-center gap-2">
      {/* Latest Dash Animation */}
      <AnimatePresence>
        {latestDash && (
          <motion.div
            key={latestDash.dashId}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dash-accent text-dash-dark text-sm font-semibold">
              <Sparkles size={14} />
              {latestDash.formattedAmount} from {latestDash.sender.displayName}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dash Button */}
      <motion.button
        onClick={handleClick}
        disabled={disabled}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative w-16 h-16 rounded-full',
          'bg-gradient-to-br from-dash-primary to-dash-secondary',
          'flex items-center justify-center',
          'shadow-lg shadow-dash-primary/30',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'group'
        )}
      >
        {/* Pulse animation on new dash */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full bg-dash-primary"
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        <motion.div
          animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Zap
            size={28}
            className="text-white fill-white group-hover:scale-110 transition-transform"
          />
        </motion.div>
      </motion.button>

      {/* Stats below button */}
      <div className="flex flex-col items-center">
        <motion.span
          key={totalDashes}
          initial={{ scale: 1.2, color: '#FFE66D' }}
          animate={{ scale: 1, color: '#ffffff' }}
          className="text-lg font-bold text-white"
        >
          {formattedTotal}
        </motion.span>
        <span className="text-xs text-white/60">
          {formatNumber(dashCount)} dashes
        </span>
      </div>
    </div>
  );
}
