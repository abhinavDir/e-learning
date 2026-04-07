const fs = require('fs');
const createCoursePath = './src/pages/CreateCourse.jsx';
const content = fs.readFileSync(createCoursePath, 'utf8');

const jsContent = `import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import {
  Plus,
  Trash2,
  Save,
  Type,
  ImageIcon,
  MonitorPlay,
  ArrowLeft,
  Settings,
  Sparkles,
  UploadCloud,
  Shield,
  ShieldCheck,
  Award,
  Clock,
  Download,
  PlayCircle, RefreshCw
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
        const { data } = await api.get(\`/courses/\${id}\`);
        setFormData({
          ...data,
          sections: (data.sections || []).length > 0 ? (data.sections).map(s => ({
            ...s,
            lectures: s.lectures || []
          })) : [{ title: '', lectures: [{ title: '', videoUrl: '', duration: '' }] }],
          outcomes: data.outcomes && data.outcomes.length > 0 ? data.outcomes : [''],
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

  const handleAddSection = () => setFormData({ ...formData, sections: [...formData.sections, { title: '', lectures: [{ title: '', description: '', videoUrl: '', duration: '' }] }] });
  const handleRemoveSection = (index) => setFormData({ ...formData, sections: formData.sections.filter((_, i) => i !== index) });

  const handleAddLecture = (sectionIndex) => {
    const nextSections = formData.sections.map((s, sIdx) => sIdx === sectionIndex ? { ...s, lectures: [...s.lectures, { title: '', description: '', videoUrl: '', duration: '' }] } : s);
    setFormData({ ...formData, sections: nextSections });
  };

  const handleRemoveLecture = (sectionIndex, lectureIndex) => {
    const nextSections = formData.sections.map((s, sIdx) => sIdx === sectionIndex ? { ...s, lectures: s.lectures.filter((_, lIdx) => lIdx !== lectureIndex) } : s);
    setFormData({ ...formData, sections: nextSections });
  };

  const resolveVideoUrl = (url) => {
    if (!url) return '';
    let sUrl = String(url).trim();
    if (sUrl.startsWith('www.')) sUrl = \`https://\${sUrl}\`;
    if (sUrl.includes('youtube.com') || sUrl.includes('youtu.be') || sUrl.includes('vimeo.com')) {
      if (!sUrl.startsWith('http')) sUrl = \`https://\${sUrl}\`;
      return sUrl;
    }
    if (sUrl.startsWith('http')) return sUrl;
    if (sUrl.startsWith('//')) return \`https:\${sUrl}\`;
    if (sUrl.startsWith('uploads/') || sUrl.startsWith('/uploads/')) {
      const base = api.defaults.baseURL ? api.defaults.baseURL.replace('/api', '') : 'http://localhost:5000';
      return \`\${base}\${sUrl.startsWith('/') ? sUrl : \`/\${sUrl}\`}\`;
    }
    return sUrl;
  };

  const handleVideoUpload = async (file, sIndex, lIndex) => {
    if (!file) return;
    const toastId = toast.loading('Uploading video matrix...');
    try {
      const uploadData = new FormData();
      uploadData.append('video', file);
      const { data } = await api.post('/upload/video', uploadData);
      const nextSections = formData.sections.map((s, si) => si === sIndex ? { ...s, lectures: s.lectures.map((l, li) => li === lIndex ? { ...l, videoUrl: data.url } : l) } : s);
      setFormData({ ...formData, sections: nextSections });
      toast.success('Matrix Link Sync Complete!', { id: toastId });
    } catch (err) {
      toast.error('Uplink failed: ' + (err.response?.data?.error || 'Server error'), { id: toastId });
    }
  };

  const handlePdfUpload = async (file, sIndex, lIndex) => {
    if (!file) return;
    const toastId = toast.loading('Syncing document to cloud...');
    try {
      const uploadData = new FormData();
      uploadData.append('pdf', file);
      const { data } = await api.post('/upload/pdf', uploadData);
      const nextSections = formData.sections.map((s, si) => si === sIndex ? { ...s, lectures: s.lectures.map((l, li) => li === lIndex ? { ...l, pdfUrl: data.url } : l) } : s);
      setFormData({ ...formData, sections: nextSections });
      toast.success('Document uploaded!', { id: toastId });
    } catch (err) {
      toast.error('Sync failed: ' + (err.response?.data?.error || 'Server error'), { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(\`/courses/\${id}\`, formData);
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

  if (loading || !formData) return <div className="h-screen flex-center animate-pulse text-2xl font-bold font-outfit text-primary tracking-[0.2em] capitalize">Syncing Studio...</div>;

  return (
    <div className="studio-container">
      <header className="studio-header max-width">
        <div className="header-left">
          <button type="button" onClick={() => navigate('/instructor/dashboard')} className="back-btn-studio">
            <ArrowLeft size={18} />
          </button>
          <div className="title-stack">
            <div className="studio-chip"><RefreshCw size={12} /> Edit Mode</div>
            <h1 className="studio-main-title">Project Refinement</h1>
          </div>
        </div>
        <div className="header-right">
          <button type="button" onClick={() => navigate(\`/course/\${id}\`)} className="btn-secondary-outline">Preview Mode</button>
          <button type="button" onClick={handleSubmit} disabled={saving} className="btn-primary studio-publish-btn shadow-primary">
            {saving ? 'Syncing...' : <><UploadCloud size={18} /> Update Live Project</>}
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="studio-workspace-grid max-width">
        <div className="studio-main-col">
          <section className="glass-panel studio-card">
            <div className="card-header-bar">
              <div className="icon-box-small"><Type size={18} /></div>
              <h3>General Information</h3>
            </div>
            <div className="form-content-inner">
              <div className="form-row">
                <label>Course Master Title</label>
                <input type="text" required className="studio-input title-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Curriculum Abstract</label>
                <textarea required rows="5" className="studio-input" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="form-double-row">
                <div className="form-row">
                  <label>Domain Category</label>
                  <select className="studio-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option>Development</option>
                    <option>Artificial Intelligence</option>
                    <option>Business Strategy</option>
                    <option>UI/UX Design</option>
                    <option>Cloud Computing</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Market Price ($)</label>
                  <div className="input-with-symbol">
                    <span className="symbol">$</span>
                    <input type="number" className="studio-input" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="form-double-row">
                <div className="form-row">
                  <label><Award size={12} /> Target Difficulty</label>
                  <select className="studio-input" value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>All Levels</option>
                  </select>
                </div>
                <div className="form-row">
                  <label><Clock size={12} /> Global Duration</label>
                  <input type="text" className="studio-input" value={formData.totalDuration || ''} onChange={e => setFormData({ ...formData, totalDuration: e.target.value })} />
                </div>
              </div>
            </div>
          </section>

          <section className="studio-curriculum-builder">
            <div className="section-head flex-between">
              <div className="flex items-center gap-3">
                <div className="icon-box-small"><MonitorPlay size={18} /></div>
                <h3 className="section-title-large">Curriculum Evolution</h3>
              </div>
              <button type="button" onClick={handleAddSection} className="btn-add-module"><Plus size={16} /> New Module</button>
            </div>
            <div className="module-stack">
              <AnimatePresence>
                {formData.sections.map((section, sIndex) => (
                  <motion.div key={sIndex} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-panel module-card">
                    <div className="module-header">
                      <div className="module-index">#{sIndex + 1}</div>
                      <input type="text" className="module-title-input" placeholder="Module Title" value={section.title} onChange={e => { const newSections = [...formData.sections]; newSections[sIndex].title = e.target.value; setFormData({ ...formData, sections: newSections }); }} />
                      <button type="button" onClick={() => handleRemoveSection(sIndex)} className="btn-icon-danger"><Trash2 size={16} /></button>
                    </div>
                    <div className="lecture-stack">
                      {section.lectures.map((lecture, lIndex) => (
                        <div key={lIndex} className="lecture-input-row">
                          <div className="lecture-drag-handle">::</div>
                          <div className="lecture-inputs">
                            <div className="lec-top-row">
                              <input type="text" placeholder="Lecture Title" className="lec-field flex-1" value={lecture.title} onChange={e => { const newSections = [...formData.sections]; newSections[sIndex].lectures[lIndex].title = e.target.value; setFormData({ ...formData, sections: newSections }); }} />
                              <input type="text" placeholder="Duration" className="lec-field w-24" value={lecture.duration} onChange={e => { const newSections = [...formData.sections]; newSections[sIndex].lectures[lIndex].duration = e.target.value; setFormData({ ...formData, sections: newSections }); }} />
                              <button type="button" onClick={() => handleRemoveLecture(sIndex, lIndex)} className="lec-remove-btn"><Trash2 size={14} /></button>
                            </div>
                            <div className="lec-media-row mt-2 flex gap-2">
                              <input type="text" placeholder="Video URL" className="lec-field flex-1" style={{ margin: 0 }} value={lecture.videoUrl} onChange={e => { const newSections = [...formData.sections]; newSections[sIndex].lectures[lIndex].videoUrl = e.target.value; setFormData({ ...formData, sections: newSections }); }} />
                              <div className="lec-upload-wrap flex gap-2">
                                <label className="lec-upload-btn" style={{ borderColor: lecture.videoUrl ? 'var(--primary)' : 'var(--glass-border)' }}>
                                  <PlayCircle size={16} color={lecture.videoUrl ? 'var(--primary)' : 'currentColor'} /> 
                                  <span style={{ color: lecture.videoUrl ? 'var(--primary)' : 'inherit' }}>{lecture.videoUrl ? 'Video Linked' : 'Video'}</span>
                                  <input type="file" accept="video/*" className="hidden" onChange={(e) => handleVideoUpload(e.target.files[0], sIndex, lIndex)} />
                                </label>
                                <label className="lec-upload-btn" style={{ borderColor: lecture.pdfUrl ? 'var(--primary)' : 'var(--glass-border)' }}>
                                  <Download size={16} color={lecture.pdfUrl ? 'var(--primary)' : 'currentColor'} />
                                  <span style={{ color: lecture.pdfUrl ? 'var(--primary)' : 'inherit' }}>{lecture.pdfUrl ? 'PDF Ready' : 'Add PDF'}</span>
                                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handlePdfUpload(e.target.files[0], sIndex, lIndex)} />
                                </label>
                              </div>
                            </div>
                            {lecture.videoUrl && (
                              <div className="lec-preview-mini mt-2" style={{ height: '140px', borderRadius: '12px', overflow: 'hidden' }}>
                                <ReactPlayer url={resolveVideoUrl(lecture.videoUrl)} controls width="100%" height="100%" />
                              </div>
                            )}
                            <textarea placeholder="Lesson Brief" rows="2" className="lec-field full-width mt-2" value={lecture.description || ''} onChange={e => { const newSections = [...formData.sections]; newSections[sIndex].lectures[lIndex].description = e.target.value; setFormData({ ...formData, sections: newSections }); }} />
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => handleAddLecture(sIndex)} className="btn-add-lecture"><Plus size={14} /> Append Lesson</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          <section className="glass-panel studio-card mt-10">
            <div className="section-head flex-between">
              <div className="flex items-center gap-3">
                <div className="icon-box-small"><Award size={18} /></div>
                <h3 className="section-title-large">Outcomes Architect</h3>
              </div>
              <button type="button" onClick={handleAddOutcome} className="btn-add-module"><Plus size={16} /> New Outcome</button>
            </div>
            <div className="form-content-inner">
              {formData.outcomes.map((outcome, idx) => (
                <div key={idx} className="lecture-input-row">
                  <input type="text" className="studio-input full-width" placeholder="Outcome" value={outcome} onChange={e => handleOutcomeChange(idx, e.target.value)} />
                  <button type="button" onClick={() => handleRemoveOutcome(idx)} className="btn-icon-danger ml-2"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="studio-sidebar">
          <div className="glass-panel sidebar-card">
            <h4 className="sidebar-subtitle"> Visual Identity</h4>
            <div className="thumbnail-studio-box">
              <img src={formData.thumbnail} alt="preview" />
              <div className="thumb-uploader">
                <UploadCloud size={20} />
                <span>Change Thumbnail</span>
              </div>
            </div>
            <div className="form-row mt-4">
              <label>External Image Link</label>
              <input type="text" className="studio-input" value={formData.thumbnail} onChange={e => setFormData({ ...formData, thumbnail: e.target.value })} />
            </div>
          </div>
          <div className="glass-panel sidebar-card studio-actions">
            <h4 className="sidebar-subtitle"><Settings size={14} /> System Sync</h4>
            <div className="workflow-status">
              <div className="status-item"><div className="dot active pulse" /> Real-time Delta Tracking</div>
              <div className="status-item"><div className="dot active" /> Cloud Sync Validate</div>
            </div>
            <div className="readiness-meter mt-4 mb-6">
              <div className="flex-between mb-2">
                <span className="text-xs font-bold uppercase text-muted">Update Readiness</span>
                <span className="text-xs font-bold text-primary">95%</span>
              </div>
              <div className="meter-track">
                <div className="meter-fill" style={{ width: '95%' }} />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary full-width bigger shadow-primary">
              {saving ? 'Syncing...' : <><Save size={18} /> Confirm Update</>}
            </button>
          </div>
        </aside>
      </form>
\`;

const headIdx = content.indexOf('<style dangerouslySetInnerHTML');
const cssBlock = content.substring(headIdx);
let finalCss = cssBlock.replace('CreateCourse', 'EditCourse');

const finalFileContent = jsContent + finalCss;
fs.writeFileSync('./src/pages/EditCourse.jsx', finalFileContent);
