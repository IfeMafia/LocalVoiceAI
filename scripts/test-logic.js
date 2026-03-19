// Mocking the logic directly since we are testing the regex and patterns
function detectIntent(message, business = null) {
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
    
    const unrelatedKeywords = ['weather', 'politics', 'news', 'joke', 'poem', 'story', 'history', 'science', 'math', 'code', 'programming'];
    const matchesUnrelated = unrelatedKeywords.some(kw => lowerMsg.includes(kw));
    
    if (lowerMsg.length > 10 && matchesUnrelated) {
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

function shouldIncludeBusinessContext(messageContent, business, hasSummary) {
  const intent = detectIntent(messageContent, business);
  if (!hasSummary) return { include: true, intent: intent === 'conversation' ? 'new_conversation' : intent };
  if (intent === 'business_info' || intent === 'order_request' || intent === 'support') {
    return { include: true, intent };
  }
  return { include: false, intent };
}

// Mock data
const mockBusiness = {
  name: "Pizza Haven",
  category: "Restaurant, Pizza",
  description: "Authentic Italian pizzas and pasta. We also serve salads and desserts."
};

const testCases = [
  { name: "Business Info Intent", msg: "What's on your menu?", expected: "business_info" },
  { name: "Order Intent", msg: "I want to order a pepperoni pizza", expected: "order_request" },
  { name: "Human Escalation Intent", msg: "Let me speak to a human", expected: "human_request" },
  { name: "Support Intent", msg: "My pizza was late and cold", expected: "support" },
  { name: "Out of Scope Intent", msg: "What's the weather in London today?", expected: "out_of_scope" },
  { name: "Normal Conversation", msg: "Hello there!", expected: "conversation" }
];

console.log("🚀 Starting Standalone AI Logic Verification...\n");

let passed = 0;
for (const tc of testCases) {
  const intent = detectIntent(tc.msg, mockBusiness);
  if (intent === tc.expected) {
    console.log(`✅ [${tc.name}] Passed`);
    passed++;
  } else {
    console.log(`❌ [${tc.name}] Failed. Expected: ${tc.expected}, Got: ${intent}`);
  }
}

console.log(`\n📊 Results: ${passed}/${testCases.length} tests passed.\n`);

console.log("🧪 Testing Context Injection Logic...");
const newConv = shouldIncludeBusinessContext("Hi", mockBusiness, false);
console.log(`- New Conversation: include=${newConv.include}, intent=${newConv.intent}`);
if (newConv.include === true) console.log("✅ New conversation includes context.");

const midConvInfo = shouldIncludeBusinessContext("What are your hours?", mockBusiness, true);
console.log(`- Info Query (Mid-conv): include=${midConvInfo.include}, intent=${midConvInfo.intent}`);
if (midConvInfo.include === true) console.log("✅ Info query includes context.");

const midConvChat = shouldIncludeBusinessContext("Okay thanks", mockBusiness, true);
console.log(`- Casual Chat (Mid-conv): include=${midConvChat.include}, intent=${midConvChat.intent}`);
if (midConvChat.include === false) console.log("✅ Casual chat excludes context.");

console.log("\n🏁 Done.");
