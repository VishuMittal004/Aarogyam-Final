import { config } from 'dotenv';
config();

import '@/ai/flows/multilingual-ai-chat.ts';
import '@/ai/flows/symptom-checker.ts';
import '@/ai/flows/photo-detection.ts';
import '@/ai/flows/health-tips.ts';