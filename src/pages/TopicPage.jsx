import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { Book, Play, CheckCircle, AlertTriangle, MessageSquare, Send, ChevronRight } from 'lucide-react'
import './TopicPage.css'

const TopicPage = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await api.get(`/api/topics/${id}`);
        setTopic(res.data);
        setMessages([{ role: 'ai', text: `Hi ${user.name}! I'm your AI assistant for "${res.data.title}". Ask me anything about this topic!` }]);
      } catch (err) {
        console.error('Topic fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [id, user.name]);

  const handleStartQuiz = async () => {
    try {
      const res = await api.post('/api/quizzes/generate', {
        topicId: id,
        difficulty: 'Medium'
      });
      navigate(`/quiz/${res.data._id}`);
    } catch (err) {
      console.error('Quiz generation error:', err);
    }
  };

  if (loading) return <div className="loading-state flex-center"><h1>Decoding Topic Knowledge...</h1></div>;
  if (!topic) return <div className="flex-center"><h1>Topic not found.</h1></div>;

  return (
    <div className="topic-container animate-fade">
      <div className="topic-header flex-between">
        <div className="header-info">
          <div className="header-badges flex gap-1">
            <div className="category-badge">{topic.category}</div>
            <div className={`level-badge level-${topic.level.toLowerCase()}`}>{topic.level} Level</div>
          </div>
          <h1>{topic.title}</h1>
          <p>{topic.description}</p>
        </div>
        <button className="btn btn-primary start-quiz-btn" onClick={handleStartQuiz}>
          <Play size={20} fill="white" />
          Start Quiz
        </button>
      </div>

      <div className="topic-main-grid">
        <div className="learning-content">
          <section className="content-section glass-panel">
            <h2>Detailed Explanation</h2>
            <div className="explanation-text">
              {topic.content.detailedExplanation?.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>

          <div className="learning-grid">
            <section className="glass-panel">
              <h3 className="section-title flex-center"><CheckCircle size={18} color="var(--success)" /> Key Points</h3>
              <ul className="points-list">
                {topic.content.keyPoints?.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </section>
            
            <section className="glass-panel">
              <h3 className="section-title flex-center"><AlertTriangle size={18} color="var(--warning)" /> Common Mistakes</h3>
              <ul className="mistakes-list">
                {topic.content.commonMistakes?.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </section>
          </div>

          <section className="glass-panel examples-section">
            <h2>Real-World Examples</h2>
            <div className="examples-grid">
              {topic.content.realWorldExamples?.map((ex, i) => (
                <div key={i} className="example-card">
                  <div className="example-number">{i + 1}</div>
                  <p>{ex}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
