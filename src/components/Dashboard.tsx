import React, { useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Briefcase, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';

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
      { label: 'Total Applicants', value: totalApplicants.toLocaleString(), icon: Users, color: 'blue', trend: '+12.5%', isPositive: true },
      { label: 'Shortlisted', value: shortlisted.toLocaleString(), icon: UserCheck, color: 'purple', trend: '+8.2%', isPositive: true },
      { label: 'Interviews', value: interviews.toLocaleString(), icon: Calendar, color: 'emerald', trend: '-2.4%', isPositive: false },
      { label: 'Hired Candidates', value: hired.toLocaleString(), icon: Briefcase, color: 'amber', trend: '+4.1%', isPositive: true },
    ];

    const rate = totalApplicants > 0 ? ((hired / totalApplicants) * 100).toFixed(1) : '0.0';

    const chart = days.map(day => {
      const count = candidates.filter(c => {
        const date = new Date(c.appliedDate);
        return days[date.getDay()] === day;
      }).length;
      return { name: day, apps: count + Math.floor(Math.random() * 5) }; // Adding some mock variety
    });

    return { stats: statsList, conversionRate: rate, chartData: chart };
  }, [candidates]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 tracking-tight">Recruitment Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor your hiring pipeline and candidate performance.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl px-4 py-2.5 shadow-sm premium-shadow">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 leading-none">Conversion Rate</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{conversionRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-[24px] p-6 group cursor-default relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-600`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-0.5 ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-3xl font-display font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card rounded-[32px] p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-display font-bold text-gray-900">Application Trends</h3>
              <p className="text-sm text-gray-500 mt-0.5">Daily volume of new candidate applications.</p>
            </div>
            <div className="flex bg-gray-100/50 p-1 rounded-xl">
              <button className="px-4 py-1.5 text-xs font-bold bg-white rounded-lg shadow-sm text-gray-900">7D</button>
              <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">30D</button>
            </div>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" stroke="#00000008" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)', 
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="apps" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorApps)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-[32px] p-8 flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-bold text-gray-900">Top Candidates</h3>
            <button className="text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-wider">See All</button>
          </div>
          
          <div className="space-y-6 flex-1">
            {candidates.slice(0, 5).map((candidate, idx) => (
              <motion.div 
                key={candidate.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (idx * 0.1) }}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="relative">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-blue-600 font-bold border border-white group-hover:scale-105 transition-transform`}>
                    {candidate.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{candidate.name}</h4>
                  <p className="text-[11px] text-gray-400 font-medium truncate uppercase tracking-tight">{candidate.role}</p>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black tracking-tighter">
                    {candidate.scores.overall}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button 
            onClick={onViewAll}
            className="w-full mt-8 py-4 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/10 transition-all active:scale-[0.98]"
          >
            Open Pipeline
          </button>
        </motion.div>
      </div>
    </div>
  );
};
