import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import {
  PlayCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  MessageSquare,
  ShieldAlert,
  Send,
  Download,
  Clock,
  Trophy,
  Youtube
} from 'lucide-react';
import toast from 'react-hot-toast';

const Learn = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState([0]);
  const [aiChat, setAiChat] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [canFinish, setCanFinish] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mainScrollRef = useRef(null);

  const parseDurationToSeconds = (durationStr) => {
    if (!durationStr) return 30;
    const str = String(durationStr).toLowerCase().trim();
    if (str.includes('hour') || str.includes('hr')) {
      const val = parseFloat(str);
      return isNaN(val) ? 30 : Math.floor(val * 3600);
    }
    if (str.includes('min') || str.includes('m')) {
      const val = parseFloat(str);
      return isNaN(val) ? 30 : Math.floor(val * 60);
    }
    if (str.includes(':')) {
      const parts = str.split(':').map(Number);
      if (parts.length === 2) return (parts[0] * 60) + parts[1];
      if (parts.length === 3) return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    }
    const val = parseInt(str, 10);
    return isNaN(val) ? 30 : val;
  };

  useEffect(() => {
    let timer;
    if (currentLecture && isPlaying && !canFinish) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanFinish(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentLecture, isPlaying, canFinish]);

  const formatTimeDisplay = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    const sUrl = String(url).trim();
    if (sUrl.includes('youtube.com/watch')) {
      const v = new URL(sUrl).searchParams.get('v');
      return `https://www.youtube.com/embed/${v}?autoplay=1&origin=${window.location.origin}`;
    }
    if (sUrl.includes('youtu.be/')) {
      const id = sUrl.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&origin=${window.location.origin}`;
    }
    if (sUrl.includes('youtube.com/live/')) {
      const id = sUrl.split('youtube.com/live/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&origin=${window.location.origin}`;
    }
    return '';
  };

  const resolveVideoUrl = (url) => {
    if (!url) return '';
    const sUrl = String(url).trim();

    // 1. Direct Cloudinary or HTTP/S links
    if (sUrl.startsWith('http')) return sUrl;

    // 2. Protocol-relative links
    if (sUrl.startsWith('//')) return `https:${sUrl}`;

    // 3. Local Cloudinary partials (rare but handled)
    if (sUrl.includes('cloudinary.com')) return `https://${sUrl.replace(/^https?:\/\//, '')}`;

    // 4. Local uploads from backend
    if (sUrl.startsWith('uploads/') || sUrl.startsWith('/uploads/')) {
      const base = api.defaults.baseURL ? api.defaults.baseURL.replace('/api', '') : 'http://localhost:5000';
      const normalized = sUrl.startsWith('/') ? sUrl : `/${sUrl}`;
      return `${base}${normalized}`;
    }

    // 5. Fallback for common domain formats
    if (sUrl.includes('.') && !sUrl.includes(' ')) {
      return `https://${sUrl}`;
    }

    return sUrl;
  };

  const selectLecture = (lecture) => {
    const rawUrl = lecture.videoUrl || '';
    const isYT = rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be');
    const resolvedUrl = isYT ? getEmbedUrl(rawUrl) : resolveVideoUrl(rawUrl);

    setCurrentLecture({ ...lecture, resolvedUrl, isYT });
    setIsCinemaMode(true);
    setCanFinish(false);
    setIsPlaying(isYT); // YouTube starts autoplay in embed
    setTimeLeft(parseDurationToSeconds(lecture.duration));

    setTimeout(() => {
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
        // Do not auto-select lecture so user sees the intro screen first
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiChat([...aiChat, { role: 'user', content: aiInput }]);
    try {
      const { data } = await api.post('/ai/ask', { question: aiInput });
      setAiChat(prev => [...prev, { role: 'ai', content: data.answer }]);
      setAiInput('');
    } catch (err) {
      toast.error('AI is offline for a moment.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleMarkComplete = async (lectureId) => {
    try {
      await api.post('/enroll/update-progress', { courseId: id, lectureId });
      toast.success('Lesson completed!');
    } catch (err) {
      // hide duplicate/minor errors during auto-advance
    }
  };

  const handleAutoAdvance = () => {
    setCanFinish(true);
    setIsPlaying(false);
    setTimeLeft(0);
    handleMarkComplete(currentLecture._id);

    if (!course || !course.sections) return;

    let foundCurrent = false;
    let nextLecture = null;
    let nextSectionIndex = -1;

    for (let sIndex = 0; sIndex < course.sections.length; sIndex++) {
      const section = course.sections[sIndex];
      for (const lecture of section.lectures) {
        if (foundCurrent) {
          nextLecture = lecture;
          nextSectionIndex = sIndex;
          break;
        }
        if (lecture._id === currentLecture._id) {
          foundCurrent = true;
        }
      }
      if (nextLecture) break;
    }

    if (nextLecture) {
      setTimeout(() => {
        toast.success('Auto-advancing to next lesson!', { icon: '🍿' });
        setOpenSections(prev => prev.includes(nextSectionIndex) ? prev : [...prev, nextSectionIndex]);
        selectLecture(nextLecture);
      }, 1000);
    } else {
      toast.success('Module Complete! Great job!');
    }
  };

  if (loading) return <div className="h-screen flex-center animate-pulse text-2xl font-bold font-outfit text-primary tracking-widest">Entering Classroom...</div>;
  if (!course) return <div className="h-screen flex-center text-red-500 font-bold">Classroom Locked: Course not found!</div>;

  return (
    <div className={`classroom-layout ${isCinemaMode ? 'cinema-active' : ''}`}>
      {/* Sidebar - Curriculum */}
      {!isCinemaMode && (
        <aside className="curriculum-sidebar">
          <div className="sidebar-header">
            <Link to="/dashboard" className="back-link">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h2 className="sidebar-title line-clamp-1">{course.title}</h2>
            <div className="progress-mini-bar">
              <motion.div
                className="progress-mini-fill"
                initial={{ width: 0 }}
                animate={{ width: '45%' }}
              />
            </div>
          </div>

          <div className="sidebar-scrollarea">
            {(course.sections || []).map((section, sIndex) => (
              <div key={sIndex} className="section-container">
                <button
                  onClick={() => setOpenSections(prev => prev.includes(sIndex) ? prev.filter(i => i !== sIndex) : [...prev, sIndex])}
                  className="section-toggle"
                >
                  <div className="section-info">
                    <div className="section-tag">Module {sIndex + 1}</div>
                    <div className="section-name">{section.title}</div>
                  </div>
                  {openSections.includes(sIndex) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <AnimatePresence>
                  {openSections.includes(sIndex) && (
                    <motion.div
                      key={`section-${sIndex}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="lecture-list"
                    >
                      {(section.lectures || []).map((lecture, lIndex) => (
                        <button
                          key={lIndex}
                          onClick={() => selectLecture(lecture)}
                          className={`lecture-item ${currentLecture?._id === lecture._id ? 'active' : ''}`}
                        >
                          <PlayCircle size={16} className="play-icon" />
                          <span className="lecture-title-text">{lIndex + 1}. {lecture.title}</span>
                          <span className="lecture-duration-tag">{lecture.duration}s</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <div className="sidebar-footer">
              <Link to={`/quiz/${course._id}`} className="btn-secondary-full quiz-btn">
                <ShieldAlert size={16} /> Take Final Assessment
              </Link>
            </div>
          </div>
        </aside>
      )}

      {/* Main Classroom Area */}
      <main className="classroom-main" ref={mainScrollRef}>
        {isCinemaMode && (
          <div className="cinema-header glass-panel">
            <button
              className={`exit-btn ${!canFinish ? 'locked-btn' : ''}`}
              onClick={() => canFinish ? setIsCinemaMode(false) : toast.error(`Please finish mission first! (${timeLeft}s remaining)`)}
            >
              {canFinish ? <><ArrowLeft size={18} /> Back to Curriculum</> : <><ShieldAlert size={18} /> Mission Locked ({timeLeft}s)</>}
            </button>
            <h4 className="cinema-m-title">{currentLecture?.title}</h4>
          </div>
        )}
        {currentLecture ? (
          <div className="classroom-content max-width">
            {/* Video Player */}
            <div className="video-player-container glass-panel animate-float-slow">
              {currentLecture.isYT ? (
                <iframe
                  src={currentLecture.resolvedUrl}
                  title={currentLecture.title}
                  className="lecture-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <ReactPlayer
                  key={currentLecture.resolvedUrl}
                  url={currentLecture.resolvedUrl}
                  className="react-player-wrapper"
                  width="100%"
                  height="100%"
                  controls={true}
                  playing={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={handleAutoAdvance}
                  onError={(e) => {
                    console.error('❌ Video Load Error:', e);
                    toast.error('Video link might be blocked or private.');
                  }}
                />
              )}
            </div>

            {/* Lesson Info */}
            <div className="lesson-info-bar">
              <div className="info-left">
                <h1 className="lesson-title">{currentLecture.title}</h1>
                <p className="lesson-desc">{currentLecture.description || 'Master the concepts with interactive lessons and AI-assisted doubt solving.'}</p>

                {currentLecture.pdfUrl && (
                  <a
                    href={currentLecture.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary-outline mt-6 flex items-center gap-2"
                    style={{ width: 'fit-content', padding: '0.75rem 1.5rem', borderRadius: '1rem' }}
                  >
                    <Download size={18} /> Download Study Material (PDF)
                  </a>
                )}
              </div>
              <button
                onClick={() => handleMarkComplete(currentLecture._id)}
                disabled={!canFinish}
                className={`btn-primary lesson-complete-btn ${!canFinish ? 'disabled-mission-btn' : 'glow-ready'}`}
              >
                {canFinish ? (
                  <><CheckCircle size={20} /> Mark Finished</>
                ) : (
                  <><Clock size={20} /> Finish in {formatTimeDisplay(timeLeft)}</>
                )}
              </button>
            </div>

            {/* AI Assistant & Resources */}
            <div className="classroom-bottom-grid">
              <div className="ai-tutor-box glass-panel">
                <h3 className="ai-box-title">
                  <BrainCircuit size={20} color="#6366f1" /> AI Classroom Mentor
                </h3>

                <div className="chat-viewport custom-scroll">
                  {aiChat.length === 0 ? (
                    <div className="empty-chat flex-center flex-col">
                      <MessageSquare size={48} className="empty-chat-icon" />
                      <p>Have a doubt? Ask our AI Assistant!</p>
                    </div>
                  ) : (
                    aiChat.map((msg, i) => (
                      <div key={i} className={`chat-bubble-wrapper ${msg.role === 'user' ? 'user-side' : 'ai-side'}`}>
                        <div className="bubble-content">
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {aiLoading && <div className="typing-indicator">AI is thinking...</div>}
                </div>

                <form onSubmit={handleAskAI} className="ai-input-form">
                  <input
                    type="text"
                    placeholder="Type your question..."
                    className="input-field"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                  />
                  <button type="submit" className="ai-send-btn">
                    <Send size={18} />
                  </button>
                </form>
              </div>

              <div className="resources-box">
                <h3 className="section-subtitle">Study Materials</h3>
                <div className="resource-stack">
                  {[
                    { label: 'Lecture Summary.pdf', size: '2.4mb' },
                    { label: 'Code Samples.zip', size: 'Link' },
                    { label: 'Practice Sheet.docx', size: '1.1mb' }
                  ].map((res, i) => (
                    <div key={i} className="resource-item card clickable">
                      <div className="res-info">
                        <div className="res-icon-box"><BookOpen size={16} color="#6366f1" /></div>
                        <span className="res-label">{res.label}</span>
                      </div>
                      <div className="res-download"><Download size={14} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="select-lesson-state flex-center flex-col">
            <div className="large-icon-bg"><PlayCircle size={80} /></div>
            <h2>Start Your Journey</h2>
            <p>Select a lesson from the left menu to begin learning</p>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .classroom-layout { display: flex; height: calc(100vh - 80px); overflow: hidden; background: var(--bg); transition: background 0.5s ease; position: relative; }
        
        .curriculum-sidebar { width: 400px; background: var(--surface); backdrop-filter: blur(20px); border-right: 1px solid var(--glass-border); display: flex; flex-direction: column; z-index: 10; flex-shrink: 0; }
        .sidebar-header { padding: 2.5rem; border-bottom: 1px solid var(--glass-border); }
        .back-link { display: flex; align-items: center; gap: 0.75rem; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800; margin-bottom: 1.5rem; text-decoration: none; transition: 0.3s; }
        .back-link:hover { color: var(--primary); transform: translateX(-5px); }
        .sidebar-title { font-size: 1.25rem; font-weight: 900; font-family: 'Outfit'; color: var(--text-main); line-height: 1.2; }
        .progress-mini-bar { margin-top: 1.5rem; height: 6px; background: var(--alternate); border-radius: 99px; overflow: hidden; }
        .progress-mini-fill { height: 100%; background: var(--primary); border-radius: 99px; box-shadow: 0 0 10px var(--primary-glow); }
 
        .sidebar-scrollarea { flex: 1; overflow-y: auto; padding-bottom: 3rem; }
        .section-container { border-bottom: 1px solid var(--glass-border); }
        .section-toggle { width: 100%; padding: 1.5rem 2.5rem; display: flex; justify-content: space-between; align-items: center; background: transparent; border: none; cursor: pointer; transition: 0.3s; }
        .section-toggle:hover { background: var(--alternate); }
        .section-tag { font-size: 0.65rem; color: var(--primary); font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem; }
        .section-name { font-weight: 800; font-size: 0.95rem; color: var(--text-main); font-family: 'Outfit'; }
        
        .lecture-list { background: var(--alternate); padding: 0.5rem 0; }
        .lecture-item { width: 100%; padding: 1rem 2.5rem; display: flex; align-items: center; gap: 1rem; background: transparent; border: none; cursor: pointer; text-align: left; transition: 0.3s; border-left: 4px solid transparent; }
        .lecture-item:hover { background: var(--surface); color: var(--primary); }
        .lecture-item.active { background: var(--primary-glow); border-left-color: var(--primary); }
        .play-icon { flex-shrink: 0; color: var(--text-muted); transition: 0.3s; }
        .active .play-icon { color: var(--primary); }
        .lecture-title-text { flex: 1; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); transition: 0.3s; }
        .active .lecture-title-text { color: var(--text-main); }
        .lecture-duration-tag { font-size: 0.65rem; color: var(--text-muted); font-weight: 800; opacity: 0.6; }
 
        .sidebar-footer { padding: 2rem 2.5rem; border-top: 1px solid var(--glass-border); }
        .quiz-btn { border: 1px solid rgba(245, 158, 11, 0.3) !important; color: #f59e0b !important; }
        .quiz-btn:hover { background: rgba(245, 158, 11, 0.1) !important; border-color: #f59e0b !important; }
 
        .classroom-main { flex: 1; overflow-y: auto; background: var(--bg); position: relative; scroll-behavior: smooth; }
        .cinema-active .classroom-main { overflow-y: auto; height: 100vh; }
        
        .cinema-header { position: sticky; top: 0; z-index: 100; padding: 1.5rem 3rem; background: var(--alternate); display: flex; align-items: center; gap: 3rem; border-bottom: 1px solid var(--glass-border); border-radius: 0; }
        .exit-btn { display: flex; align-items: center; gap: 0.75rem; background: var(--surface); padding: 0.6rem 1.5rem; border-radius: 1rem; color: var(--text-main); font-weight: 800; font-size: 0.85rem; border: 1px solid var(--glass-border); transition: 0.3s; cursor: pointer; }
        .exit-btn:hover { border-color: var(--primary); transform: translateX(-5px); }
        .locked-btn { opacity: 0.5; cursor: not-allowed; border-color: #f59e0b; color: #f59e0b; }
        .cinema-m-title { font-family: 'Outfit'; font-weight: 900; font-size: 1.15rem; color: var(--primary); letter-spacing: -0.02em; }

        .classroom-content { padding: 4rem 3rem 10rem; transition: 0.5s; }
        .cinema-active .classroom-content { padding: 2rem 2rem 10rem; max-width: 1600px; margin: 0 auto; }
        
        .video-player-container { aspect-ratio: 16/9; background: var(--bg); border-radius: 2.5rem; overflow: hidden; margin-bottom: 4rem; box-shadow: var(--shadow-lg); border: 1px solid var(--glass-border); position: relative; transition: 0.5s; }
        .cinema-active .video-player-container { aspect-ratio: 16/7; border-radius: 1.5rem; }
        .lecture-iframe { width: 100%; height: 100%; border: none; }
        
        .lesson-info-bar { display: flex; justify-content: space-between; align-items: flex-start; gap: 4rem; padding-bottom: 4rem; border-bottom: 1px solid var(--glass-border); }
        .lesson-title { font-size: 2.75rem; font-family: 'Outfit'; font-weight: 900; color: var(--text-main); letter-spacing: -0.03em; }
        .lesson-desc { color: var(--text-muted); font-size: 1.1rem; line-height: 1.7; max-width: 800px; font-weight: 500; }
        .lesson-complete-btn { white-space: nowrap; padding: 1.1rem 2.5rem; border-radius: 1.25rem; display: flex; align-items: center; gap: 0.75rem; transition: 0.4s; }
        .disabled-mission-btn { opacity: 0.5; cursor: not-allowed; background: var(--alternate); border: 1px solid var(--glass-border); color: var(--text-muted); box-shadow: none; filter: grayscale(1); }
        .glow-ready { box-shadow: 0 10px 30px -10px var(--primary-glow); border: 1px solid var(--primary); }
 
        .classroom-bottom-grid { margin-top: 5rem; display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 4rem; }
        .ai-tutor-box { display: flex; flex-direction: column; height: 550px; padding: 2.5rem; border-radius: 2.5rem; background: var(--surface); border: 1px solid var(--glass-border); box-shadow: var(--shadow-glass); }
        .ai-box-title { font-size: 1.25rem; font-weight: 900; display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem; font-family: 'Outfit'; color: var(--text-main); }
        .chat-viewport { flex: 1; overflow-y: auto; padding-right: 1rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .chat-bubble-wrapper { display: flex; width: 100%; }
        .user-side { justify-content: flex-end; }
        .ai-side { justify-content: flex-start; }
        .bubble-content { max-width: 85%; padding: 1.25rem 1.5rem; border-radius: 1.5rem; font-size: 0.95rem; font-weight: 600; line-height: 1.6; }
        .user-side .bubble-content { background: var(--primary); color: #fff; border-bottom-right-radius: 0.35rem; box-shadow: 0 10px 20px -5px var(--primary-glow); }
        .ai-side .bubble-content { background: var(--alternate); color: var(--text-main); border-bottom-left-radius: 0.35rem; border: 1px solid var(--glass-border); }
        .typing-indicator { font-size: 0.75rem; color: var(--primary); font-weight: 900; font-style: italic; margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem; }
        .empty-chat { height: 100%; opacity: 0.4; color: var(--text-muted); font-weight: 700; text-align: center; }
        .empty-chat-icon { margin-bottom: 1.5rem; }
        .ai-input-form { position: relative; }
        .ai-send-btn { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: var(--primary); color: #fff; width: 2.75rem; height: 2.75rem; border-radius: 1rem; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: 0.3s; }
        .ai-send-btn:hover { filter: brightness(1.1); transform: translateY(-50%) scale(1.05); }
        
        .resource-stack { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 2rem; }
        .resource-item { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-radius: 1.5rem; background: var(--surface); border: 1px solid var(--glass-border); transition: 0.3s; cursor: pointer; }
        .resource-item:hover { transform: translateX(10px); border-color: var(--primary); }
        .res-info { display: flex; align-items: center; gap: 1.25rem; }
        .section-subtitle { font-size: 1.25rem; font-weight: 900; font-family: 'Outfit'; color: var(--text-main); }
        .res-icon-box { background: var(--primary-glow); padding: 0.75rem; border-radius: 1rem; display: flex; color: var(--primary); }
        .res-label { font-size: 0.9rem; font-weight: 700; color: var(--text-main); }
        .res-download { opacity: 0.3; color: var(--text-muted); transition: 0.3s; }
        .resource-item:hover .res-download { opacity: 1; color: var(--primary); }
 
        .select-lesson-state { height: 100%; text-align: center; color: var(--text-muted); padding: 10rem 0; }
        .large-icon-bg { margin-bottom: 3rem; opacity: 0.1; }
        .select-lesson-state h2 { font-size: 2.5rem; font-family: 'Outfit'; font-weight: 900; margin-bottom: 1rem; color: var(--text-main); }
        .select-lesson-state p { font-size: 1.25rem; font-weight: 500; }
        
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: var(--glass-border); border-radius: 10px; }
 
        @media (max-width: 1200px) {
          .curriculum-sidebar { width: 320px; }
          .classroom-bottom-grid { gap: 2rem; }
        }
 
        @media (max-width: 1024px) {
          .classroom-layout { flex-direction: column; height: auto; overflow: visible; }
          .curriculum-sidebar { width: 100%; height: auto; border-right: none; border-bottom: 1px solid var(--glass-border); position: relative; top: 0; }
          .sidebar-scrollarea { height: 400px; }
          .classroom-bottom-grid { grid-template-columns: 1fr; }
          .classroom-content { padding: 2.5rem 1.5rem; }
          .lesson-info-bar { flex-direction: column; gap: 2.5rem; }
          .lesson-title { font-size: 2rem; }
          .ai-tutor-box { height: 500px; }
          .video-player-container { border-radius: 1.5rem; margin-bottom: 2.5rem; }
        }
 
        @media (max-width: 640px) {
          .cinema-header { padding: 1rem 1.5rem; flex-direction: column; align-items: stretch; gap: 0.75rem; text-align: center; }
          .exit-btn { width: 100%; justify-content: center; padding: 0.5rem; font-size: 0.75rem; }
          .cinema-m-title { font-size: 1rem; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          
          .classroom-content { padding: 1.5rem 1rem 6rem; }
          .video-player-container { border-radius: 1rem; margin-bottom: 2rem; box-shadow: none; border-width: 0.5px; }
          .lesson-info-bar { padding-bottom: 2rem; margin-bottom: 2rem; }
          .lesson-title { font-size: 1.75rem; line-height: 1.2; margin-bottom: 0.75rem; }
          .lesson-desc { font-size: 0.95rem; line-height: 1.6; }

          .sidebar-header { padding: 1.5rem; }
          .section-toggle { padding: 1rem 1.5rem; }
          .lecture-item { padding: 0.85rem 1.5rem; }
          .ai-tutor-box { padding: 1.5rem; border-radius: 1.75rem; }
          .bubble-content { max-width: 90%; font-size: 0.85rem; }
          .lesson-complete-btn { width: 100%; text-align: center; font-size: 0.9rem; padding: 0.85rem; border-radius: 1rem; }
        }
      ` }} />
    </div>
  );
};

export default Learn;
