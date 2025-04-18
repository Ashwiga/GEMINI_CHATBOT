// server.js

import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'models/gemini-1.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

console.log('Gemini API Key Loaded:', !!GEMINI_API_KEY);

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const geminiResponse = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                        role: 'user'
                    }
                ]
            })
        });

        const result = await geminiResponse.json();
        console.log("Raw response:", result);

        const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response.";
        res.status(200).send({ bot: reply });

    } catch (error) {
        console.error("Error from Gemini:", error);
        res.status(500).send({ bot: 'An error occurred, please try again later.' });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
