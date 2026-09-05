import { GoogleGenerativeAI } from '@google/generative-ai';
import { analyzeSkillGapLocally } from './fallbackAnalysisService.js';

/**
 * Analyze candidate profile against target role requirements using Gemini or fallback
 */
export const runSkillGapAnalysis = async ({ resumeText, targetRoleTitle, customJobDescription, candidateInfo }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key provided or empty placeholder, use robust local heuristic analyzer
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    console.log('ℹ️ No GEMINI_API_KEY detected. Running with intelligent rule-based analyzer engine.');
    return analyzeSkillGapLocally({ resumeText, targetRoleTitle, customJobDescription, candidateInfo });
  }

  try {
    console.log('🤖 Sending skill gap analysis prompt to Gemini LLM...');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const prompt = `
You are an expert Chief Technology Officer, Technical Recruiter, and Career Coach.
Analyze the following candidate's resume/profile against the target role and optional job description.

Candidate Profile / Resume:
"""
${resumeText.slice(0, 10000)}
"""

Target Role: ${targetRoleTitle || 'Full Stack Developer'}

${customJobDescription ? `Target Job Description:\n"""\n${customJobDescription.slice(0, 5000)}\n"""` : ''}

You MUST return a valid JSON object strictly matching this schema:
{
  "candidateName": "Candidate's detected name or Candidate",
  "targetRole": "${targetRoleTitle || 'Full Stack Developer'}",
  "overallMatchScore": 78, // Integer 0-100 indicating percentage match
  "summary": "Concise 2-3 sentence executive evaluation summarizing readiness, greatest asset, and primary obstacle.",
  "strengths": ["string list of top 3-5 confirmed candidate technical strengths"],
  "keyGaps": ["string list of top 3-5 missing or deficient skills required for the target role"],
  "radarData": [
    { "category": "Frontend", "candidateScore": 85, "benchmarkScore": 90, "fullMark": 100 },
    { "category": "Backend", "candidateScore": 70, "benchmarkScore": 85, "fullMark": 100 },
    { "category": "Databases", "candidateScore": 65, "benchmarkScore": 80, "fullMark": 100 },
    { "category": "DevOps & Cloud", "candidateScore": 40, "benchmarkScore": 75, "fullMark": 100 },
    { "category": "Architecture", "candidateScore": 55, "benchmarkScore": 80, "fullMark": 100 },
    { "category": "Testing & QA", "candidateScore": 60, "benchmarkScore": 75, "fullMark": 100 }
  ],
  "skillGaps": [
    {
      "skill": "Docker",
      "category": "DevOps & Cloud",
      "status": "Missing Critical" | "Needs Improvement" | "Strong Match",
      "currentProficiency": 20, // 0-100
      "requiredProficiency": 80, // 0-100
      "gapScore": 60,
      "reason": "Specific explanation of why this gap exists and how it affects the target role",
      "learningPriority": "High" | "Medium" | "Low"
    }
  ],
  "extractedSkills": ["all detected skills from resume"],
  "recommendations": [
    {
      "type": "Course" | "Project" | "Certification" | "Practice",
      "title": "Clear actionable title",
      "description": "What to learn or build and why",
      "priority": "High" | "Medium" | "Low",
      "url": "https://..."
    }
  ],
  "roadmap": {
    "targetRole": "${targetRoleTitle || 'Full Stack Developer'}",
    "candidateName": "Candidate Name",
    "totalDurationWeeks": 8,
    "overallProgressPercentage": 0,
    "phases": [
      {
        "phaseNumber": 1,
        "title": "Phase 1: Closing Critical Deficits",
        "durationWeeks": 3,
        "focusSkills": ["Skill 1", "Skill 2"],
        "milestones": [
          {
            "title": "Milestone description",
            "description": "Step by step tasks",
            "estimatedHours": 15,
            "resources": [
              { "title": "Resource title", "type": "Documentation" | "Course" | "Video", "url": "https://...", "isFree": true }
            ],
            "projectIdea": {
              "title": "Mini-project",
              "description": "What to build",
              "deliverable": "GitHub Repo"
            },
            "completed": false
          }
        ]
      }
    ]
  }
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    const parsedData = JSON.parse(jsonText);

    return {
      ...parsedData,
      aiProviderUsed: 'Google Gemini 1.5 Flash'
    };
  } catch (error) {
    console.warn('⚠️ Gemini AI request failed:', error.message, '— Falling back to local heuristic analysis.');
    const fallbackResult = analyzeSkillGapLocally({ resumeText, targetRoleTitle, customJobDescription, candidateInfo });
    return {
      ...fallbackResult,
      aiProviderUsed: 'Heuristic Rule-Engine (Gemini Fallback)'
    };
  }
};
