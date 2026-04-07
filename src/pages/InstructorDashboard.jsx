import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import {
  Users,
  BarChart,
  ChevronRight,
  Plus,
  BookOpen,
  Settings,
  Edit3,
  Trash2,
  Briefcase,
  Star,
  Activity,
  ArrowUpRight,
  X,
  BrainCircuit,
  LayoutDashboard,
  Layers,
  Zap,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [assignModal, setAssignModal] = useState({ show: false, studentId: null, quizId: null });

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const { data } = await api.get('/courses/instructor/me');
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMyStudents = async () => {
      try {
        const { data } = await api.get('/enroll/students');
        setStudents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMyQuizzes = async () => {
      try {
        const { data } = await api.get('/quiz/instructor/me');
        setQuizzes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMyFeedback = async () => {
      try {
        const { data } = await api.get('/feedback/instructor/me');
        setFeedback(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchMyCourses(), fetchMyStudents(), fetchMyQuizzes(), fetchMyFeedback()]);
      setLoading(false);
    };

    initData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c._id !== id));
      toast.success('Course deleted successfully');
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const handleAssignQuiz = async (e) => {
    e.preventDefault();
    try {
      await api.post('/quiz/assign', {
        userId: assignModal.studentId,
        quizId: assignModal.quizId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default 7 days
      });
      toast.success('Quiz assigned to student');
      setAssignModal({ show: false, studentId: null, quizId: null });
    } catch (err) {
      toast.error('Failed to assign quiz');
    }
  };

  const avgRating = React.useMemo(() => {
    if (!feedback || feedback.length === 0) return 0;
    const sum = feedback.reduce((acc, f) => acc + (f.rating || 0), 0);
    return (sum / feedback.length).toFixed(1);
  }, [feedback]);

  if (loading) return <div className="h-screen flex-center animate-pulse text-2xl font-bold font-outfit text-primary tracking-[0.2em] capitalize">Initializing Studio...</div>;

  return (
    <div className="instructor-workspace">
      {/* Header Section */}
      <section className="workspace-header max-width">
        <div className="header-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="brand-pill"
          >
            <Activity size={14} /> <span>Live Intelligence Dashboard</span>
          </motion.div>
          <h1 className="workspace-title">Professional Studio</h1>
          <p className="workspace-subtitle">Architect your knowledge into world-class educational experiences.</p>
          <div className="header-actions" style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/instructor/create-course" className="btn-primary flex items-center gap-2 p-6 shadow-primary" style={{ padding: '1.25rem 2rem' }}>
              <Plus size={20} /> Initialize Project
            </Link>
            <Link to="/instructor/create-quiz" className="btn-secondary-outline flex items-center gap-2 p-6" style={{ padding: '1.25rem 2rem', background: 'var(--alternate)', border: '1px solid var(--glass-border)' }}>
              <BrainCircuit size={18} /> Initialize Skill Architect
            </Link>
          </div>
        </div>
      </section>

      {/* Analytics Grid */}
      <section className="analytics-overview max-width">
        <div className="analytics-grid">
          {[
            { label: "Active Courses", val: (Array.isArray(courses) ? courses : []).length, icon: <BookOpen size={24} />, color: "#3b82f6" },
            { label: "Global Units", val: (Array.isArray(quizzes) ? quizzes : []).length, icon: <BrainCircuit size={24} />, color: "#8b5cf6" },
            { label: "Total Learners", val: (Array.isArray(courses) ? courses : []).reduce((acc, c) => acc + (c.enrolledStudentsCount || 0), 0), icon: <Users size={24} />, color: "#10b981" },
            { label: "Average Rating", val: avgRating > 0 ? avgRating : "-", icon: <Star size={24} />, color: "#f59e0b" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel stat-card-premium"
            >
              <header className="stat-card-header">
                <div className="stat-icon-outer" style={{ background: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </div>
              </header>

              <div className="stat-details">
                <span className="stat-label-minor">{stat.label}</span>
                <div className="stat-value-major">{stat.val}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Course List Section */}
      <section className="max-width content-management">
        <div className="section-head-bar flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 className="area-title">Studio Hub</h2>
          <div className="control-tabs" style={{ display: 'flex', gap: '1rem', background: 'var(--alternate)', padding: '0.5rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)' }}>
            <button onClick={() => setActiveTab('courses')} className={`tab-item ${activeTab === 'courses' ? 'active' : ''}`}><Layers size={14} /> Courses</button>
            <button onClick={() => setActiveTab('quizzes')} className={`tab-item ${activeTab === 'quizzes' ? 'active' : ''}`}><Zap size={14} /> Assessments</button>
            <button onClick={() => setActiveTab('students')} className={`tab-item ${activeTab === 'students' ? 'active' : ''}`}><Users size={14} /> Students</button>
            <button onClick={() => setActiveTab('feedback')} className={`tab-item ${activeTab === 'feedback' ? 'active' : ''}`}><MessageSquare size={14} /> Feedback</button>
          </div>
        </div>

        {activeTab === 'courses' && (
          (Array.isArray(courses) ? courses : []).length > 0 ? (
            <div className="instructor-course-stack">
              {(Array.isArray(courses) ? courses : []).map((course, i) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="course-management-card glass-panel"
                >
                  <div className="card-thumb-area">
                    <img src={course.thumbnail} alt="" />
                    <div className="category-tag-over">{course.category}</div>
                  </div>

                  <div className="card-main-info">
                    <div className="info-top">
                      <span className="date-stamp">{new Date(course.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="course-mgr-title">{course.title}</h3>
                    <div className="course-mgr-metrics">
                      <div className="metric-item"><Users size={14} /> <span>{course.enrolledStudentsCount || 0} enrolled</span></div>
                      {(() => {
                        const courseFeedbacks = (Array.isArray(feedback) ? feedback : []).filter(f => f.courseId && f.courseId._id === course._id);
                        const rating = courseFeedbacks.length > 0 
                          ? (courseFeedbacks.reduce((a, b) => a + (b.rating || 0), 0) / courseFeedbacks.length).toFixed(1) 
                          : 'No';
                        return (
                          <div className="metric-item"><Star size={14} color="#f59e0b" /> <span>{rating} rating{rating !== 'No' && 's'}</span></div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="card-mgr-actions">
                    <button onClick={() => handleDelete(course._id)} className="action-btn-circle delete" title="Delete Course">
                      <Trash2 size={18} />
                    </button>
                    <Link to={`/instructor/edit-course/${course._id}`} className="mgr-preview-link" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                      <Edit3 size={16} style={{ marginRight: '6px' }} /> Edit Curriculum
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="workspace-empty-state glass-panel">
              <div className="empty-icon-box"><BookOpen size={64} /></div>
              <h2>No courses detected in your studio</h2>
              <p>Your workspace is ready. Start by creating a high-impact course for your global audience.</p>
              <Link to="/instructor/create-course" className="btn-primary btn-cursive">Initialize Project</Link>
            </div>
          )
        )}

        {activeTab === 'quizzes' && (
          <div className="quizzes-management-view">
            {(Array.isArray(quizzes) ? quizzes : []).length > 0 ? (
              <div className="instructor-course-stack">
                {(Array.isArray(quizzes) ? quizzes : []).map((quiz, i) => (
                  <motion.div
                    key={quiz._id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="course-management-card glass-panel assessment-row"
                  >
                    <div className="quiz-type-icon">
                      <BrainCircuit size={32} className="text-primary" />
                    </div>
                    <div className="card-main-info">
                      <span className="date-stamp">{quiz.topic ? 'Standalone Global' : 'Course Linked'}</span>
                      <h3 className="course-mgr-title">{quiz.topic || `${quiz.difficulty} Intelligence`}</h3>
                      <div className="course-mgr-metrics">
                        <div className="metric-item"><Layers size={14} /> <span>{quiz.questions.length} Units</span></div>
                        <div className="metric-item"><Zap size={14} /> <span>{quiz.difficulty} Range</span></div>
                      </div>
                    </div>
                    <div className="card-mgr-actions">
                      <button onClick={() => handleDeleteQuiz(quiz._id)} className="action-btn-circle delete" title="Delete Assessment">
                        <Trash2 size={18} />
                      </button>
                      <Link to={`/instructor/create-quiz?edit=${quiz._id}`} className="mgr-preview-link" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                        <Edit3 size={16} style={{ marginRight: '6px' }} /> Edit Assessment
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="workspace-empty-state glass-panel">
                <div className="empty-icon-box"><Activity size={64} /></div>
                <h2>No assessments authored yet</h2>
                <p>Global skill assessments help students benchmark their progress.</p>
                <Link to="/instructor/create-quiz" className="btn-primary btn-cursive">Initialize Skill Architect</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="students-management-view">
            {(Array.isArray(students) ? students : []).length > 0 ? (
              <div className="students-grid">
                {(Array.isArray(students) ? students : []).map((student, i) => (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="student-card-premium glass-panel"
                  >
                    <div className="student-profile-main">
                      <img src={student.avatar} alt="" className="student-avatar-lg" />
                      <div className="student-info-meta">
                        <h3 className="student-name">{student.name}</h3>
                        <span className="student-email">{student.email}</span>
                      </div>
                    </div>

                    <div className="student-enrollment-badges">
                      {student.courses?.slice(0, 2).map((c, idx) => (
                        <span key={idx} className="enroll-badge">{c}</span>
                      ))}
                      {student.courses?.length > 2 && <span className="enroll-badge">+{student.courses.length - 2} more</span>}
                    </div>

                    <div className="student-card-actions">
                      <button
                        onClick={() => setAssignModal({ show: true, studentId: student._id, quizId: null })}
                        className="btn-primary assign-btn"
                      >
                        <Plus size={16} /> Assign Assessment
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="workspace-empty-state glass-panel">
                <div className="empty-icon-box"><Users size={64} /></div>
                <h2>No students enrolled yet</h2>
                <p>Students will appear here once they enroll in your courses.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="feedback-management-view">
            {(Array.isArray(feedback) ? feedback : []).length > 0 ? (
              <div className="instructor-course-stack">
                {(Array.isArray(feedback) ? feedback : []).map((f, i) => (
                  <motion.div
                    key={f._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="course-management-card glass-panel"
                    style={{ alignItems: 'flex-start' }}
                  >
                    <div className="quiz-type-icon" style={{ width: '60px', height: '60px' }}>
                      <img src={f.userId?.avatar || `https://ui-avatars.com/api/?name=${f.userId?.name}`} alt="" style={{ width: '100%', height: '100%', borderRadius: '1.25rem' }} />
                    </div>
                    <div className="card-main-info">
                      <div className="info-top">
                        <span className="date-stamp">{f.userId?.name} • {new Date(f.createdAt).toLocaleDateString()}</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < f.rating ? "#f59e0b" : "none"} color={i < f.rating ? "#f59e0b" : "#94a3b8"} />
                          ))}
                        </div>
                      </div>
                      <h3 className="course-mgr-title" style={{ fontSize: '1rem', marginTop: '0.25rem' }}>{f.courseId?.title}</h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>"{f.content}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="workspace-empty-state glass-panel">
                <div className="empty-icon-box"><MessageSquare size={64} /></div>
                <h2>Pulse check: No feedback yet</h2>
                <p>Growth parameters are normal. Once students leave reviews, they will appear in this hub.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Quick Assignment Modal */}
      {assignModal.show && (
        <div className="modal-overlay flex-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel modal-content-premium"
          >
            <div className="modal-header">
              <h2>Assign Assessment</h2>
              <button onClick={() => setAssignModal({ show: false, studentId: null, quizId: null })} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAssignQuiz} className="modal-form">
              <div className="form-group">
                <label>Select Course Quiz</label>
                <select
                  required
                  value={assignModal.quizId || ''}
                  onChange={(e) => setAssignModal({ ...assignModal, quizId: e.target.value })}
                  className="form-control"
                >
                  <option value="">Select an assessment...</option>
                  {(Array.isArray(quizzes) ? quizzes : []).map(q => (
                    <option key={q._id} value={q._id}>{q.topic || `${q.difficulty} Assessment`}</option>
                  ))}
                </select>
                <p className="form-hint">Assign an assessment to {assignModal.studentId ? students.find(s => s._id === assignModal.studentId)?.name : 'student'}</p>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setAssignModal({ show: false, studentId: null, quizId: null })} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Confirm Assignment</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .instructor-workspace { min-height: 100vh; background: var(--bg); padding-bottom: 10rem; }
        
        
        .workspace-header { padding: 8rem 0 6rem; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem; position: relative; }
        .workspace-header::after { content: ''; position: absolute; top: 0; left: 0; width: 300px; height: 300px; background: radial-gradient(circle, var(--primary) 0%, transparent 70%); opacity: 0.1; pointer-events: none; }
        
        .brand-pill { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--primary-glow); border: 1px solid var(--glass-border); padding: 0.4rem 1rem; border-radius: 99px; color: var(--primary); font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 auto 2rem; }
        .workspace-title { font-size: 5rem; font-family: 'Pacifico', cursive; line-height: 1.2; margin-bottom: 2rem; color: var(--text-title); font-weight: 400; background: linear-gradient(135deg, var(--primary) 0%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align: center; }
        .workspace-subtitle { font-size: 1.25rem; color: var(--text-muted); max-width: 600px; margin: 0 auto; text-align: center; }
        
        .create-btn-lg { padding: 1.25rem 2.5rem; font-size: 1.1rem; border-radius: 1.5rem; }

        .analytics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 4rem; width: 100%; }
        .stat-card-premium { padding: 2.5rem 2rem; border-radius: 2.5rem; display: flex; flex-direction: column; gap: 2rem; position: relative; overflow: hidden; transition: var(--transition); border: 1px solid var(--glass-border); background: var(--surface) !important; box-shadow: var(--shadow-glass); }
        .stat-card-premium:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: var(--shadow-lg); }
        .stat-card-header { display: flex; justify-content: space-between; align-items: center; }
        .stat-icon-outer { width: 3.5rem; height: 3.5rem; border-radius: 1.25rem; display: flex; align-items: center; justify-content: center; }
        .stat-trend { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; font-weight: 800; background: rgba(16, 185, 129, 0.1); padding: 0.35rem 0.75rem; border-radius: 0.75rem; }
        .stat-label-minor { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-muted); opacity: 0.6; }
        .stat-value-major { font-size: 2.5rem; font-weight: 900; font-family: 'Outfit'; margin-top: 0.5rem; color: var(--text-title); }

        .section-head-bar { margin-bottom: 3rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 2rem; }
        .area-title { font-size: 2rem; font-family: 'Outfit'; color: var(--text-title); }
        .control-tabs { display: flex; background: var(--alternate); padding: 0.4rem; border-radius: 1rem; border: 1px solid var(--glass-border); }
        .tab-item { padding: 0.5rem 1.5rem; border-radius: 0.75rem; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); transition: var(--transition); }
        .tab-item.active { background: var(--primary); color: white; }

        .instructor-course-stack { display: flex; flex-direction: column; gap: 1.5rem; }
        .course-management-card { display: grid; grid-template-columns: 280px 1fr auto; gap: 3rem; padding: 2.5rem; border-radius: 2.5rem; align-items: center; background: var(--surface) !important; border: 1px solid var(--glass-border); transition: var(--transition); box-shadow: var(--shadow-glass); }
        .course-management-card:hover { border-color: var(--primary); transform: translateY(-3px); }
        .assessment-row { grid-template-columns: 100px 1fr auto; }
        .quiz-type-icon { width: 100px; height: 100px; background: var(--primary-glow); border-radius: 2rem; display: flex; align-items: center; justify-content: center; }
        
        .card-thumb-area { position: relative; border-radius: 1.25rem; overflow: hidden; aspect-ratio: 16/9; }
        .card-thumb-area img { width: 100%; height: 100%; object-fit: cover; }
        .category-tag-over { position: absolute; top: 0.75rem; left: 0.75rem; background: var(--primary); padding: 0.35rem 0.75rem; border-radius: 0.5rem; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: white; }
        
        .info-top { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .date-stamp { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .course-mgr-title { font-size: 1.5rem; font-family: 'Outfit'; font-weight: 800; color: var(--text-title); margin-bottom: 1.25rem; line-height: 1.3; }
        .course-mgr-metrics { display: flex; gap: 1.5rem; }
        .metric-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }

        .card-mgr-actions { display: flex; align-items: center; justify-content: flex-end; gap: 1rem; }
        .action-btn-circle { width: 3rem; height: 3rem; border-radius: 1rem; display: flex; align-items: center; justify-content: center; background: var(--alternate); border: 1px solid var(--glass-border); transition: var(--transition); color: var(--text-muted); }
        .action-btn-circle.edit { color: var(--primary); }
        .action-btn-circle.edit:hover { background: var(--primary); color: white; border-color: var(--primary); }
        .action-btn-circle.delete { color: #ef4444; }
        .action-btn-circle.delete:hover { background: #ef4444; color: white; border-color: #ef4444; }
        .mgr-preview-link { font-size: 0.95rem; font-weight: 700; color: var(--text-title); display: flex; align-items: center; gap: 0.5rem; margin-left: 1rem; transition: var(--transition); }
        .mgr-preview-link:hover { color: var(--primary); }

        .workspace-empty-state { padding: 8rem 4rem; text-align: center; border-radius: 3rem; border: 2px dashed var(--glass-border); background: var(--alternate); }
        .empty-icon-box { background: var(--primary-glow); width: 8rem; height: 8rem; border-radius: 2.5rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 3rem; color: var(--primary); }
        .workspace-empty-state h2 { font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-title); }
        .workspace-empty-state p { color: var(--text-muted); font-size: 1.1rem; margin-bottom: 3rem; max-width: 500px; margin-left: auto; margin-right: auto; }

        .students-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
        .student-card-premium { padding: 2rem; border-radius: 2rem; display: flex; flex-direction: column; gap: 1.5rem; background: var(--surface); border: 1px solid var(--glass-border); box-shadow: var(--shadow-glass); }
        .student-profile-main { display: flex; align-items: center; gap: 1.25rem; }
        .student-avatar-lg { width: 3.5rem; height: 3.5rem; border-radius: 1rem; object-fit: cover; border: 2px solid var(--primary); }
        .student-name { font-size: 1.25rem; font-weight: 800; font-family: 'Outfit'; color: var(--text-title); }
        .student-email { font-size: 0.85rem; color: var(--text-muted); }
        
        .student-enrollment-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .enroll-badge { background: var(--alternate); border: 1px solid var(--glass-border); padding: 0.35rem 0.75rem; border-radius: 0.75rem; font-size: 0.7rem; font-weight: 700; color: var(--text-muted); }
        
        .assign-btn { width: 100%; border-radius: 1rem; padding: 0.85rem; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px); z-index: 1000; padding: 2rem; }
        .modal-content-premium { width: 100%; max-width: 500px; padding: 3rem; border-radius: 2.5rem; background: var(--bg); border: 1px solid var(--glass-border); box-shadow: var(--shadow-lg); }
        .modal-header h2 { font-size: 1.75rem; font-family: 'Outfit'; color: var(--text-title); }
        .close-btn { color: var(--text-muted); transition: var(--transition); }
        .close-btn:hover { color: var(--primary); }
        
        .btn-cursive { font-family: 'Outfit'; font-style: italic; font-weight: 800; letter-spacing: 0.05em; padding-left: 2.5rem; padding-right: 2.5rem; }
        
        @media (max-width: 1200px) {
          .analytics-grid { grid-template-columns: 1fr; }
          .stat-card-premium { padding: 2.5rem; }
          
          .workspace-header { padding: 4rem 0 3rem; }
          .brand-pill { font-size: 0.6rem; padding: 0.25rem 0.6rem; margin-bottom: 1rem; }
          .workspace-title { font-size: 2.5rem !important; margin-bottom: 1rem !important; }
          .workspace-subtitle { font-size: 0.9rem; line-height: 1.4; }
          .header-actions { flex-direction: column; width: 100%; gap: 0.75rem !important; margin-top: 1.5rem !important; align-items: center; }
          .header-actions a { width: fit-content !important; padding: 0.5rem 1.5rem !important; font-size: 0.8rem !important; border-radius: 1rem !important; }
          .header-actions a svg { width: 14px; height: 14px; }

          .section-head-bar { flex-direction: column; align-items: flex-start !important; gap: 1.5rem; }
          .control-tabs { width: 100%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.2rem; padding: 0.15rem; background: var(--bg); }
          .tab-item { font-size: 0.55rem; padding: 0.4rem 0rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.2rem; }
          .tab-item svg { width: 9px; height: 9px; }
          
          .course-management-card { grid-template-columns: 1fr; gap: 2rem; padding: 2rem; }
          .card-thumb-area { height: 200px; width: 100%; }
          .card-mgr-actions { width: 100%; justify-content: space-between; gap: 1rem; }
          .mgr-preview-link { margin-left: 0; width: 100%; justify-content: center; }
          
          .workspace-empty-state { padding: 4rem 2rem; }
          .workspace-empty-state .btn-cursive { width: 100%; display: block; }
        }
      ` }} />
    </div>
  );
};

export default InstructorDashboard;
