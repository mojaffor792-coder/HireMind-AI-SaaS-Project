import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  X, 
  Sparkles, 
  Check, 
  Zap, 
  Star, 
  Shield, 
  Building2 
} from 'lucide-react';
import { useApp, PlanLevel } from '../context/AppContext';
import { cn } from '../lib/utils';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan: PlanLevel;
  featureName: string;
  onUpgrade: (plan: PlanLevel) => void;
}

const PLAN_ICONS: Record<PlanLevel, any> = {
  'FREE': Lock,
  'STARTER': Zap,
  'GROWTH': Star,
  'PRO': Shield,
  'ENTERPRISE': Building2
};

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, requiredPlan, featureName, onUpgrade }) => {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    onUpgrade(requiredPlan);
  };

  const Icon = PLAN_ICONS[requiredPlan];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl shadow-blue-500/20 relative"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Icon className="w-10 h-10 text-blue-600" />
            </div>
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                Premium Feature
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Unlock {featureName}</h2>
              <p className="text-gray-500 text-base leading-relaxed">
                This feature is available in the <span className="font-black text-blue-600 uppercase tracking-wider">{requiredPlan}</span> plan and above. Upgrade your plan to unlock full potential.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-gray-50 rounded-3xl p-6 space-y-3 text-left">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">What you'll get:</h4>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-gray-700">Full access to {featureName}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-gray-700">Advanced AI matching capabilities</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-gray-700">Priority processing for your data</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={handleUpgrade}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Upgrade to {requiredPlan}
                <Sparkles className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="w-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-bold py-4 rounded-2xl transition-all"
              >
                Maybe Later
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Trusted by 500+ high-growth companies worldwide
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
