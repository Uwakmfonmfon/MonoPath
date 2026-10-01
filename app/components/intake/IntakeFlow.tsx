"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

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
    <p className="text-sm leading-relaxed font-mono text-paperWhite">
      {displayedText}
      <span className="ml-1 w-2 h-4 bg-focusTeal animate-pulse inline-block align-middle" />
    </p>
  );
}

export default function ConversationalIntake() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialGoal = searchParams.get('goal');
  const initialCat = searchParams.get('cat');

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState('goal');
  const [formData, setFormData] = useState({
    goal: initialGoal || '',
    why: '',
    where: '',
    depth: 'competence',
    experienceLevel: '',
    availableTime: '',
    deadline: undefined as string | undefined,
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialGoal) {
      const welcomeMsg = `I've architected a suggestion for you: ${initialGoal} in the ${initialCat} category. Does this align with your intent?`;
      setMessages([{ sender: 'ai', text: welcomeMsg }]);
      setStep('confirm_suggested');
    } else {
      setMessages([
        { sender: 'ai', text: "Hello. I am the Path Architect. To build your journey, I need to understand your intent. First: What are you looking to master?" }
      ]);
    }
  }, [initialGoal]);

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

  const processResponse = async (text: string) => {
    let aiResponse = '';

    // --- AI-Driven Dynamic Validation ---
    // In a real app, this would be an LLM call. For this v1, we simulate the "Vagueness Check".
    const isVague = (t: string) => t.length < 10 || t.split(' ').length < 3;

    if (step === 'confirm_suggested') {
      if (text.toLowerCase().includes('yes') || text.toLowerCase().includes('agree') || text.toLowerCase().includes('align')) {
        setStep('why');
        aiResponse = `Excellent. Now, tell me the "why"—what's the deeper driver behind this goal?`;
      } else {
        setStep('goal');
        aiResponse = "Understood. Let's pivot. What exactly are you looking to master?";
      }
    } else if (step === 'goal') {
      if (isVague(text)) {
        aiResponse = `"${text}" is a bit vague. Could you be more specific about what exactly you want to achieve within this goal?`;
      } else {
        setFormData(prev => ({ ...prev, goal: text }));
        setStep('why');
        aiResponse = `"${text}" sounds like a worthy pursuit. Now, tell me the "why"—what's the deeper driver behind this goal?`;
      }
    } else if (step === 'why') {
      if (isVague(text)) {
        aiResponse = `I want to understand the heartbeat of this goal. Why is this important to you right now?`;
      } else {
        setFormData(prev => ({ ...prev, why: text }));
        setStep('where');
        aiResponse = "I understand. And where do you see yourself applying this skill in the real world?";
      }
    } else if (step === 'where') {
      if (isVague(text)) {
        aiResponse = `Could you give me a concrete example of where you'll use this? (e.g., "at my job", "during a trip to Tokyo")`;
      } else {
        setFormData(prev => ({ ...prev, where: text }));
        setStep('depth');
        aiResponse = "Finally, how far do you want to take this? Are you looking for casual dabbling, conversational competence, or total mastery?";
      }
    } else if (step === 'depth') {
      // Capture depth and move to the new supplemental fields
      const depth = text.toLowerCase().includes('master') ? 'mastery' : text.toLowerCase().includes('casual') ? 'casual' : 'competence';
      setFormData(prev => ({ ...prev, depth }));
      setStep('experience');
      aiResponse = "Almost there. To calibrate the starting point: what is your current experience level with this? (e.g., 'Complete beginner', 'Some basics', 'Intermediate')";
    } else if (step === 'experience') {
      setFormData(prev => ({ ...prev, experienceLevel: text }));
      setStep('time');
      aiResponse = "And how much time can you realistically commit to this per week?";
    } else if (step === 'time') {
      setFormData(prev => ({ ...prev, availableTime: text }));
      setStep('deadline');
      aiResponse = "Lastly, is there a specific deadline or occasion driving this? (If not, just say 'none')";
    } else if (step === 'deadline') {
      setFormData(prev => ({ ...prev, deadline: text === 'none' ? undefined : text }));
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
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[85vh] flex flex-col bg-obsidian-surface border border-obsidian-border rounded-3xl overflow-hidden shadow-2xl relative animate-boot">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(var(--color-steel-slate) 1px, transparent 1px), linear-gradient(90deg, var(--color-steel-slate) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-obsidian-border bg-obsidian-base/50 backdrop-blur-md flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-paperWhite font-display tracking-tighter">Path Architect</h2>
          <p className="text-[10px] text-focusTeal font-mono uppercase tracking-[0.3em]">Intake Session / Seq_01</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-mutedZinc uppercase">Status: Active</span>
          <div className="w-2 h-2 bg-focusTeal rounded-full animate-pulse shadow-[0_0_8px_#4FD1C5]" />
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            <div className={`max-w-[85%] p-5 rounded-2xl transition-all ${
              msg.sender === 'user'
                ? 'bg-focusTeal text-obsidian-base rounded-tr-none shadow-[0_0_15px_rgba(79,205,197,0.3)] font-medium'
                : 'bg-obsidian-base border border-obsidian-border text-paperWhite rounded-tl-none shadow-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
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
          <div className="p-8 bg-obsidian-base border border-focusTeal/30 rounded-3xl space-y-6 animate-in zoom-in-95 duration-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-focusTeal to-transparent opacity-50" />
            <h3 className="text-xs font-mono text-focusTeal uppercase tracking-[0.4em] text-center mb-4">Proposed Path Contract</h3>

            <div className="space-y-4 text-mutedZinc font-mono text-sm leading-relaxed bg-obsidian-surface p-6 rounded-2xl border border-obsidian-border">
              <p>GOAL: <span className="text-paperWhite font-bold">{formData.goal}</span></p>
              <p>CONTEXT: <span className="text-paperWhite font-bold">{formData.where}</span></p>
              <p>DEPTH: <span className="text-paperWhite font-bold uppercase">{formData.depth}</span></p>
              <p>DRIVER: <span className="text-paperWhite font-bold">{formData.why}</span></p>
              <p>EXPERIENCE: <span className="text-paperWhite font-bold">{formData.experienceLevel || 'Not provided'}</span></p>
              <p>TIME: <span className="text-paperWhite font-bold">{formData.availableTime || 'Not provided'}</span></p>
              {formData.deadline && <p>DEADLINE: <span className="text-paperWhite font-bold">{formData.deadline}</span></p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleInitializePath}
                className="flex-1 bg-focusTeal hover:bg-focusTeal/90 text-obsidian-base py-4 rounded-xl font-bold transition-all uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(79,205,197,0.2)] active:scale-95"
              >
                Initialize Path
              </button>
              <button
                onClick={() => {
                  setStep('goal');
                  setMessages([{ sender: 'ai', text: "Session reset. Let's restart the architecture. What are you looking to master?" }]);
                }}
                className="px-6 py-4 bg-obsidian-surface text-mutedZinc rounded-xl hover:text-paperWhite border border-obsidian-border transition-all text-xs font-mono uppercase"
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
              className="w-full bg-obsidian-surface border border-obsidian-border rounded-xl px-4 py-4 text-paperWhite placeholder-mutedZinc focus:outline-none focus:border-focusTeal focus:ring-2 focus:ring-focusTeal/20 transition-all font-mono text-sm"
              placeholder="Type your response..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-mutedZinc pointer-events-none uppercase">
              Enter
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-focusTeal hover:bg-focusTeal/90 text-obsidian-base px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-30 uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(79,205,197,0.3)] active:scale-95"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
