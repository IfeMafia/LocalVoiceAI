import { cencoriClient } from "../../cencori.js";

/**
 * Groq AI Provider (via Cencori Gateway)
 * Routes Groq requests through Cencori for unified tracking and cost analysis.
 */
export const generateGroqResponse = async (messages, systemInstruction) => {
  try {
    const cencoriMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map(m => ({
        role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content || (m.parts && m.parts[0] ? m.parts[0].text : '')
      }))
    ];

    // Calling Groq via Cencori
    const response = await cencoriClient.ai.chat({
      messages: cencoriMessages,
      model: "groq/llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    return {
      text: response.content || "",
      provider: "groq",
      tokensUsed: response.usage?.totalTokens || 0
    };
  } catch (error) {
    console.error('Groq-via-Cencori Provider Error:', error);
    throw error;
  }
};
