import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface EmailLog {
  id: string;
  subject: string;
  body: string;
  sentDate: string;
  type: 'Invitation' | 'Rejection' | 'Update';
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience: string;
  education: string;
  summary: string;
  scores: {
    skills: number;
    experience: number;
    education: number;
    overall: number;
  };
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
  };
  status: 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected' | 'Hired';
  appliedDate: string;
  resumeText: string;
  notes?: string;
  emails?: EmailLog[];
}

export interface JobDescription {
  id: string;
  title: string;
  content: string;
  requirements: string[];
  minScore: number;
}

export interface GeneratedJD {
  title: string;
  summary: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredQualifications: string[];
  salaryRange: string;
  benefits: string[];
  seoKeywords: string[];
}

export interface SemanticMatchResult {
  candidateId: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  skillSimilarityInsights: string;
  experienceRelevance: string;
  industryRelevance: string;
  careerProgression: string;
  recommendation: string;
}

export interface HiringPredictionResult {
  candidateId: string;
  hireLikelihood: number;
  offerAcceptanceProb: number;
  retentionLikelihood: number;
  culturalFitScore: number;
  overallPredictionScore: number;
  recommendation: 'Strong Hire' | 'Consider' | 'Risky Candidate' | 'Reject';
  riskIndicators: {
    label: string;
    level: 'Low' | 'Medium' | 'High';
    description: string;
  }[];
  successProbabilityFactors: {
    factor: string;
    score: number;
  }[];
  aiInsights: string;
}

export interface FraudDetectionResult {
  candidateId: string;
  authenticityScore: number;
  riskLevel: 'Verified' | 'Low Risk' | 'Medium Risk' | 'High Risk';
  riskIndicators: {
    label: string;
    level: 'Low' | 'Medium' | 'High';
    description: string;
  }[];
  suspiciousSections: {
    section: string;
    reason: string;
    severity: 'Low' | 'Medium' | 'High';
  }[];
  aiExplanation: string;
}

export const detectResumeFraud = async (candidate: Candidate): Promise<FraudDetectionResult | null> => {
  const prompt = `
    Perform a deep AI Resume Fraud Detection for the following candidate.
    
    Candidate Data:
    Name: ${candidate.name}
    Summary: ${candidate.summary}
    Skills: ${candidate.skills.join(', ')}
    Experience: ${candidate.experience}
    Education: ${candidate.education}
    Resume Text: ${candidate.resumeText}
    
    Analyze the resume for patterns indicating fraud:
    - Unrealistic experience timelines (e.g., overlapping full-time roles, impossible durations)
    - AI-generated resume patterns (e.g., overly generic phrasing, perfect but hollow descriptions)
    - Skill exaggeration (e.g., listing advanced skills without supporting project/work experience)
    - Inconsistent job history (e.g., gaps or leaps that don't make sense)
    - Duplicate content patterns
    
    Generate a report including:
    - authenticityScore: 0-100 (100 is perfectly authentic, 0 is definitely fraudulent)
    - riskLevel: One of ['Verified', 'Low Risk', 'Medium Risk', 'High Risk']
    - riskIndicators: Array of specific risks found (label, level, description)
    - suspiciousSections: Array of specific resume sections that are suspicious (section name, reason, severity)
    - aiExplanation: A detailed explanation of the fraud detection logic and findings.
    
    Return the data in valid JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            authenticityScore: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING, enum: ['Verified', 'Low Risk', 'Medium Risk', 'High Risk'] },
            riskIndicators: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  level: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                  description: { type: Type.STRING }
                }
              }
            },
            suspiciousSections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  section: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
                }
              }
            },
            aiExplanation: { type: Type.STRING }
          },
          required: ['authenticityScore', 'riskLevel', 'riskIndicators', 'suspiciousSections', 'aiExplanation']
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return { ...result, candidateId: candidate.id };
  } catch (error) {
    console.error("Gemini Fraud Detection Error:", error);
    return null;
  }
};

export const predictHiringSuccess = async (candidate: Candidate, job?: JobDescription): Promise<HiringPredictionResult | null> => {
  const prompt = `
    Perform a deep AI Hiring Prediction for the following candidate.
    ${job ? `Context: Job Description for "${job.title}"` : 'Context: General hiring suitability'}
    
    Candidate Data:
    Name: ${candidate.name}
    Summary: ${candidate.summary}
    Skills: ${candidate.skills.join(', ')}
    Experience: ${candidate.experience}
    Education: ${candidate.education}
    Current Status: ${candidate.status}
    Analysis Strengths: ${candidate.analysis.strengths.join(', ')}
    Analysis Weaknesses: ${candidate.analysis.weaknesses.join(', ')}
    
    Analyze the following data points to predict hiring success:
    - Resume analysis results
    - Skill verification (based on skills list and scores)
    - Experience relevance to typical market standards
    - Education background
    
    Generate a prediction including:
    - hireLikelihood: 0-100 percentage
    - offerAcceptanceProb: 0-100 percentage (likelihood they will accept an offer)
    - retentionLikelihood: 0-100 percentage (likelihood they will stay >2 years)
    - culturalFitScore: 0-100 percentage
    - overallPredictionScore: 0-100 weighted average
    - recommendation: One of ['Strong Hire', 'Consider', 'Risky Candidate', 'Reject']
    - riskIndicators: Array of potential risks (label, level [Low, Medium, High], description)
    - successProbabilityFactors: Array of factors contributing to success (factor name, score 0-100)
    - aiInsights: A detailed explanation of the prediction logic.
    
    Return the data in valid JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidateId: { type: Type.STRING },
            hireLikelihood: { type: Type.NUMBER },
            offerAcceptanceProb: { type: Type.NUMBER },
            retentionLikelihood: { type: Type.NUMBER },
            culturalFitScore: { type: Type.NUMBER },
            overallPredictionScore: { type: Type.NUMBER },
            recommendation: { type: Type.STRING, enum: ['Strong Hire', 'Consider', 'Risky Candidate', 'Reject'] },
            riskIndicators: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  level: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                  description: { type: Type.STRING }
                }
              }
            },
            successProbabilityFactors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  factor: { type: Type.STRING },
                  score: { type: Type.NUMBER }
                }
              }
            },
            aiInsights: { type: Type.STRING }
          },
          required: ['hireLikelihood', 'offerAcceptanceProb', 'retentionLikelihood', 'culturalFitScore', 'overallPredictionScore', 'recommendation', 'riskIndicators', 'successProbabilityFactors', 'aiInsights']
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return { ...result, candidateId: candidate.id };
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    return null;
  }
};

export const semanticMatch = async (job: JobDescription, candidates: Candidate[]): Promise<SemanticMatchResult[]> => {
  const prompt = `
    Perform an advanced Semantic AI Matching between the following Job Description and a list of Candidates.
    
    The goal is to intelligently match resumes with job descriptions using semantic understanding (e.g., skill synonyms, related technologies, role equivalence like React Developer = Frontend Engineer).
    
    Job Description:
    Title: ${job.title}
    Content: ${job.content}
    Requirements: ${job.requirements.join(', ')}
    
    Candidates:
    ${candidates.map(c => `
      ID: ${c.id}
      Name: ${c.name}
      Summary: ${c.summary}
      Skills: ${c.skills.join(', ')}
      Experience: ${c.experience}
    `).join('\n---\n')}
    
    For each candidate, evaluate:
    - Skill similarity (understanding synonyms and related tech)
    - Experience relevance
    - Industry relevance
    - Career progression
    
    Return a JSON array of SemanticMatchResult objects with:
    - candidateId: The ID of the candidate
    - matchScore: 0-100 semantic match score
    - matchingSkills: Array of skills that match (including semantic matches)
    - missingSkills: Array of key skills from JD missing in candidate
    - skillSimilarityInsights: A brief explanation of semantic skill matches found
    - experienceRelevance: Brief analysis of how their experience fits
    - industryRelevance: Brief analysis of industry fit
    - careerProgression: Brief analysis of their career growth path
    - recommendation: A short final recommendation for this specific JD
    
    Return ONLY the JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              candidateId: { type: Type.STRING },
              matchScore: { type: Type.NUMBER },
              matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              skillSimilarityInsights: { type: Type.STRING },
              experienceRelevance: { type: Type.STRING },
              industryRelevance: { type: Type.STRING },
              careerProgression: { type: Type.STRING },
              recommendation: { type: Type.STRING }
            },
            required: ['candidateId', 'matchScore', 'matchingSkills', 'missingSkills', 'skillSimilarityInsights', 'experienceRelevance', 'industryRelevance', 'careerProgression', 'recommendation']
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Semantic Match Error:", error);
    return [];
  }
};
export const analyzeResume = async (resumeText: string, jobDescription?: string): Promise<Partial<Candidate>> => {
  const prompt = `
    Analyze the following resume text. 
    ${jobDescription ? `Compare it against this Job Description: ${jobDescription}` : 'Provide a general analysis.'}
    
    Extract:
    - Candidate Name
    - Skills (as an array)
    - Experience summary
    - Education summary
    - A brief professional summary
    - Scores (0-100) for Skills, Experience, Education, and an Overall hiring score.
    - Strengths (array)
    - Weaknesses (array)
    - A final hiring recommendation.

    Return the data in valid JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt + "\n\nResume Text:\n" + resumeText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            experience: { type: Type.STRING },
            education: { type: Type.STRING },
            summary: { type: Type.STRING },
            scores: {
              type: Type.OBJECT,
              properties: {
                skills: { type: Type.NUMBER },
                experience: { type: Type.NUMBER },
                education: { type: Type.NUMBER },
                overall: { type: Type.NUMBER },
              }
            },
            analysis: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendation: { type: Type.STRING },
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {};
  }
};

export const generateJobDescription = async (params: {
  title: string;
  industry: string;
  experienceLevel: string;
  keySkills: string[];
}): Promise<GeneratedJD | null> => {
  const prompt = `
    Generate a professional, high-quality, and SEO-friendly job description for the following role:
    
    Job Title: ${params.title}
    Industry: ${params.industry}
    Experience Level: ${params.experienceLevel}
    Key Technologies/Skills: ${params.keySkills.join(', ')}
    
    The job description should include:
    1. A compelling Job Summary
    2. Key Responsibilities (array of strings)
    3. Required Skills (array of strings)
    4. Preferred Qualifications (array of strings)
    5. Salary Range Suggestion (a string like "$120k - $150k")
    6. Benefits Section (array of strings)
    7. SEO Keywords for job boards (array of strings)
    
    The tone should be professional and attractive to top talent.
    
    Return the data in valid JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
            requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            preferredQualifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            salaryRange: { type: Type.STRING },
            benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
            seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['title', 'summary', 'responsibilities', 'requiredSkills', 'preferredQualifications', 'salaryRange', 'benefits', 'seoKeywords']
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini JD Generation Error:", error);
    return null;
  }
};
