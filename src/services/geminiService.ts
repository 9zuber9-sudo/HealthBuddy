import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const isGeminiConfigured = Boolean(
  GEMINI_API_KEY &&
  !GEMINI_API_KEY.includes('PASTE_YOUR_GEMINI_KEY_HERE') &&
  GEMINI_API_KEY.length > 10
);

const SYSTEM_PROMPT = `You are HealthBuddy AI — a knowledgeable, empathetic health assistant. You help users understand their symptoms, provide general health guidance, and guide them to appropriate care.

IMPORTANT RULES:
1. You are NOT a doctor and cannot diagnose diseases.
2. Always recommend seeing a doctor for serious symptoms.
3. For emergencies (chest pain, difficulty breathing, stroke symptoms, severe bleeding), ALWAYS tell them to call 112 immediately.
4. Be warm, clear, and concise. Avoid complex medical jargon.
5. If asked about medicines, explain general uses but always say "consult your doctor before taking any medication".
6. Keep responses well-structured with bullet points when listing items.
7. Always end with a safety disclaimer for medical advice.
8. You can discuss: symptoms, general health tips, medicine info (general), nutrition, fitness, mental health, first aid basics.

Start every conversation by being friendly and asking how you can help with their health today.`;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

let chatSession: ReturnType<ReturnType<GoogleGenerativeAI['getGenerativeModel']>['startChat']> | null = null;

const getTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const initGeminiChat = (): ChatMessage[] => {
  if (!isGeminiConfigured) {
    return [];
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  chatSession = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
  });

  return [
    {
      role: 'model',
      text: "👋 Hello! I'm **HealthBuddy AI**, your personal health assistant powered by Gemini.\n\nI can help you with:\n- 🩺 Understanding symptoms\n- 💊 General medicine information\n- 🍎 Health & nutrition tips\n- 🚑 First aid guidance\n- 🧠 Mental wellness advice\n\nWhat health concern can I help you with today?",
      timestamp: getTimestamp(),
    },
  ];
};

export const sendMessageToGemini = async (
  userMessage: string
): Promise<string> => {
  if (!isGeminiConfigured) {
    throw new Error('Gemini API key not configured');
  }

  if (!chatSession) {
    initGeminiChat();
  }

  if (!chatSession) {
    throw new Error('Failed to initialize chat session');
  }

  const result = await chatSession.sendMessage(userMessage);
  const response = result.response;
  return response.text();
};

export const resetGeminiChat = (): ChatMessage[] => {
  chatSession = null;
  return initGeminiChat();
};
