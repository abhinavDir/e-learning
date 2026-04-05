import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Rocket, Target, Users, BookOpen, Code, Shield, Cpu, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="about-portal">
      {/* Ambient BG */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <section className="about-hero">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-sm tracking-widest uppercase mb-8"
        >
          <BookOpen size={16} /> Mission Origin
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="about-title-cursive"
        >
          Our Neural <span>Journey</span>
        </motion.h1>
        
        <p className="about-subtitle">
          Architecting the future of <span className="text-gradient">cognitive excellence</span> through AI-powered pedagogical precision. We are building the ultimate hub to transform absolute beginners into industry-ready engineers.
        </p>
      </section>

      {/* Section 1: What is currently built */}
      <section className="about-section max-width">
        <div className="section-header">
          <h2 className="text-3xl md:text-5xl font-black text-[var(--text-title)] mb-4">Current <span className="text-primary">Architecture</span></h2>
          <p className="text-muted text-lg mb-12 max-w-2xl">What we have successfully built and deployed to supercharge your learning today.</p>
        </div>

        <div className="about-grid">
          <div className="about-card purple-card">
            <BrainCircuit size={40} className="card-icon" />
            <h3 className="card-title">AI Neural Path</h3>
            <p className="card-text">Our offline-first generative engine creates personalized 4-week roadmaps based entirely on your exact career goal.</p>
          </div>

          <div className="about-card blue-card">
            <Target size={40} className="card-icon" />
            <h3 className="card-title">Interactive Workspaces</h3>
            <p className="card-text">Learn efficiently with immersive course content, dedicated video players, and structured progress tracking across assignments.</p>
          </div>

          <div className="about-card yellow-card">
            <Code size={40} className="card-icon" />
            <h3 className="card-title">Quiz Intelligence</h3>
            <p className="card-text">Test your mettle against our integrated local-database quiz engines, verifying every skill node before you proceed.</p>
          </div>

          <div className="about-card green-card">
            <Users size={40} className="card-icon" />
            <h3 className="card-title">Role-Based Access</h3>
            <p className="card-text">A secure ecosystem where Instructors can meticulously author courses and Students can seamlessly enroll.</p>
          </div>
        </div>
      </section>

      {/* Section 2: Future Vision */}
      <section className="about-section max-width mt-32">
        <div className="section-header">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent font-bold text-sm tracking-widest uppercase mb-6"
          >
            <Rocket size={16} /> Roadmap V2.0
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-[var(--text-title)] mb-4">The <span className="text-accent">Future Protocol</span></h2>
          <p className="text-muted text-lg mb-12 max-w-2xl">We are actively architecting the next generation of learning intelligence. Here's what's coming next.</p>
        </div>

        <div className="future-grid">
          <div className="future-card">
            <Shield size={32} className="icon-style" />
            <h4 className="future-title">Web3 Credentials</h4>
            <p className="card-text">Mint your course completion certificates directly onto the Ethereum blockchain as highly verifiable NFTs.</p>
          </div>

          <div className="future-card">
            <Cpu size={32} className="icon-style" />
            <h4 className="future-title">Live Voice Tutors</h4>
            <p className="card-text">Speak directly to an AI mentor via phone calls. Using Twilio and ElevenLabs for instantaneous vocal problem-solving.</p>
          </div>

          <div className="future-card">
            <Zap size={32} className="icon-style" />
            <h4 className="future-title">Real-time IDE</h4>
            <p className="card-text">A fully sandboxed cloud IDE inside your browser to run, test, and auto-grade your code instantly against AI logic.</p>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .about-portal { padding: 8rem 1.5rem 2rem; position: relative; overflow: hidden; background: var(--bg); }
        .about-hero { text-align: center; margin-bottom: 8rem; position: relative; z-index: 10; }
        .about-title-cursive { font-size: clamp(3rem, 8vw, 5rem); font-family: 'Pacifico', cursive; margin-bottom: 2rem; color: var(--text-title); line-height: 1.2; }
        .about-title-cursive span { background: linear-gradient(135deg, var(--primary) 0%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-family: 'Inter', sans-serif; font-weight: 900; font-style: normal; }
        
        .about-subtitle { font-size: 1.15rem; color: var(--text-muted); max-width: 800px; margin: 0 auto; line-height: 1.8; font-weight: 400; }
        .text-gradient { color: var(--primary); font-weight: 700; }

        .about-section { position: relative; z-index: 10; margin-bottom: 6rem; }
        
        .about-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        .about-card { padding: 2.5rem; border-radius: 2rem; background: var(--surface); border: 1px solid var(--glass-border); transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1); position: relative; overflow: hidden; }
        .about-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: var(--primary); opacity: 0.5; }
        
        .purple-card::before { background: #a855f7; }
        .blue-card::before { background: #3b82f6; }
        .yellow-card::before { background: #f59e0b; }
        .green-card::before { background: #10b981; }

        .about-card:hover { transform: translateY(-10px); background: var(--alternate); border-color: var(--primary); box-shadow: 0 20px 40px -10px var(--primary-glow); }
        .card-icon { margin-bottom: 1.5rem; color: var(--primary); }
        .purple-card .card-icon { color: #a855f7; }
        .blue-card .card-icon { color: #3b82f6; }
        .yellow-card .card-icon { color: #f59e0b; }
        .green-card .card-icon { color: #10b981; }

        .card-title { font-size: 1.25rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-main); }
        .card-text { color: var(--text-muted); line-height: 1.7; font-size: 0.95rem; }

        /* Future Vision Section Unified Style */
        .vision-panel { 
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
          text-align: left;
        }

        .future-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
          gap: 2rem; 
          width: 100%;
        }

        .future-card { 
          padding: 2.5rem; 
          border-radius: 2rem; 
          background: var(--surface); 
          border: 1px solid var(--glass-border); 
          transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1); 
          position: relative; 
          overflow: hidden; 
        }

        .future-card::before { 
          content: ''; 
          position: absolute; 
          top: 0; 
          left: 0; 
          width: 100%; 
          height: 4px; 
          background: var(--accent); 
          opacity: 0.8; 
        }

        .future-card:hover { 
          transform: translateY(-10px); 
          background: var(--alternate); 
          border-color: var(--accent); 
          box-shadow: 0 20px 40px -10px rgba(244, 63, 94, 0.2); 
        }

        .future-card h4 { font-size: 1.25rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-main); }
        .future-card p { color: var(--text-muted); line-height: 1.7; font-size: 0.95rem; }
        .future-card .icon-style { margin-bottom: 1.5rem; color: var(--accent); }

        @media (min-width: 768px) {
           .about-portal { padding: 10rem 2rem 4rem; }
           .about-title-cursive { font-size: 4rem; }
           .vision-panel { padding: 0; }
        }
      ` }} />
    </div>
  );
};

export default About;
