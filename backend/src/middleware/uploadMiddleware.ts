import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    // Generates unique timestamp filename: photo-1714589210-48219.png
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// File Type Validation Filter (Images Only)
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const isExtValid = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isMimeValid = allowedExtensions.test(file.mimetype.toLowerCase());

  if (isExtValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (.jpg, .jpeg, .png, .webp) are allowed!'));
  }
};

// Multer Upload Instance with 5MB Limit
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter,
});

export default uploadMiddleware;