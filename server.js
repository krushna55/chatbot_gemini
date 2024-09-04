import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import markdown from 'markdown';

dotenv.config();

const app = express();
const port = 3000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.use(express.json());

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await model.generateContent(prompt, {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'text/plain',
    });

    const markdownContent = result.response.text(); // assuming Markdown
    const htmlContent = markdown.markdown.toHTML(markdownContent); // convert Markdown to HTML

    res.json({ response: htmlContent });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
