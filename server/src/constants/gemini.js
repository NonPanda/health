const {GoogleGenerativeAI}= require('@google/generative-ai');
require('dotenv').config();

const genai= new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


