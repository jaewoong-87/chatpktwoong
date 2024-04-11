import Cors from 'cors';
import axios from 'axios';
import initMiddleware from '../../lib/init-middleware';

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    // Only allow requests with POST and from specific origins
    methods: ['POST'],
    origin: true, // Reflect the request origin, as defined by the spec OR set specific origins
  })
);

export default async function handler(req, res) {
  // Run cors
  await cors(req, res);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method should be POST" });
  }

  try {
    const { body } = req;
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    };

    const response = await axios.post(url, body, { headers: headers });
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response.status || 500).json({ message: "Something went wrong" });
  }
}
