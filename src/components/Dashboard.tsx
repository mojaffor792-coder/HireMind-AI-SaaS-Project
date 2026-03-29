import React, { useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Briefcase, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useApp } from '../context/AppContext';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DashboardProps {
  onViewAll: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewAll }) => {
  const { candidates } = useApp();

  const { stats, conversionRate, chartData } = useMemo(() => {
    const totalApplicants = candidates.length;
    const shortlisted = candidates.filter(c => c.status === 'Shortlisted').length;
    const interviews = candidates.filter(c => c.status === 'Interview Scheduled').length;
    const hired = candidates.filter(c => c.status === 'Hired').length;

    const statsList = [
      { label: 'Total Applicants', value: totalApplicants.toLocaleString(), icon: Users, color: 'blue', trend: totalApplicants > 0 ? '+0%' : '0%' },
      { label: 'Shortlisted', value: shortlisted.toLocaleString(), icon: UserCheck, color: 'purple', trend: shortlisted > 0 ? '+0%' : '0%' },
      { label: 'Interviews', value: interviews.toLocaleString(), icon: Calendar, color: 'emerald', trend: interviews > 0 ? '+0%' : '0%' },
      { label: 'Hired Candidates', value: hired.toLocaleString(), icon: Briefcase, color: 'amber', trend: hired > 0 ? '+0%' : '0%' },
    ];

    const rate = totalApplicants > 0 ? ((hired / totalApplicants) * 100).toFixed(1) : '0.0';

    const chart = days.map(day => {
      const count = candidates.filter(c => {
        const date = new Date(c.appliedDate);
        return days[date.getDay()] === day;
      }).length;
      return { name: day, apps: count };
    });

    return { stats: statsList, conversionRate: rate, chartData: chart };
  }, [candidates]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here's what's happening with your hiring pipeline.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-gray-700">Hiring Conversion: <span className="text-emerald-500">{conversionRate}%</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.trend}
                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Application Trends</h3>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#00000040" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#00000040" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #00000010', borderRadius: '12px' }}
                  itemStyle={{ color: '#000' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="apps" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorApps)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Recent Candidates</h3>
          <div className="space-y-5">
            {candidates.slice(0, 4).map((candidate) => (
              <div key={candidate.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                  {candidate.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{candidate.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{candidate.skills.slice(0, 2).join(', ')}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-blue-600">{candidate.scores.overall}%</div>
                  <div className="text-[10px] text-gray-400">Match</div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={onViewAll}
            className="w-full mt-8 py-3 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-500 text-sm font-medium transition-all"
          >
            View All Candidates
          </button>
        </div>
      </div>
    </div>
  );
};
