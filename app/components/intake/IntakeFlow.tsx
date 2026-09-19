import React, { useState, useEffect, useRef } from 'react';

type Message = {
  sender: 'ai' | 'user';
  text: string;
};

export default function ConversationalIntake() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello. I am the Path Architect. To build your journey, I need to understand your intent. First: What are you looking to master?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState('goal'); // goal -> why -> where -> depth -> confirmation
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

    // Simulate AI processing and state transition
    setTimeout(() => {
      processResponse(userText);
    }, 600);
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
    <div className="max-w-2xl mx-auto h-[80vh] flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Path Architect</h2>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Intake Session</p>
        </div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {step === 'confirmation' && (
          <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-sm font-mono text-blue-400 uppercase tracking-widest">Proposed Path Contract</h3>
            <p className="text-zinc-200 italic leading-relaxed">
              "Got it: You want to master <span className="text-white font-bold">{formData.goal}</span> for <span className="text-white font-bold">{formData.where}</span>, aiming for <span className="text-white font-bold">{formData.depth}</span> level competence. Your primary driver is <span className="text-white font-bold">{formData.why}</span>."
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleInitializePath}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all"
              >
                Initialize Path
              </button>
              <button
                onClick={() => {
                  setStep('goal');
                  setMessages([{ sender: 'ai', text: "Let's start over. What are you looking to master?" }]);
                }}
                className="px-4 py-3 bg-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-700 transition-all"
              >
                Restart
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      {step !== 'confirmation' && (
        <div className="p-6 bg-zinc-900 border-t border-zinc-800 flex gap-4">
          <input
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
            placeholder="Type your response..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
