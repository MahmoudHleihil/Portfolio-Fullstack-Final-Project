import { useEffect, useState } from "react";
import { API } from "../api/http";

export default function Resume() {
  // State for experience, education, certifications
  const [exp, setExp] = useState([]);
  const [edu, setEdu] = useState([]);
  const [certs, setCerts] = useState([]);
  
  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(API("/api/resume"));
        if (!res.ok) throw new Error("Failed to load resume");
        const data = await res.json();

        // Update state with fetched data
        setExp(data.experience || []);
        setEdu(data.education || []);
        setCerts(data.certs || []);
      } catch (err) {
        console.error(err);
        setError("Could not load resume.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-primary">Resume</h1>

      {/* Loading & error messages */}
      {loading && <p>Loading resume…</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <>
          {/* Experience Section */}
          <div className="card p-3 mb-4 shadow-sm">
            <h3 className="mb-3">Experience</h3>
            {exp.length === 0 && <p className="text-muted">No experience added yet.</p>}
            <ul className="list-unstyled">
              {exp.map((e) => (
                <li key={e.id} className="mb-2">
                  <strong>{e.roleTitle}</strong> @ {e.company}{" "}
                  <span className="text-muted">
                    ({e.yearFrom} – {e.yearTo || "Present"})
                  </span>
                  <p>{e.description}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Education Section */}
          <div className="card p-3 mb-4 shadow-sm">
            <h3 className="mb-3">Education</h3>
            {edu.length === 0 && <p className="text-muted">No education added yet.</p>}
            <ul className="list-unstyled">
              {edu.map((e) => (
                <li key={e.id} className="mb-2">
                  <strong>{e.degree}</strong> – {e.institution}{" "}
                  <span className="text-muted">
                    ({e.yearFrom} – {e.yearTo || "Present"})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications Section */}
          <div className="card p-3 mb-4 shadow-sm">
            <h3 className="mb-3">Certifications</h3>
            {certs.length === 0 && <p className="text-muted">No certifications added yet.</p>}
            <ul className="list-unstyled">
              {certs.map((c) => (
                <li key={c.id} className="mb-2">
                  <strong>{c.title}</strong> – {c.organization}{" "}
                  <span className="text-muted">({c.year})</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
