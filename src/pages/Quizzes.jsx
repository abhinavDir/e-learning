import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import {
  Globe,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Quizzes.css';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await api.get('/quiz/global');
        setQuizzes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="neural-loader">
        <div className="loader-icon"><Globe size={48} /></div>
        <span className="loader-text">Synchronizing Neural Maps...</span>
      </div>
    );
  }

  return (
    <div className="quizzes-container">
      <header className="quizzes-hero">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-badge"
        >
          <Globe size={14} /> <span>Universal Intelligence Hub</span>
        </motion.div>
        <h1 className="hero-title-giant">Global Skill Architect</h1>
        <p className="hero-subtitle-refined">
          Challenge your cognitive boundaries with expert-authored assessments across all strategic domains.
        </p>
      </header>

      <section className="quizzes-grid-section">
        <div className="search-and-filter">
          <div className="search-box-premium">
            <Globe className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search 1,000+ Neural Maps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-tabs">
            {['All', 'Technical', 'Non-Technical'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-controls">
          <div className="section-intro">
            <h2 className="section-title-premium">Active Neural Nodes</h2>
            <p className="quizzes-count">Benchmarks verified for {quizzes.length} open-source skill maps.</p>
          </div>
          <div className="filter-pill">
            <Sparkles size={16} /> <span>{searchTerm ? `Searching: ${searchTerm}` : 'Intelligent Sorting Active'}</span>
          </div>
        </div>

        <div className="quizzes-masonry">
          {quizzes
            .filter(q => {
              const matchesSearch = q.topic.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesCategory = activeCategory === 'All' || q.category === activeCategory;
              return matchesSearch && matchesCategory;
            })
            .slice(0, 50) // Showing only top 50 for performance, users can search for more
            .map((quiz, i) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="global-quiz-card-full"
              >
                <div className="card-accent-line" />
                <div className="card-body-main">
                  <div className="quiz-meta-row">
                    <div className="difficulty-tag-poured">{quiz.difficulty}</div>
                    <div className="unit-tag">
                      <Layers size={14} /> <span>{quiz.questions.length} Units</span>
                    </div>
                  </div>

                  <h3 className="quiz-title-prominent">{quiz.topic} Masterclass</h3>
                  <p className="quiz-desc-minor">
                    A comprehensive intelligence sequence designed for benchmarking high-level proficiency in this domain.
                  </p>

                  <div className="quiz-footer-meta">
                    <div className="expert-signature">
                      <div className="signature-dot" />
                      <span>Expert Assessment</span>
                    </div>
                    <Link to={`/quiz/${quiz._id}?mode=global`} className="btn-primary-glow">
                      Commence <Zap size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}

          {quizzes.length === 0 && (
            <div className="empty-state-quizzes">
              <div className="empty-icon-shell"><ShieldCheck size={64} /></div>
              <h3>No neural maps published yet</h3>
              <p>The skill ecosystem is being initialized by our senior instructors.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Quizzes;
