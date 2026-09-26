import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const isGeminiConfigured = Boolean(
  GEMINI_API_KEY &&
  !GEMINI_API_KEY.includes('PASTE_YOUR_GEMINI_KEY_HERE') &&
  GEMINI_API_KEY.length > 5
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

let chatSession: any = null;

const getTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const initGeminiChat = (): ChatMessage[] => {
  try {
    if (GEMINI_API_KEY) {
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
    }
  } catch (e) {
    console.warn('Gemini chat initialization fallback:', e);
  }

  return [
    {
      role: 'model',
      text: "👋 Hello! I'm **HealthBuddy AI**, your personal health assistant powered by Gemini.\n\nI can help you with:\n- 🩺 Understanding symptoms\n- 💊 General medicine information\n- 🍎 Health & nutrition tips\n- 🚑 First aid guidance\n- 🧠 Mental wellness & sleep advice\n\nHow can I help you with your health today?",
      timestamp: getTimestamp(),
    },
  ];
};

// Smart fallback responses generator for reliable 24/7 offline/online support
const generateHealthFallbackResponse = (query: string): string => {
  const q = query.toLowerCase().trim();

  if (q.includes('fever') || q.includes('bukhar') || q.includes('temperature') || q.includes('aches')) {
    return `### 🤒 Guidance for Fever & Body Aches:

1. **Rest & Hydration:** Drink plenty of warm fluids (water, soups, herbal tea, ORS) to prevent dehydration.
2. **Cool Compress:** Apply a damp cloth on the forehead or neck to reduce body heat comfortably.
3. **Common Relief:** Over-the-counter paracetamol/acetaminophen is commonly used for fever management, but always check proper dosage for your age/weight.
4. **Monitor Temperature:** Keep a log of your body temperature twice daily.

⚠️ **When to see a Doctor:**
- Fever higher than 102°F (38.9°C) or lasting more than 3 days.
- Severe headache, stiff neck, shortness of breath, or persistent vomiting.

*Disclaimer: HealthBuddy AI provides general guidance only. Consult a certified medical doctor for prescriptions.*`;
  }

  if (q.includes('paracetamol') || q.includes('crocin') || q.includes('dolo') || q.includes('medicine') || q.includes('tablet')) {
    return `### 💊 About Paracetamol (Acetaminophen / Dolo / Crocin):

- **Primary Uses:** Reduces fever (antipyretic) and relieves mild-to-moderate pain such as headaches, muscle aches, toothaches, and colds.
- **Typical Usage:** Generally taken after food with plenty of water. Usual adult dosage is 500mg - 650mg, with at least 4 to 6 hours between doses.
- **Safety Precaution:** Never exceed 4000mg (4g) in a 24-hour period to prevent liver damage. Avoid mixing with alcohol or other medications containing paracetamol.

⚠️ **Important:** If you have liver or kidney conditions, or if pain/fever persists beyond 3 days, please consult a healthcare professional.`;
  }

  if (q.includes('heart') || q.includes('cardio') || q.includes('bp') || q.includes('blood pressure')) {
    return `### ❤️ Tips for a Healthy Heart & Blood Pressure:

1. **Balanced Diet (DASH):** Reduce sodium/salt intake, avoid trans-fats, and eat more potassium-rich foods (bananas, spinach) and whole grains.
2. **Daily Activity:** Aim for at least 30 minutes of moderate aerobic exercise (brisk walking, cycling) 5 days a week.
3. **Stress Control:** Practice deep breathing, meditation, and ensure 7-8 hours of sound sleep.
4. **Regular Monitoring:** Normal blood pressure is typically below 120/80 mmHg. Check your readings periodically.

🚨 **Emergency Warning:** If experiencing sudden crushing chest pain, pain radiating to the left arm/jaw, or sudden shortness of breath, call **112** immediately!`;
  }

  if (q.includes('food') || q.includes('immunity') || q.includes('diet') || q.includes('nutrition')) {
    return `### 🍎 Top Immunity & Nutrition Essentials:

- **Vitamin C Powerhouses:** Citrus fruits (oranges, lemons, amla), kiwi, bell peppers, and strawberries.
- **Antioxidants & Spices:** Turmeric (curcumin), ginger, garlic, and green tea support cell health and fight inflammation.
- **Gut Health:** Probiotics like fresh yogurt/curd, buttermilk, and fermented foods enhance the immune microbiome.
- **Hydration & Protein:** 2.5 - 3 liters of water daily, along with eggs, pulses, paneer, and nuts.`;
  }

  if (q.includes('anxious') || q.includes('stress') || q.includes('depression') || q.includes('mental') || q.includes('panic')) {
    return `### 🧘 Managing Stress & Anxiety:

1. **4-7-8 Breathing Technique:** Inhale through your nose for 4 seconds, hold for 7 seconds, exhale slowly through your mouth for 8 seconds. Repeat 4 times.
2. **5-4-3-2-1 Grounding Method:** Notice 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, and 1 thing you taste.
3. **Limit Stimulants:** Reduce caffeine and screen time, especially before bed.
4. **Talk it Out:** Share your feelings with a trusted friend, family member, or mental health counselor. You are not alone!`;
  }

  if (q.includes('cough') || q.includes('cold') || q.includes('sore throat') || q.includes('khansi')) {
    return `### 🤧 Cold, Cough & Sore Throat Relief:

1. **Warm Salt Water Gargle:** Mix 1/2 tsp salt in warm water and gargle 3 times a day for throat soothing.
2. **Steam Inhalation:** Inhaling warm steam helps clear nasal passages and loosen chest mucus.
3. **Honey & Ginger:** Warm water or tea with honey and ginger soothes a tickly cough (do not give honey to infants under 1 year).
4. **Rest:** Sleep with your head slightly elevated to breathe easily.`;
  }

  if (q.includes('sleep') || q.includes('insomnia') || q.includes('neend')) {
    return `### 😴 Proven Tips for Deep, Restful Sleep:

1. **Consistent Schedule:** Go to bed and wake up at the exact same time every day, even on weekends.
2. **Digital Sunset:** Turn off smartphones, laptops, and TVs at least 45 minutes before sleep. Blue light suppresses melatonin.
3. **Cool & Dark Environment:** Keep the bedroom cool (around 18-21°C) and completely dark.
4. **Avoid Heavy Meals & Caffeine:** Do not consume coffee or heavy, spicy dinners within 4 hours of bedtime.`;
  }

  // General health guidance response
  return `### 🩺 HealthBuddy AI Guidance:

Thank you for reaching out about **"${query}"**. Here are key health recommendations:

1. **Observe Your Symptoms:** Note when the issue started, its severity, and any associated changes.
2. **Stay Hydrated & Rested:** Adequate sleep and fluid intake support your body's natural defense systems.
3. **Lifestyle Factors:** Balanced nutrition, mild physical movement, and avoiding smoking/excess alcohol aid faster recovery.

⚠️ **Medical Safety Advisory:**
- If your symptoms are severe, worsening, or causing significant discomfort, please visit a licensed physician or clinic.
- In case of acute medical emergencies, immediately dial **112**.`;
};

export const sendMessageToGemini = async (
  userMessage: string
): Promise<string> => {
  // If API key is available, attempt Gemini call first
  if (GEMINI_API_KEY && GEMINI_API_KEY.length > 10) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_PROMPT,
      });

      const chat = chatSession || model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      });
      chatSession = chat;

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();
      if (text && text.trim().length > 0) {
        return text;
      }
    } catch (apiError: any) {
      console.warn('Gemini API call returned error, switching to health engine:', apiError?.message || apiError);
    }
  }

  // Fallback to intelligent health knowledge engine
  return generateHealthFallbackResponse(userMessage);
};

export const resetGeminiChat = (): ChatMessage[] => {
  chatSession = null;
  return initGeminiChat();
};
