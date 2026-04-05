import React from 'react';
import AIPath from '../components/AIPath';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import './AIGuide.css';

const AIGuide = () => {
  return (
    <div className="aiguide-container">
      {/* Background Ambient Orbs */}
      <div className="ambient-orb-primary"></div>
      <div className="ambient-orb-accent"></div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="neural-badge"
          >
            {/* <Sparkles size={16} /> POWERED BY NEURAL ENGINE */}
            <Sparkles size={16} /> POWERED BY NEURAL ENGINE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hero-title"
          >
            Architect Your <br />
            <span className="hero-title-highlight">Personal Future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-subtitle"
          >
            Our advanced AI analyzes global market trends and educational pathways to build a high-fidelity roadmap tailored strictly for your success.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="scroll-indicator"
          >
            <span className="scroll-text">Initialize Mission Lower</span>
            <div className="scroll-line"></div>
          </motion.div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="workspace-wrapper">
        <AIPath />
      </main>
    </div>
  );
};

export default AIGuide;
