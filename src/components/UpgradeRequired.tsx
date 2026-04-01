import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UpgradeRequired: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 text-center space-y-8"
      >
        <div className="relative mx-auto inline-block">
          <div className="text-[12px] font-black bg-blue-50 text-blue-600 px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-sm border border-blue-100">
            Premium
          </div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-display font-bold text-gray-900 tracking-tight">Smart Feature</h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Upgrade your plan to unlock this advanced recruitment tool.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <button
            onClick={() => navigate('/pricing')}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-gray-900/10"
          >
            <CreditCard className="w-4 h-4" />
            View Pricing
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-white text-gray-500 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            Back to Dashboard
          </button>
        </div>

        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
          Secure Payment via LemonSqueezy
        </p>
      </motion.div>
    </div>
  );
};
