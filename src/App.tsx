import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { AuthPage } from './components/AuthPage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ResumeUpload } from './components/ResumeUpload';
import { CandidateDatabase } from './components/CandidateDatabase';
import { JobDescriptions } from './components/JobDescriptions';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { SemanticMatching } from './components/SemanticMatching';
import { HiringPrediction } from './components/HiringPrediction';
import { FraudDetection } from './components/FraudDetection';
import { JDGenerator } from './components/JDGenerator';
import { Pricing } from './components/Pricing';
import { UpgradeModal } from './components/UpgradeModal';
import { Bell, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FEATURE_PLANS, PlanLevel } from './context/AppContext';

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user, setUser } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [highlightedPlan, setHighlightedPlan] = useState<PlanLevel | null>(null);
  const [upgradeModal, setUpgradeModal] = useState<{ isOpen: boolean; requiredPlan: PlanLevel; featureName: string }>({
    isOpen: false,
    requiredPlan: 'FREE',
    featureName: ''
  });

  // Step 1 & 9: Redirect to pricing if no plan selected
  useEffect(() => {
    if (user && user.subscriptionPlan === null && activeTab !== 'pricing') {
      setActiveTab('pricing');
    }
  }, [user, activeTab]);

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
    setActiveTab('pricing');
    setUpgradeModal(prev => ({ ...prev, isOpen: false }));
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!user) {
    return <AuthPage />;
  }

  // Step 7: Pricing page first access (Full Screen)
  if (user.subscriptionPlan === null) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-y-auto custom-scrollbar">
        <Pricing 
          highlightedPlan={null} 
          onSelect={() => setActiveTab('dashboard')} 
          onBack={() => {
            setUser(null);
            setShowSplash(true);
          }}
        />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onViewAll={() => setActiveTab('candidates')} />;
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
          onSelect={() => setHighlightedPlan(null)} 
          onBack={() => setActiveTab('dashboard')}
        />
      );
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-500/30">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => setUser(null)} 
        onLockedClick={handleLockedClick}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
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
                <p className="text-base font-bold text-gray-900 leading-none">{user.name}</p>
                <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">{user.company}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
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
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
