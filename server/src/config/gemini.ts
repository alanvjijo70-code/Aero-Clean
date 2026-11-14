import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let geminiClient: GoogleGenAI | null = null;
const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (apiKey && apiKey.trim() !== '') {
  try {
    geminiClient = new GoogleGenAI({ apiKey });
    logger.info(`Google GenAI client initialized with model ${env.GEMINI_MODEL}`);
  } catch (err) {
    logger.error('Failed to initialize Google GenAI SDK:', err);
  }
} else {
  logger.warn('GEMINI_API_KEY is missing. AI service will operate in high-fidelity simulation mode until valid credentials are provided in .env');
}

export const gemini = geminiClient;
export const isGeminiConfigured = Boolean(geminiClient);
