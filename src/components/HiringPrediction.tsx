import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Brain, 
  Target, 
  Zap, 
  ChevronRight, 
  ShieldCheck,
  BarChart3,
  PieChart,
  Activity,
  User,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { predictHiringSuccess, HiringPredictionResult, Candidate, JobDescription } from '../services/gemini';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

export const HiringPrediction: React.FC = () => {
  const { candidates, jobDescriptions } = useApp();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<HiringPredictionResult | null>(null);

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);
  const selectedJob = jobDescriptions.find(j => j.id === selectedJobId);

  const handlePredict = async () => {
    if (!selectedCandidate) return;
    
    setIsPredicting(true);
    setPrediction(null);

    try {
      const result = await predictHiringSuccess(selectedCandidate, selectedJob);
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setIsPredicting(false);
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'Strong Hire': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Consider': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Risky Candidate': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Reject': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-500';
      case 'Medium': return 'text-amber-500';
      case 'High': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const radarData = prediction ? [
    { subject: 'Hire Likelihood', A: prediction.hireLikelihood, fullMark: 100 },
    { subject: 'Offer Acceptance', A: prediction.offerAcceptanceProb, fullMark: 100 },
    { subject: 'Retention', A: prediction.retentionLikelihood, fullMark: 100 },
    { subject: 'Cultural Fit', A: prediction.culturalFitScore, fullMark: 100 },
    { subject: 'Skill Match', A: selectedCandidate?.scores.skills || 0, fullMark: 100 },
  ] : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-1">
              <div className="text-[8px] font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md uppercase tracking-widest border border-amber-100">
                AI
              </div>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">AI Predictive Engine</span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 font-display tracking-tight">
            Hiring Success Prediction
          </h1>
          <p className="text-gray-500 text-lg mt-1 font-medium">Predict long-term performance and cultural alignment before you hire.</p>
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
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
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

            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mt-10 mb-6 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              Target Job
            </h3>
            <div className="space-y-3">
              {jobDescriptions.map(job => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group",
                    selectedJobId === job.id
                      ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/20"
                      : "bg-white border-gray-100 hover:border-purple-200 hover:bg-purple-50/30"
                  )}
                >
                  <span className="font-bold text-sm truncate">
                    {job.title}
                  </span>
                  {selectedJobId === job.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>

            <button
              onClick={handlePredict}
              disabled={!selectedCandidateId || isPredicting}
              className={cn(
                "w-full mt-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98]",
                !selectedCandidateId || isPredicting
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-black shadow-xl shadow-gray-900/10"
              )}
            >
              {isPredicting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 text-amber-400" />
                  Run Prediction
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prediction Results */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {isPredicting ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-[650px] glass-card rounded-[40px] flex flex-col items-center justify-center p-12 text-center premium-shadow border border-white/40"
              >
                <div className="relative mb-10">
                  <div className="w-40 h-40 rounded-full border-[6px] border-amber-50 border-t-amber-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-16 h-16 text-amber-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 font-display tracking-tight">AI Predictive Modeling</h3>
                <p className="text-gray-500 max-w-md text-lg font-medium leading-relaxed">
                  Our neural network is processing resume data, skill scores, and experience patterns to calculate hiring probabilities.
                </p>
              </motion.div>
            ) : prediction ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Top Stats Card */}
                <div className="glass-card rounded-[40px] p-8 premium-shadow border border-white/40">
                  <div className="flex flex-col xl:flex-row justify-between gap-10 mb-10">
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
                            strokeDashoffset={452.4 - (452.4 * prediction.overallPredictionScore) / 100}
                            className="text-amber-500 transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                          <span className="text-4xl font-black text-gray-900">{prediction.overallPredictionScore}%</span>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Match</p>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-900 font-display tracking-tight">{selectedCandidate?.name}</h2>
                        <p className="text-gray-500 text-lg font-medium mb-6">Hiring Prediction for <span className="text-gray-900 font-bold">{selectedJob?.title || 'General Role'}</span></p>
                        <div className={cn(
                          "inline-flex items-center gap-3 px-6 py-3 rounded-2xl border text-sm font-black uppercase tracking-widest",
                          getRecommendationColor(prediction.recommendation)
                        )}>
                          {prediction.recommendation === 'Strong Hire' && <ShieldCheck className="w-5 h-5" />}
                          {prediction.recommendation === 'Reject' && <XCircle className="w-5 h-5" />}
                          {prediction.recommendation === 'Risky Candidate' && <AlertTriangle className="w-5 h-5" />}
                          {prediction.recommendation}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 flex-1 max-w-md">
                      <div className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 group hover:bg-emerald-500/10 transition-colors">
                        <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-[0.2em] mb-2">Hire Likelihood</p>
                        <p className="text-2xl font-black text-emerald-600">{prediction.hireLikelihood}%</p>
                      </div>
                      <div className="p-5 rounded-3xl bg-blue-500/5 border border-blue-500/10 group hover:bg-blue-500/10 transition-colors">
                        <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-[0.2em] mb-2">Cultural Fit</p>
                        <p className="text-2xl font-black text-blue-600">{prediction.culturalFitScore}%</p>
                      </div>
                      <div className="p-5 rounded-3xl bg-purple-500/5 border border-purple-500/10 group hover:bg-purple-500/10 transition-colors">
                        <p className="text-[10px] font-black text-purple-600/60 uppercase tracking-[0.2em] mb-2">Acceptance</p>
                        <p className="text-2xl font-black text-purple-600">{prediction.offerAcceptanceProb}%</p>
                      </div>
                      <div className="p-5 rounded-3xl bg-amber-500/5 border border-amber-500/10 group hover:bg-amber-500/10 transition-colors">
                        <p className="text-[10px] font-black text-amber-600/60 uppercase tracking-[0.2em] mb-2">Retention</p>
                        <p className="text-2xl font-black text-amber-600">{prediction.retentionLikelihood}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Radar Chart */}
                    <div className="h-[350px] bg-gray-50/30 rounded-[32px] p-8 border border-gray-100/50">
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-amber-500" />
                        Multidimensional Analysis
                      </h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 700 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            name="Candidate"
                            dataKey="A"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            fill="#f59e0b"
                            fillOpacity={0.2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Success Factors */}
                    <div className="space-y-6">
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-500" />
                        Success Probability Factors
                      </h4>
                      <div className="space-y-5">
                        {prediction.successProbabilityFactors.map((factor, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                              <span className="text-gray-700">{factor.factor}</span>
                              <span className="text-blue-600">{factor.score}%</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden p-[2px]">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${factor.score}%` }}
                                transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk & Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 glass-card rounded-[40px] p-8 premium-shadow border border-white/40">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Risk Indicators
                    </h3>
                    <div className="space-y-4">
                      {prediction.riskIndicators.map((risk, i) => (
                        <div key={i} className="p-5 rounded-3xl bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-black text-gray-900">{risk.label}</span>
                            <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border", 
                              risk.level === 'Low' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                              risk.level === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-100' : 
                              'text-red-600 bg-red-50 border-red-100'
                            )}>
                              {risk.level}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">{risk.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2 glass-card rounded-[40px] p-8 premium-shadow border border-white/40">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-500" />
                      AI Prediction Insights
                    </h3>
                    <div className="relative">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-500 rounded-full opacity-20" />
                      <div className="p-8 rounded-[32px] bg-blue-50/30 border border-blue-100/50 text-gray-700 text-base font-medium leading-relaxed whitespace-pre-wrap italic">
                        "{prediction.aiInsights}"
                      </div>
                    </div>
                    <div className="mt-8 flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <Info className="w-5 h-5 text-gray-400" />
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        This prediction is generated by AI based on historical data patterns, candidate profiles, and role requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[650px] glass-card border-dashed border-2 border-gray-200 rounded-[40px] flex flex-col items-center justify-center p-12 text-center premium-shadow">
                <div className="w-28 h-28 rounded-[32px] bg-gray-50 flex items-center justify-center mb-8 rotate-3">
                  <Brain className="w-14 h-14 text-gray-300" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 font-display tracking-tight">Ready for Prediction</h3>
                <p className="text-gray-500 max-w-md text-lg font-medium leading-relaxed">
                  Select a candidate and an optional job role to generate a deep hiring success prediction.
                </p>
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Hire Likelihood</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                      <Zap className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Cultural Fit</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Retention</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Risk Analysis</span>
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
