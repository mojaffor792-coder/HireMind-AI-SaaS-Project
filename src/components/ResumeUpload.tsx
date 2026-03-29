import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  X, 
  Sparkles, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  Cpu,
  Info,
  Brain
} from 'lucide-react';
import { useApp, PLAN_LIMITS } from '../context/AppContext';
import { analyzeResume, Candidate } from '../services/gemini';
import { cn } from '../lib/utils';
import { UpgradeModal } from './UpgradeModal';

export const ResumeUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const { setCandidates, user, setUser } = useApp();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const limit = user ? PLAN_LIMITS[user.subscriptionPlan] : 0;
  const currentUsage = user?.usage?.resumesUploaded || 0;
  const isLimitReached = currentUsage + files.length > limit;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processResumes = async () => {
    if (files.length === 0) return;
    if (isLimitReached) {
      setShowUpgradeModal(true);
      return;
    }
    setIsAnalyzing(true);
    try {
      const newCandidates: Candidate[] = [];
      
      for (const file of files) {
        // In a real app, we would extract text from PDF/DOCX here
        const simulatedText = `Resume of ${file.name.split('.')[0]}. Experience in software engineering, React, Node.js. Education from University of Technology.`;
        
        const analysis = await analyzeResume(simulatedText, jobDescription);
        
        if (analysis.name) {
          const candidate: Candidate = {
            id: Math.random().toString(36).substr(2, 9),
            name: analysis.name,
            email: `${analysis.name.toLowerCase().replace(' ', '.')}@example.com`,
            skills: analysis.skills || [],
            experience: analysis.experience || '',
            education: analysis.education || '',
            summary: analysis.summary || '',
            scores: analysis.scores || { skills: 0, experience: 0, education: 0, overall: 0 },
            analysis: analysis.analysis || { strengths: [], weaknesses: [], recommendation: '' },
            status: 'Applied',
            appliedDate: new Date().toISOString(),
            resumeText: simulatedText
          };
          newCandidates.push(candidate);
        }
      }

      setCandidates(prev => [...newCandidates, ...prev]);
      if (user) {
        setUser({
          ...user,
          usage: {
            resumesUploaded: (user.usage?.resumesUploaded || 0) + newCandidates.length
          }
        });
      }
      setFiles([]);
      setJobDescription('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          AI-Powered Screening
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Upload Resumes</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Our advanced AI analyzes skills, experience, and cultural fit in seconds. 
          <br className="hidden md:block" />
          Upload PDF or DOCX files to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: JD and Upload */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Job Description Card */}
          <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">
              Target Job Description (Optional)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job requirements here for better matching accuracy..."
              className="w-full h-32 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none placeholder:text-gray-300"
            />
          </div>

          {/* Drag & Drop Card */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-[32px] p-10 transition-all flex flex-col items-center justify-center min-h-[340px] group",
              isDragging 
                ? "border-blue-500 bg-blue-50/50" 
                : "border-gray-100 bg-white hover:bg-gray-50/50 hover:border-gray-200 shadow-sm"
            )}
          >
            <div className="w-20 h-20 bg-blue-50 rounded-[24px] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <UploadCloud className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Drag & drop resumes</h3>
            <p className="text-gray-400 text-sm mb-6">Support for PDF and DOCX up to 10MB each</p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Secure Processing
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-blue-500" />
                Gemini 1.5 Pro
              </div>
            </div>

            <input 
              type="file" 
              multiple 
              id="file-upload"
              className="hidden" 
              onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files || [])])} 
            />
            <label 
              htmlFor="file-upload"
              className="absolute inset-0 cursor-pointer"
            />
          </div>

          {/* Selected Files & Process Button */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-xl shadow-blue-500/5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Selected Files ({files.length})
                  </h3>
                  <button 
                    onClick={() => setFiles([])}
                    className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl p-4 group hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(idx)}
                        className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={processResumes}
                  disabled={isAnalyzing}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      AI Analyzing Resumes...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Start AI Analysis
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* How it works Card */}
          <div className="bg-[#151619] rounded-[32px] p-8 text-white shadow-2xl">
            <h3 className="text-xl font-bold mb-6">How it works</h3>
            <div className="space-y-8">
              {[
                { 
                  icon: UploadCloud, 
                  title: 'Upload', 
                  desc: 'Drop your candidate resumes in PDF or DOCX format.',
                  color: 'bg-blue-500/20 text-blue-400'
                },
                { 
                  icon: Brain, 
                  title: 'AI Analysis', 
                  desc: 'Our neural engine extracts skills, experience, and intent.',
                  color: 'bg-purple-500/20 text-purple-400'
                },
                { 
                  icon: BarChart3, 
                  title: 'Scoring', 
                  desc: 'Candidates are ranked based on your specific job criteria.',
                  color: 'bg-emerald-500/20 text-emerald-400'
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0", step.color)}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
            
            <div className="relative">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">AI Insights</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                HireMind AI doesn't just look for keywords. It understands context, seniority, and project impact to give you a true representation of candidate potential.
              </p>
            </div>
          </div>

          {/* Plan Usage Card */}
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Monthly Usage</h3>
              <span className="text-xs font-bold text-blue-600 px-2 py-1 bg-blue-50 rounded-lg border border-blue-100 uppercase tracking-wider">
                {user?.subscriptionPlan} Plan
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-black text-gray-900">{currentUsage}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Resumes Uploaded</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{limit === Infinity ? '∞' : limit}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Limit</p>
                </div>
              </div>

              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((currentUsage / (limit || 1)) * 100, 100)}%` }}
                  className={cn(
                    "h-full transition-all duration-1000",
                    currentUsage >= limit ? "bg-red-500" : "bg-blue-600"
                  )}
                />
              </div>

              {currentUsage >= limit && (
                <p className="text-[10px] text-red-500 font-bold text-center uppercase tracking-widest">
                  Limit reached! Upgrade to upload more.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        requiredPlan={user?.subscriptionPlan === 'FREE' ? 'STARTER' : 'GROWTH'}
        featureName="Additional Resume Uploads"
      />
    </div>
  );
};
