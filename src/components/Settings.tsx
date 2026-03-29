import React, { useState } from 'react';
import { User, Building2, Lock, Bell, Shield, Mail, Globe, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type SettingsTab = 'Profile' | 'Company' | 'Security' | 'Notifications' | 'AI Rules' | 'Email Templates';

export const Settings: React.FC = () => {
  const { user, setUser } = useApp();
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

  const tabs: { label: SettingsTab; icon: any }[] = [
    { label: 'Profile', icon: User },
    { label: 'Company', icon: Building2 },
    { label: 'Security', icon: Lock },
    { label: 'Notifications', icon: Bell },
    { label: 'AI Rules', icon: Shield },
    { label: 'Email Templates', icon: Mail },
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
      case 'Security':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">Change Password</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                      </div>
                    </div>
                  </div>
                  <button onClick={handleSave} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all">Update Password</button>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer hover:bg-gray-300 transition-all">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
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
              onClick={() => setActiveTab(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === item.label 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
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
