import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EditCourse.css';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import {
  Plus, Trash2, Save, Type, Award, Clock, Image as ImageIcon,
  MonitorPlay, ArrowLeft, Settings, UploadCloud, RefreshCw, History, FileText, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const EditCourse = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        // Normalize to ensure arrays always exist
        setFormData({
          ...data,
          sections: (data.sections || []).map(s => ({
            ...s,
            lectures: s.lectures || []
          })),
          outcomes: data.outcomes || [],
        });
      } catch (err) {
        toast.error('Failed to load course data');
        navigate('/instructor/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  const handleAddSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: '', lectures: [{ title: '', videoUrl: '', duration: '' }] }]
    });
  };

  const handleRemoveSection = (index) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  const handleAddLecture = (sectionIndex) => {
    const nextSections = formData.sections.map((s, sIdx) => {
      if (sIdx === sectionIndex) {
        return {
          ...s,
          lectures: [...s.lectures, { title: '', description: '', videoUrl: '', duration: '' }]
        };
      }
      return s;
    });
    setFormData({ ...formData, sections: nextSections });
  };

  const handleRemoveLecture = (sectionIndex, lectureIndex) => {
    const nextSections = formData.sections.map((s, sIdx) => {
      if (sIdx === sectionIndex) {
        return {
          ...s,
          lectures: s.lectures.filter((_, lIdx) => lIdx !== lectureIndex)
        };
      }
      return s;
    });
    setFormData({ ...formData, sections: nextSections });
  };

  const handleVideoUpload = async (file, sIndex, lIndex) => {
    if (!file) return;
    const toastId = toast.loading('Uploading video matrix...');
    try {
      const uploadData = new FormData();
      uploadData.append('video', file);
      const { data } = await api.post('/upload/video', uploadData);
      
      const nextSections = formData.sections.map((s, si) => {
        if (si === sIndex) {
          const nextLectures = s.lectures.map((l, li) => {
            if (li === lIndex) return { ...l, videoUrl: data.url, tempUploaded: true };
            return l;
          });
          return { ...s, lectures: nextLectures };
        }
        return s;
      });
      setFormData({ ...formData, sections: nextSections });
      toast.success('Matrix Link Sync Complete!', { id: toastId });
    } catch (err) {
      toast.error('Uplink failed: ' + (err.response?.data?.error || 'Server connection interrupted'), { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/courses/${id}`, formData);
      toast.success('Course updated successfully!');
      navigate('/instructor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAddOutcome = () => setFormData({ ...formData, outcomes: [...formData.outcomes, ''] });
  const handleRemoveOutcome = (idx) => setFormData({ ...formData, outcomes: formData.outcomes.filter((_, i) => i !== idx) });
  const handleOutcomeChange = (idx, val) => {
    const nextOutcomes = [...formData.outcomes];
    nextOutcomes[idx] = val;
    setFormData({ ...formData, outcomes: nextOutcomes });
  };

  if (loading) return <div className="ec-loader">Syncing Studio...</div>;
  if (!formData) return <div className="ec-loader">Loading course data...</div>;

  return (
    <div className="ec-page-container">
      <div className="ec-nav-wrapper">
        <div className="ec-nav-capsule">
          <div className="ec-nav-left">
            <button type="button" onClick={() => navigate('/instructor/dashboard')} className="ec-back-btn">
              <ArrowLeft size={18} />
            </button>
            <div className="ec-title-stack">
              <span className="ec-chip"><RefreshCw size={12} /> Edit Mode</span>
              <h1 className="ec-page-title">Project Refinement</h1>
            </div>
          </div>
          <div className="ec-nav-actions">
            <button type="button" onClick={handleSubmit} disabled={saving} className="ec-btn-primary">
              {saving ? 'Syncing...' : <><UploadCloud size={16} /> Update Live Project</>}
            </button>
          </div>
        </div>
      </div>

      <div className="ec-workspace-grid">
        <div className="ec-main-column">
          {/* Base Architecture */}
          <div className="ec-card">
            <div className="ec-card-header">
              <div className="ec-card-icon"><Type size={18} /></div>
              <h3 className="ec-card-title">Standard Details</h3>
            </div>

            <div className="ec-form-grid">
              <div className="ec-form-row">
                <label className="ec-label">Course Master Title</label>
                <input type="text" className="ec-input ec-input-title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>

              <div className="ec-form-row">
                <label className="ec-label">Curriculum Abstract</label>
                <textarea rows="4" className="ec-input" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="ec-form-row double">
                <div className="ec-form-row">
                  <label className="ec-label">Domain Category</label>
                  <select className="ec-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option>Development</option>
                    <option>Artificial Intelligence</option>
                    <option>Business Strategy</option>
                    <option>UI/UX Design</option>
                    <option>Cloud Computing</option>
                  </select>
                </div>
                <div className="ec-form-row">
                  <label className="ec-label">Market Price ($)</label>
                  <div className="ec-input-symbol-wrap">
                    <span className="ec-input-symbol">$</span>
                    <input type="number" className="ec-input ec-input-with-symbol" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                </div>
                <div className="ec-form-row">
                  <label className="ec-label"><Award size={14} /> Target Difficulty</label>
                  <select className="ec-input" value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>All Levels</option>
                  </select>
                </div>
                <div className="ec-form-row">
                  <label className="ec-label"><Clock size={14} /> Global Duration</label>
                  <input type="text" className="ec-input" placeholder="e.g. 20+ Hours" value={formData.totalDuration || ''} onChange={e => setFormData({ ...formData, totalDuration: e.target.value })} />
                </div>
                <div className="ec-form-row">
                  <label className="ec-label"><FileText size={14} /> Final Assessment Link</label>
                  <input type="text" className="ec-input" placeholder="Quiz link or ID" value={formData.quizUrl || ''} onChange={e => setFormData({ ...formData, quizUrl: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum Builder */}
          <div className="ec-card">
            <div className="ec-card-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="ec-card-icon"><MonitorPlay size={18} /></div>
                <h3 className="ec-card-title">Curriculum Evolution</h3>
              </div>
              <button type="button" onClick={handleAddSection} className="ec-btn-action">
                <Plus size={16} /> New Module
              </button>
            </div>

            <div className="ec-module-list">
              {formData.sections.map((section, sIndex) => (
                <div key={sIndex} className="ec-module">
                  <div className="ec-module-header">
                    <div className="ec-module-number">#{sIndex + 1}</div>
                    <input type="text" className="ec-module-input" placeholder="Module Title..." value={section.title} onChange={e => {
                      const newSections = [...formData.sections];
                      newSections[sIndex].title = e.target.value;
                      setFormData({ ...formData, sections: newSections });
                    }} />
                    <button type="button" onClick={() => handleRemoveSection(sIndex)} className="ec-btn-danger-icon">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="ec-lecture-list">
                    {section.lectures.map((lecture, lIndex) => (
                      <div key={lIndex} className="ec-lecture">
                        <div className="ec-lecture-row">
                          <input 
                            type="text" 
                            placeholder="Lecture Title" 
                            className="ec-lecture-field flex-1" 
                            value={lecture.title} 
                            onChange={e => {
                              const nextSections = formData.sections.map((s, sIdx) => {
                                if (sIdx === sIndex) {
                                  const nextLectures = s.lectures.map((l, lIdx) => {
                                    if (lIdx === lIndex) return { ...l, title: e.target.value };
                                    return l;
                                  });
                                  return { ...s, lectures: nextLectures };
                                }
                                return s;
                              });
                              setFormData({ ...formData, sections: nextSections });
                            }} 
                          />
                          <input 
                            type="text" 
                            placeholder="Time" 
                            className="ec-lecture-field w-small" 
                            value={lecture.duration} 
                            onChange={e => {
                              const nextSections = formData.sections.map((s, sIdx) => {
                                if (sIdx === sIndex) {
                                  const nextLectures = s.lectures.map((l, lIdx) => {
                                    if (lIdx === lIndex) return { ...l, duration: e.target.value };
                                    return l;
                                  });
                                  return { ...s, lectures: nextLectures };
                                }
                                return s;
                              });
                              setFormData({ ...formData, sections: nextSections });
                            }} 
                          />
                          <button type="button" onClick={() => handleRemoveLecture(sIndex, lIndex)} className="ec-btn-danger-icon">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="ec-media-row mt-2 flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Video Content URL (mp4, youtube, etc)" 
                            className="ec-lecture-field flex-1" 
                            style={{ margin: 0 }}
                            value={lecture.videoUrl} 
                            onChange={e => {
                               const nextSections = formData.sections.map((s, si) => {
                                  if (si === sIndex) {
                                     const nextLectures = s.lectures.map((l, li) => {
                                        if (li === lIndex) return { ...l, videoUrl: e.target.value };
                                        return l;
                                     });
                                     return { ...s, lectures: nextLectures };
                                  }
                                  return s;
                               });
                               setFormData({ ...formData, sections: nextSections });
                            }} 
                          />
                          <div className="ec-upload-btn-wrap">
                            <label className="ec-upload-label">
                               <ShieldCheck size={16} /> <span>Local Upload</span>
                               <input 
                                 type="file" 
                                 accept="video/*" 
                                 className="hidden" 
                                 onChange={(e) => handleVideoUpload(e.target.files[0], sIndex, lIndex)} 
                               />
                            </label>
                          </div>
                          {lecture.tempUploaded && (
                             <div className="ec-upload-status-badge">
                               <RefreshCw size={12} className="animate-spin" /> Link Ready (Pending Save)
                             </div>
                           )}
                        </div>
                        {lecture.videoUrl && (
                          <div className="ec-preview-mini mt-2" style={{ height: '120px', borderRadius: '8px', overflow: 'hidden' }}>
                            <ReactPlayer 
                              url={lecture.videoUrl} 
                              controls 
                              width="100%" 
                              height="100%" 
                            />
                          </div>
                        )}
                        <textarea
                          placeholder="Lecture Description"
                          rows="2"
                          className="ec-input mt-2"
                          value={lecture.description || ''}
                          onChange={e => {
                            const nextSections = formData.sections.map((s, sIdx) => {
                              if (sIdx === sIndex) {
                                const nextLectures = s.lectures.map((l, lIdx) => {
                                  if (lIdx === lIndex) return { ...l, description: e.target.value };
                                  return l;
                                });
                                return { ...s, lectures: nextLectures };
                              }
                              return s;
                            });
                            setFormData({ ...formData, sections: nextSections });
                          }}
                        />
                      </div>
                    ))}
                    <button type="button" onClick={() => handleAddLecture(sIndex)} className="ec-btn-action" style={{ alignSelf: 'flex-start' }}>
                      <Plus size={14} /> Append Lesson
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcomes */}
          <div className="ec-card">
            <div className="ec-card-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="ec-card-icon"><Award size={18} /></div>
                <h3 className="ec-card-title">Learning Outcomes</h3>
              </div>
              <button type="button" onClick={handleAddOutcome} className="ec-btn-action">
                <Plus size={16} /> Add Objective
              </button>
            </div>
            <div className="ec-form-grid">
              {formData.outcomes?.map((outcome, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" className="ec-input" placeholder="Outcome description..." value={outcome} onChange={e => handleOutcomeChange(idx, e.target.value)} />
                  <button type="button" onClick={() => handleRemoveOutcome(idx)} className="ec-btn-danger-icon">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="ec-side-column">
          <div className="ec-card">
            <h4 className="ec-label" style={{ marginBottom: '1rem' }}><ImageIcon size={14} /> Image Asset</h4>
            <div className="ec-thumbnail-wrap">
              <img src={formData.thumbnail} alt="preview" />
              <div className="ec-thumbnail-overlay">
                <UploadCloud size={20} /> Change Cover
              </div>
            </div>
            <div className="ec-form-row">
              <label className="ec-label">External Image URL</label>
              <input type="text" className="ec-input" value={formData.thumbnail} onChange={e => setFormData({ ...formData, thumbnail: e.target.value })} />
            </div>
          </div>

          <div className="ec-card">
            <h4 className="ec-label" style={{ marginBottom: '1.5rem' }}><Settings size={14} /> Revision Status</h4>
            <div className="ec-status-list">
              <div className="ec-status-item"><div className="ec-dot active pulse" /> Real-time Delta Tracking</div>
              <div className="ec-status-item"><div className="ec-dot active" /> Cloud Sync Active</div>
              <div className="ec-status-item"><div className="ec-dot active" /> Logic Validated</div>
            </div>
            <div className="ec-meter">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>
                <span>READINESS METRIC</span>
                <span style={{ color: '#f8fafc' }}>90%</span>
              </div>
              <div className="ec-meter-track"><div className="ec-meter-fill" style={{ width: '90%' }}></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
