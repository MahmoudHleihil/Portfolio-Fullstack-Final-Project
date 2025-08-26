import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Resume from './pages/Resume.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import BlogList from './pages/BlogList.jsx';
import BlogPost from './pages/BlogPost.jsx';
import Contact from './pages/Contact.jsx';

import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ProjectsAdmin from './pages/admin/ProjectsAdmin.jsx';
import SkillsAdmin from './pages/admin/SkillsAdmin.jsx';
import BlogAdmin from './pages/admin/BlogAdmin.jsx';
import ContactAdmin from './pages/admin/ContactAdmin.jsx';
import ResumeAdmin from './pages/admin/ResumeAdmin.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100 bg-dark text-light">
          <Header />

          <main className="flex-grow-1 container px-3 py-4" style={{ maxWidth: 1200 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetails />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/projects" element={<ProjectsAdmin />} />
              <Route path="/admin/skills" element={<SkillsAdmin />} />
              <Route path="/admin/blog" element={<BlogAdmin />} />
              <Route path="/admin/contact" element={<ContactAdmin />} />
              <Route path="/admin/resume" element={<ResumeAdmin />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
