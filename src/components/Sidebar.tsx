import React, { memo } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Users, 
  FileText, 
  UserCheck, 
  Calendar, 
  BarChart3, 
  Settings,
  BrainCircuit,
  Sparkles,
  ShieldAlert,
  Wand2,
  Lock,
  CreditCard
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLockedClick: (featureId: string) => void;
}

export const Sidebar = memo<SidebarProps>(({ activeTab, setActiveTab, onLockedClick }) => {
  const { hasAccess } = useApp();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Main' },
    { id: 'semantic-match', label: 'Semantic Match', icon: BrainCircuit, category: 'AI Tools' },
    { id: 'prediction', label: 'Hiring Prediction', icon: Sparkles, category: 'AI Tools' },
    { id: 'fraud-detection', label: 'Fraud Detection', icon: ShieldAlert, category: 'AI Tools' },
    { id: 'jd-generator', label: 'JD Generator', icon: Wand2, category: 'AI Tools' },
    { id: 'upload', label: 'Upload Resumes', icon: UploadCloud, category: 'Recruitment' },
    { id: 'candidates', label: 'Candidates', icon: Users, category: 'Recruitment' },
    { id: 'jobs', label: 'Job Descriptions', icon: FileText, category: 'Recruitment' },
    { id: 'shortlisted', label: 'Shortlisted', icon: UserCheck, category: 'Recruitment' },
    { id: 'interviews', label: 'Interviews', icon: Calendar, category: 'Recruitment' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, category: 'System' },
    { id: 'pricing', label: 'Pricing & Plans', icon: CreditCard, category: 'System' },
    { id: 'settings', label: 'Settings', icon: Settings, category: 'System' },
  ];

  const categories = ['Main', 'AI Tools', 'Recruitment', 'System'];

  return (
    <div className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col h-screen sticky top-0 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
          <Logo size={24} className="text-white" />
        </div>
        <span className="text-xl font-display font-bold text-gray-900 tracking-tight">HireMind</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
        {categories.map((category) => (
          <div key={category} className="space-y-1">
            <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">{category}</h3>
            {menuItems.filter(item => item.category === category).map((item) => {
              const allowed = hasAccess(item.id) || item.id === 'pricing';
              const active = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (allowed) {
                      setActiveTab(item.id);
                    } else {
                      onLockedClick(item.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                    active 
                      ? "text-blue-600" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/80",
                    !allowed && "opacity-60"
                  )}
                >
                  {active && (
                    <motion.div 
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 bg-blue-50/50 border border-blue-100/50 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <item.icon className={cn(
                    "w-4.5 h-4.5 transition-colors",
                    active ? "text-blue-600" : "group-hover:text-gray-900"
                  )} />
                  <span className="flex-1 text-left">{item.label}</span>
                  
                  {!allowed && (
                    <Lock className="w-3 h-3 text-gray-300" />
                  )}
                  
                  {active && (
                    <motion.div 
                      layoutId="sidebar-active-dot"
                      className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100/50">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 relative overflow-hidden group cursor-pointer">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Pro Plan</p>
          <p className="text-sm font-bold text-white mt-1">Unlock AI Features</p>
          <button className="w-full mt-3 py-2 bg-white text-gray-900 text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
});
