// Dash success page - Payment confirmation
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  return (
    <main className="min-h-screen bg-dash-darker flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-sm w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <CheckCircle size={48} className="text-green-500" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">
            Dash Sent Successfully!
          </h1>
          <p className="text-white/60 mb-8">
            Your support has been delivered to the creator. Thank you for being part
            of the Dasham community!
          </p>
        </motion.div>

        {/* Celebration animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <Zap
                size={24}
                className="text-dash-accent"
                style={{ transform: `rotate(${(i - 2) * 15}deg)` }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Reference */}
        {reference && (
          <p className="text-xs text-white/40 mb-6">
            Reference: {reference}
          </p>
        )}

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3"
        >
          <Button
            onClick={() => router.push('/')}
            className="w-full py-3"
          >
            <Home size={18} className="mr-2" />
            Back to Feed
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-full"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
