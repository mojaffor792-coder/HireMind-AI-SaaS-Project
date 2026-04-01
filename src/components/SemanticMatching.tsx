import React, { useState } from 'react';
import { 
  Brain, 
  Target, 
  Zap, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { semanticMatch, SemanticMatchResult, Candidate, JobDescription } from '../services/gemini';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const SemanticMatching: React.FC = () => {
  const { candidates, jobDescriptions } = useApp();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<SemanticMatchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SemanticMatchResult | null>(null);

  const selectedJob = jobDescriptions.find(j => j.id === selectedJobId);

  const handleStartMatching = async () => {
    if (!selectedJob) return;
    
    setIsMatching(true);
    setMatchResults([]);
    setSelectedResult(null);

    try {
      const results = await semanticMatch(selectedJob, candidates);
      setMatchResults(results.sort((a, b) => b.matchScore - a.matchScore));
    } catch (error) {
      console.error("Matching failed:", error);
    } finally {
      setIsMatching(false);
    }
  };

  const getCandidateById = (id: string) => candidates.find(c => c.id === id);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-2">
            <div className="text-[8px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md uppercase tracking-widest border border-blue-100">
              AI
            </div>
            AI-Powered Matching
          </div>
          <h1 className="text-4xl font-display font-black text-gray-900 flex items-center gap-4 tracking-tight">
            Semantic AI Matching
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-2xl">
            Intelligently match candidates using deep NLP and semantic understanding of skills, experience, and potential.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Job Selection & Controls */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card rounded-[40px] p-8 premium-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors duration-700" />
            
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
              <Target className="w-4 h-4 text-blue-600" />
              Select Target Role
            </h3>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {jobDescriptions.map(job => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={cn(
                    "w-full text-left p-5 rounded-[24px] border transition-all group relative overflow-hidden active:scale-[0.98]",
                    selectedJobId === job.id
                      ? "bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-900/20"
                      : "bg-white/50 border-gray-100 hover:border-blue-200 hover:bg-white"
                  )}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex flex-col">
                      <span className={cn(
                        "font-display font-bold text-base tracking-tight",
                        selectedJobId === job.id ? "text-white" : "text-gray-900"
                      )}>
                        {job.title}
                      </span>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest mt-1",
                        selectedJobId === job.id ? "text-white/50" : "text-gray-400"
                      )}>
                        {job.requirements.length} Requirements
                      </span>
                    </div>
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                      selectedJobId === job.id ? "bg-white/10 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                    )}>
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-transform",
                        selectedJobId === job.id ? "translate-x-0.5" : ""
                      )} />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleStartMatching}
              disabled={!selectedJobId || isMatching}
              className={cn(
                "w-full mt-10 py-5 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-[0.98]",
                !selectedJobId || isMatching
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30"
              )}
            >
              {isMatching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-blue-200" />
                  Run Semantic Match
                </>
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {selectedJob && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#151619] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full -mr-24 -mt-24 group-hover:bg-blue-600/20 transition-colors duration-1000" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.25em]">Role DNA</h4>
                  </div>
                  <div className="space-y-5">
                    {selectedJob.requirements.map((req, i) => (
                      <div key={i} className="flex items-start gap-4 text-sm text-gray-300 font-medium leading-relaxed group/item">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.6)] group-hover/item:scale-150 transition-transform" />
                        {req}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {isMatching ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-[700px] glass-card rounded-[48px] flex flex-col items-center justify-center p-16 text-center premium-shadow border-dashed border-2 border-blue-100/50"
              >
                <div className="relative mb-12">
                  <div className="w-48 h-48 rounded-full border-[6px] border-blue-50 border-t-blue-600 animate-spin" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-24 h-24 rounded-[40px] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/40">
                      <Brain className="w-12 h-12 text-white animate-pulse" />
                    </div>
                  </div>
                </div>
                <h3 className="text-4xl font-display font-black text-gray-900 mb-4 tracking-tight">Neural Semantic Analysis</h3>
                <p className="text-gray-500 max-w-md text-lg font-medium leading-relaxed">
                  Our AI is decoding skill clusters, cross-referencing industry benchmarks, and mapping career trajectories to find your ideal candidates.
                </p>
                <div className="mt-12 flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-100 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Processing {candidates.length} Profiles</span>
                </div>
              </motion.div>
            ) : matchResults.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="glass-card rounded-[48px] p-10 premium-shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                  
                  <div className="flex items-center justify-between mb-10 relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
                        <TrendingUp className="w-7 h-7 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-black text-gray-900 tracking-tight">Match Leaderboard</h3>
                        <p className="text-gray-500 font-medium">Top candidates ranked by semantic relevance</p>
                      </div>
                    </div>
                    <div className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border border-emerald-100/50 shadow-sm">
                      {matchResults.length} Matches Found
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    {matchResults.map((result, index) => {
                      const candidate = getCandidateById(result.candidateId);
                      if (!candidate) return null;

                      return (
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          key={result.candidateId}
                          onClick={() => setSelectedResult(result)}
                          className={cn(
                            "w-full flex items-center gap-6 p-6 rounded-[32px] border transition-all group relative overflow-hidden active:scale-[0.99]",
                            selectedResult?.candidateId === result.candidateId
                              ? "bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-600/20"
                              : "bg-white/50 border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5"
                          )}
                        >
                          <div className={cn(
                            "w-16 h-16 rounded-[24px] flex items-center justify-center text-2xl font-display font-black border transition-all",
                            selectedResult?.candidateId === result.candidateId 
                              ? "bg-white/10 text-white border-white/20" 
                              : "bg-gray-50 text-gray-400 border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100"
                          )}>
                            {candidate.name.charAt(0)}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <h4 className={cn(
                              "text-xl font-display font-black tracking-tight truncate mb-1",
                              selectedResult?.candidateId === result.candidateId ? "text-white" : "text-gray-900"
                            )}>
                              {candidate.name}
                            </h4>
                            <p className={cn(
                              "text-sm truncate font-medium",
                              selectedResult?.candidateId === result.candidateId ? "text-white/70" : "text-gray-500"
                            )}>
                              {candidate.summary}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className={cn(
                              "text-3xl font-display font-black tracking-tighter mb-0.5",
                              selectedResult?.candidateId === result.candidateId ? "text-white" : 
                              result.matchScore >= 80 ? "text-emerald-600" : 
                              result.matchScore >= 60 ? "text-blue-600" : "text-amber-600"
                            )}>
                              {result.matchScore}%
                            </div>
                            <div className={cn(
                              "text-[10px] font-black uppercase tracking-[0.2em]",
                              selectedResult?.candidateId === result.candidateId ? "text-white/50" : "text-gray-400"
                            )}>
                              Match
                            </div>
                          </div>
                          <div className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                            selectedResult?.candidateId === result.candidateId ? "bg-white/10 text-white" : "bg-gray-50 text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-600"
                          )}>
                            <ChevronRight className={cn(
                              "w-5 h-5 transition-transform",
                              selectedResult?.candidateId === result.candidateId ? "translate-x-0.5" : ""
                            )} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {selectedResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      className="glass-card rounded-[56px] p-12 premium-shadow relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full -mr-48 -mt-48" />
                      
                      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10 mb-16 relative z-10">
                        <div className="flex items-center gap-8">
                          <div className="w-24 h-24 rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 border-[6px] border-white/20">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl">AI</div>
                          </div>
                          <div>
                            <h3 className="text-4xl font-display font-black text-gray-900 tracking-tight mb-2">AI Match Insights</h3>
                            <p className="text-lg text-gray-500 font-medium">Deep forensic analysis for <span className="text-gray-900 font-bold">{getCandidateById(selectedResult.candidateId)?.name}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 bg-white/50 backdrop-blur-md p-6 rounded-[32px] border border-white/40 shadow-xl shadow-black/5">
                          <div className="text-right">
                            <div className="text-5xl font-display font-black text-blue-600 tracking-tighter leading-none">{selectedResult.matchScore}%</div>
                            <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mt-2">Semantic Score</div>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 relative z-10">
                        <div className="p-10 rounded-[48px] bg-emerald-50/40 border border-emerald-100/50 group hover:bg-emerald-50 transition-colors duration-500">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-sm">
                              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h4 className="text-sm font-black text-emerald-900 uppercase tracking-[0.25em]">Matching Skills</h4>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {selectedResult.matchingSkills.map((skill, i) => (
                              <span key={i} className="px-5 py-2 bg-white text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-200/50 shadow-sm hover:scale-105 transition-transform cursor-default">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-10 rounded-[48px] bg-amber-50/40 border border-amber-100/50 group hover:bg-amber-50 transition-colors duration-500">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shadow-sm">
                              <AlertCircle className="w-6 h-6 text-amber-600" />
                            </div>
                            <h4 className="text-sm font-black text-amber-900 uppercase tracking-[0.25em]">Skill Gaps</h4>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {selectedResult.missingSkills.map((skill, i) => (
                              <span key={i} className="px-5 py-2 bg-white text-amber-700 rounded-2xl text-xs font-bold border border-amber-200/50 shadow-sm hover:scale-105 transition-transform cursor-default">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                          {[
                            { icon: Zap, label: 'Skill Similarity', content: selectedResult.skillSimilarityInsights, color: 'text-blue-500', bg: 'bg-blue-50/50' },
                            { icon: BarChart3, label: 'Exp Relevance', content: selectedResult.experienceRelevance, color: 'text-purple-500', bg: 'bg-purple-50/50' },
                            { icon: TrendingUp, label: 'Career Path', content: selectedResult.careerProgression, color: 'text-emerald-500', bg: 'bg-emerald-50/50' }
                          ].map((item, i) => (
                            <div key={i} className="space-y-4">
                              <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", item.bg, item.color)}>
                                <item.icon className="w-3.5 h-3.5" />
                                {item.label}
                              </div>
                              <p className="text-base text-gray-600 leading-relaxed font-medium">{item.content}</p>
                            </div>
                          ))}
                        </div>

                        <div className="p-10 rounded-[48px] bg-gray-900 text-white shadow-2xl relative overflow-hidden group">
                          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -mr-32 -mb-32 group-hover:bg-blue-600/30 transition-colors duration-1000" />
                          <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                              <ShieldCheck className="w-7 h-7 text-blue-400" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-blue-200">AI Final Verdict</h4>
                          </div>
                          <p className="text-xl font-medium leading-relaxed relative z-10 text-gray-100 italic">
                            "{selectedResult.recommendation}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="h-[700px] glass-card rounded-[48px] flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-gray-200/50 premium-shadow">
                <div className="w-32 h-32 rounded-[40px] bg-gray-50 flex items-center justify-center mb-10 rotate-3 group hover:rotate-0 transition-transform duration-500">
                  <Search className="w-14 h-14 text-gray-200" />
                </div>
                <h3 className="text-4xl font-display font-black text-gray-900 mb-4 tracking-tight">Ready for Discovery</h3>
                <p className="text-gray-500 max-w-md text-lg font-medium leading-relaxed">
                  Select a target role on the left and initiate the neural matching engine to discover your top candidates.
                </p>
                <div className="mt-16 flex items-center gap-12">
                  {[
                    { label: 'Skill Synonyms', color: 'bg-blue-500' },
                    { label: 'Role Equivalence', color: 'bg-purple-500' },
                    { label: 'Career Path', color: 'bg-emerald-500' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                      <div className={cn("w-4 h-4 rounded-full shadow-lg", item.color)} />
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
