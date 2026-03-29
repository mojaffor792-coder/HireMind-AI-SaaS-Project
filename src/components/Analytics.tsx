import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Users, UserCheck, Calendar, Briefcase, TrendingUp, Target, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

import { useApp } from '../context/AppContext';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export const Analytics: React.FC = () => {
  const { candidates } = useApp();

  const total = candidates.length;
  const shortlisted = candidates.filter(c => c.status === 'Shortlisted').length;
  const interviewed = candidates.filter(c => c.status === 'Interview Scheduled').length;
  const hired = candidates.filter(c => c.status === 'Hired').length;

  const funnelData = [
    { name: 'Applied', value: total, fill: '#3b82f6' },
    { name: 'Shortlisted', value: shortlisted, fill: '#8b5cf6' },
    { name: 'Interviewed', value: interviewed, fill: '#10b981' },
    { name: 'Hired', value: hired, fill: '#f59e0b' },
  ];

  // Mock source data based on existing candidates or empty if none
  const sourceData = total > 0 ? [
    { name: 'Direct Upload', value: total },
  ] : [];

  const shortlistRate = total > 0 ? ((shortlisted / total) * 100).toFixed(1) : '0.0';
  const interviewSuccess = interviewed > 0 ? ((hired / interviewed) * 100).toFixed(1) : '0.0';

  const stats = [
    { label: 'Shortlist Rate', value: `${shortlistRate}%`, icon: Target, color: 'blue' },
    { label: 'Interview Success', value: `${interviewSuccess}%`, icon: Zap, color: 'purple' },
    { label: 'Time to Hire', value: hired > 0 ? 'TBD' : '0 Days', icon: TrendingUp, color: 'emerald' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hiring Analytics</h1>
        <p className="text-gray-500 text-sm">Deep dive into your recruitment performance and candidate pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
              stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
              stat.color === 'purple' ? "bg-purple-50 text-purple-600" :
              "bg-emerald-50 text-emerald-600"
            )}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recruitment Funnel</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#9ca3af" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#111827' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Candidate Sources</h3>
          <div className="flex items-center h-[300px]">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#111827' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-4">
              {sourceData.map((source, i) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-gray-500">{source.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{source.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
