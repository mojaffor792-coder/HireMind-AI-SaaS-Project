import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Brain, 
  Search, 
  ChevronRight, 
  Info,
  User,
  Activity,
  FileWarning,
  Fingerprint,
  History,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { detectResumeFraud, FraudDetectionResult, Candidate } from '../services/gemini';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const FraudDetection: React.FC = () => {
  const { candidates } = useApp();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FraudDetectionResult | null>(null);

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  const handleAnalyze = async () => {
    if (!selectedCandidate) return;
    
    setIsAnalyzing(true);
    setResult(null);

    try {
      const report = await detectResumeFraud(selectedCandidate);
      setResult(report);
    } catch (error) {
      console.error("Fraud detection failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevelStyles = (level: string) => {
    switch (level) {
      case 'Verified': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Low Risk': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Medium Risk': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'High Risk': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-blue-500';
      case 'Medium': return 'text-amber-500';
      case 'High': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-red-500" />
              <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">Security Engine</span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 font-display tracking-tight">
            AI Resume Fraud Detection
          </h1>
          <p className="text-gray-500 text-lg mt-1 font-medium">Identify suspicious patterns, AI-generated content, and exaggerated claims.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Selection Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-[32px] p-6 premium-shadow border border-white/40">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              Select Candidate
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {candidates.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCandidateId(c.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3 group",
                    selectedCandidateId === c.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                      : "bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50/30"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors",
                    selectedCandidateId === c.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                  )}>
                    {c.name.charAt(0)}
                  </div>
                  <span className="font-bold text-sm truncate">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedCandidateId || isAnalyzing}
              className={cn(
                "w-full mt-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98]",
                !selectedCandidateId || isAnalyzing
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-500 shadow-xl shadow-red-500/20"
              )}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" />
                  Run Fraud Scan
                </>
              )}
            </button>
          </div>

          <div className="bg-[#151619] rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-red-500/20 transition-colors" />
            <h4 className="text-[11px] font-black text-red-400 uppercase tracking-[0.2em] mb-8">Detection Vectors</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <History className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Timeline Consistency</p>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Detects overlapping roles and impossible durations.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">AI Pattern Analysis</p>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Identifies LLM-generated phrasing and hollow descriptions.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Skill Verification</p>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Flags skill claims without supporting work evidence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-[650px] glass-card rounded-[40px] flex flex-col items-center justify-center p-12 text-center premium-shadow border border-white/40"
              >
                <div className="relative mb-10">
                  <div className="w-40 h-40 rounded-full border-[6px] border-red-50 border-t-red-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-red-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 font-display tracking-tight">Deep Forensic Analysis</h3>
                <p className="text-gray-500 max-w-md text-lg font-medium leading-relaxed">
                  Our AI is cross-referencing career timelines, analyzing linguistic patterns, and verifying skill-experience alignment.
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Top Summary Card */}
                <div className="glass-card rounded-[40px] p-8 premium-shadow border border-white/40">
                  <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
                    <div className="flex items-center gap-8">
                      <div className="relative">
                        <svg className="w-40 h-40 transform -rotate-90">
                          <circle
                            cx="80"
                            cy="80"
                            r="72"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            className="text-gray-100"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r="72"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={452.4}
                            strokeDashoffset={452.4 - (452.4 * result.authenticityScore) / 100}
                            className={cn(
                              "transition-all duration-1000 ease-out",
                              result.authenticityScore >= 80 ? "text-emerald-500" : 
                              result.authenticityScore >= 50 ? "text-amber-500" : "text-red-500"
                            )}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                          <span className="text-4xl font-black text-gray-900">{result.authenticityScore}%</span>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Authentic</p>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-900 font-display tracking-tight">{selectedCandidate?.name}</h2>
                        <p className="text-gray-500 text-lg font-medium mb-6">Forensic Fraud Detection Report</p>
                        <div className={cn(
                          "inline-flex items-center gap-3 px-6 py-3 rounded-2xl border text-sm font-black uppercase tracking-widest",
                          getRiskLevelStyles(result.riskLevel)
                        )}>
                          {result.riskLevel === 'Verified' && <ShieldCheck className="w-5 h-5" />}
                          {result.riskLevel === 'High Risk' && <ShieldAlert className="w-5 h-5" />}
                          {(result.riskLevel === 'Medium Risk' || result.riskLevel === 'Low Risk') && <Shield className="w-5 h-5" />}
                          {result.riskLevel}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center md:text-right">
                      <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Verification Status</div>
                      <div className={cn(
                        "text-2xl font-black px-6 py-3 rounded-2xl border-2 inline-block",
                        result.authenticityScore >= 80 
                          ? "text-emerald-600 bg-emerald-50 border-emerald-100" 
                          : "text-red-600 bg-red-50 border-red-100"
                      )}>
                        {result.authenticityScore >= 80 ? 'TRUSTED PROFILE' : 'REQUIRES VERIFICATION'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Risk Indicators */}
                    <div className="space-y-6">
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Risk Indicators
                      </h4>
                      <div className="space-y-4">
                        {result.riskIndicators.map((risk, i) => (
                          <div key={i} className="p-6 rounded-[24px] bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-black text-gray-900">{risk.label}</span>
                              <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border", 
                                risk.level === 'High' ? 'text-red-600 bg-red-50 border-red-100' : 
                                risk.level === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-100' : 
                                'text-blue-600 bg-blue-50 border-blue-100'
                              )}>
                                {risk.level}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{risk.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suspicious Sections */}
                    <div className="space-y-6">
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <FileWarning className="w-4 h-4 text-red-500" />
                        Suspicious Resume Sections
                      </h4>
                      <div className="space-y-4">
                        {result.suspiciousSections.map((item, i) => (
                          <div key={i} className="p-6 rounded-[24px] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={cn("w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]", 
                                item.severity === 'High' ? 'bg-red-500 shadow-red-500/30' : 
                                item.severity === 'Medium' ? 'bg-amber-500 shadow-amber-500/30' : 
                                'bg-blue-500 shadow-blue-500/30'
                              )} />
                              <span className="text-sm font-black text-gray-900">{item.section}</span>
                            </div>
                            <div className="relative pl-4">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-100 rounded-full" />
                              <p className="text-xs text-gray-600 font-medium italic leading-relaxed">"{item.reason}"</p>
                            </div>
                          </div>
                        ))}
                        {result.suspiciousSections.length === 0 && (
                          <div className="p-12 rounded-[32px] bg-emerald-50/50 border border-emerald-100 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <p className="text-lg font-black text-emerald-900 mb-1">No suspicious sections detected</p>
                            <p className="text-sm text-emerald-700 font-medium">The resume content appears consistent and authentic.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="glass-card rounded-[40px] p-10 premium-shadow border border-white/40">
                  <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-500" />
                    AI Forensic Explanation
                  </h3>
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-red-500 rounded-full opacity-20" />
                    <div className="p-8 rounded-[32px] bg-gray-50/50 border border-gray-100 text-gray-700 text-base font-medium leading-relaxed whitespace-pre-wrap">
                      {result.aiExplanation}
                    </div>
                  </div>
                  <div className="mt-10 flex items-center gap-3 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <Info className="w-5 h-5 text-gray-400" />
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      This report is generated by AI forensic analysis. It should be used as a decision-support tool, not a final verdict.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[650px] glass-card border-dashed border-2 border-gray-200 rounded-[40px] flex flex-col items-center justify-center p-12 text-center premium-shadow">
                <div className="w-28 h-28 rounded-[32px] bg-gray-50 flex items-center justify-center mb-8 -rotate-3">
                  <Shield className="w-14 h-14 text-gray-300" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 font-display tracking-tight">Ready for Fraud Scan</h3>
                <p className="text-gray-500 max-w-md text-lg font-medium leading-relaxed">
                  Select a candidate to run a deep AI forensic scan on their resume and career history.
                </p>
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 shadow-sm">
                      <History className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timeline Check</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
                      <Brain className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">AI Detection</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Skill Verification</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm">
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Authenticity</span>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
