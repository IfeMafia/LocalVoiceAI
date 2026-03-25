import { generateAI } from "../aiProvider.js";

/**
 * Unified AI Response Interface (Step 3)
 * Refactored to route all requests through the resilient Cencori-first provider.
 * 
 * @param {Array|string} promptOrMessages - Chat history or simple prompt
 * @param {string} systemInstruction - System context
 * @param {string} userId - Opt tracking id
 * @param {string} businessId - Opt tracking id
 */
export async function generateAIResponse(
  promptOrMessages, 
  systemInstruction = "You are a helpful assistant.",
  userId = null,
  businessId = null
) {
  // Transfer execution to the central resilient provider
  return await generateAI({
    userId,
    businessId,
    prompt: promptOrMessages,
    systemInstruction,
    type: 'chat',
    model: 'gemini-2.5'
  });
}
