import multer from 'multer';
import sharp from 'sharp';
import { promisify } from 'util';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMGKIT_PUBLICKEY,
  privateKey: process.env.IMGKIT_PRIVATEKEY,
  urlEndpoint: process.env.IMGKIT_URLENDPOINT
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

    const { buffer } = req.file;
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const newFileName = `${timestamp}-${randomString}.jpeg`;

    // Compress the image and ensure correct orientation
    const compressedBuffer = await sharp(buffer)
      .rotate() 
      .resize({ width: 1920, height: 1080, fit: 'inside' }) 
      .jpeg({ quality: 80 }) 
      .toBuffer();

    const response = await imagekit.upload({
      file: compressedBuffer, 
      fileName: newFileName, 
      folder: '/uploads', 
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
