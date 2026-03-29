import React, { createContext, useContext, useState, useEffect } from 'react';
import { Candidate, JobDescription } from '../services/gemini';

export type PlanLevel = 'FREE' | 'STARTER' | 'GROWTH' | 'PRO' | 'ENTERPRISE';

export const PLAN_RANK: Record<PlanLevel, number> = {
  'FREE': 0,
  'STARTER': 1,
  'GROWTH': 2,
  'PRO': 3,
  'ENTERPRISE': 4
};

export const FEATURE_PLANS: Record<string, PlanLevel> = {
  'dashboard': 'FREE',
  'semantic-match': 'GROWTH',
  'prediction': 'PRO',
  'fraud-detection': 'PRO',
  'jd-generator': 'GROWTH',
  'upload': 'FREE',
  'candidates': 'FREE',
  'jobs': 'STARTER',
  'shortlisted': 'STARTER',
  'interviews': 'STARTER',
  'analytics': 'GROWTH',
  'settings': 'FREE',
  'candidate-ranking': 'STARTER',
  'email-automation': 'STARTER',
};

interface User {
  name: string;
  email: string;
  company: string;
  subscriptionPlan: PlanLevel | null;
  planLevel: number;
  usage: {
    resumesUploaded: number;
  };
}

export const PLAN_LIMITS: Record<PlanLevel, number> = {
  'FREE': 10,
  'STARTER': 100,
  'GROWTH': 1000,
  'PRO': 5000,
  'ENTERPRISE': Infinity
};

interface AppContextType {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  jobDescriptions: JobDescription[];
  setJobDescriptions: React.Dispatch<React.SetStateAction<JobDescription[]>>;
  activeJobId: string | null;
  setActiveJobId: (id: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  hasAccess: (featureId: string) => boolean;
  upgradePlan: (plan: PlanLevel) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const hasAccess = (featureId: string) => {
    if (!user || user.subscriptionPlan === null) return false;
    const requiredPlan = FEATURE_PLANS[featureId] || 'FREE';
    return user.planLevel >= PLAN_RANK[requiredPlan];
  };

  const upgradePlan = (plan: PlanLevel) => {
    if (user) {
      setUser({ 
        ...user, 
        subscriptionPlan: plan,
        planLevel: PLAN_RANK[plan]
      });
    }
  };

  // Mock initial data
  useEffect(() => {
    setCandidates([
      {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        phone: '+1 555-0123',
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'GraphQL'],
        experience: '5 years of frontend development experience at tech startups.',
        education: 'B.S. in Computer Science from Stanford University',
        summary: 'Senior Frontend Engineer passionate about building scalable and performant web applications.',
        scores: { skills: 92, experience: 88, education: 95, overall: 91 },
        analysis: {
          strengths: ['Expert in React ecosystem', 'Strong architectural skills', 'Excellent communicator'],
          weaknesses: ['Limited backend experience', 'New to system design'],
          recommendation: 'Highly recommended for senior frontend roles.'
        },
        status: 'Shortlisted',
        appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        resumeText: 'Sarah Chen Resume Content...'
      },
      {
        id: '2',
        name: 'Marcus Rodriguez',
        email: 'marcus.r@example.com',
        phone: '+1 555-0124',
        skills: ['Python', 'PyTorch', 'TensorFlow', 'SQL', 'AWS'],
        experience: '3 years as an AI Engineer focusing on computer vision and NLP.',
        education: 'M.S. in Artificial Intelligence from MIT',
        summary: 'Machine Learning Engineer with a strong background in deep learning and model optimization.',
        scores: { skills: 95, experience: 82, education: 98, overall: 90 },
        analysis: {
          strengths: ['Deep understanding of ML theory', 'Proficient in Python', 'Research experience'],
          weaknesses: ['Less experience with production deployment', 'Limited frontend knowledge'],
          recommendation: 'Strong candidate for AI/ML engineering positions.'
        },
        status: 'Applied',
        appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        resumeText: 'Marcus Rodriguez Resume Content...'
      },
      {
        id: '3',
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        phone: '+1 555-0125',
        skills: ['JavaScript', 'HTML5', 'CSS3', 'Vue.js', 'Firebase'],
        experience: '4 years of web development experience building user interfaces.',
        education: 'B.A. in Digital Arts from NYU',
        summary: 'Creative UI Engineer with a focus on user experience and responsive design.',
        scores: { skills: 85, experience: 85, education: 80, overall: 84 },
        analysis: {
          strengths: ['Eye for design', 'Strong CSS skills', 'UX focused'],
          weaknesses: ['Limited TypeScript experience', 'New to GraphQL'],
          recommendation: 'Good fit for UI/UX focused frontend roles.'
        },
        status: 'Interview Scheduled',
        appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        resumeText: 'Alex Rivera Resume Content...'
      }
    ]);

    setJobDescriptions([
      {
        id: 'j1',
        title: 'Senior Frontend Engineer',
        content: 'We are looking for a Senior Frontend Engineer to lead our web development team. You will be responsible for building high-quality, performant, and scalable web applications using modern technologies.',
        requirements: ['Expert in React', 'Strong TypeScript skills', 'Experience with Tailwind CSS', 'Knowledge of GraphQL', 'Unit testing experience'],
        minScore: 85
      },
      {
        id: 'j2',
        title: 'Machine Learning Engineer',
        content: 'Join our AI team to build and deploy cutting-edge machine learning models. You will work on computer vision and NLP projects to solve complex business problems.',
        requirements: ['Proficiency in Python', 'Experience with PyTorch or TensorFlow', 'Strong understanding of deep learning', 'AWS experience', 'M.S. or Ph.D. in AI/CS'],
        minScore: 80
      }
    ]);

    setUser({
      name: 'Mojaffor Hossain',
      email: 'mojaffor792@gmail.com',
      company: 'HireMind AI',
      subscriptionPlan: null,
      planLevel: -1,
      usage: {
        resumesUploaded: 3
      }
    });
  }, []);

  return (
    <AppContext.Provider value={{ 
      candidates, setCandidates, 
      jobDescriptions, setJobDescriptions,
      activeJobId, setActiveJobId,
      user, setUser,
      hasAccess,
      upgradePlan
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
