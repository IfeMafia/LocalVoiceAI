"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Send, 
  Mic, 
  MoreVertical, 
  Phone, 
  Video,
  Smile,
  Paperclip
} from 'lucide-react';
import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "ai", time: "09:00 AM" },
    { id: 2, text: "I'd like to know about the availability of product X.", sender: "user", time: "09:01 AM" },
    { id: 3, text: "Product X is currently in stock! Would you like to place an order or see the specifications?", sender: "ai", time: "09:01 AM" },
  ]);

  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <DashboardLayout title="Support Chat">
      <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto voxy-card overflow-hidden animate-fade-in-up">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#00D18F] flex items-center justify-center font-bold text-black shadow-lg shadow-[#00D18F]/20">
                V
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#00D18F] border-2 border-white dark:border-black rounded-full" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm">Voxy Assistant</h3>
              <p className="text-[11px] text-[#00D18F] font-bold uppercase tracking-wider">AI Integration Active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-zinc-400 hover:text-[#00D18F] transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">
              <Phone size={18} />
            </button>
            <button className="p-2 text-zinc-400 hover:text-[#00D18F] transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">
              <Video size={18} />
            </button>
            <button className="p-2 text-zinc-400 hover:text-[#00D18F] transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`
                  px-5 py-3.5 rounded-2xl text-sm leading-relaxed
                  ${msg.sender === 'user' 
                    ? 'bg-[#00D18F] text-black font-medium rounded-tr-none' 
                    : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-white/5 rounded-tl-none'
                  }
                `}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-zinc-500 font-medium px-1">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border-t border-zinc-200 dark:border-white/5">
          <form 
            onSubmit={handleSend}
            className="flex items-center gap-3 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 rounded-2xl p-2 pl-4 pr-2 shadow-sm focus-within:border-[#00D18F]/50 transition-all"
          >
            <button type="button" className="p-2 text-zinc-400 hover:text-[#00D18F] transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm dark:text-white placeholder:text-zinc-500 font-medium"
            />
            <div className="flex items-center gap-1">
              <button type="button" className="p-2 text-zinc-400 hover:text-[#00D18F] transition-colors">
                <Smile size={20} />
              </button>
              <button type="button" className="p-2 text-zinc-400 hover:text-[#00D18F] transition-colors rounded-xl bg-zinc-100 dark:bg-white/5">
                <Mic size={20} />
              </button>
              <button 
                type="submit" 
                className="p-2.5 bg-[#00D18F] text-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#00D18F]/20"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
          <p className="text-[10px] text-center text-zinc-500 mt-3 font-medium tracking-wide">
            Powered by Voxy AI Multilingual Processing
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}
