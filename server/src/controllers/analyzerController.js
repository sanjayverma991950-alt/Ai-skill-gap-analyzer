import mongoose from 'mongoose';
import { extractTextFromFile, extractCandidateBasicInfo } from '../services/resumeParserService.js';
import { runSkillGapAnalysis } from '../services/aiService.js';
import { Analysis } from '../models/Analysis.js';
import { Roadmap } from '../models/Roadmap.js';
import { getDbStatus } from '../config/db.js';
import { mockStore } from '../config/inMemoryStore.js';

/**
 * Perform skill gap analysis from file upload or raw text
 * POST /api/analyzer/scan
 */
export const analyzeResume = async (req, res) => {
  try {
    let resumeText = req.body.resumeText || '';
    const { targetRole, customJobDescription, candidateName: inputName } = req.body;

    // If a file was uploaded, extract text from buffer
    if (req.file) {
      const extracted = await extractTextFromFile(req.file);
      resumeText = extracted;
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Please provide resume text or upload a valid resume file (PDF, DOCX, TXT) with sufficient content.'
      });
    }

    const candidateInfo = extractCandidateBasicInfo(resumeText);
    if (inputName) {
      candidateInfo.candidateName = inputName;
    }

    console.log(`🔍 Initiating skill gap analysis for ${candidateInfo.candidateName} targeting: ${targetRole || 'Full Stack Developer'}`);

    // Run AI / Heuristic Analysis
    const analysisResult = await runSkillGapAnalysis({
      resumeText,
      targetRoleTitle: targetRole || 'Full Stack Developer',
      customJobDescription: customJobDescription || '',
      candidateInfo
    });

    const rawUserId = req.user ? req.user._id : null;
    const isValidMongoUser = rawUserId && mongoose.Types.ObjectId.isValid(rawUserId);
    const userId = isValidMongoUser ? rawUserId : null;
    const isConnected = getDbStatus().connected;

    // Sanitize skill gaps to adhere cleanly to schema enums
    const validStatuses = ['Strong Match', 'Needs Improvement', 'Missing Critical'];
    const validPriorities = ['High', 'Medium', 'Low'];
    const sanitizedSkillGaps = (analysisResult.skillGaps || []).map(sg => {
      let status = sg.status;
      if (!validStatuses.includes(status)) {
        if (/match|strong|proficient/i.test(status)) status = 'Strong Match';
        else if (/missing|critical|deficit/i.test(status)) status = 'Missing Critical';
        else status = 'Needs Improvement';
      }
      let learningPriority = sg.learningPriority;
      if (!validPriorities.includes(learningPriority)) {
        if (/high/i.test(learningPriority)) learningPriority = 'High';
        else if (/low/i.test(learningPriority)) learningPriority = 'Low';
        else learningPriority = 'Medium';
      }
      return {
        ...sg,
        status,
        learningPriority,
        currentProficiency: Number(sg.currentProficiency) || 0,
        requiredProficiency: Number(sg.requiredProficiency) || 80,
        gapScore: Number(sg.gapScore) || 0
      };
    });

    let savedAnalysis = null;
    let savedRoadmap = null;

    if (isConnected) {
      // Persist to MongoDB
      savedAnalysis = await Analysis.create({
        userId,
        candidateName: analysisResult.candidateName,
        targetRole: analysisResult.targetRole,
        jobDescriptionProvided: Boolean(customJobDescription),
        overallMatchScore: Number(analysisResult.overallMatchScore) || 50,
        summary: analysisResult.summary,
        strengths: analysisResult.strengths || [],
        keyGaps: analysisResult.keyGaps || [],
        radarData: analysisResult.radarData || [],
        skillGaps: sanitizedSkillGaps,
        extractedSkills: analysisResult.extractedSkills || [],
        recommendations: analysisResult.recommendations || [],
        aiProviderUsed: analysisResult.aiProviderUsed
      });

      if (analysisResult.roadmap) {
        savedRoadmap = await Roadmap.create({
          userId,
          analysisId: savedAnalysis._id,
          targetRole: analysisResult.targetRole,
          candidateName: analysisResult.candidateName,
          totalDurationWeeks: analysisResult.roadmap.totalDurationWeeks || 8,
          phases: analysisResult.roadmap.phases || [],
          overallProgressPercentage: 0
        });
      }
    } else {
      // In-Memory store
      const analysisId = `mem_analysis_${Date.now()}`;
      savedAnalysis = {
        _id: analysisId,
        userId: rawUserId,
        ...analysisResult,
        skillGaps: sanitizedSkillGaps,
        createdAt: new Date()
      };
      mockStore.analyses.unshift(savedAnalysis);

      if (analysisResult.roadmap) {
        const roadmapId = `mem_roadmap_${Date.now()}`;
        savedRoadmap = {
          _id: roadmapId,
          userId: rawUserId,
          analysisId,
          ...analysisResult.roadmap,
          createdAt: new Date()
        };
        mockStore.roadmaps.unshift(savedRoadmap);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        analysis: savedAnalysis,
        roadmap: savedRoadmap,
        extractedInfo: {
          candidateName: analysisResult.candidateName,
          email: candidateInfo.email,
          textLength: resumeText.length
        }
      }
    });
  } catch (error) {
    console.error('Analysis failed:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete skill gap analysis'
    });
  }
};

/**
 * Get analysis history for logged in user
 * GET /api/analyzer/history
 */
export const getAnalysisHistory = async (req, res) => {
  try {
    const isConnected = getDbStatus().connected;
    const rawUserId = req.user ? req.user._id : null;
    const isValidMongoUser = rawUserId && mongoose.Types.ObjectId.isValid(rawUserId);

    if (isConnected && isValidMongoUser) {
      const history = await Analysis.find({ userId: rawUserId })
        .sort({ createdAt: -1 })
        .select('candidateName targetRole overallMatchScore summary createdAt aiProviderUsed');
      return res.json({ success: true, count: history.length, data: history });
    } else {
      const history = mockStore.analyses
        .filter(a => String(a.userId) === String(rawUserId))
        .map(({ _id, candidateName, targetRole, overallMatchScore, summary, createdAt, aiProviderUsed }) => ({
          _id, candidateName, targetRole, overallMatchScore, summary, createdAt, aiProviderUsed
        }));
      return res.json({ success: true, count: history.length, data: history });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single analysis by ID
 * GET /api/analyzer/:id
 */
export const getAnalysisById = async (req, res) => {
  try {
    const isConnected = getDbStatus().connected;
    const { id } = req.params;

    let analysis = null;
    let roadmap = null;

    if (isConnected && mongoose.Types.ObjectId.isValid(id)) {
      analysis = await Analysis.findById(id);
      if (analysis) {
        roadmap = await Roadmap.findOne({ analysisId: analysis._id });
      }
    } else {
      analysis = mockStore.analyses.find(a => String(a._id) === String(id));
      if (analysis) {
        roadmap = mockStore.roadmaps.find(r => String(r.analysisId) === String(id) || String(r._id) === String(id));
      }
    }

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    return res.json({
      success: true,
      data: {
        analysis,
        roadmap
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
