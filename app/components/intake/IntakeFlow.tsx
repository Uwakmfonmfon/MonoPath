"use client";
import React, { useState, useEffect, useRef } from 'react';

type Message = {
  sender: 'ai' | 'user';
  text: string;
};

function Typewriter({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, onComplete]);

  return (
    <p className="text-sm leading-relaxed font-mono text-zinc-300">
      {displayedText}
      <span className="ml-1 w-2 h-4 bg-neonBlue-glow animate-pulse inline-block align-middle" />
    </p>
  );
}

export default function ConversationalIntake() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello. I am the Path Architect. To build your journey, I need to understand your intent. First: What are you looking to master?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState('goal');
  const [formData, setFormData] = useState({
    goal: '',
    why: '',
    where: '',
    depth: 'competence',
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');

    setTimeout(() => {
      processResponse(userText);
    }, 800);
  };

  const processResponse = (text: string) => {
    let aiResponse = '';

    if (step === 'goal') {
      setFormData(prev => ({ ...prev, goal: text }));
      setStep('why');
      aiResponse = `"${text}" sounds like a worthy pursuit. Now, tell me the "why"—what's the deeper driver behind this goal?`;
    } else if (step === 'why') {
      setFormData(prev => ({ ...prev, why: text }));
      setStep('where');
      aiResponse = "I understand. And where do you see yourself applying this skill in the real world?";
    } else if (step === 'where') {
      setFormData(prev => ({ ...prev, where: text }));
      setStep('depth');
      aiResponse = "Finally, how far do you want to take this? Are you looking for casual dabbling, conversational competence, or total mastery?";
    } else if (step === 'depth') {
      setFormData(prev => ({ ...prev, depth: text.toLowerCase().includes('master') ? 'mastery' : text.toLowerCase().includes('casual') ? 'casual' : 'competence' }));
      setStep('confirmation');
      aiResponse = "I have enough information to architect your path. Please review the summary below to ensure I've captured your intent correctly.";
    }

    setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
  };

  const handleInitializePath = async () => {
    const response = await fetch('/api/generate-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user_1',
        goal: formData.goal,
        intake: formData,
      }),
    });

    if (response.ok) {
      alert('Your personalized path has been initialized. Welcome to MonoPath.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[85vh] flex flex-col bg-obsidian-surface border border-obsidian-border rounded-3xl overflow-hidden shadow-2xl relative animate-boot">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-obsidian-border bg-obsidian-base/50 backdrop-blur-md flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-display tracking-tighter">Path Architect</h2>
          <p className="text-[10px] text-neonBlue-accent font-mono uppercase tracking-[0.3em]">Intake Session / Seq_01</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-zinc-600 uppercase">Status: Active</span>
          <div className="w-2 h-2 bg-neonBlue-glow rounded-full animate-pulse shadow-[0_0_8px_#00F0FF]" />
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            <div className={`max-w-[85%] p-5 rounded-2xl transition-all ${
              msg.sender === 'user'
                ? 'bg-neonBlue-glow text-obsidian-base rounded-tr-none shadow-[0_0_15px_rgba(0,240,255,0.3)] font-medium'
                : 'bg-obsidian-base border border-obsidian-border text-zinc-300 rounded-tl-none shadow-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
            }`}>
              {msg.sender === 'ai' ? (
                <Typewriter text={msg.text} />
              ) : (
                <p className="text-sm leading-relaxed">{msg.text}</p>
              )}
            </div>
          </div>
        ))}

        {step === 'confirmation' && (
          <div className="p-8 bg-obsidian-base border border-neonBlue-glow/30 rounded-3xl space-y-6 animate-in zoom-in-95 duration-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neonBlue-glow to-transparent opacity-50" />
            <h3 className="text-xs font-mono text-neonBlue-accent uppercase tracking-[0.4em] text-center mb-4">Proposed Path Contract</h3>

            <div className="space-y-4 text-zinc-300 font-mono text-sm leading-relaxed bg-obsidian-surface p-6 rounded-2xl border border-obsidian-border">
              <p>GOAL: <span className="text-white font-bold">{formData.goal}</span></p>
              <p>CONTEXT: <span className="text-white font-bold">{formData.where}</span></p>
              <p>DEPTH: <span className="text-white font-bold uppercase">{formData.depth}</span></p>
              <p>DRIVER: <span className="text-white font-bold">{formData.why}</span></p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleInitializePath}
                className="flex-1 bg-neonBlue-glow hover:bg-neonBlue-accent text-obsidian-base py-4 rounded-xl font-bold transition-all uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(0,240,255,0.2)] active:scale-95"
              >
                Initialize Path
              </button>
              <button
                onClick={() => {
                  setStep('goal');
                  setMessages([{ sender: 'ai', text: "Session reset. Let's restart the architecture. What are you looking to master?" }]);
                }}
                className="px-6 py-4 bg-obsidian-surface text-zinc-500 rounded-xl hover:text-zinc-300 border border-obsidian-border transition-all text-xs font-mono uppercase"
              >
                Restart
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      {step !== 'confirmation' && (
        <div className="relative z-10 p-6 bg-obsidian-base border-t border-obsidian-border flex gap-4">
          <div className="relative flex-1">
            <input
              className="w-full bg-obsidian-surface border border-obsidian-border rounded-xl px-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-neonBlue-glow focus:ring-2 focus:ring-neonBlue-glow/20 transition-all font-mono text-sm"
              placeholder="Type your response..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-700 pointer-events-none uppercase">
              Enter
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-neonBlue-glow hover:bg-neonBlue-accent text-obsidian-base px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-30 uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-95"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
