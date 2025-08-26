import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaLinkedin, FaGithub, FaArrowDown, FaDownload } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100 text-center text-light bg-dark position-relative overflow-hidden px-3">
      {/* Profile */}
      {/* <img
        src="/profile.jpg"
        alt="Profile"
        className="rounded-circle shadow mb-4"
        style={{
          width: '160px',
          height: '160px',
          objectFit: 'cover',
          border: '3px solid #0d6efd'
        }}
        data-aos="fade-down"
      /> */}

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

      {/* Short Bio */}
      <p className="lead text-secondary mb-4" data-aos="fade-up" data-aos-delay="200">
        I'm a passionate Computer Science student eager to grow in the world of software development. 
        I enjoy learning new technologies, building hands-on projects, and solving real-world problems through code.
      </p>

      {/* Buttons */}
      <div className="d-flex gap-3 flex-wrap justify-content-center" data-aos="zoom-in" data-aos-delay="400">
        <a href="/projects" className="btn btn-primary px-4 shadow-sm">
          View Projects
        </a>
        <a href="/contact" className="btn btn-outline-light px-4 shadow-sm">
          Contact Me
        </a>
      </div>

      {/* About Me as a CS Student */}
      <div className="mt-5" data-aos="fade-up" data-aos-delay="800">
        <h5 className="text-uppercase text-secondary mb-3">About Me</h5>
        <p className="text-light small px-md-5">
          I'm a Computer Science student with a strong interest in full-stack development, algorithms, and system design. 
          I'm constantly exploring new technologies and working on personal and academic projects to deepen my skills.
          My passion lies in building clean, efficient, and user-centric applications that solve real-world problems.
          <br />
          I aspire to work in tech companies where I can contribute to impactful software products and continue growing as a developer.
        </p>
      </div>

      {/* Academic Interests */}
      <div className="mt-4" data-aos="fade-up" data-aos-delay="900">
        <h5 className="text-uppercase text-secondary mb-3">Academic Focus</h5>
        <p className="text-light small px-md-5">
          My studies focus on data structures, web development, databases, and software engineering. 
          I also enjoy exploring fields like cybersecurity, machine learning, and distributed systems.
        </p>
      </div>

      {/* Projects */}
      <div className="mt-4" data-aos="fade-up" data-aos-delay="1000">
        <h5 className="text-uppercase text-secondary mb-3">Recent Projects</h5>
        <ul className="list-unstyled text-light small">
          <li>📁 <strong>Task Manager API</strong> – Node.js backend with JWT auth and MongoDB.</li>
          <li>♟️ <strong>Console Chess Game</strong> – Built in C++ using object-oriented design.</li>
          <li>📊 <strong>Data Visualization Dashboard</strong> – React + Chart.js for dynamic analytics.</li>
          <li>🧠 <strong>KNN Classifier</strong> – Python-based ML model trained on real-world datasets.</li>
        </ul>
      </div>

      {/* Technologies */}
      <div className="mt-4" data-aos="fade-up" data-aos-delay="1100">
        <h5 className="text-uppercase text-secondary mb-3">Technologies I Work With</h5>
        <p className="text-light small px-md-5">
          JavaScript, Python, C++, React, Node.js, Express, MongoDB, MySQL, Git, Docker, and more.
          <br />
          I use React for building responsive interfaces, Node.js for backend APIs, and Docker to containerize my apps during development.
        </p>
      </div>

      {/* Quote */}
      <div className="mt-5 text-info fst-italic" data-aos="fade-up" data-aos-delay="1200">
        <p>"Learning to write programs stretches your mind, and helps you think better." – Bill Gates</p>
      </div>

      {/* Personal Quote */}
      <blockquote className="mt-5 text-secondary fst-italic" data-aos="fade-up" data-aos-delay="900">
        “Code is like humor. When you have to explain it, it’s bad.”
      </blockquote>
    </div>
  );
}
