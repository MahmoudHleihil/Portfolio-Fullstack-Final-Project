import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API, authHeader } from "../../api/http";
import { AuthCtx } from "../../context/AuthContext";

export default function ResumeAdmin() {
  const { token } = useContext(AuthCtx);
  const navigate = useNavigate();

  const [exp, setExp] = useState([]);
  const [edu, setEdu] = useState([]);
  const [certs, setCerts] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    type: "experience",
    title: "",
    institution: "",
    field: "",
    roleTitle: "",
    company: "",
    organization: "",
    credentialUrl: "",
    yearFrom: "",
    yearTo: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Load resume data
  const load = async () => {
    try {
      const r = await fetch(API("/api/resume"), { headers: authHeader() });
      if (!r.ok) throw new Error("Failed to fetch resume data");
      const d = await r.json();
      setExp(d.experience || []);
      setEdu(d.education || []);
      setCerts(d.certs || []);
    } catch (err) {
      console.error(err);
      setError("Could not load resume data.");
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  // Build backend payload based on type
  const buildPayload = () => {
    switch (form.type) {
      case "experience":
        return {
          type: "experience",
          roleTitle: form.title,
          company: form.company,
          startDate: form.yearFrom ? new Date(form.yearFrom).toISOString() : null,
          endDate: form.yearTo ? new Date(form.yearTo).toISOString() : null,
          description: form.field || "",
          isCurrent: false,
        };
      case "education":
        return {
          type: "education",
          degree: form.title,
          institution: form.institution,
          field: form.field || "",
          startDate: form.yearFrom ? new Date(form.yearFrom).toISOString() : null,
          endDate: form.yearTo ? new Date(form.yearTo).toISOString() : null,
        };
      case "certification":
        return {
          type: "certification",
          title: form.title,
          organization: form.organization,
          credentialUrl: form.credentialUrl || "",
          dateIssued: form.yearFrom ? new Date(form.yearFrom).toISOString() : null,
        };
      default:
        return {};
    }
  };

  const save = async () => {
    setError("");
    if (!form.title.trim()) {
      setError("Title / Role / Degree is required.");
      return;
    }

    try {
      const payload = buildPayload();
      const r = await fetch(API("/api/resume"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(text || "Failed to save entry.");
      }
      setForm({
        type: "experience",
        title: "",
        institution: "",
        field: "",
        roleTitle: "",
        company: "",
        organization: "",
        credentialUrl: "",
        yearFrom: "",
        yearTo: "",
      });
      load();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const remove = async (type, id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      const r = await fetch(API(`/api/resume/${type}/${id}`), {
        method: "DELETE",
        headers: authHeader(),
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(text || "Failed to delete entry.");
      }
      load();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-primary mb-4">Resume Admin</h1>

      {/* Form */}
      <div className="card p-3 mb-4 shadow-sm">
        <h4>Add Resume Entry</h4>

        <select
          className="form-select my-2"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="experience">Experience</option>
          <option value="education">Education</option>
          <option value="certification">Certification</option>
        </select>

        <input
          className="form-control my-2"
          placeholder="Title / Role / Degree"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        {form.type === "experience" && (
          <input
            className="form-control my-2"
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        )}

        {form.type === "education" && (
          <>
            <input
              className="form-control my-2"
              placeholder="Institution"
              value={form.institution}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
            />
            <input
              className="form-control my-2"
              placeholder="Field"
              value={form.field}
              onChange={(e) => setForm({ ...form, field: e.target.value })}
            />
          </>
        )}

        {form.type === "certification" && (
          <input
            className="form-control my-2"
            placeholder="Organization"
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
          />
        )}

        <div className="row">
          <div className="col">
            <input
              className="form-control my-2"
              placeholder={form.type === "certification" ? "Date Issued" : "Year From"}
              value={form.yearFrom}
              onChange={(e) => setForm({ ...form, yearFrom: e.target.value })}
            />
          </div>
          {form.type !== "certification" && (
            <div className="col">
              <input
                className="form-control my-2"
                placeholder="Year To"
                value={form.yearTo}
                onChange={(e) => setForm({ ...form, yearTo: e.target.value })}
              />
            </div>
          )}
        </div>

        <button className="btn btn-success mt-2" onClick={save} disabled={!token}>
          Save
        </button>
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>

      {/* Resume Sections */}
      <div className="card p-3 shadow-sm">
        <h3>Experience</h3>
        <ul className="list-group mb-3">
          {exp.map((e) => (
            <li key={e.id} className="list-group-item d-flex justify-content-between align-items-center">
              {e.roleTitle} @ {e.company} ({e.startDate?.slice(0, 10)} - {e.endDate?.slice(0, 10)})
              <button className="btn btn-sm btn-danger" onClick={() => remove("experience", e.id)}>Delete</button>
            </li>
          ))}
        </ul>

        <h3>Education</h3>
        <ul className="list-group mb-3">
          {edu.map((e) => (
            <li key={e.id} className="list-group-item d-flex justify-content-between align-items-center">
              {e.degree} – {e.institution} ({e.startDate?.slice(0, 10)} - {e.endDate?.slice(0, 10)})
              <button className="btn btn-sm btn-danger" onClick={() => remove("education", e.id)}>Delete</button>
            </li>
          ))}
        </ul>

        <h3>Certifications</h3>
        <ul className="list-group">
          {certs.map((c) => (
            <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
              {c.title} – {c.organization} ({c.dateIssued?.slice(0, 10)})
              <button className="btn btn-sm btn-danger" onClick={() => remove("certification", c.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
