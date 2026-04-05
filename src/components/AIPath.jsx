import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Map, Target, CheckCircle2, Loader2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import './AIPath.css';

const AIPath = () => {
  const [goal, setGoal] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchCurrentRoadmap();
  }, []);

  const fetchCurrentRoadmap = async () => {
    try {
      const { data } = await api.get('/ai/path/me');
      setRoadmap(data);
    } catch (err) {
      console.log("No active roadmap found");
    } finally {
      setFetching(false);
    }
  };

  const generatePath = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return toast.error("Please enter a learning goal");

    setLoading(true);
    try {
      const { data } = await api.post('/ai/path', { goal });
      setRoadmap(data);
      toast.success("AI Learning Path Generated!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex-center p-10"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="ai-path-container">
      {!roadmap ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="aipath-init-wrapper"
        >
          <div className="aipath-init-panel">
            {/* Corner Decorative Orbs inside strictly */}
            <div className="aipath-orb-tr"></div>
            <div className="aipath-orb-bl"></div>

            <div style={{ position: 'relative', zIndex: 10 }}>
              <div className="aipath-sparkle-box">
                <Sparkles size={32} color="var(--primary)" />
              </div>
              
              <h3 className="aipath-title">
                Initialize Your <br className="hid-mobile" /> AI Learning Path
              </h3>
              <p className="aipath-desc">
                Tell us what you want to achieve, and our hyper-advanced neural engine will architect a personalized <strong>4-week roadmap</strong> just for you.
              </p>

              <form onSubmit={generatePath} className="aipath-form">
                <div className="aipath-input-group">
                  <div className="aipath-input-wrapper">
                    <Target size={20} color="var(--primary)" style={{ marginRight: '0.75rem', opacity: 0.6 }} />
                    <input
                      type="text"
                      placeholder="e.g. Master React and Node.js for Fullstack Dev"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      disabled={loading}
                      className="aipath-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary aipath-submit-btn"
                  >
                    {loading ? (
                      <><Loader2 className="animate-spin" size={24} color="#fff" /> Processing...</>
                    ) : (
                      <><Target size={24} color="#fff" /> Architect Path</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="aipath-workspace">
          <div className="aipath-header">
            <div className="aipath-header-glow" />
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div className="aipath-mission-badge">
                <div className="aipath-ping-dot">
                  <span className="aipath-ping-ring"></span>
                  <span className="aipath-ping-core"></span>
                </div>
                <Map size={16} /> MISSION CONTROL [ACTIVE]
              </div>
              <h2 className="aipath-target-title">
                Target: <span className="aipath-target-highlight">{roadmap.goal}</span>
              </h2>
            </div>
            <button onClick={() => setRoadmap(null)} className="btn-secondary-outline aipath-rearchitect-btn">
              ⟲ Rearchitect Mission
            </button>
          </div>

          {/* Mission Progress Bar */}
          <div className="glass-panel aipath-progress-portal">
            <div className="aipath-progress-accent"></div>
            <div className="aipath-progress-info">
              <div className="aipath-progress-label">Global Completion</div>
              <div className="aipath-progress-value">25%</div>
            </div>
            <div className="aipath-progress-track">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '25%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="aipath-progress-fill"
              >
              </motion.div>
            </div>
            <div className="aipath-track-status">
              <CheckCircle2 size={16} /> ON TRACK
            </div>
          </div>

          <div className="aipath-timeline-wrapper">
            <div className="aipath-timeline-spine" />

            <div className="aipath-timeline-grid">
              <AnimatePresence>
                {roadmap.curriculum.map((week, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-panel aipath-week-card"
                  >
                    <div className="aipath-week-bridge" />
                    <div className="aipath-week-knot">
                      {week.week}
                    </div>

                    <div className="aipath-week-header">
                      <div className="aipath-week-focus">{week.focus}</div>
                      {idx === 0 && <span className="aipath-badge-glow">Active Week</span>}
                    </div>

                    <div className="aipath-week-bifrost">
                      <div className="aipath-section-core">
                        <div>
                          <div className="aipath-section-label">
                            <BookOpen size={14} color="var(--primary)" /> Integrated Curriculum
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {week.modules?.map((m, mi) => (
                              <div key={mi} className="aipath-module-core">
                                <div className="aipath-module-title">
                                  <div className="aipath-module-dot" />
                                  <span>{m.title}</span>
                                </div>
                                <ul className="aipath-subtopic-list">
                                  {m.subtopics.map((st, sti) => (
                                    <li key={sti} className="aipath-subtopic-item">
                                      <span className="aipath-subtopic-chevron">›</span>
                                      <span className="aipath-subtopic-text">{st}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )) || (
                                <div className="badge-glass" style={{ display: 'inline-block' }}>Generating Core Curriculum...</div>
                              )}
                          </div>
                        </div>

                        <div className="aipath-mission-challenge">
                          <div className="aipath-section-label" style={{ color: 'var(--primary)', opacity: 1, textTransform: 'none' }}>
                            <Target size={14} /> Mission Challenge
                          </div>
                          <p className="aipath-challenge-title">{week.weeklyProject || "Build a comprehensive portfolio application."}</p>
                          <div className="aipath-challenge-footer">
                            <div className="aipath-outcome-tag">
                              <Sparkles size={12} color="#22c55e" /> Outcome: {week.learningOutcome || "Operational Competence"}
                            </div>
                            <CheckCircle2 size={24} color="var(--text-muted)" opacity={0.2} />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="aipath-section-label">
                          <CheckCircle2 size={14} color="#22c55e" /> Mission Log
                        </div>
                        <div className="aipath-mission-log">
                          {week.tasks.map((task, ki) => (
                            <div key={ki} className="glass-panel aipath-task-node">
                              <div className={`aipath-task-check ${ki === 0 ? 'completed' : 'pending'}`} />
                              <span className="aipath-task-name">{task.title}</span>
                              <span className={`aipath-task-diff ${task.difficulty.toLowerCase()}`}>{task.difficulty}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPath;
