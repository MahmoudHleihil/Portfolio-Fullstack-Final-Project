import { FaProjectDiagram, FaTools, FaBlog, FaFileAlt, FaEnvelope } from "react-icons/fa";

export default function Dashboard() {
  const sections = [
    { name: "Projects", path: "/admin/projects", icon: <FaProjectDiagram className="me-2" /> },
    { name: "Skills", path: "/admin/skills", icon: <FaTools className="me-2" /> },
    { name: "Blog", path: "/admin/blog", icon: <FaBlog className="me-2" /> },
    { name: "Resume", path: "/admin/resume", icon: <FaFileAlt className="me-2" /> },
    { name: "Contact", path: "/admin/contact", icon: <FaEnvelope className="me-2" /> },
  ];

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-primary">Admin Dashboard</h1>
      <div className="row g-3">
        {sections.map((s, i) => (
          <div key={i} className="col-md-4">
            <a href={s.path} className="text-decoration-none">
              <div className="card shadow-sm h-100 p-3 text-center hover-shadow">
                <div className="fs-1 text-primary mb-2">{s.icon}</div>
                <h5 className="text-dark">{s.name}</h5>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
