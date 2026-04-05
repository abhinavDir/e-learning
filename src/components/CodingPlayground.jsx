import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import api from '../api/axios';
import { Play, RotateCcw, Bug, Sparkles, Terminal, FileCode, CheckCircle, Smartphone, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CodingPlayground = () => {
  const [code, setCode] = useState('// Your mission begins here...\n\nfunction startArchitecture() {\n  console.log("Welcome to the Neural Playground.");\n}\n\nstartArchitecture();');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');

  const runCode = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/code/run', { 
        code, 
        language, 
        version: language === 'javascript' ? '18.15.0' : '3.10.0' 
      });
      setOutput(data.output);
      toast.success("Execution Complete!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Execution failed");
    } finally {
      setLoading(false);
    }
  };

  const reviewCode = async () => {
    setReviewing(true);
    try {
      const { data } = await api.post('/code/review', { code });
      setReview(data.review);
      toast.success("AI Synthesis Complete!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Review failed");
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="playground-layout">
      <div className="playground-toolbar mb-4 flex-between items-center p-4 glass-panel border-glow">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Terminal size={18} /> NEURAL PLAYGROUND
          </div>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="playground-selector"
          >
            <option value="javascript">JavaScript (Node v18)</option>
            <option value="python">Python (v3.10)</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={reviewCode} 
            className="btn-secondary-outline flex items-center gap-2 text-xs"
            disabled={reviewing}
          >
            {reviewing ? <RotateCcw className="animate-spin" size={14} /> : <Sparkles className="text-primary" size={14} />} 
            AI Review
          </button>
          <button 
            onClick={runCode} 
            className="btn-primary-glow px-8 py-2 text-sm flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <RotateCcw className="animate-spin" size={16} /> : <Play fill="currentColor" size={12} />} 
            EXECUTE UNIT
          </button>
        </div>
      </div>

      <div className="playground-main grid lg:grid-cols-2 gap-6 h-[700px]">
        <div className="editor-zone relative glass-panel overflow-hidden border-none shadow-2xl">
          <Editor
            theme={theme}
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              cursorBlinking: "expand",
              cursorSmoothCaretAnimation: true,
              lineNumbersMinChars: 3
            }}
          />
        </div>

        <div className="results-zone grid grid-rows-2 gap-6">
          <div className="output-console glass-panel p-6 bg-[#0a0a0a] border-none overflow-auto relative">
            <div className="text-xs uppercase opacity-40 font-bold mb-4 tracking-widest flex-between">
              Runtime Console {loading && <span className="text-primary pulse">Connecting...</span>}
            </div>
            <pre className="font-mono text-sm leading-relaxed text-zinc-300">
              {output || "// System Idle. Waiting for input..."}
            </pre>
            {output && <div className="absolute right-4 top-4">
              <CheckCircle size={14} className="text-success shadow-success" />
            </div>}
          </div>

          <div className="ai-feedback glass-panel p-6 bg-primary-glow border-none overflow-auto">
            <div className="text-xs uppercase opacity-40 font-bold mb-4 tracking-widest flex items-center gap-2">
              <Bug size={14} /> Synthetic Code Reviewer
            </div>
            {reviewing ? (
              <div className="flex-center h-full gap-3 opacity-50">
                <Sparkles className="animate-pulse text-primary" /> Thinking...
              </div>
            ) : (
              <div className="text-sm leading-relaxed text-blue-100 font-medium">
                {review || "// Request synthesis to see AI improvements."}
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .playground-layout { position: relative; width: 100%; top: -2rem; }
        .playground-selector { background: var(--surface); border: 1px solid var(--glass-border); color: white; padding: 0.5rem; border-radius: 0.75rem; font-size: 0.75rem; font-weight: 700; cursor: pointer; outline: none; }
        .playground-selector:hover { border-color: var(--primary); }
        .btn-primary-glow { background: var(--primary); color: white; border-radius: 0.85rem; font-weight: 800; border: none; box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); transition: 0.3s; }
        .btn-primary-glow:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
        .output-console { color: #fecaca; }
        .pulse { animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}} />
    </div>
  );
};

export default CodingPlayground;
