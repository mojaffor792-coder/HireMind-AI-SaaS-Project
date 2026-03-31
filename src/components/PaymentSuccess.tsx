import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useApp, PlanLevel } from '../context/AppContext';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const PaymentSuccess: React.FC = () => {
  const { user, upgradePlan } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plan = searchParams.get('plan') as PlanLevel;
  const [countdown, setCountdown] = useState(5);
  const [isUpgrading, setIsUpgrading] = useState(true);

  useEffect(() => {
    if (plan && user) {
      upgradePlan(plan).then(() => {
        setIsUpgrading(false);
      });
    }
  }, [plan, user, upgradePlan]);

  useEffect(() => {
    if (isUpgrading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isUpgrading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-2xl shadow-blue-500/10 text-center space-y-8 border border-gray-100"
      >
        <div className="relative inline-block">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500"
          >
            <CheckCircle className="w-12 h-12" />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl -z-10"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Payment Successful!</h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Thank you for upgrading, <span className="text-blue-600 font-bold">{user?.name}</span>! 
            Your account has been successfully upgraded to the <span className="text-blue-600 font-bold uppercase">{plan}</span> plan.
          </p>
        </div>

        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">New Features Unlocked</p>
          <ul className="text-sm text-gray-600 space-y-2 font-medium">
            <li>• Advanced AI Resume Analysis</li>
            <li>• Semantic Candidate Matching</li>
            <li>• Predictive Hiring Analytics</li>
          </ul>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/dashboard')}
            disabled={isUpgrading}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all group disabled:opacity-50"
          >
            {isUpgrading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Upgrading Account...
              </>
            ) : (
              <>
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          {!isUpgrading && (
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
              <Loader2 className="w-3 h-3 animate-spin" />
              Redirecting in {countdown}s
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
