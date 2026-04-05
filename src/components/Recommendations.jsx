import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldAlert, BookOpen, Star, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Recommendations = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const { data } = await api.get('/recommendations/me');
      setCourses(data);
    } catch (err) {
      console.error(err);
      toast.error("Discovery system offline.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-64 glass-panel animate-pulse bg-zinc-900 border-none rounded-3xl"></div>
      ))}
    </div>
  );

  return (
    <section className="recommendations-section py-10">
      <div className="flex-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold mb-2">
            <Sparkles size={16} /> NEURAL SYNERGY
          </div>
          <h2 className="text-3xl font-black tracking-tight">Recommended For You</h2>
          <p className="text-muted mt-2">Optimized curricula based on your progress and identified skill gaps.</p>
        </div>
        <Link to="/courses" className="btn-secondary-outline text-sm flex items-center gap-2">View Catalog <ArrowRight size={14} /></Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {courses.length > 0 ? (
            courses.map((course, idx) => (
              <motion.div 
                key={course._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
                className="course-card-mini rounded-3xl overflow-hidden glass-panel border-none relative group hover-float transition-all cursor-pointer"
                style={{ background: 'var(--surface)', padding: '1.25rem' }}
              >
                <div className="card-thumb aspect-video rounded-2xl overflow-hidden mb-5 relative">
                  <img src={course.thumbnail || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop'} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="badge-primary-blur text-[10px] uppercase font-bold py-1 px-3 rounded-full backdrop-blur-md">AI Sync</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="flex-between text-[11px] font-black uppercase text-primary mb-3 tracking-widest">
                    <span>{course.category}</span>
                    <span className="flex items-center gap-1"><BookOpen size={10} /> {course.sections?.length || 0} Modules</span>
                  </div>
                  <h3 className="text-lg font-bold line-clamp-1 mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">{course.description}</p>
                  
                  <Link to={`/courses/${course._id}`} className="flex-center w-full py-3 bg-zinc-900 border border-white border-opacity-5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all text-sm font-bold">
                    Engage Mission
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full h-40 flex-center text-muted font-bold gap-3">
              <ShieldAlert size={20} /> Starting Analysis... Begin a quiz to identify targets.
            </div>
          )}
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .course-card-mini { background: rgba(255, 255, 255, 0.02); height: 100%; border: 1.5px solid rgba(255, 255, 255, 0.05); }
        .course-card-mini:hover { background: rgba(255, 255, 255, 0.04); border-color: rgba(99, 102, 241, 0.3); }
        .badge-primary-blur { background: rgba(99, 102, 241, 0.4); color: white; border: 1px solid rgba(255, 255, 255, 0.1); }
      `}} />
    </section>
  );
};

export default Recommendations;
