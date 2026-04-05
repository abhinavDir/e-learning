import React, { useState, useEffect } from 'react'
import api from '../api/axios'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { TrendingUp, AlertCircle, Target, Clock, Calendar, CheckCircle2 } from 'lucide-react'
import './AnalyticsPage.css'

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/api/analytics/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user.id]);

  if (loading) return <div className="loading-state flex-center"><h1>Crunching Performance Data...</h1></div>;

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#ef4444'];

  return (
    <div className="analytics-container animate-fade">
      <div className="analytics-header">
        <h1>Performance Intelligence</h1>
        <p>Deep dive into your learning data and cognitive performance tracks.</p>
      </div>

      <div className="stats-strip flex-between glass-panel mb-2">
        <div className="stat-box">
          <span className="stat-label">Topics Explored</span>
          <span className="stat-value">{data?.stats?.totalTopics || 0}</span>
        </div>
        <div className="stat-box divider"></div>
        <div className="stat-box">
          <span className="stat-label">Quiz Attempts</span>
          <span className="stat-value">{data?.stats?.totalAttempts || 0}</span>
        </div>
        <div className="stat-box divider"></div>
        <div className="stat-box">
          <span className="stat-label">Average Accuracy</span>
          <span className="stat-value">{data?.stats?.avgAccuracy || 0}%</span>
        </div>
        <div className="stat-box divider"></div>
        <div className="stat-box">
          <span className="stat-label">Last Score</span>
          <span className="stat-value">{data?.stats?.lastScore || '0/0'}</span>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="char-card glass-panel wide">
          <div className="chart-header flex-center">
            <TrendingUp size={20} color="var(--primary)" />
            <h3>Mastery Improvement Trend</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data?.history}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="var(--primary)" fillOpacity={1} fill="url(#colorAcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="char-card glass-panel">
          <div className="chart-header flex-center">
            <Target size={20} color="var(--secondary)" />
            <h3>Topic Performance (Mastery %)</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.topicPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="title" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
                <Bar dataKey="mastery" radius={[4, 4, 0, 0]}>
                  {data?.topicPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="intelligence-grid">
          <div className="intelligence-card glass-panel">
            <div className="card-top flex-center">
              <AlertCircle size={32} color="var(--danger)" />
              <div>
                <h4>Weakness Identification</h4>
                <p>Based on recurring mistakes</p>
              </div>
            </div>
            <div className="weak-list">
              {data?.intelligence.weakTopics.map((topic, i) => (
                <div key={i} className="weak-item flex-between">
                  <span>{topic}</span>
                  <span className="weak-label">Needs attention</span>
                </div>
              ))}
            </div>
          </div>

          <div className="intelligence-card glass-panel">
            <div className="card-top flex-center">
              <CheckCircle2 size={32} color="var(--success)" />
              <div>
                <h4>Mastery Achievements</h4>
                <p>Topics you have conquered</p>
              </div>
            </div>
            <div className="mastered-list">
              {data?.intelligence.masteredTopics.map((topic, i) => (
                <div key={i} className="master-item flex-between">
                  <span>{topic}</span>
                  <span className="master-label">Proficient</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="intelligence-card glass-panel highlight-card">
            <div className="card-top flex-center">
              <Calendar size={32} color="var(--text)" />
              <div>
                <h4>Daily Study Plan</h4>
                <p>Generated by AI Brain</p>
              </div>
            </div>
            <div className="study-plan">
              <div className="plan-item">
                <h5>1. Revision (15m)</h5>
                <p>Quick summary of {data?.intelligence.weakTopics[0] || 'your last topics'}</p>
              </div>
              <div className="plan-item">
                <h5>2. New Topic (45m)</h5>
                <p>Search for Computer Architecture to fill gaps</p>
              </div>
              <div className="plan-item">
                <h5>3. Quiz (15m)</h5>
                <p>Practice Hard level MCQs for Data Structures</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
