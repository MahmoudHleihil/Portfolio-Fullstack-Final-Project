import { useEffect } from 'react';
import AOS from 'aos'; // Animate On Scroll library
import 'aos/dist/aos.css';
import { FaGraduationCap, FaLaptopCode, FaUsers } from 'react-icons/fa';

export default function About() {
  // Initialize AOS animations on component mount
  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <div className="container py-5 text-light">
      {/* Section title */}
      <h1 className="text-center mb-4" data-aos="fade-up">
        About Me
      </h1>

      {/* Intro paragraph */}
      <p
        className="lead text-secondary text-center mb-5 px-md-5"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        I’m a <span className="text-info">Computer Science student</span> with a passion 
        for building full-stack applications, exploring modern web technologies, 
        and solving real-world problems through clean, efficient code.
      </p>

      {/* Cards showcasing background, skills, and vision */}
      <div className="row g-4">
        <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
          <div className="card bg-dark shadow-sm h-100 p-4 text-center">
            <FaGraduationCap size={40} className="text-primary mb-3" />
            <h5>Academic Background</h5>
            <p className="small text-secondary">
              Strong foundation in algorithms, databases, and software engineering. 
              Always eager to apply theory to practical projects.
            </p>
          </div>
        </div>

        <div className="col-md-4" data-aos="fade-up" data-aos-delay="500">
          <div className="card bg-dark shadow-sm h-100 p-4 text-center">
            <FaLaptopCode size={40} className="text-success mb-3" />
            <h5>Technical Skills</h5>
            <p className="small text-secondary">
              Proficient in JavaScript, React, Node.js, Express, and SQL. 
              Experienced with Git, Docker, and cloud deployment.
            </p>
          </div>
        </div>

        <div className="col-md-4" data-aos="fade-up" data-aos-delay="700">
          <div className="card bg-dark shadow-sm h-100 p-4 text-center">
            <FaUsers size={40} className="text-warning mb-3" />
            <h5>Teamwork & Vision</h5>
            <p className="small text-secondary">
              I believe in collaboration, continuous learning, and creating 
              impactful software that improves people’s lives.
            </p>
          </div>
        </div>
      </div>

      {/* Quote / mission statement */}
      <div className="mt-5 text-center" data-aos="fade-up" data-aos-delay="900">
        <blockquote className="fst-italic text-info">
          “My mission is to combine creativity and technology to build applications 
          that are not only functional but also meaningful.”
        </blockquote>
      </div>
    </div>
  );
}
