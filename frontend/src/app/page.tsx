'use client'

import { motion } from 'framer-motion'
import { Crown, Target, Trophy, Zap, Music, Users, TrendingUp } from 'lucide-react'

// Demo data
const demoUser = {
  displayName: 'AfrobeatKing_Lagos',
  tier: 'diamond',
  convictionScore: 847,
  percentile: 95,
  streak: 15,
}

const demoMissions = [
  {
    id: '1',
    title: 'Share Burna Boy to 5 WhatsApp groups',
    platform: 'whatsapp',
    progress: 3,
    threshold: 5,
    reward: '50 conviction pts',
  },
  {
    id: '2',
    title: 'Join #PalmPride Telegram',
    platform: 'telegram',
    progress: 1,
    threshold: 1,
    reward: '25 conviction pts',
  },
  {
    id: '3',
    title: 'Stream Tems 100x on Boomplay',
    platform: 'boomplay',
    progress: 67,
    threshold: 100,
    reward: '100 conviction pts',
  },
]

const demoLeaderboard = [
  { rank: 1, name: 'AfrobeatKing_Lagos', score: 847, region: 'Lagos' },
  { rank: 2, name: 'TemsFan254', score: 723, region: 'Nairobi' },
  { rank: 3, name: 'AmapianoPrincess', score: 651, region: 'Joburg' },
  { rank: 4, name: 'BurnaBoyFC', score: 598, region: 'Lagos' },
  { rank: 5, name: 'GhanaStreamer', score: 512, region: 'Accra' },
]

export default function PalmlionDashboard() {
  return (
    <div className="min-h-screen bg-midnight text-text-primary">
      {/* Header */}
      <header className="border-b border-charcoal">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="lion-badge text-2xl"
              >
                🦁
              </motion.div>
              <div>
                <h1 className="font-display text-xl font-bold tracking-tight">PALMLION</h1>
                <p className="text-xs text-text-tertiary">African Music Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">{demoUser.displayName}</div>
                <div className="text-xs text-palm-gold uppercase">{demoUser.tier}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-palm flex items-center justify-center text-midnight font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section - Impact Power Formula */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="conviction-card mb-8 text-center"
        >
          <div className="palm-label justify-center mb-4">
            <Zap className="w-4 h-4" />
            IMPACT POWER FORMULA
          </div>
          <div className="font-mono text-xl mb-6">
            <span className="text-palm-gold">Verified Actions</span>
            <span className="text-text-tertiary"> × </span>
            <span className="text-kente-green">Outcome Lift</span>
            <span className="text-text-tertiary"> × </span>
            <span className="text-kente-red">Conviction Weight</span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 bg-charcoal rounded-lg">
              <div className="text-4xl font-mono font-bold text-palm-gold">{demoUser.convictionScore}</div>
              <div className="text-xs text-text-secondary mt-1">Conviction Score</div>
            </div>
            <div className="p-4 bg-charcoal rounded-lg">
              <div className="text-4xl font-mono font-bold text-kente-green">1.24</div>
              <div className="text-xs text-text-secondary mt-1">Outcome Lift</div>
            </div>
            <div className="p-4 bg-charcoal rounded-lg">
              <div className="text-4xl font-mono font-bold text-kente-red">0.92</div>
              <div className="text-xs text-text-secondary mt-1">Conviction Weight</div>
            </div>
          </div>
          <div className="mt-6 text-5xl font-mono font-bold">
            = <span className="text-palm-gold animate-conviction-pulse inline-block">967</span> IMPACT
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conviction Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="conviction-card"
          >
            <div className="palm-label mb-4">
              <Trophy className="w-4 h-4" />
              YOUR CONVICTION
            </div>
            <div className="text-5xl font-mono font-bold text-palm-gold mb-2">
              {demoUser.convictionScore}
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 rounded-full bg-gradient-palm text-midnight text-xs font-bold uppercase">
                {demoUser.tier}
              </span>
              <span className="text-text-secondary text-sm">Top {100 - demoUser.percentile}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Streak</span>
                <span className="text-palm-gold">{demoUser.streak} days 🔥</span>
              </div>
              <div className="h-2 bg-charcoal rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${demoUser.percentile}%` }}
                  className="h-full bg-gradient-palm"
                />
              </div>
            </div>
          </motion.div>

          {/* #PalmDash Missions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="conviction-card"
          >
            <div className="palm-label mb-4">
              <Target className="w-4 h-4" />
              #PALMDASH MISSIONS
            </div>
            <div className="space-y-4">
              {demoMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="p-3 bg-charcoal/50 rounded-lg border border-charcoal hover:border-palm-gold/30 transition-colors"
                >
                  <div className="text-sm font-medium mb-2">{mission.title}</div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-text-secondary capitalize">{mission.platform}</span>
                    <span className="text-palm-gold font-mono">
                      {mission.progress}/{mission.threshold}
                    </span>
                  </div>
                  <div className="h-1.5 bg-midnight rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-palm transition-all"
                      style={{ width: `${(mission.progress / mission.threshold) * 100}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-kente-green">{mission.reward}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="conviction-card"
          >
            <div className="palm-label mb-4">
              <Users className="w-4 h-4" />
              LAGOS ELITE 100
            </div>
            <div className="space-y-2">
              {demoLeaderboard.map((entry, index) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    index === 0 ? 'bg-palm-gold/10 border border-palm-gold/30' : 'bg-charcoal/30'
                  }`}
                >
                  <div className="w-6 text-center">
                    {entry.rank === 1 ? '👑' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium truncate">{entry.name}</div>
                    <div className="text-xs text-text-tertiary">{entry.region}</div>
                  </div>
                  <div className="font-mono font-bold text-palm-gold">{entry.score}</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-center text-palm-gold text-sm hover:text-palm-gold/80 transition-colors">
              View Full Rankings
            </button>
          </motion.div>
        </div>

        {/* Streaming Proof Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="conviction-card mt-6"
        >
          <div className="palm-label mb-4">
            <Music className="w-4 h-4" />
            STREAMING PROOF
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { platform: 'Boomplay', plays: 847, verified: true },
              { platform: 'Audiomack', plays: 1203, verified: true },
              { platform: 'YouTube', plays: 2104, verified: true },
            ].map((item) => (
              <div key={item.platform} className="p-4 bg-charcoal/50 rounded-lg text-center">
                <div className="text-lg font-bold">{item.platform}</div>
                <div className="text-2xl font-mono text-palm-gold">{item.plays.toLocaleString()}</div>
                <div className="text-xs text-success mt-1">✓ Verified</div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 bg-gradient-palm text-midnight font-bold rounded-lg hover:opacity-90 transition-opacity">
            Verify More Platforms
          </button>
        </motion.div>
      </main>
    </div>
  )
}
