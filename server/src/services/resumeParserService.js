import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extracts raw text from uploaded file buffer or path
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} Cleaned raw text
 */
export const extractTextFromFile = async (file) => {
  if (!file) {
    throw new Error('No file provided for extraction');
  }

  const { mimetype, path, buffer, originalname } = file;
  let rawText = '';

  try {
    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      const dataBuffer = buffer || fs.readFileSync(path);
      const pdfData = await pdfParse(dataBuffer);
      rawText = pdfData.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      originalname.endsWith('.docx')
    ) {
      const dataBuffer = buffer || fs.readFileSync(path);
      const docResult = await mammoth.extractRawText({ buffer: dataBuffer });
      rawText = docResult.value;
    } else if (mimetype === 'text/plain' || originalname.endsWith('.txt')) {
      rawText = buffer ? buffer.toString('utf8') : fs.readFileSync(path, 'utf8');
    } else {
      // Fallback: try reading as text
      rawText = buffer ? buffer.toString('utf8') : fs.readFileSync(path, 'utf8');
    }

    // Clean up temporary disk file if multer saved it to disk
    if (path && fs.existsSync(path)) {
      try {
        fs.unlinkSync(path);
      } catch (cleanupErr) {
        console.warn('Could not remove temporary uploaded file:', cleanupErr.message);
      }
    }

    return cleanResumeText(rawText);
  } catch (error) {
    if (path && fs.existsSync(path)) {
      try { fs.unlinkSync(path); } catch (e) {}
    }
    throw new Error(`Failed to extract text from resume: ${error.message}`);
  }
};

/**
 * Clean text, normalizes whitespace and removes unprintable artifacts
 */
export const cleanResumeText = (text) => {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
};

/**
 * Quick heuristic extractor for candidate name & contacts
 */
export const extractCandidateBasicInfo = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : null;

  // Candidate name is usually in the first 3 lines
  let candidateName = 'Candidate';
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i];
    if (
      line.length > 2 &&
      line.length < 35 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !/resume|curriculum|phone|profile|summary/i.test(line)
    ) {
      candidateName = line;
      break;
    }
  }

  return {
    candidateName,
    email
  };
};
