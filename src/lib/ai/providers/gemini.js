import { cencoriClient } from "../../cencori.js";

/**
 * Gemini AI Provider (via Cencori Gateway)
 * Routes Gemini requests through Cencori for unified tracking and cost analysis.
 */
export const generateGeminiResponse = async (messages, systemInstruction) => {
  try {
    const cencoriMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map(m => ({
        role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content || (m.parts && m.parts[0] ? m.parts[0].text : '')
      }))
    ];

    // Calling Gemini via Cencori
    const response = await cencoriClient.ai.chat({
      messages: cencoriMessages,
      model: "gemini/gemini-2.0-flash", // Tracking Gemini usage through Cencori
    });

    return {
      text: response.content || "",
      provider: "gemini",
      tokensUsed: response.usage?.totalTokens || 0
    };
  } catch (error) {
    console.error('Gemini-via-Cencori Provider Error:', error);
    throw error;
  }
};
