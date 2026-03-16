export const MOCK_BUSINESSES = [
  {
    id: "luxe-diners",
    name: "Luxe Diners",
    description: "Experience fine dining with a globally inspired menu and world-class service.",
    category: "Restaurant",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    color: "#00D18F",
    accent: "emerald"
  },
  {
    id: "tech-gear",
    name: "Tech Gear",
    description: "The ultimate destination for premium electronics, gadgets, and computing power.",
    category: "Retail",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
    color: "#3B82F6",
    accent: "blue"
  },
  {
    id: "fresh-mart",
    name: "Fresh Mart",
    description: "Your local source for organic, farm-fresh produce and health-conscious groceries.",
    category: "Grocery",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    color: "#F59E0B",
    accent: "amber"
  },
  {
    id: "spa-bliss",
    name: "Spa Bliss",
    description: "Rejuvenate your mind and body with our holistic spa and wellness treatments.",
    category: "Wellness",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544161515-4af6b1d8e1c?w=800&q=80",
    color: "#8B5CF6",
    accent: "purple"
  }
];

export const MOCK_CHAT_HISTORY = [
  {
    businessId: "luxe-diners",
    lastMessage: "I'd be happy to check availability for you!",
    timestamp: "10:30 AM",
    unread: 0,
    status: "delivered"
  },
  {
    businessId: "tech-gear",
    lastMessage: "The new MacBook Pro is available in store.",
    timestamp: "Yesterday",
    unread: 2,
    status: "read"
  }
];
