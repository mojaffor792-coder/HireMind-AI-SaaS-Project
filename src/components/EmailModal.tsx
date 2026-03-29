import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Mail, ChevronDown, CheckCircle2, Loader2, History } from 'lucide-react';
import { Candidate, EmailLog } from '../services/gemini';
import { EMAIL_TEMPLATES, replacePlaceholders } from '../constants/emailTemplates';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

interface EmailModalProps {
  candidate: Candidate;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ candidate, onClose }) => {
  const { user, jobDescriptions, activeJobId, setCandidates } = useApp();
  const [selectedTemplateId, setSelectedTemplateId] = useState(EMAIL_TEMPLATES[0].id);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [view, setView] = useState<'compose' | 'history'>('compose');

  const activeJob = jobDescriptions.find(j => j.id === activeJobId) || jobDescriptions[0];

  useEffect(() => {
    const template = EMAIL_TEMPLATES.find(t => t.id === selectedTemplateId);
    if (template) {
      const data = {
        candidateName: candidate.name,
        jobTitle: activeJob?.title || 'the position',
        companyName: user?.company || 'our company',
        senderName: user?.name || 'Hiring Team'
      };
      setSubject(replacePlaceholders(template.subject, data));
      setBody(replacePlaceholders(template.body, data));
    }
  }, [selectedTemplateId, candidate, activeJob, user]);

  const handleSend = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newEmail: EmailLog = {
      id: Math.random().toString(36).substr(2, 9),
      subject,
      body,
      sentDate: new Date().toISOString(),
      type: EMAIL_TEMPLATES.find(t => t.id === selectedTemplateId)?.type || 'Update'
    };

    setCandidates(prev => prev.map(c => {
      if (c.id === candidate.id) {
        return {
          ...c,
          emails: [newEmail, ...(c.emails || [])]
        };
      }
      return c;
    }));

    setIsSending(false);
    setIsSent(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white border border-gray-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Email Candidate</h2>
              <p className="text-xs text-gray-500">{candidate.name} ({candidate.email})</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setView(view === 'compose' ? 'history' : 'compose')}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-all flex items-center gap-2 text-sm font-medium"
            >
              {view === 'compose' ? <History className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              {view === 'compose' ? 'History' : 'Compose'}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {isSent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Sent!</h3>
              <p className="text-gray-500">Your message has been successfully sent to {candidate.name}.</p>
            </div>
          ) : view === 'compose' ? (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Select Template</label>
                <div className="relative">
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                  >
                    {EMAIL_TEMPLATES.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Message Body</label>
                <textarea
                  rows={10}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none font-sans text-sm leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {candidate.emails && candidate.emails.length > 0 ? (
                candidate.emails.map((email) => (
                  <div key={email.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md",
                        email.type === 'Invitation' ? "bg-blue-50 text-blue-600" :
                        email.type === 'Rejection' ? "bg-red-50 text-red-600" :
                        "bg-gray-200 text-gray-500"
                      )}>
                        {email.type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(email.sentDate).toLocaleDateString()} at {new Date(email.sentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{email.subject}</h4>
                    <p className="text-xs text-gray-600 whitespace-pre-wrap line-clamp-3">{email.body}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500">No emails sent to this candidate yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {!isSent && view === 'compose' && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Email
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
