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
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            AI Resume Fraud Detection
          </h1>
          <p className="text-gray-500 text-base">Identify suspicious patterns, AI-generated content, and exaggerated claims.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Selection Panel */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Select Candidate
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {candidates.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCandidateId(c.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                    selectedCandidateId === c.id
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                    {c.name.charAt(0)}
                  </div>
                  <span className={cn(
                    "font-bold text-sm truncate",
                    selectedCandidateId === c.id ? "text-blue-700" : "text-gray-700"
                  )}>
                    {c.name}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedCandidateId || isAnalyzing}
              className={cn(
                "w-full mt-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
                !selectedCandidateId || isAnalyzing
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-500 shadow-red-500/20"
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

          <div className="bg-[#151619] rounded-3xl p-6 text-white shadow-xl">
            <h4 className="text-xs font-black text-red-400 uppercase tracking-[0.2em] mb-4">Detection Vectors</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <History className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-bold">Timeline Consistency</p>
                  <p className="text-[10px] text-gray-400">Detects overlapping roles and impossible durations.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Brain className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-bold">AI Pattern Analysis</p>
                  <p className="text-[10px] text-gray-400">Identifies LLM-generated phrasing and hollow descriptions.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-bold">Skill Verification</p>
                  <p className="text-[10px] text-gray-400">Flags skill claims without supporting work evidence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="lg:col-span-3 space-y-5">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[600px] bg-white border border-gray-100 rounded-[32px] flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="relative mb-8">
                  <div className="w-32 h-32 rounded-full border-4 border-red-50 border-t-red-500 animate-spin" />
                  <Shield className="w-12 h-12 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Deep Forensic Analysis</h3>
                <p className="text-gray-500 max-w-md text-base">
                  Our AI is cross-referencing career timelines, analyzing linguistic patterns, and verifying skill-experience alignment.
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Top Summary Card */}
                <div className="bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-100"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364.4}
                            strokeDashoffset={364.4 - (364.4 * result.authenticityScore) / 100}
                            className={cn(
                              "transition-all duration-1000 ease-out",
                              result.authenticityScore >= 80 ? "text-emerald-500" : 
                              result.authenticityScore >= 50 ? "text-amber-500" : "text-red-500"
                            )}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                          <span className="text-3xl font-black text-gray-900">{result.authenticityScore}%</span>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Authenticity</p>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedCandidate?.name}</h2>
                        <p className="text-gray-500 text-sm mb-4">Fraud Detection Report</p>
                        <div className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold",
                          getRiskLevelStyles(result.riskLevel)
                        )}>
                          {result.riskLevel === 'Verified' && <ShieldCheck className="w-4 h-4" />}
                          {result.riskLevel === 'High Risk' && <ShieldAlert className="w-4 h-4" />}
                          {(result.riskLevel === 'Medium Risk' || result.riskLevel === 'Low Risk') && <Shield className="w-4 h-4" />}
                          {result.riskLevel}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center text-right">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</div>
                      <div className={cn(
                        "text-lg font-black",
                        result.authenticityScore >= 80 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {result.authenticityScore >= 80 ? 'TRUSTED PROFILE' : 'REQUIRES VERIFICATION'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Risk Indicators */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Risk Indicators
                      </h4>
                      <div className="space-y-3">
                        {result.riskIndicators.map((risk, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-bold text-gray-900">{risk.label}</span>
                              <span className={cn("text-[10px] font-black uppercase", 
                                risk.level === 'High' ? 'text-red-500' : 
                                risk.level === 'Medium' ? 'text-amber-500' : 'text-blue-500'
                              )}>
                                {risk.level}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{risk.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suspicious Sections */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <FileWarning className="w-4 h-4 text-red-500" />
                        Suspicious Resume Sections
                      </h4>
                      <div className="space-y-3">
                        {result.suspiciousSections.map((item, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={cn("w-2 h-2 rounded-full", 
                                item.severity === 'High' ? 'bg-red-500' : 
                                item.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                              )} />
                              <span className="text-sm font-bold text-gray-900">{item.section}</span>
                            </div>
                            <p className="text-xs text-gray-600 italic leading-relaxed">"{item.reason}"</p>
                          </div>
                        ))}
                        {result.suspiciousSections.length === 0 && (
                          <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                            <p className="text-sm font-bold text-emerald-900">No suspicious sections detected</p>
                            <p className="text-xs text-emerald-700">The resume content appears consistent and authentic.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    AI Forensic Explanation
                  </h3>
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {result.aiExplanation}
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 font-medium italic">
                    <Info className="w-3 h-3" />
                    This report is generated by AI forensic analysis. It should be used as a decision-support tool, not a final verdict.
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[600px] bg-white border border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                  <Shield className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready for Fraud Scan</h3>
                <p className="text-gray-500 max-w-md text-base">
                  Select a candidate to run a deep AI forensic scan on their resume and career history.
                </p>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                      <History className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timeline Check</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <Brain className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Detection</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skill Verification</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Authenticity</span>
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
