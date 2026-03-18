import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateOpenAIResponse = async (messages, systemInstruction) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API Key is missing");
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Cost effective fallback
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
    provider: "openai",
    tokensUsed: completion.usage?.total_tokens || 0
  };
};
