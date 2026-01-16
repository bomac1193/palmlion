// MomentCard - Individual moment card in the feed
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Eye, MapPin } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { formatRelativeTime, formatNumber, cn } from '@/lib/utils';
import type { Moment } from '@/types';
import { CITY_CONFIG } from '@/types';

interface MomentCardProps {
  moment: Moment;
  isActive?: boolean;
  onCreatorClick?: (creatorId: string) => void;
}

export function MomentCard({ moment, isActive, onCreatorClick }: MomentCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const cityConfig = CITY_CONFIG[moment.city];
  const isVideo = moment.type === 'CLIP' || moment.type === 'LIVE_EVENT';

  return (
    <div className="relative w-full h-full bg-dash-darker rounded-3xl overflow-hidden">
      {/* Media Background */}
      <div className="absolute inset-0">
        {isVideo ? (
          <video
            src={moment.mediaUrl}
            poster={moment.thumbnailUrl || undefined}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            autoPlay={isActive}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <img
            src={moment.thumbnailUrl || moment.mediaUrl}
            alt={moment.title}
            className="w-full h-full object-cover"
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        {/* City Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm"
        >
          <MapPin size={14} style={{ color: cityConfig.color }} />
          <span className="text-xs font-medium text-white">{cityConfig.name}</span>
        </motion.div>

        {/* Media Controls */}
        {isVideo && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
            >
              {isMuted ? (
                <VolumeX size={16} className="text-white" />
              ) : (
                <Volume2 size={16} className="text-white" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Live Badge */}
      {moment.type === 'LIVE_EVENT' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-16 left-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-600"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-bold text-white">LIVE</span>
        </motion.div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        {/* Creator Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-3"
          onClick={() => onCreatorClick?.(moment.creatorId)}
        >
          <Avatar
            src={moment.creator.avatarUrl}
            name={moment.creator.displayName}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">
              {moment.creator.displayName}
            </p>
            <p className="text-xs text-white/70">@{moment.creator.username}</p>
          </div>
        </motion.div>

        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <h3 className="text-lg font-bold text-white line-clamp-2">
            {moment.title}
          </h3>
          {moment.description && (
            <p className="text-sm text-white/70 line-clamp-2 mt-1">
              {moment.description}
            </p>
          )}
          {moment.venue && (
            <p className="text-xs text-white/50 mt-1">
              {moment.eventName ? `${moment.eventName} @ ` : ''}
              {moment.venue}
            </p>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 text-white/70"
        >
          <div className="flex items-center gap-1.5">
            <Eye size={14} />
            <span className="text-xs">{formatNumber(moment.viewCount)}</span>
          </div>
          <div className="text-xs">
            {formatRelativeTime(moment.createdAt)}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
