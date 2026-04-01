import React, { useState, useEffect, memo } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  X,
  Zap, 
  Star, 
  Shield, 
  Rocket, 
  Building2, 
  ChevronDown,
  Info
} from 'lucide-react';
import { useApp, PlanLevel } from '../context/AppContext';
import { cn } from '../lib/utils';
import { PLANS, Plan } from '../constants/plans';

const COMPARISON_FEATURES = [
  { name: 'Resume Upload Limit', free: '10/mo', starter: '100/mo', growth: '1,000/mo', pro: '5,000/mo', enterprise: 'Unlimited' },
  { name: 'AI Resume Analysis', free: false, starter: true, growth: true, pro: true, enterprise: true },
  { name: 'Semantic Matching', free: false, starter: false, growth: true, pro: true, enterprise: true },
  { name: 'Hiring Prediction', free: false, starter: false, growth: false, pro: true, enterprise: true },
  { name: 'Fraud Detection', free: false, starter: false, growth: false, pro: true, enterprise: true },
  { name: 'JD Generator', free: false, starter: false, growth: true, pro: true, enterprise: true },
  { name: 'Advanced Analytics', free: false, starter: false, growth: true, pro: true, enterprise: true },
  { name: 'API Access', free: false, starter: false, growth: false, pro: false, enterprise: true },
];

interface PricingProps {
  highlightedPlan: PlanLevel | null;
  onSelect: () => void;
  onBack?: () => void;
}

export const Pricing = memo<PricingProps>(({ highlightedPlan, onSelect, onBack }) => {
  const { user, upgradePlan } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const planRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (highlightedPlan && planRefs.current[highlightedPlan]) {
      planRefs.current[highlightedPlan]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedPlan]);

  const handleSelect = (plan: Plan) => {
    const baseUrl = billingCycle === 'yearly' ? plan.yearlyCheckoutUrl || plan.checkoutUrl : plan.checkoutUrl;
    if (baseUrl) {
      const successUrl = `${window.location.origin}/payment-success?plan=${plan.id}`;
      const checkoutUrl = `${baseUrl}?checkout[success_url]=${encodeURIComponent(successUrl)}`;
      window.location.href = checkoutUrl;
    }
    onSelect();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-12 animate-in fade-in duration-700 relative">
      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-0 left-0 flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm uppercase tracking-widest transition-all group"
        >
          <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-gray-900 transition-all">
            <ChevronDown className="w-4 h-4 rotate-90" />
          </div>
          Back
        </button>
      )}

      {/* Header */}
      <div className="text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest animate-bounce">
            <Rocket className="w-4 h-4" />
            Scale Your Hiring
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            {user?.subscriptionPlan === null ? 'Choose Your Plan to Continue' : 'Simple, Transparent Pricing'}
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium">
            {user?.subscriptionPlan === null 
              ? 'Select a plan to unlock the full power of HireMind AI and access your dashboard.' 
              : 'Choose the plan that\'s right for your hiring needs. All plans include our core AI engine.'}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <span className={cn("text-sm font-bold transition-colors", billingCycle === 'monthly' ? "text-gray-900" : "text-gray-400")}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-14 h-7 bg-gray-200 rounded-full p-1 transition-colors hover:bg-gray-300"
          >
            <motion.div
              animate={{ x: billingCycle === 'monthly' ? 0 : 28 }}
              className="w-5 h-5 bg-white rounded-full shadow-sm"
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-bold transition-colors", billingCycle === 'yearly' ? "text-gray-900" : "text-gray-400")}>
              Yearly
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-wider">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 items-stretch group/container">
        {PLANS.map((plan) => {
          const isCurrent = user?.subscriptionPlan === plan.id;
          const isHighlighted = highlightedPlan === plan.id;
          const accentColor = plan.color;
          const currentPrice = billingCycle === 'yearly' ? plan.yearlyPrice : plan.price;
          
          // Dynamic classes for borders and shadows based on plan color
          const borderClasses = {
            slate: "border-slate-400 shadow-[0_0_50px_rgba(148,163,184,0.25)] ring-slate-400/10 hover:border-slate-500/50",
            blue: "border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.25)] ring-blue-500/10 hover:border-blue-600/50",
            purple: "border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.25)] ring-purple-500/10 hover:border-purple-600/50",
            orange: "border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.25)] ring-orange-500/10 hover:border-orange-600/50",
            rose: "border-rose-800 shadow-[0_0_50px_rgba(159,18,57,0.25)] ring-rose-800/10 hover:border-rose-900/50"
          }[accentColor as keyof typeof borderClasses];

          const highlightShadowClasses = {
            slate: "shadow-[0_20px_50px_rgba(148,163,184,0.15)]",
            blue: "shadow-[0_20px_50px_rgba(59,130,246,0.15)]",
            purple: "shadow-[0_20px_50px_rgba(168,85,247,0.15)]",
            orange: "shadow-[0_20px_50px_rgba(249,115,22,0.15)]",
            rose: "shadow-[0_20px_50px_rgba(159,18,57,0.15)]"
          }[accentColor as keyof typeof highlightShadowClasses];

          return (
            <motion.div
              key={plan.id}
              ref={el => planRefs.current[plan.id] = el}
              whileHover={{ y: -12, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "relative bg-white rounded-[40px] p-8 flex flex-col border transition-all duration-500 group",
                "group-hover/container:opacity-70 hover:!opacity-100", // Dim others on hover
                isHighlighted 
                  ? `${borderClasses} ring-4 z-20` 
                  : plan.highlight
                    ? `border-purple-500 ${highlightShadowClasses} z-10` 
                    : `border-gray-100 shadow-xl shadow-gray-200/50 ${borderClasses.split(' ').pop()} hover:shadow-2xl`,
                isCurrent && "border-emerald-500 shadow-emerald-500/10"
              )}
            >
              {/* Light Sweep Animation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[40px]">
                <motion.div 
                  initial={{ x: '-100%', opacity: 0 }}
                  whileHover={{ x: '100%', opacity: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                />
              </div>

              {/* Glowing Border on Hover */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ 
                  opacity: 1,
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  opacity: { duration: 0.3 },
                  scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                }}
                className={cn(
                  "absolute inset-0 rounded-[40px] pointer-events-none",
                  `bg-gradient-to-br ${plan.gradient} blur-[8px] -m-[3px] z-[-1]`
                )} 
              />
              <div className="absolute inset-0 rounded-[40px] bg-white z-[-1]" />

              {(plan.badge || isCurrent) && (
                <div className={cn(
                  "absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 text-white text-[11px] font-black rounded-full uppercase tracking-widest shadow-xl z-30",
                  isCurrent ? "bg-emerald-500" : `bg-gradient-to-r ${plan.gradient}`
                )}>
                  {isCurrent ? 'Selected Plan' : plan.badge}
                </div>
              )}

              <div className="mb-8">
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 relative overflow-hidden",
                  "bg-gray-100 text-gray-400 group-hover:text-white group-hover:shadow-lg group-hover:scale-110 group-hover:rotate-6",
                  `group-hover:bg-gradient-to-br group-hover:${plan.gradient}`
                )}>
                  {/* Icon Glow */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2, 
                      ease: "easeInOut" 
                    }}
                    className={cn(
                      "absolute inset-0 rounded-3xl blur-xl pointer-events-none",
                      `bg-gradient-to-br ${plan.gradient}`
                    )} 
                  />
                  <plan.icon className="w-8 h-8 relative z-10 transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{plan.name}</h3>
                <p className="text-sm text-gray-400 mt-2 font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">${currentPrice}</span>
                  <span className="text-gray-400 text-base font-bold">/mo</span>
                </div>
                {billingCycle === 'yearly' && plan.price > 0 && (
                  <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider mt-1">
                    Billed annually (${currentPrice! * 12}/yr)
                  </p>
                )}
              </div>

              {/* Features Section */}
              <div className="flex-1 space-y-8 mb-10">
                {/* Included */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Included Features</h4>
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 group/feature">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                          "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100"
                        )}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-sm text-gray-700 font-semibold leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Locked */}
                {plan.lockedFeatures.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-gray-100/50">
                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-rose-100" />
                      <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] whitespace-nowrap px-2">
                        Not Included
                      </h4>
                      <div className="h-px flex-1 bg-rose-100" />
                    </div>
                    <div className="space-y-3">
                      {plan.lockedFeatures.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 transition-all duration-300 group/locked">
                          <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover/locked:bg-rose-100 group-hover/locked:scale-110 transition-all">
                            <X className="w-2.5 h-2.5" />
                          </div>
                          <span className="text-sm text-gray-400 font-medium leading-tight group-hover/locked:text-rose-400 transition-colors">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleSelect(plan)}
                disabled={isCurrent}
                className={cn(
                  "w-full py-4 rounded-2xl text-sm font-black transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-2xl",
                  isCurrent 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default" 
                    : plan.highlight || isHighlighted
                      ? `bg-gradient-to-r ${plan.gradient} text-white hover:scale-[1.02] shadow-${accentColor}-500/20`
                      : "bg-gray-900 text-white hover:bg-black hover:scale-[1.02]"
                )}
              >
                {isCurrent ? 'Current Plan' : plan.id === 'Free' ? 'Select Plan' : 'Upgrade Now'}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200/50">
        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Compare Features</h2>
            <p className="text-gray-400 text-base mt-2 font-medium">Detailed breakdown of what's included in each plan.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-100 text-gray-500 text-xs font-bold">
            <Info className="w-4 h-4" />
            Scroll to see all
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Feature</th>
                {PLANS.map(p => (
                  <th key={p.id} className="p-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {COMPARISON_FEATURES.map((feature, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="p-8 text-base font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{feature.name}</td>
                  {[feature.free, feature.starter, feature.growth, feature.pro, feature.enterprise].map((val, j) => (
                    <td key={j} className="p-8 text-center">
                      {typeof val === 'string' ? (
                        <span className="text-sm font-black text-gray-900">{val}</span>
                      ) : val ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                          <Check className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                          <X className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});
