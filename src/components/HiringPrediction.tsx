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
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-amber-500" />
            Hiring Prediction AI
          </h1>
          <p className="text-gray-500 text-base">Predict hiring success, retention, and cultural fit using deep learning.</p>
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
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
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

            <h3 className="text-base font-bold text-gray-900 uppercase tracking-widest mt-8 mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              Target Job (Optional)
            </h3>
            <div className="space-y-2">
              {jobDescriptions.map(job => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                    selectedJobId === job.id
                      ? "bg-purple-50 border-purple-200 shadow-sm"
                      : "bg-white border-gray-100 hover:border-purple-100 hover:bg-gray-50"
                  )}
                >
                  <span className={cn(
                    "font-bold text-sm truncate",
                    selectedJobId === job.id ? "text-purple-700" : "text-gray-700"
                  )}>
                    {job.title}
                  </span>
                  {selectedJobId === job.id && <CheckCircle2 className="w-4 h-4 text-purple-500" />}
                </button>
              ))}
            </div>

            <button
              onClick={handlePredict}
              disabled={!selectedCandidateId || isPredicting}
              className={cn(
                "w-full mt-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
                !selectedCandidateId || isPredicting
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-amber-500 text-white hover:bg-amber-400 shadow-amber-500/20"
              )}
            >
              {isPredicting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Predict Success
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prediction Results */}
        <div className="lg:col-span-3 space-y-5">
          <AnimatePresence mode="wait">
            {isPredicting ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[600px] bg-white border border-gray-100 rounded-[32px] flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="relative mb-8">
                  <div className="w-32 h-32 rounded-full border-4 border-amber-50 border-t-amber-500 animate-spin" />
                  <Activity className="w-12 h-12 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Predictive Modeling</h3>
                <p className="text-gray-500 max-w-md text-base">
                  Our neural network is processing resume data, skill scores, and experience patterns to calculate hiring probabilities.
                </p>
              </motion.div>
            ) : prediction ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Top Stats Card */}
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
                            strokeDashoffset={364.4 - (364.4 * prediction.overallPredictionScore) / 100}
                            className="text-amber-500 transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                          <span className="text-3xl font-black text-gray-900">{prediction.overallPredictionScore}%</span>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</p>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedCandidate?.name}</h2>
                        <p className="text-gray-500 text-sm mb-4">Hiring Prediction for {selectedJob?.title || 'General Role'}</p>
                        <div className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold",
                          getRecommendationColor(prediction.recommendation)
                        )}>
                          {prediction.recommendation === 'Strong Hire' && <ShieldCheck className="w-4 h-4" />}
                          {prediction.recommendation === 'Reject' && <XCircle className="w-4 h-4" />}
                          {prediction.recommendation === 'Risky Candidate' && <AlertTriangle className="w-4 h-4" />}
                          {prediction.recommendation}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Hire Likelihood</p>
                        <p className="text-xl font-black text-emerald-600">{prediction.hireLikelihood}%</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cultural Fit</p>
                        <p className="text-xl font-black text-blue-600">{prediction.culturalFitScore}%</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Offer Acceptance</p>
                        <p className="text-xl font-black text-purple-600">{prediction.offerAcceptanceProb}%</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Retention</p>
                        <p className="text-xl font-black text-amber-600">{prediction.retentionLikelihood}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Radar Chart */}
                    <div className="h-[300px] bg-gray-50/50 rounded-3xl p-4 border border-gray-100">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <PieChart className="w-4 h-4" />
                        Multidimensional Analysis
                      </h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            name="Candidate"
                            dataKey="A"
                            stroke="#f59e0b"
                            fill="#f59e0b"
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Success Factors */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Success Probability Factors
                      </h4>
                      <div className="space-y-3">
                        {prediction.successProbabilityFactors.map((factor, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-gray-700">{factor.factor}</span>
                              <span className="text-blue-600">{factor.score}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${factor.score}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className="h-full bg-blue-500 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk & Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Risk Indicators
                    </h3>
                    <div className="space-y-4">
                      {prediction.riskIndicators.map((risk, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-gray-900">{risk.label}</span>
                            <span className={cn("text-[10px] font-black uppercase", getRiskLevelColor(risk.level))}>
                              {risk.level} Risk
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{risk.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      AI Prediction Insights
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {prediction.aiInsights}
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 font-medium italic">
                      <Info className="w-3 h-3" />
                      This prediction is generated by AI based on historical data patterns and candidate profiles.
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[600px] bg-white border border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                  <Brain className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready for Prediction</h3>
                <p className="text-gray-500 max-w-md text-base">
                  Select a candidate and an optional job role to generate a deep hiring success prediction.
                </p>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hire Likelihood</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cultural Fit</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Retention</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Risk Analysis</span>
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
