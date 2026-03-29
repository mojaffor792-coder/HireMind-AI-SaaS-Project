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
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            Semantic AI Matching
          </h1>
          <p className="text-gray-500 text-base">Intelligently match candidates using NLP and semantic understanding.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Selection & Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Select Job Role
            </h3>
            <div className="space-y-3">
              {jobDescriptions.map(job => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all group",
                    selectedJobId === job.id
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "font-bold text-base",
                      selectedJobId === job.id ? "text-blue-700" : "text-gray-700"
                    )}>
                      {job.title}
                    </span>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform",
                      selectedJobId === job.id ? "text-blue-500 translate-x-1" : "text-gray-300"
                    )} />
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleStartMatching}
              disabled={!selectedJobId || isMatching}
              className={cn(
                "w-full mt-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
                !selectedJobId || isMatching
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20"
              )}
            >
              {isMatching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Run Semantic Match
                </>
              )}
            </button>
          </div>

          {selectedJob && (
            <div className="bg-[#151619] rounded-3xl p-6 text-white shadow-xl">
              <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Job Requirements</h4>
              <div className="space-y-2">
                {selectedJob.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    {req}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-6">
          {isMatching ? (
            <div className="h-[500px] bg-white border border-gray-100 rounded-3xl flex flex-col items-center justify-center p-12 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full border-4 border-blue-50 border-t-blue-600 animate-spin" />
                <Brain className="w-10 h-10 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Semantic Analysis in Progress</h3>
              <p className="text-gray-500 max-w-md">
                We're analyzing skill synonyms, related technologies, and career progression to find the perfect match.
              </p>
            </div>
          ) : matchResults.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Match Score Leaderboard
                  </h3>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                    Top Matches Found
                  </div>
                </div>

                <div className="space-y-4">
                  {matchResults.map((result, index) => {
                    const candidate = getCandidateById(result.candidateId);
                    if (!candidate) return null;

                    return (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={result.candidateId}
                        onClick={() => setSelectedResult(result)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all group",
                          selectedResult?.candidateId === result.candidateId
                            ? "bg-blue-50 border-blue-200 shadow-sm"
                            : "bg-white border-gray-100 hover:border-blue-100"
                        )}
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                          {candidate.name.charAt(0)}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <h4 className="text-base font-bold text-gray-900 truncate">{candidate.name}</h4>
                          <p className="text-sm text-gray-500 truncate">{candidate.summary}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={cn(
                            "text-xl font-black",
                            result.matchScore >= 80 ? "text-emerald-600" : 
                            result.matchScore >= 60 ? "text-blue-600" : "text-amber-600"
                          )}>
                            {result.matchScore}%
                          </div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Semantic Match</div>
                        </div>
                        <ChevronRight className={cn(
                          "w-4 h-4 transition-transform",
                          selectedResult?.candidateId === result.candidateId ? "text-blue-500 translate-x-1" : "text-gray-300"
                        )} />
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {selectedResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">AI Match Insights</h3>
                          <p className="text-sm text-gray-500">Deep analysis for {getCandidateById(selectedResult.candidateId)?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-blue-600">{selectedResult.matchScore}%</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Overall Semantic Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100">
                        <div className="flex items-center gap-2 mb-4">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-widest">Matching Skills</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedResult.matchingSkills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-white text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-200 shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-100">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-widest">Skill Gaps</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedResult.missingSkills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-white text-amber-700 rounded-lg text-[10px] font-bold border border-amber-200 shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-3 h-3 text-blue-500" />
                            Skill Similarity
                          </p>
                          <p className="text-xs text-gray-600 leading-relaxed">{selectedResult.skillSimilarityInsights}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <BarChart3 className="w-3 h-3 text-purple-500" />
                            Experience Relevance
                          </p>
                          <p className="text-xs text-gray-600 leading-relaxed">{selectedResult.experienceRelevance}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            Career Progression
                          </p>
                          <p className="text-xs text-gray-600 leading-relaxed">{selectedResult.careerProgression}</p>
                        </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="w-4 h-4 text-blue-200" />
                          <h4 className="text-xs font-bold uppercase tracking-widest text-blue-100">Final AI Recommendation</h4>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">
                          {selectedResult.recommendation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="h-[500px] bg-white border border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Match</h3>
              <p className="text-gray-500 max-w-md">
                Select a job description on the left and click "Run Semantic Match" to see the best candidates for the role.
              </p>
              <div className="mt-8 flex items-center gap-8">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skill Synonyms</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role Equivalence</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Career Path</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
