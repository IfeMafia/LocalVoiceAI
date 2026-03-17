import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, isTyping, typingAvatar }) => {
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => (
          <MessageBubble 
            key={msg.id || index} 
            message={msg} 
            senderType={msg.sender_type} 
          />
        ))
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-zinc-500 italic space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
            <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M16 12h.01M16 12h.01M16 12h.01M16 12h.01M16 12h.01" />
            </svg>
          </div>
          <p>Start the conversation below.</p>
        </div>
      )}
      
      {isTyping && (
        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300 py-2">
          <div className="flex items-center gap-3">
            <div className="size-8 sm:size-10 rounded-lg sm:rounded-xl bg-[#00D18F]/5 border border-[#00D18F]/20 text-[#00D18F] flex items-center justify-center shadow-md overflow-hidden">
              {typingAvatar ? (
                typeof typingAvatar === 'string' && typingAvatar.startsWith('/') || typingAvatar.startsWith('http') ? (
                  <img src={typingAvatar} className="size-full object-cover" alt="Typing" />
                ) : (
                  <span className="font-bold text-xs">{typingAvatar}</span>
                )
              ) : (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="bg-zinc-900/50 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-10">
              <span className="size-1 bg-[#00D18F] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="size-1 bg-[#00D18F] rounded-full animate-bounce [animation-delay:-0.15s] "></span>
              <span className="size-1 bg-[#00D18F] rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={scrollRef} className="h-4" />
    </div>
  );
};

export default MessageList;
