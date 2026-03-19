import db from '@/lib/db';
import { generateAIResponse } from './ai/core/generateAIResponse';

/**
 * 1. BUSINESS CONTEXT COMPRESSION
 * Generates an AI-friendly summary of the business and stores it in the database.
 * Call this when a business profile is created or updated.
 */
export async function buildBusinessSummary(businessId) {
  const res = await db.query('SELECT name, category, description, business_hours, assistant_tone, assistant_instructions FROM businesses WHERE id = $1', [businessId]);
  if (res.rowCount === 0) return null;

  const b = res.rows[0];
  
  // Format business hours into a readable string
  let hoursStr = "Not specified.";
  if (b.business_hours) {
    try {
      const hours = typeof b.business_hours === 'string' ? JSON.parse(b.business_hours) : b.business_hours;
      
      const openDays = Object.entries(hours)
        .filter(([day, data]) => data && !data.closed) // Fixed: using .closed instead of .isClosed
        .map(([day, data]) => `${day}: ${data.open} - ${data.close}`);
      
      const closedDays = Object.entries(hours)
        .filter(([day, data]) => data && data.closed) // Fixed: using .closed
        .map(([day]) => day);
        
      if (openDays.length > 0) {
        hoursStr = openDays.join(', ');
        if (closedDays.length > 0) hoursStr += ` | Closed on: ${closedDays.join(', ')}`;
      } else if (closedDays.length > 0) {
        hoursStr = `Closed every day (${closedDays.join(', ')})`;
      }
    } catch (e) {
      hoursStr = JSON.stringify(b.business_hours);
    }
  }

  const compressionPrompt = `
Compress the following business profile into a dense, AI-friendly system prompt (max 80-100 tokens). 
Include exactly: name, category, short description, business hours, tone, and key assistant instructions. 
Do not talk in the first person. Output ONLY the compressed summary.

Name: ${b.name}
Category: ${b.category}
Description: ${b.description}
Hours: ${hoursStr}
Tone: ${b.assistant_tone}
Instructions: ${b.assistant_instructions}
  `.trim();

  let aiSummary = '';
  try {
    const aiResponse = await generateAIResponse(compressionPrompt, "Compress business profiles for systems.");
    aiSummary = aiResponse.text.trim();
    
    await db.query('UPDATE businesses SET ai_summary = $1 WHERE id = $2', [aiSummary, businessId]);
    return aiSummary;
  } catch (error) {
    console.error('Error generating AI business summary:', error);
    // fallback if AI fails
    aiSummary = `${b.name} (${b.category}). ${b.description}. Hours: ${hoursStr}. Tone: ${b.assistant_tone}. Rules: ${b.assistant_instructions}`;
    // Truncate fallback to stay near limit
    if (aiSummary.length > 500) aiSummary = aiSummary.substring(0, 500) + '...';
    await db.query('UPDATE businesses SET ai_summary = $1 WHERE id = $2', [aiSummary, businessId]);
    return aiSummary;
  }
}

/**
 * 2. INTENT DETECTION
 * Simple regex and keyword matcher to classify user intent without an LLM call.
 * @param {string} message - The user message
 * @param {Object} business - The business context (category, description)
 */
export function detectIntent(message, business = null) {
  if (!message || typeof message !== 'string') return 'conversation';

  const lowerMsg = message.toLowerCase();

  // Pattern sets
  const intents = {
    human_request: [
      /\b(human|owner|agent|person|someone|representative|staff|speak to someone|talk to someone|speak to a person)\b/i,
      /speak with (the|a) (owner|manager|person|human)/,
      /can i (speak|talk) to a (human|person|agent|owner)/,
      /let me (speak|talk) to (someone|a human)/
    ],
    order_request: [
      /i (want|need) to (order|buy|book|get|purchase)/,
      /can i (order|get|have|buy|book)/,
      /(order|buy|book|get|purchase) (some|a|an)/,
      /\b(order|buy|purchase|book|reserve|checkout|payment|price|cost)\b/
    ],
    support: [
      /(not working|broken|delay|failed|error|wrong|missing)/,
      /where is my (order|stuff|package|delivery)/,
      /i have a (problem|issue|complaint|trouble)/,
      /\b(problem|issue|complain|complaint|help|refund|missing|wrong|broken|fix)\b/
    ],
    business_info: [
      /what do you (sell|offer|have|do)/,
      /how much (is it|does it cost)/,
      /are you (open|closed)/,
      /where are you (located|based)/,
      /\b(price|cost|costing|service|menu|offer|available|open|close|hours|location|address|services|products)\b/
    ]
  };

  // 1. Check for Human/Support Escalation (Highest Priority)
  for (const pattern of intents.human_request) {
    if (pattern.test(lowerMsg)) return 'human_request';
  }

  // 2. Check for Support/Problem
  for (const pattern of intents.support) {
    if (pattern.test(lowerMsg)) return 'support';
  }

  // 3. Check for Out of Scope (if business context provided)
  if (business && (business.category || business.description)) {
    const scopeKeywords = [
      ...(business.category ? business.category.toLowerCase().split(/[ ,&]+/) : []),
      ...(business.description ? business.description.toLowerCase().split(/[ ,&]+/).filter(w => w.length > 3) : [])
    ];
    
    // Very basic check: if message is long enough and contains none of the scope keywords 
    // AND contains keywords from "general knowledge" or "other categories", mark as out of scope.
    const unrelatedKeywords = ['weather', 'politics', 'news', 'joke', 'poem', 'story', 'history', 'science', 'math', 'code', 'programming'];
    const matchesUnrelated = unrelatedKeywords.some(kw => lowerMsg.includes(kw));
    
    // If it's short, it might just be greeting
    if (lowerMsg.length > 10 && matchesUnrelated) {
      // Check if it matches any business keywords
      const matchesBusiness = scopeKeywords.some(kw => kw.length > 2 && lowerMsg.includes(kw));
      if (!matchesBusiness) return 'out_of_scope';
    }
  }

  // 4. Check for Business Info / Order
  for (const intent of ['business_info', 'order_request']) {
    for (const pattern of intents[intent]) {
      if (pattern.test(lowerMsg)) return intent;
    }
  }

  return 'conversation';
}

/**
 * 3. CONDITIONAL CONTEXT INJECTION
 * Determines if the business context should be sent to the AI.
 * @param {string} messageContent - Current user message
 * @param {Object} business - Business object
 * @param {boolean} hasSummary - Whether conversation has a summary
 */
export function shouldIncludeBusinessContext(messageContent, business, hasSummary) {
  const intent = detectIntent(messageContent, business);

  // Always include if the conversation is new enough that we haven't summarized it yet
  if (!hasSummary) return { include: true, intent: intent === 'conversation' ? 'new_conversation' : intent };
  
  if (intent === 'business_info' || intent === 'order_request' || intent === 'support') {
    return { include: true, intent };
  }
  
  return { include: false, intent };
}

/**
 * 4. CONVERSATION WINDOW LIMIT & PAYLOAD BUILDING
 * Ensures we don't exceed token limits by selecting appropriate message history.
 * Rule: Last 5 messages OR (Summary + Last 2 messages)
 */
export async function buildAIPayload(conversationId, hasSummary) {
  const limit = hasSummary ? 2 : 5;
  const messages = await getRecentMessages(conversationId, limit);
  
  return messages.map(m => ({
    role: m.sender_type === 'ai' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));
}

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
    const aiResponse = await generateAIResponse(summarizePrompt, "Summarize conversations for memory.");
    const summary = aiResponse.text.trim();
    await db.query('UPDATE conversations SET summary = $1 WHERE id = $2', [summary, conversationId]);
    return summary;
  } catch (error) {
    console.error('Error generating conversation summary:', error);
    return null;
  }
}
