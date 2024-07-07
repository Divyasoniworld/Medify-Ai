// pages/api/gemini.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Only GET requests are allowed' });
    return;
  }

  try {
    const response = await axios.get('https://api.gemini.com/v1/symbols'); // Example endpoint
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Gemini API', error: error.message });
  }
}
