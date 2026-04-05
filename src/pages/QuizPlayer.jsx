import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Timer, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  X,
  Trophy,
  Award,
  BrainCircuit,
  Zap,
  Sparkles,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import './QuizPlayer.css';

const QuizPlayer = () => {
  const { courseId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isAssignment = queryParams.get('mode') === 'assignment';
  const assignmentId = isAssignment ? courseId : null;
  const isGlobal = queryParams.get('mode') === 'global';
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (isAssignment) {
          const { data } = await api.get(`/quiz/assignment/${assignmentId}`);
          setQuiz(data.quizId);
          if (data.quizId?.timeLimit) setTimeLeft(data.quizId.timeLimit * 60);
        } else if (isGlobal) {
          const { data } = await api.get(`/quiz/id/${courseId}`);
          setQuiz(data);
          if (data.timeLimit) setTimeLeft(data.timeLimit * 60);
        } else {
          const { data } = await api.get(`/quiz/${courseId}`);
          setQuiz(data);
          if (data.timeLimit) setTimeLeft(data.timeLimit * 60);
        }
      } catch (err) {
        toast.error('Could not load assessment.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [courseId, navigate, isAssignment, assignmentId, isGlobal]);

  useEffect(() => {
    if (!started || isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, started]);

  const handleSubmit = async () => {
    setIsSubmitted(true);
    const answersArray = Object.values(selectedAnswers);
    try {
      const payload = { 
        answers: answersArray,
        assignmentId: isAssignment ? assignmentId : null 
      };
      const { data } = await api.post(`/quiz/submit/${quiz._id}`, payload);
      setResult(data.result);
      toast.success('Assessment complete!');
    } catch (err) {
      toast.error('Failed to submit quiz.');
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setTimeLeft(600);
    setIsSubmitted(false);
    setResult(null);
    setStarted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) return <div className="quiz-loader-screen">Initializing Intelligence...</div>;

  if (!started && quiz) {
    return (
      <div className="arena-mainframe">
         <div className="launch-arena">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="launch-card"
           >
              <header className="launch-header">
                 <div className="launch-icon-box">
                   <BrainCircuit size={32} />
                 </div>
                 <h1 className="launch-title">{quiz.topic || 'Skill Assessment'}</h1>
                 <div className="launch-meta">
                    <span className="meta-pill difficulty">{quiz.difficulty || 'Expert'} Intelligence</span>
                    <span className="meta-pill units">{quiz.questions?.length || 0} Units</span>
                 </div>
              </header>

              <div className="instruction-v-stack">
                 <div className="instruction-row">
                    <div className="row-number">1</div>
                    <p>Consists of <strong>{quiz.questions?.length || 0}</strong> sequential query sequences.</p>
                 </div>
                 <div className="instruction-row">
                    <div className="row-number">2</div>
                    <p>You have <strong>{quiz.timeLimit || 10} minutes</strong> before the uplink terminates.</p>
                 </div>
                 <div className="instruction-row">
                    <div className="row-number">3</div>
                    <p>Score <strong>70%+</strong> for official knowledge verification.</p>
                 </div>
              </div>

              <button onClick={() => setStarted(true)} className="engage-trigger">
                 Engage Assessment <ArrowRight size={20} />
              </button>
           </motion.div>
         </div>
      </div>
    );
  }

  if (!quiz) return null;

  if (isSubmitted && result) {
    return (
      <div className="result-arena">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="result-card"
        >
          <div className="result-trophy-area">
            <Trophy size={80} color="#facc15" />
          </div>
          <h1 className="result-headline">Synchronization Complete</h1>
          <p className="result-subline">{quiz.difficulty || 'Expert'} Verification Complete</p>
          
          <div className="result-telemetry">
            <div className="telemetry-box">
              <span className="t-val">{result.score}/{result.totalQuestions}</span>
              <span className="t-label">Precision</span>
            </div>
            <div className="telemetry-box prominent">
              <span className="t-val">{Math.round(result.percentage)}%</span>
              <span className="t-label">Proficiency</span>
            </div>
          </div>

          <div className="result-footer-actions">
             <button 
               onClick={handleRetry} 
               className="btn-retry"
             >
               <RotateCcw size={18} /> Try Again
             </button>

             <button 
               onClick={() => navigate(isGlobal ? '/quizzes' : (isAssignment ? '/dashboard' : `/learn/${courseId}`))} 
               className="btn-exit"
             >
               <ChevronLeft size={18} /> {isGlobal ? 'Back to Global Hub' : (isAssignment ? 'Exit Hub' : 'Back to Studio')}
             </button>
             
             {result.percentage >= 70 && (
               <div className="mastery-badge">
                 <Sparkles size={14} /> <span>Cognitive Mastery Achieved</span>
               </div>
             )}
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIdx];

  return (
    <div className="arena-mainframe">
      <header className="arena-hud">
        <div className="hud-brand">
            <div className="hud-icon-shell"><ShieldCheck size={20} /></div>
            <div className="hud-text-group">
              <span className="hud-status">Session Active</span>
              <h1 className="hud-title">{quiz.topic || 'Assessment'}</h1>
            </div>
        </div>
        
        <div className="hud-controls">
           <div className={`hud-timer ${timeLeft < 60 ? 'critical' : ''}`}>
              <Timer size={18} />
              <span className="timer-digits">{formatTime(timeLeft)}</span>
           </div>
           
           <button onClick={() => navigate(-1)} className="hud-close-btn" title="Exit">
              <X size={20} />
           </button>
        </div>
      </header>

      <div className="arena-workspace">
        <div className="arena-progress-module">
           <div className="progress-label">
              UPLINK <span>{currentIdx + 1}</span> / {quiz.questions.length}
           </div>
           <div className="progress-track-bg">
              <motion.div 
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
              />
           </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="question-container"
          >
            <h2 className="question-text">{currentQ.question}</h2>

            <div className="options-vertical-stack">
              {currentQ.options.map((option, i) => {
                const isSelected = selectedAnswers[currentIdx] === option;
                return (
                  <button 
                    key={i}
                    onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentIdx]: option })}
                    className={`option-variant ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="variant-left">
                       <div className="variant-id">{String.fromCharCode(65 + i)}</div>
                       <span className="variant-text">{option}</span>
                    </div>
                    {isSelected && <CheckCircle size={20} className="selected-icon" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <footer className="arena-navigation">
           <button 
             disabled={currentIdx === 0}
             onClick={() => setCurrentIdx(currentIdx - 1)}
             className="nav-btn-back"
           >
             <ChevronLeft size={20} /> BACKLINK
           </button>
           
           {currentIdx < quiz.questions.length - 1 ? (
             <button 
               onClick={() => setCurrentIdx(currentIdx + 1)}
               className="nav-btn-next"
             >
               NEXT PHASE <ChevronRight size={20} />
             </button>
           ) : (
             <button onClick={handleSubmit} className="nav-btn-submit">
               COMMIT RESULTS <Zap size={20} />
             </button>
           )}
        </footer>
      </div>
    </div>
  );
};

export default QuizPlayer;
