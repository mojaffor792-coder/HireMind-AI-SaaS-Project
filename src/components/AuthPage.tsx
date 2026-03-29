import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Mail, Lock, Github, Linkedin, Building2, User, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { setUser } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    company: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: formData.fullName || 'Demo User',
      email: formData.email,
      company: formData.company || 'HireMind AI',
      subscriptionPlan: null,
      planLevel: -1
    });
  };

  return (
    <div className="min-h-screen bg-silk-gradient-light flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Animated Silk Textures (Light Mode) */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-500/5 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-slate-500/5 blur-[120px] rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="glass-card-light rounded-[32px] p-10 relative overflow-hidden">
          {/* Razor-thin top highlight (Light Mode) */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-xl backdrop-blur-md"
            >
              <BrainCircuit className="w-8 h-8 text-indigo-600" />
            </motion.div>
            
            <h2 className="text-3xl font-light text-gray-900 tracking-[0.12em] uppercase mb-2">
              {isLogin ? 'HireMind' : 'Join HireMind'}
            </h2>
            <p className="text-slate-500 text-sm font-medium tracking-wide">
              {isLogin ? 'EXECUTIVE ACCESS' : 'ENTERPRISE REGISTRATION'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Identity</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/30 focus:bg-white transition-all shadow-sm"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Organization</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="Company Name"
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/30 focus:bg-white transition-all shadow-sm"
                      value={formData.company}
                      onChange={e => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Credentials</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="Corporate Email"
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/30 focus:bg-white transition-all shadow-sm"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Security</label>
                {isLogin && (
                  <button type="button" className="text-[10px] font-bold text-indigo-600/80 hover:text-indigo-600 uppercase tracking-[0.1em] transition-colors">
                    Recovery
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="Access Key"
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/30 focus:bg-white transition-all shadow-sm"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(79,70,229,0.2)] transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group tracking-widest uppercase text-xs"
            >
              {isLogin ? 'Initialize Session' : 'Create Enterprise Account'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <span className="relative bg-white/50 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Secure Protocols</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 bg-white border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-slate-600 py-3 rounded-2xl transition-all group shadow-sm">
                <Github className="w-4 h-4 group-hover:text-gray-900 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Github</span>
              </button>
              <button className="flex items-center justify-center gap-3 bg-white border border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-slate-600 py-3 rounded-2xl transition-all group shadow-sm">
                <Linkedin className="w-4 h-4 group-hover:text-gray-900 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-widest">LinkedIn</span>
              </button>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors"
            >
              {isLogin ? "Request New Account" : "Return to Login"}
            </button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] opacity-50">
          &copy; 2026 HireMind Systems &bull; Encrypted
        </p>
      </motion.div>
    </div>
  );
};
