import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { Sidebar } from './components/Sidebar';
import { Bell, Search, User, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FEATURE_PLANS, PlanLevel } from './context/AppContext';
import { PaymentSuccess } from './components/PaymentSuccess';

// Lazy load components for better performance
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const ResumeUpload = lazy(() => import('./components/ResumeUpload').then(m => ({ default: m.ResumeUpload })));
const CandidateDatabase = lazy(() => import('./components/CandidateDatabase').then(m => ({ default: m.CandidateDatabase })));
const JobDescriptions = lazy(() => import('./components/JobDescriptions').then(m => ({ default: m.JobDescriptions })));
const Analytics = lazy(() => import('./components/Analytics').then(m => ({ default: m.Analytics })));
const Settings = lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));
const SemanticMatching = lazy(() => import('./components/SemanticMatching').then(m => ({ default: m.SemanticMatching })));
const HiringPrediction = lazy(() => import('./components/HiringPrediction').then(m => ({ default: m.HiringPrediction })));
const FraudDetection = lazy(() => import('./components/FraudDetection').then(m => ({ default: m.FraudDetection })));
const JDGenerator = lazy(() => import('./components/JDGenerator').then(m => ({ default: m.JDGenerator })));
const Pricing = lazy(() => import('./components/Pricing').then(m => ({ default: m.Pricing })));
const UpgradeModal = lazy(() => import('./components/UpgradeModal').then(m => ({ default: m.UpgradeModal })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="w-8 h-8 text-blue-600 animate-spin opacity-20" />
  </div>
);

// Checkout Redirect Component
const CheckoutRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') as PlanLevel;
  const { user } = useApp();

  useEffect(() => {
    if (user && plan) {
      const checkoutUrls: Record<string, string> = {
        'STARTER': 'https://samiulreshad.lemonsqueezy.com/checkout/buy/cd5235e9-fd69-4416-ac2a-e3a9ddab25b9',
        'GROWTH': 'https://samiulreshad.lemonsqueezy.com/checkout/buy/0949aeb7-2c11-47a4-9770-e10776bb34e9',
        'PRO': 'https://samiulreshad.lemonsqueezy.com/checkout/buy/be49c90a-a806-4d0e-9585-33d87c7ce875',
        'ENTERPRISE': 'https://samiulreshad.lemonsqueezy.com/checkout/buy/f19b6b12-4c8b-4796-8eb0-297656191edf'
      };

      const url = checkoutUrls[plan];
      if (url) {
        const successUrl = `${window.location.origin}/payment-success?plan=${plan}`;
        window.location.href = `${url}?embed=1&media=0&logo=0&checkout[success_url]=${encodeURIComponent(successUrl)}`;
      }
    }
  }, [user, plan]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
        <p className="text-gray-500 font-medium">Redirecting to secure checkout...</p>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user, setUser, upgradePlan, loading, hasAccess } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [highlightedPlan, setHighlightedPlan] = useState<PlanLevel | null>(null);
  const [upgradeModal, setUpgradeModal] = useState<{ isOpen: boolean; requiredPlan: PlanLevel; featureName: string }>({
    isOpen: false,
    requiredPlan: 'FREE',
    featureName: ''
  });

  const handleLockedClick = (featureId: string) => {
    const requiredPlan = FEATURE_PLANS[featureId] || 'FREE';
    const featureName = featureId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    setUpgradeModal({
      isOpen: true,
      requiredPlan,
      featureName
    });
  };

  const handleUpgradeRedirect = (plan: PlanLevel) => {
    setHighlightedPlan(plan);
    navigate('/pricing');
    setUpgradeModal(prev => ({ ...prev, isOpen: false }));
  };

  const activeTab = location.pathname.substring(1) || 'dashboard';

  useEffect(() => {
    if (!loading && activeTab && activeTab !== 'pricing' && activeTab !== 'payment-success' && activeTab !== 'checkout') {
      if (!hasAccess(activeTab)) {
        handleLockedClick(activeTab);
        navigate('/dashboard');
      }
    }
  }, [activeTab, loading, hasAccess]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    const isPublicTab = ['pricing', 'payment-success', 'checkout', 'dashboard'].includes(activeTab);
    if (!loading && !isPublicTab && !hasAccess(activeTab)) {
      return <Navigate to="/dashboard" replace />;
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard onViewAll={() => navigate('/candidates')} />;
      case 'semantic-match': return <SemanticMatching />;
      case 'prediction': return <HiringPrediction />;
      case 'fraud-detection': return <FraudDetection />;
      case 'jd-generator': return <JDGenerator />;
      case 'upload': return <ResumeUpload />;
      case 'candidates': return <CandidateDatabase onLockedClick={handleLockedClick} />;
      case 'jobs': return <JobDescriptions />;
      case 'shortlisted': return <CandidateDatabase filterStatus="Shortlisted" onLockedClick={handleLockedClick} />;
      case 'interviews': return <CandidateDatabase filterStatus="Interview Scheduled" onLockedClick={handleLockedClick} />;
      case 'analytics': return <Analytics />;
      case 'pricing': return (
        <Pricing 
          highlightedPlan={highlightedPlan} 
          onSelect={() => {
            setHighlightedPlan(null);
            navigate('/dashboard');
          }} 
          onBack={() => navigate(-1)}
        />
      );
      case 'settings': return <Settings onUpgrade={() => navigate('/pricing')} onLockedClick={handleLockedClick} />;
      default: return <Dashboard />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={showSplash ? <SplashScreen onComplete={() => { setShowSplash(false); navigate('/dashboard'); }} /> : <Navigate to="/dashboard" />} />
      <Route path="/pricing" element={<div className="min-h-screen bg-gray-50 p-8"><Pricing highlightedPlan={null} onSelect={() => navigate('/dashboard')} onBack={() => navigate(-1)} /></div>} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutRedirect /></ProtectedRoute>} />
      
      <Route path="/:tab" element={
        <ProtectedRoute>
          <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-500/30">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={(tab) => navigate(`/${tab}`)} 
              onLockedClick={handleLockedClick}
            />
            
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
              <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white/80 backdrop-blur-xl z-10">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold capitalize text-gray-900">{activeTab.replace('-', ' ')}</h2>
                  <div className="h-4 w-px bg-gray-200 mx-2" />
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search anything..."
                      className="bg-gray-100 border border-transparent rounded-xl py-2 pl-10 pr-4 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
                  </button>
                  
                  <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-900 leading-none">{user?.name}</p>
                      <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">{user?.company}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <Suspense fallback={<LoadingFallback />}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      {renderContent()}
                    </motion.div>
                  </AnimatePresence>
                </Suspense>
              </div>

              <UpgradeModal 
                isOpen={upgradeModal.isOpen}
                onClose={() => setUpgradeModal({ ...upgradeModal, isOpen: false })}
                requiredPlan={upgradeModal.requiredPlan}
                featureName={upgradeModal.featureName}
                onUpgrade={handleUpgradeRedirect}
              />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
