import React, { useState } from 'react';
import { User, Building2, Lock, Bell, Shield, Mail, Globe, Check, AlertCircle, Zap, Rocket, Code2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type SettingsTab = 'Profile' | 'Company' | 'Subscription' | 'Notifications' | 'AI Rules' | 'Email Templates' | 'API Access' | 'White-label';

interface SettingsProps {
  onUpgrade?: () => void;
  onLockedClick?: (featureId: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onUpgrade, onLockedClick }) => {
  const { user, setUser, hasAccess } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('Profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const tabs: { label: SettingsTab; icon: any; id: string }[] = [
    { label: 'Profile', icon: User, id: 'profile' },
    { label: 'Company', icon: Building2, id: 'company' },
    { label: 'Subscription', icon: Zap, id: 'subscription' },
    { label: 'Notifications', icon: Bell, id: 'notifications' },
    { label: 'AI Rules', icon: Shield, id: 'ai-scoring' },
    { label: 'Email Templates', icon: Mail, id: 'email-automation' },
    { label: 'API Access', icon: Code2, id: 'api-access' },
    { label: 'White-label', icon: Globe, id: 'white-label' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Role</label>
                  <input 
                    type="text" 
                    defaultValue="Hiring Manager"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone</label>
                  <input 
                    type="text" 
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
              <button 
                onClick={handleSave}
                className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                {isSaving ? 'Saving...' : saveSuccess ? <><Check className="w-4 h-4" /> Saved</> : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        );
      case 'Company':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Company Profile</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl border border-gray-100 flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
                      Change Logo
                    </button>
                    <p className="text-xs text-gray-400 mt-2">JPG, PNG or SVG. Max size 2MB.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Company Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.company}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="https://company.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSave}
                className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                {isSaving ? 'Saving...' : saveSuccess ? <><Check className="w-4 h-4" /> Saved</> : 'Update Profile'}
              </button>
            </div>
          </motion.div>
        );
      case 'Subscription':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Subscription & Billing</h3>
              
              <div className="flex items-center justify-between p-6 bg-blue-50 rounded-2xl border border-blue-100 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Current Plan</h4>
                    <p className="text-2xl font-black text-blue-600 tracking-tight">{user?.subscriptionPlan || 'Free'}</p>
                  </div>
                </div>
                <button 
                  onClick={onUpgrade}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                >
                  Change Plan
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Resume Uploads</label>
                    <span className="text-sm font-black text-gray-900">
                      {user?.usage.resumesUploaded} / {user?.subscriptionPlan === 'FREE' ? '10' : user?.subscriptionPlan === 'STARTER' ? '100' : user?.subscriptionPlan === 'GROWTH' ? '1,000' : user?.subscriptionPlan === 'PRO' ? '5,000' : 'Unlimited'}
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-1000" 
                      style={{ width: `${Math.min((user?.usage.resumesUploaded || 0) / (user?.subscriptionPlan === 'FREE' ? 10 : user?.subscriptionPlan === 'STARTER' ? 100 : user?.subscriptionPlan === 'GROWTH' ? 1000 : user?.subscriptionPlan === 'PRO' ? 5000 : 1000000) * 100, 100)}%` }} 
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">Your usage resets on the 1st of every month.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Next Billing Date</h5>
                    <p className="text-sm font-bold text-gray-900">April 30, 2026</p>
                  </div>
                  <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Method</h5>
                    <p className="text-sm font-bold text-gray-900">Visa ending in 4242</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Rocket className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-xl font-black tracking-tight">Need more power?</h3>
                <p className="text-blue-100 text-sm max-w-md font-medium leading-relaxed">
                  Upgrade to our Enterprise plan for unlimited resumes, custom AI scoring rules, and full API access.
                </p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-sm hover:bg-blue-50 transition-all shadow-xl shadow-black/10">
                  Talk to Sales
                </button>
              </div>
            </div>
          </motion.div>
        );
      case 'Notifications':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-6">
                {[
                  { title: 'Email Notifications', desc: 'Receive daily summaries and important alerts via email.' },
                  { title: 'Candidate Applications', desc: 'Get notified when a new candidate applies for a job.' },
                  { title: 'Interview Reminders', desc: 'Receive reminders 1 hour before scheduled interviews.' },
                  { title: 'AI Analysis Complete', desc: 'Get notified when AI resume screening is finished.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <div className={cn(
                      "w-12 h-6 rounded-full relative cursor-pointer transition-all",
                      i < 2 ? "bg-blue-600" : "bg-gray-200"
                    )}>
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                        i < 2 ? "right-1" : "left-1"
                      )} />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="mt-8 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-500 transition-all">Save Preferences</button>
            </div>
          </motion.div>
        );
      case 'AI Rules':
        if (!hasAccess('ai-scoring')) {
          return (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Scoring Rules Locked</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Upgrade to the Growth plan to unlock custom AI scoring rules and weighting factors.</p>
              <button 
                onClick={() => onLockedClick?.('ai-scoring')}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
              >
                Upgrade Now
              </button>
            </motion.div>
          );
        }
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">AI Scoring Rules</h3>
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Active</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-700">Minimum Match Score</label>
                    <span className="text-sm font-black text-blue-600">75%</span>
                  </div>
                  <input type="range" className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
                  <p className="text-[10px] text-gray-400 font-medium italic">Candidates below this score will be automatically flagged for review.</p>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">Weighting Factors</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Technical Skills', weight: 40 },
                      { label: 'Experience Level', weight: 30 },
                      { label: 'Education', weight: 15 },
                      { label: 'Soft Skills', weight: 15 },
                    ].map((factor) => (
                      <div key={factor.label} className="flex items-center gap-4">
                        <span className="text-xs font-medium text-gray-500 w-32">{factor.label}</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${factor.weight}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-900 w-8">{factor.weight}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={handleSave} className="mt-8 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-500 transition-all">Update AI Rules</button>
            </div>
          </motion.div>
        );
      case 'Email Templates':
        if (!hasAccess('email-automation')) {
          return (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Templates Locked</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Upgrade to the Starter plan to unlock automated email templates and candidate communication.</p>
              <button 
                onClick={() => onLockedClick?.('email-automation')}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
              >
                Upgrade Now
              </button>
            </motion.div>
          );
        }
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Email Templates</h3>
                <button className="text-xs font-bold text-blue-600 hover:underline">+ Create New</button>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Interview Invitation', subject: 'Interview Invitation - {{company_name}}' },
                  { name: 'Rejection Letter', subject: 'Application Status - {{job_title}}' },
                  { name: 'Job Offer', subject: 'Job Offer: {{job_title}} at {{company_name}}' },
                ].map((template) => (
                  <div key={template.name} className="p-4 border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-gray-900">{template.name}</h4>
                      <Mail className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Subject: {template.subject}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 'API Access':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {!hasAccess('api-access') ? (
              <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Code2 className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">API Access Locked</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Upgrade to the Enterprise plan to unlock full API access and integrate HireMind with your existing tools.</p>
                <button 
                  onClick={() => onLockedClick?.('api-access')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                >
                  Upgrade Now
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">API Configuration</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Your API Key</label>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-900">
                        hm_live_••••••••••••••••••••••••
                      </code>
                      <button className="text-blue-600 font-bold text-xs hover:underline">Reveal</button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Use this key to authenticate your requests to the HireMind API. See our <a href="#" className="text-blue-600 underline">API Documentation</a> for more details.</p>
                </div>
              </div>
            )}
          </motion.div>
        );
      case 'White-label':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {!hasAccess('white-label') ? (
              <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">White-label Branding Locked</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Upgrade to the Enterprise plan to unlock white-label branding and customize the platform with your own domain and styles.</p>
                <button 
                  onClick={() => onLockedClick?.('white-label')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                >
                  Upgrade Now
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Branding Customization</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 border border-gray-200" />
                        <input type="text" defaultValue="#2563eb" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Custom Domain</label>
                      <input type="text" placeholder="hiring.yourcompany.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-sm" />
                    </div>
                  </div>
                  <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm">Save Branding</button>
                </div>
              </div>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">Configure your account, company profile, and AI scoring rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-1">
          {tabs.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (hasAccess(item.id)) {
                  setActiveTab(item.label);
                } else {
                  onLockedClick?.(item.id);
                }
              }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all group",
                activeTab === item.label 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
              {!hasAccess(item.id) && (
                <Lock className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
              )}
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
