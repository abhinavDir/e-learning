import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  BrainCircuit,
  ArrowLeft,
  Sparkles,
  Shield,
  Layers,
  Settings,
  Globe,
  ChevronRight,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import './CreateQuiz.css';

const CreateQuiz = () => {
  const [quizData, setQuizData] = useState({
    topic: '',
    difficulty: 'Intermediate',
    isGlobal: true,
    questions: [
      { question: '', options: ['', '', '', ''], correctAnswer: '' }
    ]
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddQuizQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]
    });
  };

  const handleRemoveQuizQuestion = (index) => {
    if (quizData.questions.length === 1) return toast.error('At least one question is required.');
    const newQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quizData.topic) return toast.error('Please name your topic architecture.');

    const incomplete = quizData.questions.some(q => !q.correctAnswer || !q.question || q.options.some(o => !o));
    if (incomplete) return toast.error('Ensure all questions, options, and correct answers are defined.');

    setLoading(true);
    try {
      await api.post('/quiz/create', {
        ...quizData,
        isGlobal: true
      });

      toast.success('Global Assessment Published Successfully!');
      navigate('/instructor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Intelligence publication failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <div className="studio-container">
      {/* Background Decorative Elements */}
      <div className="studio-bg-accent top-left" />
      <div className="studio-bg-accent bottom-right" />

      <header className="studio-sticky-header">
        <div className="max-width header-flex">
          <div className="header-brand-area">
            <button onClick={() => navigate('/instructor/dashboard')} className="action-btn-secondary back-hub-btn">
              <ArrowLeft size={18} />
            </button>
            <div className="title-group">
              <span className="badge-pill">Neural Studio v2.0</span>
              <h1 className="studio-title-main">Assessment Architect</h1>
            </div>
          </div>
          <div className="header-actions-area">
            <button onClick={handleSubmit} disabled={loading} className="btn-primary publish-trigger">
              {loading ? <span className="loader-pulse" /> : <><Globe size={18} /> <span>Publish Ecosystem</span></>}
            </button>
          </div>
        </div>
      </header>

      <motion.main 
        className="studio-workspace max-width"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        <form onSubmit={handleSubmit} className="workspace-layout">
          <div className="workspace-primary-col">

            {/* Core Configuration Card */}
            <motion.section variants={itemVariants} className="studio-glass-card config-card">
              <div className="card-header">
                <div className="header-icon-box blue">
                  <Layers size={20} />
                </div>
                <div className="header-text">
                  <h3>Core Intelligence</h3>
                  <p>Define the foundational parameters of this assessment.</p>
                </div>
              </div>

              <div className="card-body">
                <div className="input-group-premium">
                  <label>Topic Signature</label>
                  <div className="input-with-icon">
                    <Sparkles size={18} className="input-focus-icon" />
                    <input
                      type="text"
                      placeholder="e.g. Applied Machine Learning Patterns"
                      value={quizData.topic}
                      onChange={(e) => setQuizData({ ...quizData, topic: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group-premium">
                  <label>Skill Level Mapping</label>
                  <div className="select-wrapper-premium">
                    <select
                      value={quizData.difficulty}
                      onChange={(e) => setQuizData({ ...quizData, difficulty: e.target.value })}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Questions Collection */}
            <motion.section variants={itemVariants} className="questions-architect-area">
              <div className="area-title-bar">
                <Shield size={18} className="text-primary" />
                <h3>Question Sequences</h3>
                <span className="unit-counter">{quizData.questions.length} Stored Units</span>
              </div>

              <div className="question-nodes-list">
                <AnimatePresence mode="popLayout">
                  {quizData.questions.map((q, qIndex) => (
                    <motion.div
                      key={qIndex}
                      id={`q-node-${qIndex}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="studio-glass-card question-node"
                    >
                      <div className="node-header">
                        <div className="node-number">{qIndex + 1}</div>
                        <input
                          type="text"
                          className="node-title-input"
                          placeholder="Architect your query pattern here..."
                          value={q.question}
                          onChange={(e) => {
                            const nextQ = [...quizData.questions];
                            nextQ[qIndex].question = e.target.value;
                            setQuizData({ ...quizData, questions: nextQ });
                          }}
                        />
                        <button type="button" onClick={() => handleRemoveQuizQuestion(qIndex)} className="node-delete-btn">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="node-options-grid">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className={`option-input-row ${q.correctAnswer === opt && opt !== '' ? 'correct-active' : ''}`}>
                            <div
                              className="correct-toggle-trigger"
                              onClick={() => {
                                const nextQ = [...quizData.questions];
                                nextQ[qIndex].correctAnswer = opt;
                                setQuizData({ ...quizData, questions: nextQ });
                              }}
                            >
                              <Sparkles size={14} />
                            </div>
                            <input
                              type="text"
                              placeholder={`Response Variant ${oIndex + 1}`}
                              value={opt}
                              onChange={(e) => {
                                const nextQ = [...quizData.questions];
                                nextQ[qIndex].options[oIndex] = e.target.value;
                                // Auto-update correct answer if it was this option
                                if (q.correctAnswer === opt) nextQ[qIndex].correctAnswer = e.target.value;
                                setQuizData({ ...quizData, questions: nextQ });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <button type="button" onClick={handleAddQuizQuestion} className="append-sequence-trigger">
                <div className="plus-icon-container"><Plus size={24} /></div>
                <span>Initialize Next Intelligence Sequence</span>
              </button>
            </motion.section>
          </div>

          <aside className="workspace-sidebar">
            <motion.div variants={itemVariants} className="studio-glass-card sidebar-control-panel sticky-panel">
              <div className="panel-header">
                <Settings size={16} className="text-primary" />
                <h4>Neural Map</h4>
              </div>

              <div className="navigator-grid-container">
                <div className="dots-grid">
                  {quizData.questions.map((q, idx) => {
                    const isComplete = q.question && q.correctAnswer && !q.options.some(o => !o);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          document.getElementById(`q-node-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className={`nav-dot-v2 ${isComplete ? 'complete' : ''}`}
                        title={`Sequence ${idx + 1}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                  <button type="button" onClick={handleAddQuizQuestion} title="Add Sequence" className="nav-dot-v2 add-trigger">
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              <div className="telemetry-stats">
                <div className="stat-row">
                  <div className="stat-led emerald" />
                  <span className="stat-label">Global Uplink</span>
                  <span className="stat-value">ACTIVE</span>
                </div>
                <div className="stat-row">
                  <div className="stat-led blue" />
                  <span className="stat-label">Intelligence Units</span>
                  <span className="stat-value">{quizData.questions.length}</span>
                </div>
              </div>

              <div className="workspace-tip">
                <Info size={14} />
                <p>Ensure each sequence has a designated correct response marked by the sparkle icon.</p>
              </div>
            </motion.div>
          </aside>
        </form>
      </motion.main>
    </div>
  );
};

export default CreateQuiz;
