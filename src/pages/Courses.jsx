import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Clock, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-width page-padding">
      <div className="courses-header">
        <div className="header-info">
          <h1 className="title-large">Explore Our <span>Courses</span></h1>
          <p className="section-desc-stylish">Discover expert-authored curricula designed for deep cognitive mastery and professional growth.</p>
        </div>
        
        <div className="search-box-container">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="input-field search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card skeleton-card" />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid-3">
          {filteredCourses.map((course, i) => (
            <motion.div 
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card course-card"
            >
              <div className="course-thumb-box">
                <img src={course.thumbnail} alt={course.title} />
                <div className="category-tag">{course.category}</div>
              </div>
              
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                
                <div className="course-meta">
                  <div className="meta-item">
                    <BookOpen size={16} color="#6366f1" />
                    <span>{course.sections?.length || 0} Modules</span>
                  </div>
                  <div className="meta-item rating">
                    <Star size={16} fill="#eab308" color="#eab308" />
                    <span>{course.rating || 4.5}</span>
                  </div>
                </div>

                <div className="instructor-minimal">
                  <img src={course.instructor?.avatar} alt="instr" />
                  <span>{course.instructor?.name}</span>
                </div>

                <div className="course-footer">
                  <div className="price-tag">
                    {course.price === 0 ? 'FREE' : `$${course.price}`}
                  </div>
                  <Link to={`/courses/${course._id}`} className="btn-primary-small">
                    Enroll <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
           <Search size={64} color="#334155" />
           <p>No courses found matching your criteria.</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .page-padding { padding: 8rem 1.5rem; }
        .courses-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 5rem; gap: 4rem; position: relative; }
        .courses-header::after { content: ''; position: absolute; top: -2rem; left: 0; width: 150px; height: 150px; background: radial-gradient(circle, var(--primary) 0%, transparent 70%); opacity: 0.1; pointer-events: none; }
        
        .title-large { font-size: clamp(2.5rem, 6vw, 4.5rem); font-family: 'Outfit'; font-weight: 800; line-height: 1; letter-spacing: -0.04em; }
        .title-large span { font-style: italic; font-weight: 400; background: linear-gradient(135deg, var(--primary) 0%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; padding: 0 0.1em; }
        
        .section-desc-stylish { font-size: 1.15rem; color: var(--text-muted); max-width: 500px; line-height: 1.6; letter-spacing: 0.02em; margin-top: 1rem; }
        .search-box-container { position: relative; width: 400px; }
        .search-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
        .search-input { padding-left: 3.5rem !important; }
        
        .course-card { padding: 0; overflow: hidden; }
        .course-thumb-box { position: relative; height: 200px; overflow: hidden; }
        .course-thumb-box img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition); }
        .course-card:hover .course-thumb-box img { transform: scale(1.1); }
        .category-tag { position: absolute; top: 1rem; left: 1rem; background: var(--primary); padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.05em; }
        
        .course-content { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .course-title { font-size: 1.25rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .course-meta { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); }
        .meta-item { display: flex; align-items: center; gap: 0.5rem; }
        .rating { color: #eab308; font-weight: 700; }
        .instructor-minimal { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; }
        .instructor-minimal img { width: 1.75rem; height: 1.75rem; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); }
        
        .course-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .price-tag { font-size: 1.75rem; font-weight: 800; color: var(--primary); font-family: 'Outfit'; }
        .btn-primary-small { background: var(--primary); color: white; padding: 0.5rem 1.25rem; border-radius: 0.75rem; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
        
        .skeleton-card { height: 400px; background: var(--alternate); animation: pulse 1.5s infinite; border-radius: 1.5rem; }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
        
        .empty-state { text-align: center; padding: 6rem; background: var(--alternate); border-radius: 2rem; border: 1px dashed var(--glass-border); margin-top: 2rem; }
        .empty-state p { margin-top: 1.5rem; color: var(--text-muted); font-size: 1.1rem; }

        @media (max-width: 768px) {
          .courses-header { flex-direction: column; align-items: flex-start; }
          .search-box-container { width: 100%; }
        }
      ` }} />
    </div>
  );
};

export default Courses;
