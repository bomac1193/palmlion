// DashModal - Payment flow modal for sending dashes
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, CreditCard, Smartphone, Loader2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { dashApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Moment, DashPreset, Currency } from '@/types';
import { CITY_CONFIG } from '@/types';

interface DashModalProps {
  moment: Moment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DashModal({ moment, isOpen, onClose }: DashModalProps) {
  const [presets, setPresets] = useState<DashPreset[]>([]);
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch presets on open
  useEffect(() => {
    if (isOpen) {
      dashApi.getPresets().then((data) => {
        setPresets(data.presets);
        setCurrency(data.currency as Currency);
        if (data.presets.length > 0) {
          setSelectedAmount(data.presets[0].amount);
        }
      });
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!moment || !selectedAmount) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await dashApi.initializePayment({
        momentId: moment.id,
        amount: selectedAmount,
        message: message || undefined,
      });

      // Redirect to payment page
      window.location.href = result.paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const cityConfig = moment ? CITY_CONFIG[moment.city] : null;

  return (
    <AnimatePresence>
      {isOpen && moment && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-0 left-0 right-0 bg-dash-dark rounded-t-3xl z-50 max-h-[90vh] overflow-auto"
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1.5 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="text-dash-primary" size={24} />
                  Send a Dash
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>

              {/* Creator info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <Avatar
                  src={moment.creator.avatarUrl}
                  name={moment.creator.displayName}
                  size="lg"
                />
                <div className="flex-1">
                  <p className="font-semibold text-white">
                    {moment.creator.displayName}
                  </p>
                  <p className="text-sm text-white/60">@{moment.creator.username}</p>
                </div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cityConfig?.color }}
                />
              </div>
            </div>

            {/* Amount Selection */}
            <div className="px-6 py-6">
              <label className="text-sm font-medium text-white/70 mb-3 block">
                Select amount
              </label>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {presets.map((preset) => (
                  <button
                    key={preset.amount}
                    onClick={() => {
                      setSelectedAmount(preset.amount);
                      setCustomAmount('');
                    }}
                    className={cn(
                      'py-3 rounded-xl font-semibold transition-all',
                      selectedAmount === preset.amount
                        ? 'bg-dash-primary text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    )}
                  >
                    {preset.display}
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  {cityConfig?.currencySymbol}
                </span>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    const val = parseInt(e.target.value) * 100; // Convert to minor units
                    setSelectedAmount(isNaN(val) ? null : val);
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-dash-primary"
                />
              </div>
            </div>

            {/* Message */}
            <div className="px-6 pb-6">
              <label className="text-sm font-medium text-white/70 mb-3 block">
                Add a message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say something nice..."
                maxLength={200}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-dash-primary resize-none"
              />
              <p className="text-xs text-white/40 text-right mt-1">
                {message.length}/200
              </p>
            </div>

            {/* Payment Methods */}
            <div className="px-6 pb-6">
              <p className="text-xs text-white/50 text-center mb-4">
                Pay securely with
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                  <CreditCard size={16} className="text-white/60" />
                  <span className="text-xs text-white/60">Card</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                  <Smartphone size={16} className="text-white/60" />
                  <span className="text-xs text-white/60">
                    {moment.city === 'NAIROBI' ? 'M-Pesa' : 'Transfer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-6 pb-4">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="px-6 pb-8">
              <Button
                onClick={handleSubmit}
                disabled={!selectedAmount || isLoading}
                isLoading={isLoading}
                className="w-full py-4 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2" size={20} />
                    Dash{' '}
                    {selectedAmount
                      ? `${cityConfig?.currencySymbol}${Math.floor(selectedAmount / 100)}`
                      : ''}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
