import { Cencori } from 'cencori';

/**
 * Cencori Architecture Layer
 * Handles primary AI execution and metadata normalization.
 */
export const cencoriClient = new Cencori({
  apiKey: process.env.CENCORI_SECRET_KEY || process.env.CENCORI_API_KEY,
});

/**
 * Unified call to Cencori AI gateway
 * @param {Object} params
 * @param {Array|string} params.prompt - Input prompt or messages
 * @param {string} params.model - Target model name
 * @param {Object} params.metadata - Contextual metadata
 */
export async function callCencoriAI({ prompt, model = 'gemini-2.5', metadata = {} }) {
  const messages = typeof prompt === 'string' 
    ? [{ role: 'user', content: prompt }]
    : prompt.map(m => ({
        role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content || (m.parts && m.parts[0] ? m.parts[0].text : '')
      }));

  const response = await cencoriClient.ai.chat({
    messages,
    model: model,
    ...metadata
  });

  return {
    text: response.content,
    model: response.model,
    provider: "cencori",
    tokensUsed: response.usage?.totalTokens || 0,
    finishReason: response.finishReason
  };
}
