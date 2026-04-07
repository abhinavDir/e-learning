import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Trophy,
  ArrowRight,
  Plus,
  LayoutDashboard,
  BrainCircuit,
  User,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Recommendations from '../components/Recommendations';
import Chatbot from '../components/Chatbot';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [enrolled, setEnrolled] = useState([]);
  const [assignedQuizzes, setAssignedQuizzes] = useState([]);
  const [globalQuizzes, setGlobalQuizzes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'instructor') {
      navigate('/instructor/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [activeView, setActiveView] = useState('courses');

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const { data } = await api.get('/enroll/my-courses');
        setEnrolled(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAssignedQuizzes = async () => {
      try {
        const { data } = await api.get('/quiz/assigned');
        setAssignedQuizzes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMyProfile = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setActivities(Array.isArray(data.activities) ? data.activities : []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchGlobalQuizzes = async () => {
      try {
        const { data } = await api.get('/quiz/global');
        setGlobalQuizzes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchMyCourses(), fetchAssignedQuizzes(), fetchGlobalQuizzes(), fetchMyProfile()]);
      setLoading(false);
    };

    initData();
  }, []);

  if (loading) return <div className="h-screen flex-center animate-pulse text-2xl font-bold font-outfit uppercase tracking-widest text-primary">Loading Student Hub...</div>;

  const stats = [
    { id: 'courses', icon: <BookOpen color="#3b82f6" />, label: "Enrolled", val: enrolled.length },
    { id: 'assigned', icon: <TrendingUp color="#8b5cf6" />, label: "Assigned", val: assignedQuizzes.length },
    { id: 'global', icon: <BrainCircuit color="#f59e0b" />, label: "Global", val: globalQuizzes.length },
    { id: 'completed', icon: <CheckCircle color="#22c55e" />, label: "History", val: activities.length }
  ];

  return (
    <div className="max-width page-padding dashboard-portal">
      <div className="dashboard-header">
        <div className="header-info">
          <div className="badge-wrapper">
            <LayoutDashboard size={14} /> <span>Neural Hub</span>
          </div>
          <h1 className="title-huge">Welcome Back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-muted">Explore your current mission parameters and cognitive growth.</p>
        </div>
      </div>

      {/* Analytic Toggle Hub */}
      <div className="stats-grid grid-4">
        {stats.map((stat) => (
          <button
            key={stat.id}
            onClick={() => setActiveView(stat.id)}
            className={`card stat-card-btn ${activeView === stat.id ? 'active-stat' : ''}`}
          >
            <div className="stat-icon-bg">
              {stat.icon}
            </div>
            <div className="stat-meta">
              <div className="stat-label-tag">{stat.label}</div>
              <div className="stat-value-text">{stat.val}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mission-content-portal mt-12">
        <AnimatePresence mode="wait">
          {activeView === 'courses' && (
            <motion.section
              key="courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="section-container"
            >
              <h2 className="section-heading">My Active Curriculums</h2>
              {enrolled.length > 0 ? (
                <div className="grid-3">
                  {(enrolled || []).map((item, i) => (
                    <div key={item._id} className="card enrolled-card group">
                      <div className="card-thumb-area">
                        <img src={item.course.thumbnail} alt={item.course.title} />
                        <div className="hover-play-overlay">
                          <Link to={`/learn/${item.course._id}`} className="play-button-central">
                            <PlayCircle size={48} fill="white" />
                          </Link>
                        </div>
                      </div>
                      <div className="card-details">
                        <h3 className="course-card-title">{item.course.title}</h3>
                        <div className="progress-section">
                          <div className="progress-meta">Progress: {Math.round(item.progress)}%</div>
                          <div className="progress-track-bg">
                            <div className="progress-bar-fill" style={{ width: `${item.progress}%` }} />
                          </div>
                        </div>
                        <Link to={`/learn/${item.course._id}`} className="btn-secondary-full">Continue Mission</Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-portal-state">No courses initialized yet. Visit the catalog to start.</div>
              )}
            </motion.section>
          )}

          {activeView === 'assigned' && (
            <motion.section
              key="assigned"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="section-container"
            >
              <h2 className="section-heading">Assigned Verifications</h2>
              <div className="grid-3">
                {(assignedQuizzes || []).map((quiz) => (
                  <div key={quiz._id} className="card assignment-card-compact">
                    <div className="difficulty-pill">{quiz.quizId?.difficulty}</div>
                    <h3 className="mission-topic">{quiz.quizId?.topic || 'Curriculum Check'}</h3>
                    <Link to={`/quiz/${quiz._id}?mode=assignment`} className="btn-primary-small">Start Probe</Link>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {activeView === 'global' && (
            <motion.section
              key="global"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="section-container"
            >
              <h2 className="section-heading">Global Missions</h2>
              <div className="grid-3">
                {(globalQuizzes || []).map((quiz) => (
                  <div key={quiz._id} className="card global-mission-box">
                    <h3 className="mission-topic">{quiz.topic} Masterclass</h3>
                    <Link to={`/quiz/${quiz._id}?mode=global`} className="btn-secondary-full">Launch Protocol</Link>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {activeView === 'completed' && (
            <motion.section
              key="completed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="section-container"
            >
              <h2 className="section-heading">Intelligence History & Certificates</h2>
              {activities.length > 0 ? (
                <div className="activity-stack">
                  {(activities || []).slice().reverse().map((activity, i) => (
                    <div key={i} className="activity-row-modern glass-panel">
                      <div className="row-info">
                        <div className="row-icon-box"><Trophy size={16} /></div>
                        <div>
                          <h4 className="row-title">{activity.title}</h4>
                          <span className="row-date">{new Date(activity.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="proficiency-actions">
                        {activity.metadata?.score !== undefined && (
                          <div className="proficiency-badge">{activity.metadata.percent}% Mastery</div>
                        )}
                        <button className="btn-certificate-view" onClick={() => toast('Certificate Generation Syncing...')}>
                          View Certificate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-portal-state">No certificates generated yet. Complete a mission to unlock.</div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <Chatbot />

      <style dangerouslySetInnerHTML={{
        __html: `
        .dashboard-portal { min-height: 100vh; position: relative; }
        .dashboard-header { margin-bottom: 4rem; }
        .badge-wrapper { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); padding: 0.4rem 0.85rem; border-radius: 999px; color: var(--primary); font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 1.5rem; }
        .title-huge { font-size: clamp(2.5rem, 6vw, 4rem); font-family: 'Outfit'; font-weight: 900; letter-spacing: -0.04em; margin-bottom: 0.5rem; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 4rem; }
        .stat-card-btn { display: flex; align-items: center; gap: 1.5rem; padding: 2rem; border-radius: 2rem; background: var(--surface); border: 1px solid var(--glass-border); text-align: left; transition: 0.4s cubic-bezier(0.23, 1, 0.32, 1); cursor: pointer; color: var(--text-main); }
        .stat-card-btn:hover { border-color: var(--primary); transform: translateY(-5px); background: var(--alternate); }
        .active-stat { border-color: var(--primary); background: var(--alternate); box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.2); }
        
        .stat-icon-bg { width: 50px; height: 50px; border-radius: 1rem; background: var(--alternate); display: flex; align-items: center; justify-content: center; transform: scale(1.1); }
        .stat-label-tag { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.25rem; }
        .stat-value-text { font-size: 1.75rem; font-weight: 900; font-family: 'Outfit'; }
        
        .section-heading { font-size: 2.25rem; font-weight: 900; font-family: 'Outfit'; margin-bottom: 3rem; letter-spacing: -0.02em; }
        
        .enrolled-card { overflow: hidden; background: var(--surface); border-radius: 2.25rem; border: 1px solid var(--glass-border); transition: 0.4s; }
        .enrolled-card:hover { transform: translateY(-10px); border-color: var(--primary); }
        .card-thumb-area { height: 200px; position: relative; overflow: hidden; }
        .card-thumb-area img { width: 100%; height: 100%; object-fit: cover; }
        
        .hover-play-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); opacity: 0; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .enrolled-card:hover .hover-play-overlay { opacity: 1; }
        
        .card-details { padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .course-card-title { font-size: 1.25rem; font-weight: 800; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.8em; }
        
        .progress-section { margin-top: 0.5rem; }
        .progress-meta { font-size: 0.75rem; font-weight: 800; color: var(--primary); text-transform: uppercase; margin-bottom: 0.5rem; }
        .progress-track-bg { height: 8px; background: var(--alternate); border-radius: 1rem; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: var(--primary); box-shadow: 0 0 15px var(--primary); border-radius: 1rem; }
        
        .assignment-card-compact, .global-mission-box { padding: 3rem; border-radius: 2.5rem; background: var(--surface); border: 1px solid var(--glass-border); display: flex; flex-direction: column; gap: 1.5rem; transition: 0.4s; }
        .assignment-card-compact:hover, .global-mission-box:hover { transform: translateY(-8px); border-color: var(--primary); background: var(--alternate); }
        .mission-topic { font-size: 1.75rem; font-weight: 900; font-family: 'Outfit'; letter-spacing: -0.01em; }
        .difficulty-pill { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; color: var(--primary); background: rgba(99, 102, 241, 0.1); padding: 0.35rem 0.85rem; border-radius: 99px; width: fit-content; }

        .activity-stack { display: flex; flex-direction: column; gap: 0.85rem; }
        .activity-row-modern { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2.5rem; border-radius: 1.75rem; background: var(--surface); border: 1px solid var(--glass-border); transition: 0.3s; }
        .activity-row-modern:hover { background: var(--alternate); border-color: var(--primary); }
        .row-info { display: flex; align-items: center; gap: 1.5rem; }
        .row-icon-box { color: var(--primary); width: 44px; height: 44px; border-radius: 1rem; background: var(--alternate); display: flex; align-items: center; justify-content: center; }
        .row-title { font-size: 1.15rem; font-weight: 800; font-family: 'Outfit'; margin-bottom: 0.25rem; }
        .row-date { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
        .proficiency-badge { background: var(--primary); color: white; padding: 0.6rem 1.25rem; border-radius: 1rem; font-size: 0.85rem; font-weight: 900; }
        
        .proficiency-actions { display: flex; align-items: center; gap: 1.5rem; }
        .btn-certificate-view { background: var(--alternate); border: 1px solid var(--glass-border); padding: 0.6rem 1.25rem; border-radius: 1rem; color: var(--text-main); font-size: 0.8rem; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .btn-certificate-view:hover { border-color: var(--primary); transform: translateY(-3px); }

        .empty-portal-state { text-align: center; padding: 6rem; background: var(--surface); border-radius: 2.5rem; border: 2px dashed var(--glass-border); color: var(--text-muted); font-weight: 700; font-size: 1.25rem; }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .grid-3 { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
          .grid-3 { grid-template-columns: 1fr; }
          .stat-card-btn { padding: 1.5rem; }
          .title-huge { font-size: 2rem; }
          .row-modern { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .proficiency-badge { align-self: flex-end; }
        }
      ` }} />
    </div>
  );
};

export default Dashboard;
