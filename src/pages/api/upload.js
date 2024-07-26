import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { promisify } from 'util';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: 'public_g08MB1DLrjzW9Jk2wr0qmRHDKwc=',
  privateKey: 'private_Q1oxuN7db0FjW6w8UNuBfI+a3t0=',
  urlEndpoint: 'https://ik.imagekit.io/medifyai'
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handler = async (req, res) => {
  const uploadMiddleware = upload.single('file');
  const uploadPromise = promisify(uploadMiddleware);

  try {
    await uploadPromise(req, res);

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { buffer, originalname } = req.file;
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const newFileName = `${timestamp}-${randomString}.jpeg`;

    // Compress the image
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 1920, height: 1080, fit: 'inside' }) // adjust the size as needed
      .jpeg({ quality: 80 }) // adjust the quality as needed
      .toBuffer();

    const response = await imagekit.upload({
      file: compressedBuffer, // required
      fileName: newFileName, // required
      folder: '/uploads', // optional
    });

    res.status(200).json({ success: true, url: response.url, fileId: response.fileId });
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
