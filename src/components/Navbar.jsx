import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Menu, X, BookOpen, User, LogOut, ChevronDown, BrainCircuit, Moon, Sun, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="max-width nav-wrapper">
        <div className="nav-left">
          <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
            <div className="logo-icon">
              <BookOpen size={24} color="white" />
            </div>
            <span>EdStack</span>
          </Link>

          <div className="desktop-nav">
            {user?.role === 'instructor' ? (
              <>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/instructor/dashboard" className="nav-link studio-link">Instructor Studio</Link>
                <Link to="/instructor/create-course" className="nav-link">Create Course</Link>
                <Link to="/instructor/create-quiz" className="nav-link">Create Quiz</Link>
              </>
            ) : (
              <>
                <Link to="/courses" className="nav-link">Courses</Link>
                <Link to="/quizzes" className="nav-link flex items-center gap-2">
                  <Zap size={16} className="text-secondary" /> Quiz Hub
                </Link>
                <Link to="/ai-guide" className="btn-primary-mini flex items-center gap-2">
                  <BrainCircuit size={16} /> AI Roadmap
                </Link>
                <Link to="/about" className="nav-link">Features</Link>
              </>
            )}
          </div>
        </div>

        <div className="nav-right">
          <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="desktop-only">
            {user ? (
              <div className="user-dropdown-container">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="user-profile-btn">
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="user-avatar-small" alt="" />
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="dropdown-menu">
                      <Link to={user?.role === 'instructor' ? '/instructor/dashboard' : '/dashboard'} className="dropdown-item" onClick={() => setDropdownOpen(false)}><BrainCircuit size={16} /> Dashboard</Link>
                      <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}><User size={16} /> Profile</Link>
                      <div className="dropdown-divider" />
                      <button onClick={handleLogout} className="dropdown-item logout-btn"><LogOut size={16} /> Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn-primary-small">Join Free</Link>
              </div>
            )}
          </div>

          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mobile-menu">
            <div className="mobile-links">
              {user && (
                <div className="mobile-user-card">
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="" />
                  <div>
                    <div className="m-name">{user.name}</div>
                    <div className="m-role">{user.role}</div>
                  </div>
                </div>
              )}
              {user?.role === 'instructor' ? (
                <>
                  <Link to="/" onClick={() => setIsOpen(false)} className="mobile-link">Home</Link>
                  <Link to="/instructor/dashboard" onClick={() => setIsOpen(false)} className="mobile-link">Instructor Studio</Link>
                  <Link to="/instructor/create-course" onClick={() => setIsOpen(false)} className="mobile-link">Create Course</Link>
                  <Link to="/instructor/create-quiz" onClick={() => setIsOpen(false)} className="mobile-link">Create Quiz</Link>
                </>
              ) : (
                <>
                  <Link to="/courses" onClick={() => setIsOpen(false)} className="mobile-link">Course Catalog</Link>
                  <Link to="/quizzes" onClick={() => setIsOpen(false)} className="mobile-link">
                    <Zap size={18} className="text-secondary" /> Quiz Hub
                  </Link>
                  <Link to="/ai-guide" onClick={() => setIsOpen(false)} className="btn-primary-mini flex items-center gap-2 mt-4 mx-4 justify-center">
                    <BrainCircuit size={18} /> AI Guide
                  </Link>
                  <Link to="/about" onClick={() => setIsOpen(false)} className="mobile-link">About Mission</Link>
                  {user && <Link to={user?.role === 'instructor' ? '/instructor/dashboard' : '/dashboard'} onClick={() => setIsOpen(false)} className="mobile-link">My Dashboard</Link>}
                </>
              )}

              <div className="mobile-divider" />

              {user ? (
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="mobile-link logout-trigger">End Session</button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="mobile-link">Sign In</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="mobile-link btn-join">Join Collective</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        .navbar { position: sticky; top: 0; z-index: 2000; width: 100%; height: 75px; background: var(--surface); backdrop-filter: blur(20px); border-bottom: 1px solid var(--glass-border); display: flex; align-items: center; transition: var(--transition); }
        .nav-wrapper { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .nav-left { display: flex; align-items: center; gap: 4rem; }
        .nav-right { display: flex; align-items: center; gap: 2.5rem; }
        .nav-logo { display: flex; align-items: center; gap: 0.75rem; font-family: 'Outfit'; font-weight: 800; font-size: 1.5rem; color: var(--text-main); }
        .logo-icon { width: 36px; height: 36px; background: var(--primary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
        
        .desktop-nav { display: flex; align-items: center; gap: 3rem; }
        .nav-link { font-size: 0.9rem; font-weight: 700; color: var(--text-muted); transition: 0.3s; }
        .nav-link:hover { color: var(--primary); }

        .theme-toggle-btn { width: 40px; height: 40px; border-radius: 50%; background: var(--alternate); border: 1px solid var(--glass-border); color: var(--text-main); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; }
        .theme-toggle-btn:hover { border-color: var(--primary); transform: scale(1.05); }

        .user-profile-btn { display: flex; align-items: center; gap: 0.75rem; background: var(--alternate); padding: 0.5rem 1.25rem; border-radius: 999px; border: 1px solid var(--glass-border); font-size: 0.85rem; font-weight: 800; color: var(--text-main); }
        .user-avatar-small { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--primary); }
        
        .dropdown-menu { position: absolute; top: calc(100% + 1rem); right: 0; width: 220px; background: var(--surface); border: 1px solid var(--glass-border); border-radius: 1.25rem; padding: 0.5rem; box-shadow: var(--shadow-lg); backdrop-filter: blur(20px); }
        .dropdown-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 0.75rem; color: var(--text-main); font-size: 0.9rem; font-weight: 700; transition: 0.2s; }
        .dropdown-item:hover { background: var(--alternate); color: var(--primary); }
        .dropdown-divider { height: 1px; background: var(--glass-border); margin: 0.5rem 0; }
        .logout-btn { color: var(--accent); width: 100%; text-align: left; }

        .mobile-toggle { display: none; width: 44px; height: 44px; background: var(--alternate); border-radius: 0.75rem; border: 1px solid var(--glass-border); color: var(--text-main); align-items: center; justify-content: center; cursor: pointer; }

        .mobile-menu { position: absolute; top: 100%; left: 0; width: 100%; background: var(--surface); border-bottom: 1px solid var(--glass-border); padding: 2rem; z-index: 1500; height: calc(100vh - 75px); overflow-y: auto; }
        .mobile-links { display: flex; flex-direction: column; gap: 1.25rem; }
        .mobile-link { font-size: 1.1rem; font-weight: 700; color: var(--text-main); text-decoration: none; display: flex; align-items: center; gap: 0.75rem; }
        .mobile-user-card { display: flex; align-items: center; gap: 1rem; background: var(--alternate); padding: 1.25rem; border-radius: 1.25rem; margin-bottom: 1rem; }
        .mobile-user-card img { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--primary); }
        .m-name { font-weight: 800; color: var(--text-main); }
        .m-role { font-size: 0.75rem; color: var(--primary); font-weight: 700; text-transform: uppercase; }
        .mobile-divider { height: 1px; background: var(--glass-border); margin: 0.5rem 0; }
        .btn-join { background: var(--primary); color: white; padding: 1rem; border-radius: 1rem; justify-content: center; }

        @media (max-width: 1024px) {
          .desktop-nav, .desktop-only { display: none; }
          .mobile-toggle { display: flex; }
        }
      ` }} />
    </nav>
  );
};

export default Navbar;
