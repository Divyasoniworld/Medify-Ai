// pages/api/upload.js
import ImageKit from 'imagekit';

// const imagekit = new ImageKit({
//   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
// });

// publicKey= "public_g08MB1DLrjzW9Jk2wr0qmRHDKwc=",
// privateKey= "private_Q1oxuN7db0FjW6w8UNuBfI+a3t0=" ,
// urlEndpoint= "https://ik.imagekit.io/medifyai" ,
const imagekit = new ImageKit({
    publicKey:"public_g08MB1DLrjzW9Jk2wr0qmRHDKwc=",
    privateKey: "private_Q1oxuN7db0FjW6w8UNuBfI+a3t0=" ,
    urlEndpoint: "https://ik.imagekit.io/medifyai" ,
  });

console.log('process.env.IMAGEKIT_PUBLIC_KEY', process.env.IMAGEKIT_PUBLIC_KEY)

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { file, fileName } = req.body;

  if (!file || !fileName) {
    return res.status(400).json({ error: 'File and fileName are required' });
  }

  try {
    const response = await imagekit.upload({
      file,
      fileName,
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
