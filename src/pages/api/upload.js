// pages/api/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

// Ensure the root directory exists (although it always exists)
const rootDir = process.cwd();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, rootDir);  // Set the destination to the root directory
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExtension = path.extname(file.originalname);
    const newFileName = `${timestamp}-${randomString}${fileExtension}`;
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

const handler = async (req, res) => {
  const uploadMiddleware = upload.single('file');

  const uploadPromise = promisify(uploadMiddleware);

  try {
    await uploadPromise(req, res);

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    res.status(200).json({ success: true, fileName: req.file.filename });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, error: 'Error uploading file' });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
