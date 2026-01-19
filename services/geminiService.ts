
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
export const suggestResponse = async (h: string) => {
  const r = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: h });
  return r.text;
};
