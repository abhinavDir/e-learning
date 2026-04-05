import React, { useState } from 'react'
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import './Topbar.css'

const Topbar = ({ theme, toggleTheme, user, toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      try {
        const res = await api.get(`/api/topics/search?q=${searchQuery}`);
        navigate(`/topic/${res.data._id}`);
      } catch (err) {
        console.error('Search error:', err);
      }
    }
  };

  return (
    <header className="topbar glass-panel flex-between">
      <div className="topbar-left flex-center">
        <button className="menu-toggle btn-icon mobile-only" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="search-container flex">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search engineering topics..." 
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
    </div>

      <div className="topbar-actions flex">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="notifications-btn">
          <Bell size={20} />
          <span className="badge"></span>
        </div>

        <div className="user-profile flex" onClick={() => navigate('/profile')}>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-rank">Pro Learner</span>
          </div>
          <img src={user?.avatar} alt="Profile" className="user-avatar" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
