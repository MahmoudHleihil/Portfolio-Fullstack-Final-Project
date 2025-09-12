import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaProjectDiagram, FaTools, FaBlog, FaFileAlt, FaEnvelope } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import { NavLink } from 'react-router-dom';

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  const sections = [
    { name: "Projects", path: "/projects", icon: <FaProjectDiagram className="me-2" /> },
    { name: "Skills", path: "/skills", icon: <FaTools className="me-2" /> },
    { name: "Blog", path: "/blog", icon: <FaBlog className="me-2" /> },
    { name: "Resume", path: "/resume", icon: <FaFileAlt className="me-2" /> },
    { name: "Contact", path: "/contact", icon: <FaEnvelope className="me-2" /> },
  ];

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100 text-center text-light bg-dark position-relative overflow-hidden px-3">
      {/* Name & Animated Title */}
      <h1 className="display-4 fw-bold mb-2" data-aos="fade-up">
        Hi, I'm <span className="text-primary">Mahmoud Hleihil</span>
      </h1>

      <TypeAnimation
        sequence={[
          'Computer Science Student',
          1500,
          'Aspiring Full-Stack Developer',
          1500,
          'Always Learning & Exploring',
          1500
        ]}
        wrapper="h5"
        cursor={true}
        repeat={Infinity}
        className="text-info mb-4"
      />

      {/* Navigation Cards */}
      <div className="row g-3 justify-content-center w-100" data-aos="zoom-in" data-aos-delay="400">
        {sections.map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <NavLink
              to={s.path}
              className={({ isActive }) =>
                `text-decoration-none ${isActive ? "fw-bold text-primary" : ""}`
              }
            >
              <div className="card shadow-sm h-100 p-3 text-center hover-shadow bg-secondary">
                <div className="fs-1 text-primary mb-2">{s.icon}</div>
                <h5 className="text-light">{s.name}</h5>
              </div>
            </NavLink>
          </div>
        ))}
      </div>

      {/* Short Bio */}
      <p className="lead text-secondary mt-4 mb-4 px-md-5" data-aos="fade-up" data-aos-delay="600">
        I'm a passionate Computer Science student eager to grow in the world of software development. 
        I enjoy learning new technologies, building hands-on projects, and solving real-world problems through code.
      </p>

      {/* Optional sections like About, Academic Focus, Projects, Technologies, Quotes */}
      {/* Keep the rest of your Home content here... */}
    </div>
  );
}
