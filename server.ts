import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialize Gemini AI client
  let genAIClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!genAIClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not configured.');
      }
      genAIClient = new GoogleGenAI({ apiKey });
    }
    return genAIClient;
  }

  // API Endpoints
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      company: 'K.N.S.K Security Co., Ltd.',
      license: 'KNSK-SEC-2015-089',
      provinces: 25,
      timestamp: new Date().toISOString(),
    });
  });

  // AI Security Consultation Chat Endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, language = 'en', facilityType, guardCount } = req.body;
      const ai = getGeminiClient();

      const systemPrompt = `You are the official Senior Security Consultant for K.N.S.K Security Co., Ltd. (ក្រុមហ៊ុនសន្តិសុខ K.N.S.K), Cambodia's premier private security provider established in 2015, operating in all 25 provinces.
Company Slogan:
- Khmer: ក្រុមហ៊ុនសន្តិសុខ K.N.S.K ផ្តល់សេវាកម្មការពារប្រកបដោយវិជ្ជាជីវៈ ស្មោះត្រង់ និងអាចទុកចិត្តបាន ទូទាំងប្រទេស។ គុណភាព • តម្លៃសមរម្យ • សេវារហ័ស
- English: K.N.S.K Security Co., Ltd. Professional, reliable, and trusted security services nationwide. Quality • Reliability • Fast Response

Key Company Facts & Official Contact Details:
- Ministry of Interior License #KNSK-SEC-2015-089
- Over 2,500 trained security officers across Cambodia
- Official Email: soengknsk@gmail.com (mailto:soengknsk@gmail.com)
- 24/7 Emergency Hotline: 096 483 8666
- General Company Phones: 093 878 666 / 060 878 666
- Official Telegram: https://t.me/KNSK_security (@KNSK_security)
- Official WhatsApp: https://wa.me/855964838666?s=t
- Official Facebook: https://www.facebook.com/share/1BrYBJpnQk/
- Services: Manned Guarding, VIP Escort, Cash-in-Transit (CIT), Event Security, AI CCTV & Electronic Security, Mobile Patrol.

STRICT RULE: The ONLY official company contact channels are the email (soengknsk@gmail.com), the three phone numbers (096 483 8666, 093 878 666, 060 878 666), Facebook (https://www.facebook.com/share/1BrYBJpnQk/), WhatsApp (https://wa.me/855964838666?s=t), and Telegram (https://t.me/KNSK_security). NEVER invent or provide any other phone numbers, email addresses, or social accounts.

Respond professionally, helpfully, and concisely in the requested language (${language}: 'km' for Khmer, 'en' for English, 'zh' for Chinese). Provide accurate advice on security guard headcount, shift scheduling, CCTV integration, and compliance with Cambodian Ministry of Interior regulations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nClient Facility context: ${facilityType || 'General'}, Proposed guards: ${guardCount || 'N/A'}\nUser Query: ${message}` }] },
        ],
      });

      res.json({ reply: response.text || 'Thank you for contacting K.N.S.K Security Co., Ltd. Our regional commander will assist you shortly. You can also reach our 24/7 hotline at 096 483 8666 or message on Telegram (@KNSK_security).' });
    } catch (error: any) {
      console.error('Error in AI chat handler:', error);
      res.status(500).json({
        error: 'Failed to generate response',
        details: error.message || 'Gemini API not available',
        fallback: 'K.N.S.K Security officers are available 24/7 at 096 483 8666, 093 878 666, or 060 878 666. You can also reach us via Telegram (@KNSK_security), WhatsApp (https://wa.me/855964838666?s=t), or email soengknsk@gmail.com.',
      });
    }
  });

  // AI Security Risk Assessment Endpoint
  app.post('/api/ai/risk-assessment', async (req, res) => {
    try {
      const { propertyType, location, guardCount, shiftPattern } = req.body;
      const ai = getGeminiClient();

      const prompt = `Generate an enterprise Security Risk & Guard Plan for K.N.S.K Security Co., Ltd.:
Property Type: ${propertyType}
Location: ${location}, Cambodia
Current/Proposed Guards: ${guardCount}
Shift: ${shiftPattern}

Provide a structured 3-part assessment:
1. Threat & Vulnerability Index (Low, Moderate, High, Critical)
2. Recommended Security Post Layout (Main Gate, CCTV Room, Perimeter Wand Patrol, Visitor Screening)
3. Essential K.N.S.K Technology Add-ons (e.g. AI CCTV, Electronic Patrol Wand, VIP Escort Option)
Keep it formatted with bullet points, authoritative, and concise.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      res.json({ assessment: response.text });
    } catch (error: any) {
      console.error('Error in AI risk assessment:', error);
      res.status(500).json({ error: error.message || 'Risk assessment error' });
    }
  });

  // Vite development vs production setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`K.N.S.K Security Platform Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
