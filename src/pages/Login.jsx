import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(loginSuccess(data));
      toast.success('Welcome back!');
      
      if (data.user.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      dispatch(loginFailure(msg));
      toast.error(msg);
    }
  };

  return (
    <div className="auth-page flex-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel auth-card"
      >
        <div className="auth-header">
           <div className="auth-icon-circle"><LogIn size={24} color="white" /></div>
           <h2 className="title-medium">Welcome Back</h2>
           <p className="subtitle">Enter your credentials to continue your journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label className="field-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                required 
                className="input-field pad-icon" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                required 
                className="input-field pad-icon" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary auth-submit"
          >
            {loading ? 'Authenticating...' : 'Sign In Now'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-link">Sign up for free</Link>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .auth-page { min-height: 90vh; }
        .auth-card { width: 100%; max-width: 480px; padding: 4rem 3rem; border-radius: 3rem; }
        .auth-header { text-align: center; margin-bottom: 3.5rem; }
        .auth-icon-circle { background: var(--primary); width: 3.5rem; height: 3.5rem; border-radius: 1.25rem; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px -5px rgba(99,102,241,0.4); }
        .title-medium { font-size: 2.25rem; margin-bottom: 0.5rem; }
        .subtitle { color: var(--text-muted); font-size: 0.95rem; }

        .auth-form { display: flex; flex-direction: column; gap: 2rem; }
        .field-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .field-label { font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.05em; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 1.5rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .pad-icon { padding-left: 3.5rem !important; }
        
        .auth-submit { padding-top: 1.15rem; padding-bottom: 1.15rem; width: 100%; font-size: 1.05rem; }
        .auth-footer { text-align: center; margin-top: 2.5rem; font-size: 0.9rem; color: var(--text-muted); }
        .auth-link { color: var(--primary); font-weight: 800; text-decoration: underline; text-underline-offset: 4px; }
      ` }} />
    </div>
  );
};

export default Login;
