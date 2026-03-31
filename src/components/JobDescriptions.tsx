import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Plus, Search, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JobDescription } from '../services/gemini';

export const JobDescriptions: React.FC = () => {
  const { jobDescriptions, setJobDescriptions, setActiveJobId, activeJobId } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [newJob, setNewJob] = useState({ title: '', content: '', requirements: '', minScore: 80 });

  const addJob = () => {
    const job: JobDescription = {
      id: editingJobId || Math.random().toString(36).substr(2, 9),
      title: newJob.title,
      content: newJob.content,
      requirements: newJob.requirements.split(',').map(s => s.trim()),
      minScore: newJob.minScore
    };

    if (editingJobId) {
      setJobDescriptions(prev => prev.map(j => j.id === editingJobId ? job : j));
    } else {
      setJobDescriptions(prev => [job, ...prev]);
    }

    setIsAdding(false);
    setEditingJobId(null);
    setNewJob({ title: '', content: '', requirements: '', minScore: 80 });
  };

  const startEdit = (job: JobDescription) => {
    setEditingJobId(job.id);
    setNewJob({
      title: job.title,
      content: job.content,
      requirements: job.requirements.join(', '),
      minScore: job.minScore
    });
    setIsAdding(true);
  };

  const deleteJob = (id: string) => {
    setJobDescriptions(prev => prev.filter(j => j.id !== id));
    if (activeJobId === id) {
      setActiveJobId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-gray-900 tracking-tight">Job Descriptions</h1>
          <p className="text-gray-500 font-medium">Create and manage job requirements for AI matching.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-[20px] font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-500/20 group"
        >
          <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform duration-500">
            <Plus className="w-5 h-5" />
          </div>
          Create New Job
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {jobDescriptions.map((job) => (
          <div 
            key={job.id} 
            className={`glass-card rounded-[40px] p-10 transition-all group premium-shadow border border-white/40 relative overflow-hidden ${activeJobId === job.id ? 'ring-2 ring-blue-500/40 bg-blue-50/20' : 'hover:translate-y-[-8px] hover:bg-white/80'}`}
          >
            {activeJobId === job.id && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
            )}

            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center text-blue-600 shadow-inner border border-white">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-gray-900">{job.title}</h3>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">ID: {job.id}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                <button 
                  onClick={() => startEdit(job)}
                  className="p-3 hover:bg-white rounded-2xl text-gray-400 hover:text-blue-600 transition-all shadow-sm border border-transparent hover:border-blue-100 active:scale-90"
                ><Edit3 className="w-5 h-5" /></button>
                <button 
                  onClick={() => deleteJob(job.id)}
                  className="p-3 hover:bg-red-50 rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-sm border border-transparent hover:border-red-100 active:scale-90"
                ><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>

            <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed font-medium text-base">{job.content}</p>

            <div className="flex flex-wrap gap-3 mb-10 relative z-10">
              {job.requirements.map((req, i) => (
                <span key={i} className="text-[10px] font-bold bg-white/80 text-gray-500 px-4 py-2 rounded-xl border border-gray-100 uppercase tracking-wider shadow-sm">
                  {req}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-100/60 relative z-10">
              <div className="flex items-center gap-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Min Match Score</div>
                <div className="text-2xl font-display font-bold text-blue-600">{job.minScore}%</div>
              </div>
              <button 
                onClick={() => setActiveJobId(job.id)}
                className={`px-8 py-3.5 rounded-[20px] text-sm font-bold transition-all shadow-sm border active:scale-95 ${activeJobId === job.id ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-gray-500 hover:text-gray-900 border-gray-100 hover:border-gray-200'}`}
              >
                {activeJobId === job.id ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Active Job
                  </span>
                ) : 'Set as Active'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-2xl border border-white/40 rounded-[48px] p-12 w-full max-w-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h2 className="text-4xl font-display font-bold text-gray-900 tracking-tight">{editingJobId ? 'Edit Job' : 'New Job Description'}</h2>
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setEditingJobId(null);
                  setNewJob({ title: '', content: '', requirements: '', minScore: 80 });
                }}
                className="p-3 hover:bg-gray-100 rounded-full text-gray-400 transition-all active:rotate-90"
              >
                <Plus className="w-8 h-8 rotate-45" />
              </button>
            </div>
            
            <div className="space-y-8 relative z-10">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 block ml-1">Job Title</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all placeholder:text-gray-300"
                  placeholder="e.g. Senior Product Designer"
                  value={newJob.title}
                  onChange={e => setNewJob({...newJob, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 block ml-1">Description</label>
                <textarea 
                  rows={4}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all resize-none placeholder:text-gray-300 leading-relaxed"
                  placeholder="Paste the full job description here..."
                  value={newJob.content}
                  onChange={e => setNewJob({...newJob, content: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 block ml-1">Key Requirements (comma separated)</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all placeholder:text-gray-300"
                  placeholder="React, TypeScript, Figma, UI/UX"
                  value={newJob.requirements}
                  onChange={e => setNewJob({...newJob, requirements: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 block ml-1">Min Match Score (%)</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
                    value={newJob.minScore}
                    onChange={e => setNewJob({...newJob, minScore: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-6 mt-12 relative z-10">
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setEditingJobId(null);
                  setNewJob({ title: '', content: '', requirements: '', minScore: 80 });
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-5 rounded-[20px] transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={addJob}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-[20px] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                {editingJobId ? 'Update Job' : 'Save Job'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
