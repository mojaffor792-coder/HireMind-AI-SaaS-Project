import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Linkedin,
  Github,
  ChevronRight
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

export const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUpWithEmail, signInWithEmail, login, user, upgradePlan } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { returnTo?: string; selectedPlan?: string } | null;

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate network delay for "premium" feel
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (!acceptTerms) {
          throw new Error('Please accept the terms and conditions');
        }
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }

      if (state?.selectedPlan) {
        await upgradePlan(state.selectedPlan as any);
      }
      
      navigate(state?.returnTo || '/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      await login();
      if (state?.selectedPlan) {
        await upgradePlan(state.selectedPlan as any);
      }
      navigate(state?.returnTo || '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Left Side: Branding & Visuals */}
      <div className="hidden md:flex md:w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center p-12 lg:p-24">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
          
          {/* Neural Network Grid Effect */}
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 max-w-lg w-full space-y-12 scale-90">
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex items-center gap-4 group"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <Logo size={40} className="text-white" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl -z-10"
              />
            </div>
            <span className="text-3xl font-black text-white tracking-tighter">HireMind <span className="text-blue-500">AI</span></span>
          </motion.div>

          {/* Headline & Description */}
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight"
            >
              Hire Smarter <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">with AI Intelligence.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-slate-400 text-lg lg:text-xl font-medium leading-relaxed max-w-md"
            >
              The world's most advanced AI-powered resume screening platform. Build high-performing teams in seconds, not weeks.
            </motion.p>
          </div>

          {/* Trust Badges / Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="grid grid-cols-2 gap-8 pt-12 border-t border-white/10"
          >
            <div className="space-y-1">
              <p className="text-3xl font-black text-white tracking-tight">99.9%</p>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Accuracy Rate</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-white tracking-tight">10k+</p>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Resumes Screened</p>
            </div>
          </motion.div>

          {/* Testimonial Snippet */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-4"
          >
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => <Sparkles key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
            </div>
            <p className="text-slate-300 italic font-medium leading-relaxed">
              "HireMind AI transformed our recruitment workflow. We found our lead engineer in 48 hours."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10" />
              <div>
                <p className="text-white font-bold text-sm">Alex Thompson</p>
                <p className="text-slate-500 text-xs font-medium">Head of Talent @ TechFlow</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50/50 relative">
        {/* Subtle Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-[20%] left-[10%] w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 0.9 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="md:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Logo size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">HireMind <span className="text-blue-500">AI</span></span>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
            {/* Header */}
            <div className="text-center space-y-2 mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-slate-500 font-medium">
                {isSignUp ? 'Start your 14-day free trial today.' : 'Sign in to access your dashboard.'}
              </p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3"
                >
                  <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px]">!</span>
                  </div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div 
                    key="name-field"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                  {!isSignUp && (
                    <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div 
                    key="confirm-password-field"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="password" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isSignUp && (
                <div className="flex items-start gap-3 ml-1 pt-2">
                  <input 
                    type="checkbox" 
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500/20" 
                  />
                  <label htmlFor="terms" className="text-xs font-medium text-slate-500 leading-relaxed">
                    I agree to the <button type="button" className="text-blue-600 font-bold hover:underline">Terms of Service</button> and <button type="button" className="text-blue-600 font-bold hover:underline">Privacy Policy</button>.
                  </label>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-base shadow-xl shadow-slate-900/10 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden",
                  isLoading && "opacity-80 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs font-black uppercase tracking-widest">
                <span className="bg-white px-4 text-slate-400">Or continue with</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleGoogleLogin}
                type="button"
                className="flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all"
              >
                <Globe className="w-5 h-5 text-blue-500" />
                Google
              </button>
              <button 
                type="button"
                className="flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all"
              >
                <Linkedin className="w-5 h-5 text-[#0077B5]" />
                LinkedIn
              </button>
            </div>

            {/* Toggle Sign In / Sign Up */}
            <div className="mt-10 text-center">
              <p className="text-slate-500 font-medium">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button 
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                  }}
                  className="text-blue-600 font-black hover:text-blue-700 transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>

          {/* Footer Info / Trust Badges */}
          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <ShieldCheck className="w-6 h-6 text-slate-400" />
              <Globe className="w-6 h-6 text-slate-400" />
              <CheckCircle2 className="w-6 h-6 text-slate-400" />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure & GDPR Compliant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
