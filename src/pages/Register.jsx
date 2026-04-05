import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const { loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await api.post('/auth/register', formData);
      dispatch(loginSuccess(data));
      toast.success('Registration successful! Welcome.');
      
      if (data.user.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      dispatch(loginFailure(msg));
      toast.error(msg);
    }
  };

  return (
    <div className="auth-page flex-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel register-card"
      >
        <div className="auth-header">
           <div className="auth-icon-circle"><ShieldCheck size={24} color="white" /></div>
           <h2 className="title-medium">Create Account</h2>
           <p className="subtitle">Join thousands of students and start learning today.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-grid">
            <div className="field-group">
              <label className="field-label">Full Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  required 
                  className="input-field pad-icon" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  required 
                  className="input-field pad-icon" 
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
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
                placeholder="Make it strong ••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">I want to join as</label>
            <div className="role-selector">
              <button 
                type="button" 
                onClick={() => setFormData({...formData, role: 'student'})}
                className={formData.role === 'student' ? 'btn-tab active' : 'btn-tab'}
              >
                Student
              </button>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, role: 'instructor'})}
                className={formData.role === 'instructor' ? 'btn-tab active' : 'btn-tab'}
              >
                Instructor
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary auth-submit"
          >
            {loading ? 'Creating Account...' : 'Get Started Now'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .register-card { width: 100%; max-width: 600px; padding: 4rem 3rem; border-radius: 3rem; }
        .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .role-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: rgba(15, 23, 42, 0.4); padding: 0.5rem; border-radius: 1.25rem; border: 1px solid rgba(255,255,255,0.05); }
        .btn-tab { padding: 0.75rem; border-radius: 0.85rem; font-weight: 700; font-size: 0.85rem; color: var(--text-muted); transition: var(--transition); }
        .btn-tab.active { background: var(--primary); color: white; box-shadow: 0 4px 15px rgba(99,102,241,0.3); }

        @media (max-width: 640px) {
          .input-grid { grid-template-columns: 1fr; }
          .register-card { padding: 3rem 2rem; }
        }
      ` }} />
    </div>
  );
};

export default Register;
