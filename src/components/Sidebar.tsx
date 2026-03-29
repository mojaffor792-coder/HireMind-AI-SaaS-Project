import React from 'react';
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
  LogOut,
  BrainCircuit,
  Sparkles,
  ShieldAlert,
  Wand2,
  Lock,
  CreditCard
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onLockedClick: (featureId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, onLockedClick }) => {
  const { hasAccess } = useApp();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'semantic-match', label: 'Semantic Match', icon: BrainCircuit },
    { id: 'prediction', label: 'Hiring Prediction', icon: Sparkles },
    { id: 'fraud-detection', label: 'Fraud Detection', icon: ShieldAlert },
    { id: 'jd-generator', label: 'JD Generator', icon: Wand2 },
    { id: 'upload', label: 'Upload Resumes', icon: UploadCloud },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'jobs', label: 'Job Descriptions', icon: FileText },
    { id: 'shortlisted', label: 'Shortlisted', icon: UserCheck },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'pricing', label: 'Pricing & Plans', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-5 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900 tracking-tight">HireMind</span>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const allowed = hasAccess(item.id) || item.id === 'pricing';
          
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
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                activeTab === item.id 
                  ? "bg-blue-50 text-blue-600 border border-blue-100" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                !allowed && "opacity-60"
              )}
            >
              <item.icon className={cn(
                "w-4.5 h-4.5 transition-colors",
                activeTab === item.id ? "text-blue-600" : "group-hover:text-gray-900"
              )} />
              {item.label}
              {!allowed && (
                <Lock className="w-3 h-3 ml-auto text-gray-400" />
              )}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500/60 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4.5 h-4.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
