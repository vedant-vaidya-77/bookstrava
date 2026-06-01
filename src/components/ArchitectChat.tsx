import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Send, Sparkles, User, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ArchitectChatProps {
  onAskArchitect: (customQuestion: string) => void;
  architectAnswer: string;
  isAsking: boolean;
  systemVariables: {
    platform: string;
    database: string;
    syncPolicy: string;
  };
}

export default function ArchitectChat({ 
  onAskArchitect, 
  architectAnswer, 
  isAsking,
  systemVariables 
}: ArchitectChatProps) {
  const [chatInput, setChatInput] = useState('');
  const [conversation, setConversation] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: "👋 Welcom! I am your lead System Architect for Bookstrava. Ask me anything about scaling feeds, offline DB designs, or matching physical pages to kindle percentages."
    }
  ]);

  const endOfChatRef = useRef<HTMLDivElement>(null);

  // Suggested prompt questions
  const SUGGESTIONS = [
    "Web vs App: Where should I code first?",
    "How does Fanout-on-Write scaling work?",
    "Explain SSTables vs B-Trees for log indexes.",
    "Draft a Firestore schema for book sessions."
  ];

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isAsking]);

  // When parent architectAnswer updates, sync to local conversation array
  useEffect(() => {
    if (architectAnswer && conversation.length > 0) {
      const lastMsg = conversation[conversation.length - 1];
      if (lastMsg.role === 'user') {
        setConversation(prev => [
          ...prev,
          { role: 'model', text: architectAnswer }
        ]);
      }
    }
  }, [architectAnswer]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim() || isAsking) return;
    
    // Add User message
    setConversation(prev => [
      ...prev,
      { role: 'user', text: textToSend }
    ]);
    
    // Pass to parent API router
    onAskArchitect(textToSend);
    setChatInput('');
  };

  return (
    <div className="bg-[#080808] border border-white/10 rounded-2xl flex flex-col h-[550px] overflow-hidden text-left shadow-none" id="architect-chat-container">
      {/* Container Header */}
      <div className="bg-[#0c0c0c] p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#FC5200]/20 text-[#FC5200] p-1.5 rounded-lg border border-[#FC5200]/30">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white font-mono">System Design Expert</h3>
            <span className="text-[9px] text-emerald-400 font-bold font-mono uppercase flex items-center gap-1">
              ● Gemini AI Advisor Live
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setConversation([{ role: 'model', text: "Chat refreshed. Ask me technical questions." }])}
          className="text-white/40 hover:text-white p-1 rounded hover:bg-white/5 transition"
          title="Reset chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll space */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm bg-[#050505]">
        {conversation.map((msg, i) => (
          <div 
            key={i} 
            className={`flex items-start gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}
          >
            {/* Avatar indicator */}
            <div className={`w-7 h-7 rounded-none flex items-center justify-center text-xs flex-shrink-0 border ${msg.role === 'user' ? 'bg-[#FC5200] border-[#FC5200] text-black font-black italic' : 'bg-white/5 border-white/10 text-[#FC5200]'}`}>
              {msg.role === 'user' ? 'U' : 'AI'}
            </div>

            <div className={`p-3 rounded-xl ${msg.role === 'user' ? 'bg-white text-black font-semibold' : 'bg-[#080808] text-white/90 border border-white/10'}`}>
              <p className="whitespace-pre-wrap leading-relaxed text-xs">
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {/* Typing loading indicators */}
        {isAsking && (
          <div className="flex items-start gap-2.5 max-w-[80%] mr-auto text-left">
            <div className="w-7 h-7 rounded-none flex items-center justify-center text-xs flex-shrink-0 bg-white/5 border border-white/10 text-[#FC5200]">
              AI
            </div>
            <div className="p-3 bg-[#080808] rounded-xl border border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#FC5200] rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#FC5200] rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-[#FC5200] rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[10px] text-white/40 font-mono font-bold uppercase tracking-wider ml-1">Analyzing tradeoffs...</span>
            </div>
          </div>
        )}

        <div ref={endOfChatRef} />
      </div>

      {/* Suggested Prompt Chips */}
      {conversation.length === 1 && !isAsking && (
        <div className="px-4 pb-3 space-y-1.5 text-left bg-[#050505]">
          <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.15em] font-mono block">SUGGESTED CONVERSATIONS:</span>
          <div className="flex flex-wrap gap-1">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="text-[10px] bg-white/5 hover:bg-[#FC5200] hover:text-black border border-white/10 rounded-lg px-2.5 py-1 text-white/70 transition cursor-pointer font-bold uppercase tracking-tight font-mono"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input controls box */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(chatInput);
        }}
        className="p-3 bg-[#0c0c0c] border-t border-white/10 flex gap-2"
      >
        <input 
          type="text" 
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="e.g., Write the Swift offline Sync algorithm..."
          className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#FC5200]"
          disabled={isAsking}
        />
        <button 
          type="submit"
          className="bg-[#FC5200] hover:bg-[#ff641a] disabled:bg-white/5 hover:disabled:bg-white/5 text-black disabled:text-white/20 font-black uppercase text-xs px-5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
          disabled={isAsking || !chatInput.trim()}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

