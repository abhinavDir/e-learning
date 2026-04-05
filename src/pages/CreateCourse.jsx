import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import {
  Plus,
  Trash2,
  Save,
  Video,
  Layout,
  Type,
  Layers,
  DollarSign,
  Image as ImageIcon,
  ChevronRight,
  MonitorPlay,
  ArrowLeft,
  Settings,
  Sparkles,
  UploadCloud,
  Shield,
  ShieldCheck,
  Award,
  Clock,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    price: 0,
    level: 'Beginner',
    totalDuration: '10+ Hours',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    sections: [{ title: '', lectures: [{ title: '', videoUrl: '', duration: '' }] }],
    outcomes: ['']
  });
  const [quizData, setQuizData] = useState({
    difficulty: 'Intermediate',
    questions: [
      { question: '', options: ['', '', '', ''], correctAnswer: '' }
    ]
  });
  const [hasQuiz, setHasQuiz] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: '', lectures: [{ title: '', description: '', videoUrl: '', duration: '' }] }]
    });
  };

  const handleRemoveSection = (index) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  const handleAddLecture = (sectionIndex) => {
    const nextSections = formData.sections.map((s, sIdx) => {
      if (sIdx === sectionIndex) {
        return {
          ...s,
          lectures: [...s.lectures, { title: '', description: '', videoUrl: '', duration: '' }]
        };
      }
      return s;
    });
    setFormData({ ...formData, sections: nextSections });
  };

  const handleRemoveLecture = (sectionIndex, lectureIndex) => {
    const nextSections = formData.sections.map((s, sIdx) => {
      if (sIdx === sectionIndex) {
        return {
          ...s,
          lectures: s.lectures.filter((_, lIdx) => lIdx !== lectureIndex)
        };
      }
      return s;
    });
    setFormData({ ...formData, sections: nextSections });
  };

  const resolveVideoUrl = (url) => {
    if (!url) return '';
    const sUrl = String(url).trim();
    if (sUrl.startsWith('http')) return sUrl;
    if (sUrl.startsWith('//')) return `https:${sUrl}`;
    
    // If it's a local upload path from backend
    if (sUrl.startsWith('uploads/') || sUrl.startsWith('/uploads/')) {
      const base = api.defaults.baseURL ? api.defaults.baseURL.replace('/api', '') : 'http://localhost:5000';
      const normalized = sUrl.startsWith('/') ? sUrl : `/${sUrl}`;
      return `${base}${normalized}`;
    }
    
    // Fallback for domains without protocol (like www.youtube.com)
    if (sUrl.includes('.') && !sUrl.includes(' ')) {
      return `https://${sUrl}`;
    }
    
    return sUrl;
  };
   

  const handleVideoUpload = async (file, sIndex, lIndex) => {
    if (!file) return;
    const toastId = toast.loading('Uploading video matrix...');
    try {
      const uploadData = new FormData();
      uploadData.append('video', file);
      const { data } = await api.post('/upload/video', uploadData);
      
      const nextSections = formData.sections.map((s, si) => {
        if (si === sIndex) {
          const nextLectures = s.lectures.map((l, li) => {
            if (li === lIndex) return { ...l, videoUrl: data.url };
            return l;
          });
          return { ...s, lectures: nextLectures };
        }
        return s;
      });
      setFormData({ ...formData, sections: nextSections });
      toast.success('Uplink complete!', { id: toastId });
    } catch (err) {
      toast.error('Uplink failed: ' + (err.response?.data?.error || 'Server connection interrupted'), { id: toastId });
    }
  };

  const handlePdfUpload = async (file, sIndex, lIndex) => {
    if (!file) return;
    const toastId = toast.loading('Syncing document to cloud...');
    try {
      const uploadData = new FormData();
      uploadData.append('pdf', file);
      const { data } = await api.post('/upload/pdf', uploadData);
      
      const nextSections = formData.sections.map((s, si) => {
        if (si === sIndex) {
          const nextLectures = s.lectures.map((l, li) => {
            if (li === lIndex) return { ...l, pdfUrl: data.url };
            return l;
          });
          return { ...s, lectures: nextLectures };
        }
        return s;
      });
      setFormData({ ...formData, sections: nextSections });
      toast.success('Document uploaded!', { id: toastId });
    } catch (err) {
      toast.error('Sync failed: ' + (err.response?.data?.error || 'Server error'), { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/courses/create', formData);

      // If quiz is enabled, create the quiz too
      if (hasQuiz && data.course._id) {
        await api.post('/quiz/create', {
          courseId: data.course._id,
          difficulty: quizData.difficulty,
          questions: quizData.questions
        });
      }

      toast.success('Course and Assessment published to EdStack!');
      navigate('/instructor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Publishing failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuizQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]
    });
  };

  const handleRemoveQuizQuestion = (index) => {
    const newQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: newQuestions });
  };
  const handleAddOutcome = () => setFormData({ ...formData, outcomes: [...formData.outcomes, ''] });
  const handleRemoveOutcome = (idx) => setFormData({ ...formData, outcomes: formData.outcomes.filter((_, i) => i !== idx) });
  const handleOutcomeChange = (idx, val) => {
    const nextOutcomes = [...formData.outcomes];
    nextOutcomes[idx] = val;
    setFormData({ ...formData, outcomes: nextOutcomes });
  };

  return (
    <div className="studio-container">
      {/* Studio Header */}
      <header className="studio-header max-width">
        <div className="header-left">
          <button onClick={() => navigate('/instructor/dashboard')} className="back-btn-studio">
            <ArrowLeft size={18} />
          </button>
          <div className="title-stack">
            <div className="studio-chip"><Sparkles size={12} /> New Project</div>
            <h1 className="studio-main-title">Course Architect</h1>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-secondary-outline">Preview Mode</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary studio-publish-btn shadow-primary">
            {loading ? 'Processing...' : <><UploadCloud size={18} /> Final Publish</>}
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="studio-workspace-grid max-width">
        <div className="studio-main-col">
          {/* Step 1: Base Architecture */}
          <section className="glass-panel studio-card">
            <div className="card-header-bar">
              <div className="icon-box-small"><Type size={18} /></div>
              <h3>General Information</h3>
            </div>

            <div className="form-content-inner">
              <div className="form-row">
                <label>Course Master Title</label>
                <input
                  type="text"
                  required
                  className="studio-input title-field"
                  placeholder="e.g. Advanced Quantum Computing for Developers"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <label>Curriculum Abstract</label>
                <textarea
                  required
                  rows="5"
                  className="studio-input"
                  placeholder="Describe the learning objectives and impact of this course..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-double-row">
                <div className="form-row">
                  <label>Domain Category</label>
                  <select
                    className="studio-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Development</option>
                    <option>Artificial Intelligence</option>
                    <option>Business Strategy</option>
                    <option>UI/UX Design</option>
                    <option>Cloud Computing</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Market Price ($)</label>
                  <div className="input-with-symbol">
                    <span className="symbol">$</span>
                    <input
                      type="number"
                      className="studio-input"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-double-row">
                <div className="form-row">
                  <label><Award size={12} /> Target Difficulty</label>
                  <select
                    className="studio-input"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>All Levels</option>
                  </select>
                </div>
                
                <div className="form-row">
                  <label><Clock size={12} /> Course Highlights (Duration)</label>
                  <input
                    type="text"
                    required
                    className="studio-input"
                    placeholder="e.g. 15+ Hours HD Video"
                    value={formData.totalDuration}
                    onChange={(e) => setFormData({ ...formData, totalDuration: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Content Modules */}
          <section className="studio-curriculum-builder">
            <div className="section-head flex-between">
              <div className="flex items-center gap-3">
                <div className="icon-box-small"><MonitorPlay size={18} /></div>
                <h3 className="section-title-large">Curriculum Builder</h3>
              </div>
              <button type="button" onClick={handleAddSection} className="btn-add-module">
                <Plus size={16} /> New Module
              </button>
            </div>

            <div className="module-stack">
              <AnimatePresence>
                {formData.sections.map((section, sIndex) => (
                  <motion.div
                    key={sIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel module-card"
                  >
                    <div className="module-header">
                      <div className="module-index">#{sIndex + 1}</div>
                      <input
                        type="text"
                        required
                        className="module-title-input"
                        placeholder="Module Title (e.g. Technical Foundation)"
                        value={section.title}
                        onChange={(e) => {
                          const newSections = [...formData.sections];
                          newSections[sIndex].title = e.target.value;
                          setFormData({ ...formData, sections: newSections });
                        }}
                      />
                      <button type="button" onClick={() => handleRemoveSection(sIndex)} className="btn-icon-danger">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="lecture-stack">
                      {section.lectures.map((lecture, lIndex) => (
                        <div key={lIndex} className="lecture-input-row">
                          <div className="lecture-drag-handle">::</div>
                          <div className="lecture-inputs">
                            <div className="lec-top-row">
                              <input
                                type="text"
                                placeholder="Lecture Title"
                                className="lec-field flex-1"
                                value={lecture.title}
                                onChange={(e) => {
                                  const nextSections = formData.sections.map((s, sIdx) => {
                                    if (sIdx === sIndex) {
                                      const nextLectures = s.lectures.map((l, lIdx) => {
                                        if (lIdx === lIndex) return { ...l, title: e.target.value };
                                        return l;
                                      });
                                      return { ...s, lectures: nextLectures };
                                    }
                                    return s;
                                  });
                                  setFormData({ ...formData, sections: nextSections });
                                }}
                              />
                              <input
                                type="text"
                                placeholder="Duration"
                                className="lec-field w-24"
                                value={lecture.duration}
                                onChange={(e) => {
                                  const nextSections = formData.sections.map((s, sIdx) => {
                                    if (sIdx === sIndex) {
                                      const nextLectures = s.lectures.map((l, lIdx) => {
                                        if (lIdx === lIndex) return { ...l, duration: e.target.value };
                                        return l;
                                      });
                                      return { ...s, lectures: nextLectures };
                                    }
                                    return s;
                                  });
                                  setFormData({ ...formData, sections: nextSections });
                                }}
                              />
                              <button type="button" onClick={() => handleRemoveLecture(sIndex, lIndex)} className="lec-remove-btn">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="lec-media-row mt-2 flex gap-2">
                              <input
                                type="text"
                                placeholder="Content Provider URL (mp4, youtube, etc)"
                                className="lec-field flex-1"
                                style={{ margin: 0 }}
                                value={lecture.videoUrl}
                                onChange={(e) => {
                                  const nextSections = formData.sections.map((s, si) => {
                                    if (si === sIndex) {
                                      const nextLectures = s.lectures.map((l, li) => {
                                        if (li === lIndex) return { ...l, videoUrl: e.target.value };
                                        return l;
                                      });
                                      return { ...s, lectures: nextLectures };
                                    }
                                    return s;
                                  });
                                  setFormData({ ...formData, sections: nextSections });
                                }}
                              />
                              <div className="lec-upload-wrap flex gap-2">
                                 <label className="lec-upload-btn">
                                    <ShieldCheck size={16} /> <span>Video</span>
                                    <input 
                                      type="file" 
                                      accept="video/*" 
                                      className="hidden" 
                                      onChange={(e) => handleVideoUpload(e.target.files[0], sIndex, lIndex)} 
                                    />
                                 </label>
                                 <label className="lec-upload-btn" style={{ borderColor: lecture.pdfUrl ? 'var(--primary)' : 'var(--glass-border)' }}>
                                    <Download size={16} color={lecture.pdfUrl ? 'var(--primary)' : 'currentColor'} /> 
                                    <span style={{ color: lecture.pdfUrl ? 'var(--primary)' : 'inherit' }}>{lecture.pdfUrl ? 'PDF Ready' : 'Add PDF'}</span>
                                    <input 
                                      type="file" 
                                      accept=".pdf" 
                                      className="hidden" 
                                      onChange={(e) => handlePdfUpload(e.target.files[0], sIndex, lIndex)} 
                                    />
                                 </label>
                              </div>
                            </div>
                            {lecture.videoUrl && (
                              <div className="lec-preview-mini mt-2" style={{ height: '140px', borderRadius: '12px', overflow: 'hidden' }}>
                                <ReactPlayer 
                                  url={resolveVideoUrl(lecture.videoUrl)} 
                                  controls 
                                  width="100%"
                                  height="100%"
                                />
                              </div>
                            )}
                            <textarea
                              placeholder="Lesson Brief (Optional)"
                              rows="2"
                              className="lec-field full-width mt-2"
                              value={lecture.description || ''}
                              onChange={(e) => {
                                const nextSections = formData.sections.map((s, sIdx) => {
                                  if (sIdx === sIndex) {
                                    const nextLectures = s.lectures.map((l, lIdx) => {
                                      if (lIdx === lIndex) return { ...l, description: e.target.value };
                                      return l;
                                    });
                                    return { ...s, lectures: nextLectures };
                                  }
                                  return s;
                                });
                                setFormData({ ...formData, sections: nextSections });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => handleAddLecture(sIndex)} className="btn-add-lecture">
                        <Plus size={14} /> Append Lesson
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

            {/* Step 3: Outcomes Studio */}
            <section className="glass-panel studio-card mt-10">
               <div className="section-head flex-between">
                  <div className="flex items-center gap-3">
                    <div className="icon-box-small"><Award size={18} /></div>
                    <h3 className="section-title-large">Outcomes Architect</h3>
                  </div>
                  <button type="button" onClick={handleAddOutcome} className="btn-add-module">
                     <Plus size={16} /> New Outcome
                  </button>
               </div>
               
               <div className="form-content-inner">
                  {formData.outcomes.map((outcome, idx) => (
                    <div key={idx} className="lecture-input-row">
                       <input 
                         type="text" 
                         required
                         className="studio-input full-width"
                         placeholder="e.g. Master React Hooks and Context API"
                         value={outcome}
                         onChange={(e) => handleOutcomeChange(idx, e.target.value)}
                       />
                       <button type="button" onClick={() => handleRemoveOutcome(idx)} className="btn-icon-danger ml-2">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  ))}
                  {formData.outcomes.length === 0 && (
                    <p className="text-muted text-center py-6 text-sm">Add at least one learning outcome for your students.</p>
                  )}
               </div>
            </section>

            {/* Step 4: Quiz Architecture */}
          <section className="studio-quiz-builder">
            <div className="section-head flex-between">
              <div className="flex items-center gap-3">
                <div className="icon-box-small"><Shield size={18} /></div>
                <h3 className="section-title-large">Assessment Architecture</h3>
              </div>
              <div className="quiz-toggle-box">
                <span className="quiz-toggle-label">{hasQuiz ? 'Assessment Enabled' : 'Include Assessment'}</span>
                <button
                  type="button"
                  onClick={() => setHasQuiz(!hasQuiz)}
                  className={`quiz-toggle-btn ${hasQuiz ? 'on' : 'off'}`}
                >
                  <div className="toggle-dot" />
                </button>
              </div>
            </div>

            {hasQuiz && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="quiz-workspace-inner mt-4"
              >
                <div className="glass-panel quiz-config-card mb-6">
                  <div className="form-row">
                    <label>Difficulty Intelligence</label>
                    <select
                      className="studio-input"
                      value={quizData.difficulty}
                      onChange={(e) => setQuizData({ ...quizData, difficulty: e.target.value })}
                    >
                      <option>Easy</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="question-stack">
                  {quizData.questions.map((q, qIndex) => (
                    <motion.div
                      key={qIndex}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-panel question-card-studio"
                    >
                      <div className="q-card-header">
                        <div className="q-count">{qIndex + 1}</div>
                        <input
                          type="text"
                          required
                          className="q-title-input"
                          placeholder="Enter your question here..."
                          value={q.question}
                          onChange={(e) => {
                            const nextQ = [...quizData.questions];
                            nextQ[qIndex].question = e.target.value;
                            setQuizData({ ...quizData, questions: nextQ });
                          }}
                        />
                        <button type="button" onClick={() => handleRemoveQuizQuestion(qIndex)} className="btn-icon-danger">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="options-entry-grid">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="option-entry-row">
                            <div className={`correct-indicator ${q.correctAnswer === opt && opt !== '' ? 'active' : ''}`}
                              onClick={() => {
                                const nextQ = [...quizData.questions];
                                nextQ[qIndex].correctAnswer = opt;
                                setQuizData({ ...quizData, questions: nextQ });
                              }}>
                              <Sparkles size={12} />
                            </div>
                            <input
                              type="text"
                              required
                              placeholder={`Option ${oIndex + 1}`}
                              className="option-field"
                              value={opt}
                              onChange={(e) => {
                                const nextQ = [...quizData.questions];
                                nextQ[qIndex].options[oIndex] = e.target.value;
                                setQuizData({ ...quizData, questions: nextQ });
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="q-footer-info">
                        <span className="footer-hint">Click the sparkles to mark an option as the <strong>Correct Answer</strong>.</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button type="button" onClick={handleAddQuizQuestion} className="btn-add-module w-full mt-4 flex items-center justify-center gap-2">
                  <Plus size={16} /> Append New Question
                </button>
              </motion.div>
            )}
          </section>
        </div>

        {/* Sidebar Controls */}
        <aside className="studio-sidebar">
          <div className="glass-panel sidebar-card">
            <h4 className="sidebar-subtitle"><ImageIcon size={14} /> Visual Identity</h4>
            <div className="thumbnail-studio-box">
              <img src={formData.thumbnail} alt="preview" />
              <div className="thumb-uploader">
                <UploadCloud size={20} />
                <span>Upload Thumbnail</span>
              </div>
            </div>
            <div className="form-row mt-4">
              <label>External Image Link</label>
              <input
                type="text"
                className="studio-input"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              />
            </div>
          </div>

          <div className="glass-panel sidebar-card studio-actions">
            <h4 className="sidebar-subtitle"><Settings size={14} /> Project Initialization</h4>
            <div className="workflow-status">
              <div className="status-item"><div className="dot active pulse" /> Market Fit Analysis</div>
              <div className="status-item"><div className="dot active" /> Infrastructure Ready</div>
              <div className="status-item"><div className="dot active" /> SEO Metadata Validated</div>
              <div className="status-item"><div className="dot" /> Cloud CDN Propagation</div>
              <div className="status-item"><div className="dot" /> Asset Finalization</div>
            </div>
            
            <div className="readiness-meter mt-4 mb-6">
               <div className="flex-between mb-2">
                  <span className="text-xs font-bold uppercase text-muted">Project Readiness</span>
                  <span className="text-xs font-bold text-primary">72%</span>
               </div>
               <div className="meter-track">
                  <div className="meter-fill" style={{ width: '72%' }} />
               </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary full-width bigger shadow-primary"
            >
              {loading ? 'Finalizing...' : <><Save size={18} /> Publish Project</>}
            </button>
            <button type="button" className="btn-secondary-outline full-width bigger mt-3">
              Archive Draft
            </button>
          </div>
        </aside>
      </form>

      <style dangerouslySetInnerHTML={{
        __html: `
        .studio-container { min-height: 100vh; background: var(--bg); padding-bottom: 4rem; padding-top: 0; }
        
        .studio-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 1rem 0; 
          margin-bottom: 2rem; 
          position: sticky; 
          top: 0; 
          z-index: 1000; 
          background: var(--surface); 
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--glass-border);
        }
        .header-left { display: flex; align-items: center; gap: 1.5rem; }
        .back-btn-studio { width: 3rem; height: 3rem; border-radius: 1rem; background: var(--alternate); border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: var(--transition); }
        .back-btn-studio:hover { background: var(--primary); color: white; }
        .card-header-bar h3 { font-size: 1.5rem; font-family: 'Outfit'; color: var(--text-title); }
        .icon-box-small { width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; background: var(--primary-glow); display: flex; align-items: center; justify-content: center; color: var(--primary); }

        .form-content-inner { display: flex; flex-direction: column; gap: 2.5rem; }
        .form-row { display: flex; flex-direction: column; gap: 1rem; }
        .form-row label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em; }
        .studio-input { background: var(--alternate); border: 1px solid var(--glass-border); border-radius: 1.25rem; padding: 1.25rem; color: var(--text-main); transition: var(--transition); font-size: 1rem; }
        .studio-input:focus { border-color: var(--primary); outline: none; background: white; box-shadow: var(--shadow-lg); }
        .title-field { font-size: 1.5rem; font-weight: 800; font-family: 'Outfit'; color: var(--text-title); }
        
        .form-double-row { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        .input-with-symbol { position: relative; }
        .input-with-symbol .symbol { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-weight: 800; }
        .input-with-symbol .studio-input { padding-left: 2.5rem; }

        .section-title-large { font-size: 1.5rem; font-family: 'Outfit'; color: var(--text-title); }
        .btn-add-module { padding: 0.75rem 1.5rem; border-radius: 1rem; background: var(--primary-glow); color: var(--primary); font-weight: 800; font-size: 0.85rem; border: 1px solid var(--glass-border); transition: var(--transition); }
        .btn-add-module:hover { background: var(--primary); color: white; }

        .module-stack { display: flex; flex-direction: column; gap: 2rem; margin-top: 3rem; }
        .module-card { padding: 2.5rem; border-radius: 2rem; background: var(--card-bg); border: 1px solid var(--glass-border); }
        .module-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem; }
        .module-index { width: 3rem; height: 3rem; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; }
        .module-title-input { flex: 1; background: transparent; border: none; font-size: 1.5rem; font-family: 'Outfit'; font-weight: 800; color: var(--text-title); outline: none; }
        .module-title-input::placeholder { color: var(--text-muted); opacity: 0.3; }
        .btn-icon-danger { width: 3rem; height: 3rem; border-radius: 1rem; display: flex; align-items: center; justify-content: center; background: rgba(239, 68, 68, 0.05); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.1); }
        
        .lecture-stack { padding-left: 4.5rem; border-left: 2px solid var(--glass-border); display: flex; flex-direction: column; gap: 1rem; }
        .lecture-input-row { display: flex; gap: 1.5rem; align-items: flex-start; }
        .lecture-drag-handle { margin-top: 1rem; color: var(--text-muted); opacity: 0.3; font-weight: 800; cursor: grab; }
        .lecture-inputs { flex: 1; background: var(--alternate); padding: 1.5rem; border-radius: 1.5rem; border: 1px solid var(--glass-border); }
        .lec-top-row { display: flex; gap: 1rem; }
        .lec-field { background: var(--bg); border: 1px solid var(--glass-border); padding: 0.75rem 1.25rem; border-radius: 1rem; color: var(--text-main); outline: none; font-size: 0.9rem; }
        .lec-field:focus { border-color: var(--primary); background: white; }
        .lec-remove-btn { color: var(--text-muted); opacity: 0.5; transition: var(--transition); }
        .lec-remove-btn:hover { color: #ef4444; opacity: 1; }
        
        .lec-upload-btn { 
          display: flex; 
          align-items: center; 
          gap: 0.75rem; 
          background: var(--primary); 
          border: none;
          padding: 0.75rem 1.25rem; 
          border-radius: 1rem; 
          color: white; 
          font-size: 0.85rem; 
          font-weight: 800; 
          cursor: pointer; 
          transition: var(--transition);
          white-space: nowrap;
        }
        .lec-upload-btn:hover { filter: brightness(1.1); }
        .hidden { display: none; }

        .btn-add-lecture { margin-top: 1rem; font-size: 0.85rem; font-weight: 800; color: var(--primary); display: flex; align-items: center; gap: 0.5rem; transition: var(--transition); }
        .btn-add-lecture:hover { opacity: 0.7; }

        .studio-sidebar { position: sticky; top: 6rem; display: flex; flex-direction: column; gap: 2rem; height: fit-content; }
        .sidebar-card { padding: 2rem; border-radius: 2rem; background: var(--card-bg); border: 1px solid var(--glass-border); box-shadow: var(--shadow-glass); }
        .sidebar-subtitle { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; }
        
        .thumbnail-studio-box { position: relative; border-radius: 1.5rem; overflow: hidden; border: 1px solid var(--glass-border); aspect-ratio: 16/10; background: var(--alternate); }
        .thumbnail-studio-box img { width: 100%; height: 100%; object-fit: cover; }
        .thumb-uploader { position: absolute; inset: 0; background: rgba(255,255,255,0.8); color: var(--primary); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; opacity: 0; transition: var(--transition); cursor: pointer; }
        .thumbnail-studio-box:hover .thumb-uploader { opacity: 1; }
        .thumb-uploader span { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }

        .workflow-status { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
        .status-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--glass-border); }
        .dot.active { background: #10b981; box-shadow: 0 0 10px #10b981; }

        .full-width { width: 100%; }
        .bigger { padding-top: 1.25rem; padding-bottom: 1.25rem; font-size: 1rem; border-radius: 1.5rem; font-weight: 800; }
        .mt-3 { margin-top: 1rem; }

        @media (max-width: 1200px) {
          .studio-workspace-grid { grid-template-columns: 1fr; gap: 1rem; }
          .studio-sidebar { position: static; order: -1; }
        }

        @media (max-width: 768px) {
          .studio-header { padding: 0.75rem 0; flex-direction: column; align-items: flex-start; gap: 1rem; }
          .studio-main-title { font-size: 1rem; }
          .studio-card { padding: 1rem !important; border-radius: 1rem; margin-bottom: 1rem; }
          .form-double-row { grid-template-columns: 1fr; gap: 1rem; }
          
          .studio-input { padding: 0.75rem 1rem; font-size: 0.85rem; border-radius: 0.75rem; }
          .title-field { font-size: 1rem; }
          
          .module-stack { margin-top: 1rem; gap: 0.75rem; }
          .module-card { padding: 0.75rem; border-radius: 1rem; }
          .module-header { gap: 0.5rem; margin-bottom: 1rem; }
          .module-index { width: 1.75rem; height: 1.75rem; font-size: 0.75rem; }
          .module-title-input { font-size: 1rem; }
          
          .lecture-stack { padding-left: 0.75rem; gap: 0.75rem; }
          .lecture-inputs { padding: 0.75rem; border-radius: 0.75rem; }
          .lec-top-row { flex-direction: column; align-items: stretch; gap: 0.75rem; }
          .lec-field.w-24 { width: 100% !important; }
          .lecture-inputs { padding: 1rem; }
          
          .options-entry-grid { grid-template-columns: 1fr; gap: 0.5rem; }
          .question-card-studio { padding: 1rem; border-radius: 1rem; }
          .q-title-input { font-size: 0.95rem; }
          .q-count { width: 1.75rem; height: 1.75rem; font-size: 0.65rem; }
          
          .full-width.bigger { padding: 0.75rem; font-size: 0.9rem; border-radius: 0.85rem; }
          
          .sidebar-subtitle p, .form-hint, .studio-quiz-builder p { display: none; }
          .studio-quiz-builder { margin-top: 2rem; }
          
          .dot.pulse { animation: dotPulse 2s infinite; }
          @keyframes dotPulse { 0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(99, 102, 241, 0); } 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); } }
          
          .meter-track { height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
          .meter-fill { height: 100%; background: var(--primary); border-radius: 10px; box-shadow: 0 0 10px var(--primary); }
        }

        .quiz-toggle-box { display: flex; align-items: center; gap: 1rem; }
        .quiz-toggle-label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; }
        .quiz-toggle-btn { width: 3.5rem; height: 1.75rem; border-radius: 99px; position: relative; transition: var(--transition); border: 1px solid rgba(255,255,255,0.1); }
        .quiz-toggle-btn.on { background: var(--primary); }
        .quiz-toggle-btn.off { background: rgba(255,255,255,0.05); }
        .toggle-dot { position: absolute; top: 3px; left: 3px; width: 1.25rem; height: 1.25rem; border-radius: 50%; background: white; transition: var(--transition); }
        .on .toggle-dot { transform: translateX(1.75rem); }
        
        .studio-quiz-builder { margin-top: 4rem; }
        .quiz-config-card { padding: 2rem; border-radius: 1.5rem; border: 1px solid rgba(255,255,255,0.05); }
        
        .question-stack { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem; }
        .question-card-studio { padding: 2rem; border-radius: 2rem; border: 1px solid rgba(255,255,255,0.05); }
        .q-card-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
        .q-count { background: rgba(255,255,255,0.05); width: 2.25rem; height: 2.25rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem; color: var(--primary); border: 1px solid var(--primary); }
        .q-title-input { flex: 1; background: transparent; border: none; font-size: 1.25rem; font-weight: 700; color: white; outline: none; }
        .q-title-input::placeholder { color: rgba(255,255,255,0.1); }
        
        .options-entry-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .option-entry-row { display: flex; align-items: center; gap: 1rem; background: rgba(0,0,0,0.2); border-radius: 1rem; padding: 0.5rem 1rem; border: 1px solid rgba(255,255,255,0.03); }
        .option-field { background: transparent; border: none; flex: 1; padding: 0.5rem 0; color: white; font-size: 0.9rem; outline: none; }
        .correct-indicator { width: 1.5rem; height: 1.5rem; border-radius: 0.5rem; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(255,255,255,0.1); transition: var(--transition); border: 1px solid rgba(255,255,255,0.05); }
        .correct-indicator.active { background: #facc15; color: #854d0e; box-shadow: 0 0 15px #facc15; border-color: #facc15; }
        .q-footer-info { margin-top: 1.5rem; font-size: 0.7rem; color: var(--text-muted); }
        .q-footer-info strong { color: #facc15; }

        @media (max-width: 768px) {
           .options-entry-grid { grid-template-columns: 1fr; }
        }
      ` }} />
    </div>
  );
};

export default CreateCourse;
