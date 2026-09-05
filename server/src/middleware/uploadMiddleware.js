import multer from 'multer';
import path from 'path';

// Configure multer storage in memory for speedy processing without disk clutter
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext) || file.mimetype.includes('pdf') || file.mimetype.includes('word') || file.mimetype.includes('text')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Please upload a PDF, DOCX, or TXT file.'), false);
  }
};

export const uploadResume = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});
