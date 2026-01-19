
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initializing GoogleGenAI using the required named parameter and process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestResponse = async (chatHistory: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      // Fix: Using gemini-3-flash-preview for basic text tasks (summarization, Q&A)
      model: "gemini-3-flash-preview",
      contents: `O seguinte é um histórico de conversa de WhatsApp. Sugira uma resposta curta, profissional e amigável para o atendente (em Português do Brasil):\n\n${chatHistory}`,
      config: {
        maxOutputTokens: 150,
        temperature: 0.7,
      },
    });
    // Fix: Accessing .text as a property as per current SDK rules
    return response.text || "Desculpe, não consegui gerar uma sugestão.";
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return "Erro ao gerar sugestão.";
  }
};

export const analyzeSentiment = async (message: string): Promise<{ sentiment: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' }> => {
  try {
    const response = await ai.models.generateContent({
      // Fix: Using gemini-3-flash-preview for sentiment analysis tasks
      model: "gemini-3-flash-preview",
      contents: `Analise o sentimento desta mensagem de cliente e defina uma prioridade de atendimento (LOW, MEDIUM, HIGH). Retorne apenas JSON.\n\nMensagem: "${message}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] }
          },
          required: ['sentiment', 'priority']
        }
      },
    });
    // Fix: Accessing .text as a property as per current SDK rules
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { sentiment: 'Neutro', priority: 'MEDIUM' };
  }
};
