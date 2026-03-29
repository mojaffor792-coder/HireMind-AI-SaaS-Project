import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Wand2, 
  Copy, 
  Check, 
  RotateCcw, 
  Plus, 
  Briefcase, 
  Building2, 
  Target, 
  Code2, 
  DollarSign, 
  Heart, 
  Search,
  FileText,
  Save
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateJobDescription, GeneratedJD, JobDescription } from '../services/gemini';
import { cn } from '../lib/utils';

export const JDGenerator: React.FC = () => {
  const { setJobDescriptions } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    title: '',
    industry: '',
    experienceLevel: 'Mid-Level',
    keySkills: ''
  });
  const [result, setResult] = useState<GeneratedJD | null>(null);

  const handleGenerate = async () => {
    if (!form.title || !form.industry) return;
    setIsGenerating(true);
    try {
      const jd = await generateJobDescription({
        title: form.title,
        industry: form.industry,
        experienceLevel: form.experienceLevel,
        keySkills: form.keySkills.split(',').map(s => s.trim()).filter(Boolean)
      });
      setResult(jd);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `
${result.title}
${result.summary}

Responsibilities:
${result.responsibilities.map(r => `- ${r}`).join('\n')}

Required Skills:
${result.requiredSkills.map(s => `- ${s}`).join('\n')}

Preferred Qualifications:
${result.preferredQualifications.map(q => `- ${q}`).join('\n')}

Salary Range: ${result.salaryRange}

Benefits:
${result.benefits.map(b => `- ${b}`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = () => {
    if (!result) return;
    const newJD: JobDescription = {
      id: Math.random().toString(36).substr(2, 9),
      title: result.title,
      content: result.summary + '\n\n' + result.responsibilities.join('\n'),
      requirements: [...result.requiredSkills, ...result.preferredQualifications],
      minScore: 80
    };
    setJobDescriptions(prev => [newJD, ...prev]);
    alert('Job Description published to your active jobs!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          AI-Powered JD Generation
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Job Description Generator</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Create professional, SEO-optimized job descriptions in seconds using our advanced AI engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-blue-600" />
              Role Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                  Job Title
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                  Industry
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.industry}
                    onChange={e => setForm({ ...form, industry: e.target.value })}
                    placeholder="e.g. Fintech, E-commerce"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                  Experience Level
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={form.experienceLevel}
                    onChange={e => setForm({ ...form, experienceLevel: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                  >
                    <option>Entry-Level</option>
                    <option>Mid-Level</option>
                    <option>Senior</option>
                    <option>Lead / Manager</option>
                    <option>Executive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                  Key Skills (comma separated)
                </label>
                <div className="relative">
                  <Code2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={form.keySkills}
                    onChange={e => setForm({ ...form, keySkills: e.target.value })}
                    placeholder="React, TypeScript, AWS, Node.js..."
                    className="w-full h-24 bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !form.title || !form.industry}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {isGenerating ? (
                <>
                  <RotateCcw className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Description
                </>
              )}
            </button>
          </div>

          <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" />
              SEO Optimized
            </h4>
            <p className="text-blue-100 text-sm leading-relaxed">
              Our AI ensures your job descriptions contain the right keywords to rank higher on job boards like LinkedIn, Indeed, and Glassdoor.
            </p>
          </div>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm"
              >
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{result.title}</h2>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Generated by HireMind AI</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 transition-all shadow-sm flex items-center gap-2 text-xs font-bold"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={handlePublish}
                      className="p-2.5 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 text-xs font-bold"
                    >
                      <Save className="w-4 h-4" />
                      Publish
                    </button>
                  </div>
                </div>

                <div className="p-8 space-y-8 max-h-[700px] overflow-y-auto custom-scrollbar">
                  <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" />
                      Job Summary
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{result.summary}</p>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5" />
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {result.responsibilities.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5" />
                        Required Skills
                      </h4>
                      <ul className="space-y-2">
                        {result.requiredSkills.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5" />
                        Preferred
                      </h4>
                      <ul className="space-y-2">
                        {result.preferredQualifications.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5" />
                        Salary Range
                      </h4>
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <p className="text-lg font-bold text-gray-900">{result.salaryRange}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">Estimated Market Value</p>
                      </div>
                    </section>
                    <section>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5" />
                        Benefits
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.benefits.map((item, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">
                            {item}
                          </span>
                        ))}
                      </div>
                    </section>
                  </div>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">SEO Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.seoKeywords.map((item, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-500 text-[9px] font-bold rounded-md uppercase tracking-wider">
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-gray-200 border-dashed rounded-[32px] p-12 text-center h-[600px] flex flex-col items-center justify-center space-y-6"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-200" />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Description Generated</h3>
                  <p className="text-gray-400 text-sm">Fill in the role details on the left and click "Generate Description" to see the magic happen.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
