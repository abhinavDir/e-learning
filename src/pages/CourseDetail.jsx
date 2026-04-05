import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  CheckCircle,
  Clock,
  Globe,
  Award,
  ChevronRight,
  Check,
  ShoppingCart,
  User,
  Star,
  BookMarked,
  ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useSelector(state => state.auth);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);

        if (user) {
          const enrollResp = await api.get('/enroll/my-courses');
          const enrolled = enrollResp.data.some(e => e.course._id === id);
          setIsEnrolled(enrolled);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll!');
      return navigate('/login');
    }

    try {
      await api.post('/enroll/enroll', { courseId: id });
      toast.success('Successfully enrolled!');
      setIsEnrolled(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Enrollment failed');
    }
  };

  if (loading) return <div className="h-screen flex-center animate-pulse text-2xl font-bold font-outfit text-primary uppercase tracking-[0.2em]">Crafting Course Experience...</div>;
  if (!course) return <div className="h-screen flex-center text-red-500 font-bold">Error: Course not discovered!</div>;

  return (
    <div className="course-detail-page">
      {/* Dynamic Header */}
      <section className="detail-hero-section">
        <div className="hero-glow-layer" />
        <div className="max-width detail-hero-grid">

          <div className="content-left">
            <div className="category-badge-main">{course.category}</div>
            <h1 className="course-main-title">{course.title}</h1>
            <p className="course-tagline">{course.description}</p>

            <div className="horizontal-stats-bar">
              <div className="h-stat">
                <Star size={18} fill="#eab308" color="#eab308" />
                <span>4.9 Ratings</span>
              </div>
              <div className="h-stat">
                <User size={18} />
                <span>{course.enrolledStudentsCount || 0} Enrolled</span>
              </div>
              <div className="h-stat">
                <Award size={18} />
                <span>{course.level || 'Beginner'}</span>
              </div>
              <div className="h-stat">
                <Clock size={18} />
                <span>Last updated {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="instructor-profile">
              <img src={course.instructor?.avatar} className="instr-img" />
              <div>
                <div className="instr-tag">Created by</div>
                <div className="instr-name">{course.instructor?.name} Master</div>
              </div>
            </div>
          </div>

          {/* Right Enrollment Sidebar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel enrollment-sidebar"
          >
            <div className="card-media-box group" onClick={() => toast('Preview video coming soon!')}>
              <img src={course.thumbnail} alt={course.title} />
              <div className="preview-overlay">
                <PlayCircle size={64} color="white" />
                <span>Preview Course</span>
              </div>
            </div>

            <div className="pricing-info">
              <div className="current-price">${course.price === 0 ? '0' : course.price}</div>
              <div className="original-price">$99.99</div>
              <div className="discount-chip">80% OFF</div>
            </div>

            {isEnrolled ? (
              <Link to={`/learn/${course._id}`} className="btn-primary full-width bigger">
                <PlayCircle size={20} /> Continue Learning
              </Link>
            ) : user?.role === 'instructor' ? (
              <button disabled className="btn-secondary full-width bigger disabled-state">
                <ShieldAlert size={20} /> Instructor Account
              </button>
            ) : (
              <button onClick={handleEnroll} className="btn-primary full-width bigger shadow-primary">
                <ShoppingCart size={20} /> Enroll Now
              </button>
            )}

            <div className="features-list">
              <h4 className="feature-title-minor">Includes:</h4>
              <div className="f-item"><PlayCircle size={16} /> {course.totalDuration || '10+ Hours HD Video'}</div>
              <div className="f-item"><BookMarked size={16} /> {course.sections?.reduce((acc, s) => acc + (s.lectures?.length || 0), 0)} Lectures</div>
              <div className="f-item"><Award size={16} /> Certificate Of Achievement</div>
              <div className="f-item"><Globe size={16} /> Lifetime Access</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curriculum & Details */}
      <section className="max-width curriculum-section">
        <div className="curriculum-grid">
          <div className="grid-main-col">
            <h2 className="area-title-large">
              <BookMarked size={32} color="#6366f1" /> What you'll learn
            </h2>
            <div className="outcomes-card glass-panel">
              {(course.outcomes && course.outcomes.length > 0) ? course.outcomes.map((item, i) => (
                <div key={i} className="outcome-item">
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
                    <Check size={18} color="#22c55e" />
                  </motion.div>
                  <span>{item}</span>
                </div>
              )) : (
                <p className="text-muted col-span-2 text-center py-6">The instructor hasn't specified specific outcomes for this curriculum yet.</p>
              )}
            </div>

            <div className="curriculum-body">
              <h2 className="area-title-large mt-10">Course Content</h2>
              <div className="curriculum-accordion">
                {(course.sections || []).map((section, idx) => (
                  <div key={idx} className="accordion-item glass-panel">
                    <div className="acc-header flex-between">
                      <div className="acc-left">
                        <span className="acc-idx">{idx + 1}</span>
                        <span className="acc-title">{section.title}</span>
                      </div>
                      <span className="acc-count">{section.lectures?.length || 0} Lectures</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        .course-detail-page { min-height: 100vh; background: var(--bg); transition: background 0.5s ease; }
        .detail-hero-section { position: relative; padding: 10rem 0 6rem; border-bottom: 1px solid var(--glass-border); overflow: hidden; }
        .hero-glow-layer { position: absolute; inset: 0; background: radial-gradient(circle at 10% 10%, var(--primary-glow) 0%, transparent 60%); pointer-events: none; }
        
        .detail-hero-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 6rem; align-items: flex-start; }
        
        .category-badge-main { background: var(--primary-glow); border: 1px solid var(--glass-border); padding: 0.5rem 1.25rem; border-radius: 999px; color: var(--primary); font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; width: fit-content; margin-bottom: 2rem; }
        .course-main-title { font-size: clamp(2.5rem, 6vw, 4rem); line-height: 1.05; margin-bottom: 1.5rem; font-family: 'Outfit'; font-weight: 900; letter-spacing: -0.04em; color: var(--text-main); }
        .course-tagline { font-size: clamp(1rem, 2vw, 1.25rem); color: var(--text-muted); line-height: 1.7; margin-bottom: 3.5rem; max-width: 650px; font-weight: 500; }
        
        .horizontal-stats-bar { display: flex; flex-wrap: wrap; gap: 2rem; padding: 1.5rem 0; border-top: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); margin-bottom: 3.5rem; }
        .h-stat { display: flex; align-items: center; gap: 0.75rem; font-weight: 800; font-size: 0.85rem; color: var(--text-main); }
        
        .instructor-profile { display: flex; align-items: center; gap: 1.25rem; background: var(--alternate); padding: 1.25rem; border-radius: 1.5rem; width: fit-content; border: 1px solid var(--glass-border); }
        .instr-img { width: 3.5rem; height: 3.5rem; border-radius: 50%; border: 2px solid var(--primary); }
        .instr-tag { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; margin-bottom: 0.25rem; }
        .instr-name { font-size: 1.1rem; font-weight: 800; color: var(--text-main); }

        .enrollment-sidebar { position: sticky; top: 10rem; padding: 2.5rem; border-radius: 2.5rem; background: var(--surface); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); box-shadow: var(--shadow-lg); transition: transform 0.4s; }
        .card-media-box { position: relative; border-radius: 1.75rem; overflow: hidden; height: 220px; margin-bottom: 2.5rem; border: 1px solid var(--glass-border); cursor: pointer; }
        .card-media-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
        .card-media-box:hover img { transform: scale(1.1); }
        .preview-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; opacity: 0; transition: 0.3s; color: white; }
        .card-media-box:hover .preview-overlay { opacity: 1; }
        .preview-overlay span { font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; }

        .pricing-info { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2.5rem; }
        .current-price { font-size: 2.75rem; font-weight: 900; font-family: 'Outfit'; color: var(--text-main); }
        .original-price { font-size: 1.25rem; color: var(--text-muted); text-decoration: line-through; opacity: 0.5; }
        .discount-chip { background: rgba(34, 197, 94, 0.15); color: #22c55e; padding: 0.4rem 0.85rem; border-radius: 0.75rem; font-weight: 900; font-size: 0.75rem; margin-left: auto; border: 1px solid rgba(34, 197, 94, 0.2); }

        .full-width { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
        .bigger { padding: 1.25rem; font-size: 1.1rem; }
        .shadow-primary { box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.5); }

        .features-list { margin-top: 3rem; display: flex; flex-direction: column; gap: 1rem; }
        .feature-title-minor { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 900; margin-bottom: 0.5rem; }
        .f-item { display: flex; align-items: center; gap: 1rem; font-size: 0.9rem; font-weight: 700; color: var(--text-main); }
        .f-item svg { color: var(--primary); }

        .curriculum-section { padding: 8rem 0; }
        .area-title-large { font-size: 2.5rem; font-weight: 900; margin-bottom: 3.5rem; display: flex; align-items: center; gap: 1.25rem; font-family: 'Outfit'; color: var(--text-main); }
        .outcomes-card { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; padding: 3.5rem; margin-bottom: 6rem; border-radius: 2.5rem; background: var(--alternate); border: 1px solid var(--glass-border); }
        .outcome-item { display: flex; gap: 1rem; font-size: 1rem; font-weight: 600; color: var(--text-main); }
        
        .curriculum-accordion { display: flex; flex-direction: column; gap: 1rem; }
        .accordion-item { padding: 2rem 2.5rem; border-radius: 1.75rem; background: var(--surface); border: 1px solid var(--glass-border); transition: 0.3s; }
        .accordion-item:hover { transform: translateX(10px); border-color: var(--primary); }
        .acc-header { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .acc-left { display: flex; align-items: center; }
        .acc-idx { background: var(--bg); width: 2.75rem; height: 2.75rem; display: inline-flex; align-items: center; justify-content: center; border-radius: 1rem; font-weight: 900; margin-right: 1.5rem; color: var(--primary); border: 1px solid var(--glass-border); }
        .acc-title { font-size: 1.25rem; font-weight: 800; color: var(--text-main); font-family: 'Outfit'; }
        .acc-count { font-size: 0.7rem; color: var(--primary); background: var(--primary-glow); padding: 0.5rem 1rem; border-radius: 0.75rem; font-weight: 900; text-transform: uppercase; }

        @media (max-width: 1100px) {
          .detail-hero-grid { grid-template-columns: 1fr; gap: 4rem; }
          .enrollment-sidebar { position: static; width: 100%; }
          .course-main-title { font-size: 3rem; }
        }

        @media (max-width: 768px) {
          .detail-hero-section { padding-top: 6rem; }
          .horizontal-stats-bar { gap: 1.5rem; padding: 1rem 0; }
          .h-stat { font-size: 0.75rem; }
          .outcomes-card { grid-template-columns: 1fr; padding: 2rem; }
          .accordion-item { padding: 1.5rem; }
          .acc-title { font-size: 1.1rem; }
          .acc-idx { width: 2.25rem; height: 2.25rem; margin-right: 1rem; }
          .area-title-large { font-size: 1.75rem; }
        }

        @media (max-width: 480px) {
          .course-main-title { font-size: 2.25rem; }
          .instructor-profile { width: 100%; }
          .horizontal-stats-bar { justify-content: center; }
          .enrollment-sidebar { padding: 1.5rem; }
          .card-media-box { height: 180px; }
          .pricing-info { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
          .discount-chip { margin-left: 0; }
        }
      ` }} />
    </div>
  );
};

export default CourseDetail;
