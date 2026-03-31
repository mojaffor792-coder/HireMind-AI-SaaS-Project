import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, getDocFromServer } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Candidate, JobDescription } from '../services/gemini';

export type PlanLevel = 'FREE' | 'STARTER' | 'GROWTH' | 'PRO' | 'ENTERPRISE';

export const PLAN_RANK: Record<PlanLevel, number> = {
  'FREE': 0,
  'STARTER': 1,
  'GROWTH': 2,
  'PRO': 3,
  'ENTERPRISE': 4
};

export const PLAN_LIMITS: Record<PlanLevel, number> = {
  'FREE': 10,
  'STARTER': 100,
  'GROWTH': 1000,
  'PRO': 5000,
  'ENTERPRISE': Infinity
};

export const FEATURE_PLANS: Record<string, PlanLevel> = {
  'dashboard': 'FREE',
  'upload': 'FREE',
  'candidates': 'FREE',
  'jobs': 'FREE',
  'basic-parsing': 'FREE',
  'ai-analysis': 'STARTER',
  'candidate-ranking': 'STARTER',
  'email-automation': 'STARTER',
  'shortlisted': 'STARTER',
  'semantic-match': 'GROWTH',
  'advanced-ranking': 'GROWTH',
  'interviews': 'GROWTH',
  'jd-generator': 'GROWTH',
  'fraud-detection': 'PRO',
  'prediction': 'PRO',
  'analytics': 'PRO',
  'api-access': 'ENTERPRISE',
  'white-label': 'ENTERPRISE',
  'settings': 'FREE',
};

interface User {
  uid: string;
  name: string;
  email: string;
  company: string;
  user_plan: PlanLevel;
  planLevel: number;
  usage: {
    resumesUploaded: number;
  };
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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
  upgradePlan: (plan: PlanLevel) => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthReady: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen for real-time updates to the user document
        const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as any;
            setUser({
              uid: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || 'User',
              email: userData.email || firebaseUser.email || '',
              company: userData.company || '',
              user_plan: userData.user_plan || 'FREE',
              planLevel: PLAN_RANK[userData.user_plan as PlanLevel] || 0,
              usage: userData.usage || { resumesUploaded: 0 }
            });
          } else {
            // Create default user document if it doesn't exist
            const newUser: User = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              company: '',
              user_plan: 'FREE',
              planLevel: 0,
              usage: { resumesUploaded: 0 }
            };
            setDoc(userDocRef, newUser).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`));
            setUser(newUser);
          }
          setLoading(false);
          setIsAuthReady(true);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        });

        return () => unsubDoc();
      } else {
        setUser(null);
        setLoading(false);
        setIsAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasAccess = (featureId: string) => {
    if (!user) return false;
    const requiredPlan = FEATURE_PLANS[featureId] || 'FREE';
    return user.planLevel >= PLAN_RANK[requiredPlan];
  };

  const upgradePlan = async (plan: PlanLevel) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await setDoc(userDocRef, {
          ...user,
          user_plan: plan,
          planLevel: PLAN_RANK[plan]
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    }
  };

  // Mock initial data for candidates and jobs
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
  }, []);

  return (
    <AppContext.Provider value={{ 
      candidates, setCandidates, 
      jobDescriptions, setJobDescriptions,
      activeJobId, setActiveJobId,
      user, setUser,
      hasAccess,
      upgradePlan,
      login,
      logout,
      loading,
      isAuthReady
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
