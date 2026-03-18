import OpenAI from "openai";

// OpenRouter uses the OpenAI-compatible API
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "Voxy AI",
  }
});

export const generateOpenRouterResponse = async (messages, systemInstruction) => {
  const completion = await openrouter.chat.completions.create({
    model: "meta-llama/llama-3.1-405b", // High reliability model
    messages: [
      { role: "system", content: systemInstruction },
      ...messages.map(m => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.parts[0].text
      }))
    ],
    temperature: 0.7,
  });

  return {
    text: completion.choices[0]?.message?.content || "",
    provider: "openrouter",
    tokensUsed: completion.usage?.total_tokens || 0
  };
};
