import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Users
} from 'lucide-react';
import { useApp, FEATURE_PLANS } from '../context/AppContext';
import { Candidate } from '../services/gemini';
import { cn, formatDate } from '../lib/utils';
import { EmailModal } from './EmailModal';
import { Sparkles } from 'lucide-react';

export const CandidateDatabase: React.FC<{ filterStatus?: string; onLockedClick?: (id: string) => void }> = ({ filterStatus, onLockedClick }) => {
  const { candidates, setCandidates, hasAccess } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isRanking, setIsRanking] = useState(false);

  const canRank = hasAccess('candidate-ranking');
  const canEmail = hasAccess('email-automation');
  const canSeeAnalysis = hasAccess('ai-analysis');

  const rankCandidates = () => {
    if (!canRank) {
      onLockedClick?.('candidate-ranking');
      return;
    }
    setIsRanking(true);
    setTimeout(() => {
      setCandidates(prev => [...prev].sort((a, b) => b.scores.overall - a.scores.overall));
      setIsRanking(false);
    }, 1000);
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                         c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus ? c.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, status: Candidate['status']) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    if (selectedCandidate?.id === id) {
      setSelectedCandidate(prev => prev ? { ...prev, status } : null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {filterStatus ? `${filterStatus} Candidates` : 'Candidate Database'}
          </h1>
          <p className="text-gray-500 text-sm">Manage and review all your applicants in one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={rankCandidates}
            disabled={isRanking}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm",
              canRank 
                ? "bg-blue-600 text-white hover:bg-blue-500" 
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            )}
          >
                {isRanking ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Ranking...
                  </span>
                ) : (
                  <>
                    {canRank ? <div className="w-3 h-3 bg-white/20 rounded-full" /> : (
                      <span className="text-[8px] font-black bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-md uppercase tracking-widest">Pro</span>
                    )}
                    Rank Candidates
                  </>
                )}
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              className="bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 shadow-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          {filteredCandidates.map((candidate) => (
            <motion.div
              layout
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate)}
              className={cn(
                "bg-white border border-gray-200 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md group",
                selectedCandidate?.id === candidate.id && "ring-2 ring-blue-500/50 shadow-md"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-600 border border-blue-100">
                  {candidate.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{candidate.name}</h3>
                      <div className="flex items-center gap-2">
                        {candidate.emails && candidate.emails.length > 0 && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                            <Mail className="w-3 h-3" />
                            {candidate.emails.length}
                          </span>
                        )}
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md",
                          candidate.status === 'Shortlisted' ? "bg-emerald-50 text-emerald-600" :
                          candidate.status === 'Rejected' ? "bg-red-50 text-red-600" :
                          candidate.status === 'Hired' ? "bg-blue-50 text-blue-600" :
                          "bg-gray-100 text-gray-500"
                        )}>
                          {candidate.status}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-bold text-blue-600">{candidate.scores.overall}%</div>
                        </div>
                      </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-1">{candidate.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.slice(0, 4).map(skill => (
                      <span key={skill} className="text-[10px] font-medium bg-gray-50 text-gray-600 px-2 py-1 rounded-lg border border-gray-100">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 4 && (
                      <span className="text-[10px] font-medium text-gray-400 px-1 py-1">
                        +{candidate.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredCandidates.length === 0 && (
            <div className="text-center py-20 bg-white border border-gray-200 border-dashed rounded-3xl">
              <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500">No candidates found matching your criteria.</p>
            </div>
          )}
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {selectedCandidate ? (
              <motion.div
                key={selectedCandidate.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-gray-200 rounded-3xl p-6 sticky top-8 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-blue-500/20">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        if (canEmail) {
                          setIsEmailModalOpen(true);
                        } else {
                          onLockedClick?.('email-automation');
                        }
                      }}
                      className={cn(
                        "p-2 border rounded-xl transition-all",
                        canEmail 
                          ? "bg-gray-50 border-gray-200 text-gray-400 hover:text-blue-600 hover:bg-blue-50" 
                          : "bg-gray-100 border-gray-200 text-gray-300 hover:bg-gray-200"
                      )}
                    >
                      {canEmail ? <Mail className="w-5 h-5" /> : (
                        <span className="text-[8px] font-black bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-md uppercase tracking-widest">Pro</span>
                      )}
                    </button>
                    <button className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-900 transition-all">
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedCandidate.name}</h2>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {selectedCandidate.email}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Overall Score</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedCandidate.scores.overall}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Experience</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedCandidate.scores.experience}%</p>
                  </div>
                </div>

                <div className="space-y-5 mb-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">AI Analysis</h4>
                      {!canSeeAnalysis && (
                        <span className="text-[8px] font-black bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md uppercase tracking-widest">Pro</span>
                      )}
                    </div>
                    {canSeeAnalysis ? (
                      <div className="space-y-2">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5">
                          <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Strengths</p>
                          <ul className="space-y-1">
                            {selectedCandidate.analysis.strengths.map((s, i) => (
                              <li key={i} className="text-xs text-emerald-700 flex items-start gap-2">
                                <CheckCircle2 className="w-3 h-3 mt-0.5" /> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-50 border border-red-100 rounded-xl p-2.5">
                          <p className="text-[10px] font-bold text-red-600 uppercase mb-2">Weaknesses</p>
                          <ul className="space-y-1">
                            {selectedCandidate.analysis.weaknesses.map((w, i) => (
                              <li key={i} className="text-xs text-red-700 flex items-start gap-2">
                                <XCircle className="w-3 h-3 mt-0.5" /> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => onLockedClick?.('ai-analysis')}
                        className="bg-gray-50 border border-gray-200 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-100 transition-all"
                      >
                        <div className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-3">Pro Feature</div>
                        <p className="text-xs font-bold text-gray-900 mb-1">AI Analysis Locked</p>
                        <p className="text-[10px] text-gray-500">Upgrade to Starter to unlock AI-powered candidate insights.</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Recommendation</h4>
                      {!canSeeAnalysis && (
                        <span className="text-[8px] font-black bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md uppercase tracking-widest">Pro</span>
                      )}
                    </div>
                    {canSeeAnalysis ? (
                      <p className="text-sm text-gray-600 leading-relaxed italic">
                        "{selectedCandidate.analysis.recommendation}"
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic blur-[2px] select-none">
                        Upgrade to see AI recommendation for this candidate.
                      </p>
                    )}
                  </div>

                  {selectedCandidate.emails && selectedCandidate.emails.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Recent Communications</h4>
                      <div className="space-y-2">
                        {selectedCandidate.emails.slice(0, 2).map(email => (
                          <div key={email.id} className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className={cn(
                                "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded",
                                email.type === 'Invitation' ? "bg-blue-100 text-blue-600" :
                                email.type === 'Rejection' ? "bg-red-100 text-red-600" :
                                "bg-gray-200 text-gray-600"
                              )}>
                                {email.type}
                              </span>
                              <span className="text-[10px] text-gray-400">{new Date(email.sentDate).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs font-medium text-gray-900 truncate">{email.subject}</p>
                          </div>
                        ))}
                        {selectedCandidate.emails.length > 2 && (
                          <button 
                            onClick={() => setIsEmailModalOpen(true)}
                            className="text-[10px] font-bold text-blue-600 hover:underline"
                          >
                            View all {selectedCandidate.emails.length} emails
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        if (canEmail) {
                          setIsEmailModalOpen(true);
                        } else {
                          onLockedClick?.('email-automation');
                        }
                      }}
                      className={cn(
                        "w-full font-bold py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2",
                        canEmail 
                          ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20" 
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200 shadow-none"
                      )}
                    >
                      {canEmail ? <Mail className="w-5 h-5" /> : (
                        <span className="text-[8px] font-black bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-md uppercase tracking-widest">Pro</span>
                      )}
                      {canEmail ? 'Contact Candidate' : 'Upgrade to Contact'}
                    </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => updateStatus(selectedCandidate.id, 'Interview Scheduled')}
                      className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Interview
                    </button>
                    <button 
                      onClick={() => updateStatus(selectedCandidate.id, 'Rejected')}
                      className="bg-gray-50 border border-gray-200 hover:bg-red-50 hover:text-red-600 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white border border-gray-200 border-dashed rounded-3xl p-12 text-center h-[600px] flex flex-col items-center justify-center">
                <Users className="w-16 h-16 text-gray-100 mb-4" />
                <p className="text-gray-400 text-sm">Select a candidate to view their AI analysis and profile.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isEmailModalOpen && selectedCandidate && (
          <EmailModal 
            candidate={selectedCandidate} 
            onClose={() => setIsEmailModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
