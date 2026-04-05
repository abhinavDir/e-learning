import { User, Mail, Award, Settings, Shield, Clock, Activity, MessageSquare } from 'lucide-react'
import api from '../api/axios'
import { motion } from 'framer-motion'
import './ProfilePage.css'

const ProfilePage = () => {
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
       try {
         const { data } = await api.get('/auth/me');
         setUser(data);
       } catch (err) {
         console.error(err);
       } finally {
         setLoading(false);
       }
    };
    fetchProfile();
  }, []);

  return (
    <div className="profile-container animate-fade">
      <div className="profile-header flex-center">
        <div className="profile-avatar-wrap">
          <img src={user?.avatar} alt="Avatar" className="user-avatar-lg" />
          <div className="edit-overlay"><Settings size={18} /></div>
        </div>
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p className="user-email"><Mail size={16} /> {user?.email}</p>
          <div className="user-meta flex-center">
            <span className="badge-premium"><Shield size={14} /> PRO LEARNER</span>
            <span className="join-date"><Clock size={14} /> Joined April 2026</span>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-stat-card glass-panel">
          <Award size={32} color="#f59e0b" />
          <h3>Mastery Rank</h3>
          <p className="rank-name">Architect of Knowledge</p>
          <div className="rank-progress flex-between">
            <span>Level 12</span>
            <span>2,450 / 5,000 XP</span>
          </div>
          <div className="rank-bar-bg">
            <div className="rank-bar-fill" style={{ width: '45%' }}></div>
          </div>
        </div>

        <div className="profile-activity-feed glass-panel">
          <h3>Activity Architecture</h3>
          <div className="feed-container">
            {user?.activities?.length > 0 ? (
               user.activities.slice().reverse().map((act, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="activity-item"
                 >
                    <div className="act-icon-box" style={{ background: act.type === 'quiz' ? '#6366f120' : '#10b98120' }}>
                       {act.type === 'quiz' ? <Activity size={16} color="#6366f1" /> : <Shield size={16} color="#10b981" />}
                    </div>
                    <div className="act-details">
                       <span className="act-title">{act.title}</span>
                       {act.metadata && (
                         <div className="act-meta">
                            {act.metadata.percent !== undefined && <span className="meta-pill">Score: {act.metadata.percent}%</span>}
                            {act.metadata.courseTitle && <span className="meta-pill">{act.metadata.courseTitle}</span>}
                         </div>
                       )}
                       <span className="act-time">{new Date(act.timestamp).toLocaleString()}</span>
                    </div>
                 </motion.div>
               ))
            ) : (
                <div className="empty-feed">
                   <MessageSquare size={32} />
                   <p>No activity recorded architecture yet.</p>
                </div>
            )}
          </div>
        </div>

        <div className="profile-settings glass-panel">
          <h3>Account Settings</h3>
          <div className="settings-list">
            <div className="setting-item flex-between">
              <span>Email Notifications</span>
              <div className="toggle on"></div>
            </div>
            <div className="setting-item flex-between">
              <span>Appearance (Dark mode)</span>
              <div className="toggle on"></div>
            </div>
            <div className="setting-item flex-between">
              <span>Knowledge Privacy</span>
              <div className="toggle off"></div>
            </div>
            <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '1rem' }}>Update Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
