import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Shield, Zap, Users, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Logo } from './Logo';
import { useNavigate } from 'react-router-dom';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-[#FDFDFF] flex flex-col items-center justify-center z-50 overflow-hidden font-sans">
      {/* Premium Background Animation: Soft Glowing Circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#6C63FF] blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, -60, 0],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2563EB] blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.02, 0.06, 0.02]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-[#4F46E5] blur-[150px] rounded-full"
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center">
        {/* Logo Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center mb-12"
        >
          <div className="mb-6 group cursor-default">
            <Logo size={80} className="text-indigo-600 group-hover:scale-110 transition-transform duration-500" />
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">
            HireMind <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] via-[#4F46E5] to-[#2563EB]">AI</span>
          </h1>
          
          <div className="h-6 flex items-center">
            <TypewriterText text="AI Powered Hiring Automation" />
          </div>
        </motion.div>

        {/* Headline Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
            Smarter Hiring <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500">Starts Here</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Automate resume screening, candidate ranking, and hiring decisions with AI. 
            Build your dream team with precision and speed.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <button
            onClick={() => {
              onComplete();
              navigate('/dashboard');
            }}
            className="group relative px-8 py-4 bg-gradient-to-r from-[#6C63FF] via-[#4F46E5] to-[#2563EB] text-white font-bold rounded-2xl shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            {/* Button Glow Effect */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/pricing')}
            className="px-8 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            View Pricing
          </button>
        </motion.div>

        {/* Skip Button */}
        <button 
          onClick={() => {
            onComplete();
            navigate('/dashboard');
          }}
          className="absolute top-8 right-8 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
        >
          Skip Intro
        </button>

        {/* Trust Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Secure Platform
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">
            <Zap className="w-4 h-4 text-amber-500" />
            AI Powered
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">
            <Users className="w-4 h-4 text-blue-500" />
            Trusted by Teams
          </div>
        </motion.div>
      </div>

      {/* Footer Micro-text */}
      <div className="absolute bottom-8 text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">
        &copy; 2026 HireMind AI Systems &bull; Enterprise Ready
      </div>
    </div>
  );
};

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(60);

  useEffect(() => {
    const handleType = () => {
      const fullText = text;
      setDisplayedText(
        isDeleting 
          ? fullText.substring(0, displayedText.length - 1) 
          : fullText.substring(0, displayedText.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 60);

      if (!isDeleting && displayedText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, text, typingSpeed, loopNum]);

  return (
    <span className="text-gray-400 font-bold tracking-[0.2em] text-[10px] uppercase">
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-1 h-3 bg-[#4F46E5] ml-1 align-middle"
      />
    </span>
  );
};
