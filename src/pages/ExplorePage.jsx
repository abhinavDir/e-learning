import React, { useState, useEffect } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { Search, BookOpen, Star, PlayCircle, Clock, AlertCircle } from 'lucide-react'
import './ExplorePage.css'

const ExplorePage = () => {
  const [availableTopics, setAvailableTopics] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get('/api/topics');
        setAvailableTopics(res.data);
      } catch (err) {
        console.error('Fetch topics error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim() || searchLoading) return;
    setSearchLoading(true);
    try {
      const res = await api.get(`/api/topics/search?q=${query}`);
      navigate(`/topic/${res.data._id}`);
    } catch (err) {
      console.error('Explore search error:', err);
      alert(err.response?.data?.error || 'Topic not available. Please try another topic.');
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) return <div className="loading-state flex-center"><h1>Syncing Academy Data...</h1></div>;

  return (
    <div className="explore-container animate-fade">
      <div className="explore-header sticky-header">
        <h1>Explore Academy</h1>
        <p>Expertly curated engineering curriculum. Select a topic to begin your journey.</p>
        
        <div className="explore-search-bar flex-center glass-panel">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search within 2000+ available topics..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(search)}
          />
          <button 
            className="btn btn-primary ai-search-btn" 
            onClick={() => handleSearch(search)}
            disabled={searchLoading}
          >
            {searchLoading ? 'LOCATING...' : 'ACCESS'}
          </button>
        </div>
      </div>

      {availableTopics.length === 0 ? (
        <div className="no-topics flex-center flex-col mt-5">
          <AlertCircle size={48} color="var(--warning)" />
          <h2 className="mt-1">No Topics Available Yet</h2>
          <p>Please check back later as we expand our local curriculum.</p>
        </div>
      ) : (
        <div className="topics-grid">
          {availableTopics.map((topic, i) => (
            <div key={i} className="topic-card glass-panel animate-fade" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="topic-card-img">
                <img src={`https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=400&sig=${i}`} alt={topic.title} />
                <div className={`level-tag level-${topic.level.toLowerCase()}`}>{topic.level}</div>
              </div>
              <div className="topic-card-content">
                <div className="flex-between">
                    <span className="category-text">{topic.category}</span>
                </div>
                <h3>{topic.title}</h3>
                <p className="topic-desc-short">{topic.description?.substring(0, 80)}...</p>
                
                <div className="topic-meta flex-between mt-1">
                  <span className="flex-center"><BookOpen size={14} /> Full Module</span>
                  <span className="flex-center"><Star size={14} /> Advanced</span>
                </div>

                <button 
                  className={`btn btn-outline start-learning-btn ${searchLoading ? 'loading' : ''}`} 
                  onClick={() => handleSearch(topic.title)}
                  disabled={searchLoading}
                >
                  <PlayCircle size={18} /> {searchLoading ? 'Accessing...' : 'Start Learning'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
