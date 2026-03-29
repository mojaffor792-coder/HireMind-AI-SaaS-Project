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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Descriptions</h1>
          <p className="text-gray-500 text-sm">Create and manage job requirements for AI matching.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          Create New Job
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {jobDescriptions.map((job) => (
          <div 
            key={job.id} 
            className={`bg-white border rounded-3xl p-5 transition-all group shadow-sm ${activeJobId === job.id ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                  <p className="text-xs text-gray-400">ID: {job.id}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => startEdit(job)}
                  className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-all"
                ><Edit3 className="w-4 h-4" /></button>
                <button 
                  onClick={() => deleteJob(job.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                ><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.content}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.requirements.map((req, i) => (
                <span key={i} className="text-[10px] font-bold bg-gray-50 text-gray-500 px-2 py-1 rounded-lg border border-gray-100 uppercase tracking-wider">
                  {req}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Min Score</div>
                <div className="text-sm font-bold text-blue-600">{job.minScore}%</div>
              </div>
              <button 
                onClick={() => setActiveJobId(job.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeJobId === job.id ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-500 hover:text-gray-900 border border-gray-100'}`}
              >
                {activeJobId === job.id ? 'Active for Matching' : 'Set as Active'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 w-full max-w-2xl shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{editingJobId ? 'Edit Job Description' : 'Create Job Description'}</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Job Title</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="e.g. Senior Product Designer"
                  value={newJob.title}
                  onChange={e => setNewJob({...newJob, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Description</label>
                <textarea 
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Paste the full job description here..."
                  value={newJob.content}
                  onChange={e => setNewJob({...newJob, content: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Key Requirements (comma separated)</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="React, TypeScript, Figma, UI/UX"
                  value={newJob.requirements}
                  onChange={e => setNewJob({...newJob, requirements: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Min Match Score (%)</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={newJob.minScore}
                    onChange={e => setNewJob({...newJob, minScore: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setEditingJobId(null);
                  setNewJob({ title: '', content: '', requirements: '', minScore: 80 });
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={addJob}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20"
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
