// Dash failed page - Payment failure
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'payment_failed';

  const errorMessages: Record<string, string> = {
    payment_failed: 'The payment could not be completed.',
    verification_failed: 'Payment verification failed.',
    invalid_reference: 'Invalid payment reference.',
    server_error: 'A server error occurred.',
  };

  return (
    <main className="min-h-screen bg-dash-darker flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-sm w-full text-center"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center"
        >
          <XCircle size={48} className="text-red-500" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">
            Dash Failed
          </h1>
          <p className="text-white/60 mb-8">
            {errorMessages[error] || 'Something went wrong with your payment.'}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3"
        >
          <Button
            onClick={() => router.push('/')}
            className="w-full py-3"
          >
            <RefreshCw size={18} className="mr-2" />
            Try Again
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="w-full"
          >
            <Home size={18} className="mr-2" />
            Back to Feed
          </Button>
        </motion.div>

        {/* Help text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-white/40 mt-8"
        >
          If this problem persists, please contact support.
        </motion.p>
      </motion.div>
    </main>
  );
}
