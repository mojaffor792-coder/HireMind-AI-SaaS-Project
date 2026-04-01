import { 
  Zap, 
  Star, 
  Shield, 
  Building2, 
  Info
} from 'lucide-react';
import { PlanLevel } from '../context/AppContext';

export interface Plan {
  id: PlanLevel;
  name: string;
  price: number;
  yearlyPrice?: number;
  description: string;
  icon: any;
  features: string[];
  lockedFeatures: string[];
  highlight?: boolean;
  badge?: string;
  color: string;
  gradient: string;
  checkoutUrl?: string;
  yearlyCheckoutUrl?: string;
}

export const PLANS: Plan[] = [
  {
    id: 'Free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    description: 'Perfect for trying out HireMind AI',
    icon: Info,
    color: 'slate',
    gradient: 'from-slate-400 to-slate-500',
    features: [
      '10 Resumes / month',
      'Basic Resume Parsing',
      'Basic Dashboard',
      'Candidate Database',
    ],
    lockedFeatures: [
      'AI Resume Analysis',
      'Semantic AI Matching',
      'Hiring Prediction AI',
      'Resume Fraud Detection',
      'JD Generator',
      'Advanced Analytics'
    ]
  },
  {
    id: 'Starter',
    name: 'Starter',
    price: 19,
    yearlyPrice: 15,
    description: 'For small teams starting to scale',
    icon: Zap,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    checkoutUrl: 'https://samiulreshad.lemonsqueezy.com/checkout/buy/cd5235e9-fd69-4416-ac2a-e3a9ddab25b9',
    yearlyCheckoutUrl: 'https://samiulreshad.lemonsqueezy.com/checkout/buy/cd5235e9-fd69-4416-ac2a-e3a9ddab25b9',
    features: [
      '100 Resumes / month',
      'AI Resume Analysis',
      'Candidate Ranking',
      'Auto Shortlisting',
      'Email Automation',
      'Interview Management',
    ],
    lockedFeatures: [
      'Semantic AI Matching',
      'Smart Auto Shortlisting',
      'Hiring Prediction AI',
      'Resume Fraud Detection',
      'JD Generator',
      'Advanced Analytics'
    ]
  },
  {
    id: 'Growth',
    name: 'Growth',
    price: 49,
    yearlyPrice: 39,
    description: 'Our most popular plan for growing companies',
    icon: Star,
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
    highlight: true,
    badge: 'Most Popular',
    checkoutUrl: 'https://samiulreshad.lemonsqueezy.com/checkout/buy/71f849d5-5115-4240-bfd4-5663c7851fae',
    yearlyCheckoutUrl: 'https://samiulreshad.lemonsqueezy.com/checkout/buy/71f849d5-5115-4240-bfd4-5663c7851fae',
    features: [
      '1,000 Resumes / month',
      'Semantic AI Matching',
      'Advanced Candidate Ranking',
      'Smart Auto Shortlisting',
      'Email Automation',
      'Interview Tracking',
      'Advanced Analytics',
      'AI JD Generator'
    ],
    lockedFeatures: [
      'Hiring Prediction AI',
      'Resume Fraud Detection',
      'Candidate Risk Indicators',
      'API Access',
      'White-label Branding'
    ]
  },
  {
    id: 'Pro',
    name: 'Pro',
    price: 79,
    yearlyPrice: 65,
    description: 'Advanced AI features for power users',
    icon: Shield,
    color: 'orange',
    gradient: 'from-orange-500 to-amber-600',
    checkoutUrl: 'https://samiulreshad.lemonsqueezy.com/checkout/buy/d2c73b57-ee6b-470f-879b-6b7a40ce058e',
    yearlyCheckoutUrl: 'https://samiulreshad.lemonsqueezy.com/checkout/buy/d2c73b57-ee6b-470f-879b-6b7a40ce058e',
    features: [
      '5,000 Resumes / month',
      'Hiring Prediction AI',
      'Resume Fraud Detection',
      'Advanced Matching',
      'Predictive Dashboard',
      'Custom Email Automation',
      'Candidate Risk Indicators'
    ],
    lockedFeatures: [
      'Custom AI Scoring Rules',
      'Team Management',
      'API Access',
      'White-label Branding'
    ]
  },
  {
    id: 'Enterprise',
    name: 'Enterprise',
    price: 149,
    yearlyPrice: 119,
    description: 'Full platform access for large organizations',
    icon: Building2,
    color: 'rose',
    gradient: 'from-rose-800 to-red-950',
    checkoutUrl: 'https://samiulreshad.lemonsqueezy.com/checkout/buy/3d694d25-6260-499b-b3af-27d534286d54',
    yearlyCheckoutUrl: 'https://samiulreshad.lemonsqueezy.com/checkout/buy/3d694d25-6260-499b-b3af-27d534286d54',
    features: [
      'Unlimited Resumes',
      'Full Semantic AI Matching',
      'Hiring Prediction AI',
      'Resume Fraud Detection',
      'AI JD Generator',
      'Custom AI Scoring Rules',
      'Team Management',
      'API Access',
      'White-label Branding'
    ],
    lockedFeatures: []
  }
];
