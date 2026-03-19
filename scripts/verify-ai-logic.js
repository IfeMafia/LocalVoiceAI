const { detectIntent, shouldIncludeBusinessContext } = require('../src/lib/ai-context');

// Mock data
const mockBusiness = {
  name: "Pizza Haven",
  category: "Restaurant, Pizza",
  description: "Authentic Italian pizzas and pasta. We also serve salads and desserts.",
  ai_summary: "Pizza Haven is an authentic Italian restaurant specializing in pizza and pasta. Open 10 AM - 10 PM. Tone: Friendly."
};

const testCases = [
  { 
    name: "Business Info Intent", 
    msg: "What's on your menu?", 
    expected: "business_info" 
  },
  { 
    name: "Order Intent", 
    msg: "I want to order a pepperoni pizza", 
    expected: "order_request" 
  },
  { 
    name: "Human Escalation Intent", 
    msg: "Let me speak to a human", 
    expected: "human_request" 
  },
  { 
    name: "Support Intent", 
    msg: "My pizza was late and cold", 
    expected: "support" 
  },
  { 
    name: "Out of Scope Intent", 
    msg: "What's the weather in London?", 
    expected: "out_of_scope" 
  },
  { 
    name: "Normal Conversation", 
    msg: "Hello there!", 
    expected: "conversation" 
  }
];

console.log("🚀 Starting AI Logic Verification...\n");

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
