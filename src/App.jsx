import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/Dashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import CreateCourse from './pages/CreateCourse';
import Learn from './pages/Learn';
import QuizPlayer from './pages/QuizPlayer';
import EditCourse from './pages/EditCourse';
import CreateQuiz from './pages/CreateQuiz';
import Quizzes from './pages/Quizzes';
import About from './pages/About';
import AIGuide from './pages/AIGuide';

// Utilities
import ScrollToTop from './components/ScrollToTop';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector(state => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const homePath = user.role === 'instructor' ? '/instructor/dashboard' : '/dashboard';
    return <Navigate to={homePath} replace />;
  }

  return children;
};

function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Toaster position="top-center" toastOptions={{
          style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
        }} />
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/about" element={<About />} />


          {/* Student Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/ai-guide" element={
            <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
              <AIGuide />
            </ProtectedRoute>
          } />

          <Route path="/learn/:id" element={
            <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
              <Learn />
            </ProtectedRoute>
          } />

          <Route path="/quiz/:courseId" element={
            <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
              <QuizPlayer />
            </ProtectedRoute>
          } />

          {/* Instructor Routes */}
          <Route path="/instructor/dashboard" element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <InstructorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/instructor/create-course" element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <CreateCourse />
            </ProtectedRoute>
          } />

          <Route path="/instructor/edit-course/:id" element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <EditCourse />
            </ProtectedRoute>
          } />

          <Route path="/instructor/create-quiz" element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <CreateQuiz />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
