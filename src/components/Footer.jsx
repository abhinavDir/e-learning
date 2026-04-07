import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="max-width footer-grid">
        <div className="footer-brand">
          <Link to="/" className="nav-logo">
            <div className="logo-icon">
              <BookOpen size={24} color="white" />
            </div>
            <span className="brand- cursive-title">EdStack</span>
          </Link>
          <p className="brand-desc">
            Empowering the next generation of engineers with <span className="highlight-text">AI-driven</span> personalized education and industrial-grade curriculum.
          </p>
          <div className="social-links">
            <a href="#" className="social-btn"><Twitter size={18} /></a>
            <a href="#" className="social-btn"><Github size={18} /></a>
            <a href="#" className="social-btn"><Linkedin size={18} /></a>
            <a href="#" className="social-btn"><Mail size={18} /></a>
          </div>
        </div>

        <div className="footer-column">
          <h4 className="footer-title-cursive">Portal Discovery</h4>
          <Link to="/courses" className="footer-link purple-link">Explore Courses</Link>
          <Link to="/features" className="footer-link blue-link">Special Features</Link>
          <Link to="/quizzes" className="footer-link yellow-link">Skill Assessments</Link>
        </div>

        <div className="footer-column">
          <h4 className="footer-title-cursive">Intel Studio</h4>
          <Link to="/about" className="footer-link green-link">Neural Map (About)</Link>
          <Link to="/blog" className="footer-link red-link">Classroom News</Link>
          <Link to="/careers" className="footer-link purple-link">Join Faculty</Link>
        </div>

        <div className="footer-column newsletter-col">
          <h4 className="footer-title-cursive">Stay Enlightened</h4>
          <p className="newsletter-text">Get the latest course updates and AI news delivered to your inbox.</p>
          <div className="newsletter-box">
            <input type="email" placeholder="email@address.com" className="email-input" />
            <button className="join-btn">Initialize</button>
          </div>
        </div>
      </div>
      {/* 
      <div className="footer-legal">
        <div className="max-width legal-flex">
          <p className="legal-text">© 2026 EdStack Intelligence Platform. Designed for the <span className="neural-text">Neural Era</span>.</p>
          <div className="legal-links">
            <a href="#">Privacy Protocol</a>
            <a href="#">Neural Terms</a>
          </div>
        </div>
      </div> */}

      <style dangerouslySetInnerHTML={{
        __html: `
        .footer-wrapper { background: var(--alternate); border-top: 1px solid var(--glass-border); padding: 4rem 2rem 0; margin-top: 4rem; position: relative; overflow: hidden; }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.5fr; gap: 3rem; padding-bottom: 4rem; position: relative; z-index: 2; }
        
        .footer-brand { display: flex; flex-direction: column; gap: 2rem; }
        .nav-logo { display: flex; align-items: center; gap: 0.75rem; color: var(--text-main); font-weight: 800; font-family: 'Outfit'; font-size: 1.5rem; text-decoration: none; }
        .logo-icon { width: 36px; height: 36px; background: var(--primary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
        
        .brand-desc { color: var(--text-muted); line-height: 1.8; max-width: 320px; font-size: 0.95rem; font-weight: 500; }
        .highlight-text { color: var(--primary); font-weight: 700; border-bottom: 1px dashed var(--primary); padding-bottom: 2px; }
        
        .social-links { display: flex; gap: 1rem; }
        .social-btn { width: 44px; height: 44px; background: var(--surface); border-radius: 1.25rem; border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: 0.4s; }
        .social-btn:hover { background: var(--primary); color: white; transform: translateY(-5px) rotate(8deg); border-color: var(--primary); box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4); }

        .footer-column { display: flex; flex-direction: column; gap: 1.25rem; }
        .footer-title-cursive { font-family: 'Outfit'; font-style: italic; font-size: 1.25rem; font-weight: 400; color: var(--text-main); margin-bottom: 1rem; letter-spacing: -0.01em; }
        
        .footer-link { font-size: 0.9rem; font-weight: 700; color: var(--text-muted); transition: 0.3s; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }
        .footer-link:hover { transform: translateX(8px); }
        .purple-link:hover { color: #a855f7; }
        .blue-link:hover { color: #3b82f6; }
        .yellow-link:hover { color: #f59e0b; }
        .green-link:hover { color: #10b981; }
        .red-link:hover { color: #ef4444; }

        .newsletter-text { color: var(--text-muted); font-size: 0.9rem; line-height: 1.7; margin-bottom: 2rem; font-weight: 500; }
        .newsletter-box { display: flex; gap: 0.75rem; background: var(--surface); padding: 0.6rem; border-radius: 1.5rem; border: 1px solid var(--glass-border); transition: 0.3s; }
        .newsletter-box:focus-within { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
        .email-input { background: transparent; border: none; padding: 0.5rem 1rem; color: var(--text-main); flex: 1; outline: none; font-size: 0.85rem; font-weight: 600; }
        .join-btn { background: var(--primary); color: white; border-radius: 1.1rem; padding: 0.75rem 1.75rem; font-weight: 800; font-size: 0.8rem; box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4); border: none; cursor: pointer; transition: 0.3s; }
        .join-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }

        .footer-legal { border-top: 1px solid var(--glass-border); padding: 3rem 0; background: var(--bg); position: relative; z-index: 2; }
        .legal-flex { display: flex; justify-content: space-between; align-items: center; color: var(--text-muted); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .neural-text { color: var(--primary); font-weight: 800; font-style: italic; }
        .legal-links { display: flex; gap: 3rem; }
        .legal-links a { text-decoration: none; color: inherit; transition: 0.3s; }
        .legal-links a:hover { color: var(--text-main); }

        .footer-bg-glow { position: absolute; bottom: 0; right: 0; width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%); pointer-events: none; z-index: 1; }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 4rem; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; gap: 3rem; text-align: center; }
          .footer-brand, .footer-column { align-items: center; text-align: center; }
          .brand-desc { text-align: center; margin: 0 auto; max-width: 100%; }
          .social-links { justify-content: center; margin: 0 auto; }
          .footer-link { justify-content: center; transform: none !important; }
          .newsletter-box { max-width: 320px; margin: 1.5rem auto 0; width: 100%; display: flex; flex-direction: column; gap: 1rem; padding: 1rem; border-radius: 1.5rem; }
          .email-input { width: 100%; text-align: center; padding: 0.75rem; }
          .join-btn { width: 100%; }
          .legal-flex { flex-direction: column; gap: 2rem; text-align: center; }
          .legal-links { gap: 2rem; justify-content: center; }
        }
      ` }} />
      <div className="footer-bg-glow" />
    </footer>
  );
};

export default Footer;
