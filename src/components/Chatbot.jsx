import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Mic, MicOff, RotateCcw, Bot, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your AI learning assistant. Ask me anything about your courses, code, or career path.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);

  // Initialize Web Speech API
  const recognitionRef = useRef(null);
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        toast.success("Voice Captured!");
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
        toast.error("Speech Recognition Failed");
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return toast.error("Speech recognition not supported in this browser.");
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info("Listening...");
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-5); // Send last 5 messages for context
      const { data } = await api.post('/chat', { message: input, history });
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (err) {
      toast.error("Assistant is momentarily offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        className="chatbot-toggle-btn glass-panel border-glow shadow-primary flex-center"
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', color: 'white', position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="chatbot-window glass-panel fixed bottom-32 right-8 flex flex-col overflow-hidden"
            style={{ width: '400px', height: '600px', zIndex: 999, border: '1.5px solid var(--glass-border)', background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(30px)' }}
          >
            <div className="chat-header p-5 flex items-center gap-3 border-b border-white border-opacity-10 bg-primary-glow">
              <div className="p-2 rounded-xl bg-primary text-white"><Bot size={22} /></div>
              <div>
                <div className="font-bold">Neural Assistant</div>
                <div className="text-xs opacity-50 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> Active AI</div>
              </div>
              <button onClick={() => setMessages([{ role: 'ai', content: 'Hello! I am your AI learning assistant.' }])} className="ml-auto text-muted"><RotateCcw size={16} /></button>
            </div>

            <div className="chat-messages flex-1 overflow-y-auto p-5 space-y-4 custom-scroll" ref={scrollRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 max-w-[85%] text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-2xl rounded-tr-none' 
                      : 'bg-surface border-glow rounded-2xl rounded-tl-none'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="p-4 bg-surface rounded-2xl rounded-tl-none border-glow flex gap-1">
                    <span className="dot-blink bg-primary"></span>
                    <span className="dot-blink bg-primary delay-100"></span>
                    <span className="dot-blink bg-primary delay-200"></span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="chat-input-area p-5 border-t border-white border-opacity-10 flex gap-2 items-center bg-zinc-900">
              <input 
                type="text" 
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="button" 
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-all ${isListening ? 'bg-danger text-white pulse' : 'text-zinc-500 hover:text-white'}`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button 
                type="submit" 
                className="p-2.5 rounded-xl bg-primary text-white disabled:opacity-50"
                disabled={!input.trim() || loading}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .dot-blink { width: 4px; height: 4px; border-radius: 50%; display: inline-block; animation: dot-blink 1s infinite alternate; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        @keyframes dot-blink { from { opacity: 0.2; } to { opacity: 1; } }
      `}} />
    </>
  );
};

export default Chatbot;
