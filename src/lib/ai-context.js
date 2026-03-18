import db from '@/lib/db';
import { generateText } from '@/lib/gemini';

/**
 * 1. BUSINESS CONTEXT COMPRESSION
 * Generates an AI-friendly summary of the business and stores it in the database.
 * Call this when a business profile is created or updated.
 */
export async function buildBusinessSummary(businessId) {
  const res = await db.query('SELECT name, category, description, assistant_tone, assistant_instructions FROM businesses WHERE id = $1', [businessId]);
  if (res.rowCount === 0) return null;

  const b = res.rows[0];
  const compressionPrompt = `
Compress the following business profile into a dense, AI-friendly system prompt (max 80-100 tokens). 
Include exactly: name, category, core description, tone, and key assistant instructions. 
Do not talk in the first person. Output ONLY the compressed summary.

Name: ${b.name}
Category: ${b.category}
Description: ${b.description}
Tone: ${b.assistant_tone}
Instructions: ${b.assistant_instructions}
  `.trim();

  let aiSummary = '';
  try {
    aiSummary = await generateText(compressionPrompt);
    aiSummary = aiSummary.trim();
    
    await db.query('UPDATE businesses SET ai_summary = $1 WHERE id = $2', [aiSummary, businessId]);
    return aiSummary;
  } catch (error) {
    console.error('Error generating AI business summary:', error);
    // fallback if AI fails
    aiSummary = `${b.name} (${b.category}). ${b.description}. Tone: ${b.assistant_tone}. Rules: ${b.assistant_instructions}`;
    await db.query('UPDATE businesses SET ai_summary = $1 WHERE id = $2', [aiSummary, businessId]);
    return aiSummary;
  }
}

/**
 * 2. CONDITIONAL CONTEXT INJECTION
 * Determines if the business context should be sent to the AI.
 * We send it if there's no conversation summary (meaning it's new) 
 * OR if the message implies a need for core business knowledge.
 */
export function shouldIncludeBusinessContext(messageContent, hasSummary) {
  // Always include if the conversation is new enough that we haven't summarized it yet
  if (!hasSummary) return true;

  // Simple heuristic: if the message asks about services, pricing, hours, location, who, what
  const keywords = ['price', 'cost', 'service', 'hour', 'time', 'location', 'where', 'who', 'what', 'offer', 'do you', 'can you'];
  const contentLower = messageContent.toLowerCase();
  
  for (const kw of keywords) {
    if (contentLower.includes(kw)) return true;
  }
  
  return false;
}

/**
 * 4. CONVERSATION WINDOW LIMIT
 * Fetch only the most recent messages. limit defaults to 5.
 */
export async function getRecentMessages(conversationId, limit = 5) {
  const res = await db.query(
    `SELECT sender_type, content 
     FROM messages 
     WHERE conversation_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2`,
    [conversationId, limit]
  );
  // reverse to return chronological order
  return res.rows.reverse();
}

/**
 * 5. CONVERSATION MEMORY (SUMMARIZATION)
 * If message count > 10, summarize the conversation up to this point and store it.
 */
export async function summarizeConversation(conversationId) {
  // Check total message count
  const countRes = await db.query('SELECT COUNT(*) FROM messages WHERE conversation_id = $1', [conversationId]);
  const count = parseInt(countRes.rows[0].count, 10);
  
  if (count <= 10) return null; // No need to summarize yet

  // Fetch all messages (or you could fetch last 10 if avoiding huge context)
  const msgsRes = await db.query(
    'SELECT sender_type, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
    [conversationId]
  );
  
  const historyText = msgsRes.rows.map(m => `${m.sender_type.toUpperCase()}: ${m.content}`).join('\n');
  
  const summarizePrompt = `
Summarize the following conversation concisely (max 100 tokens). 
Highlight the main issue/inquiry of the customer and what the AI has resolved or stated so far.

Conversation:
${historyText}
  `.trim();

  try {
    const summary = await generateText(summarizePrompt);
    await db.query('UPDATE conversations SET summary = $1 WHERE id = $2', [summary.trim(), conversationId]);
    return summary.trim();
  } catch (error) {
    console.error('Error generating conversation summary:', error);
    return null;
  }
}
