import { useEffect, useState, useContext } from "react";
import { API, authHeader } from "../../api/http";
import { AuthCtx } from "../../context/AuthContext";
import Select from 'react-select/creatable';

export default function ProjectsAdmin() {
  const { token, user } = useContext(AuthCtx); // include user
  const [items, setItems] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
    userId: 1,
    skillIds: [],
  });

  const load = async () => {
    const res = await fetch(API("/api/projects"));
    setItems(await res.json());
    const s = await fetch(API("/api/skills")).then((r) => r.json());
    setSkills(s);
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

const save = async () => {
  if (!token) {
    alert("You must be an admin to save projects.");
    return;
  }

  if (!form.title || !form.summary || !form.description) {
    alert("Please fill in Title, Summary, and Description.");
    return;
  }

  // Generate slug
  const generateSlug = (title) =>
    title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

  let slug = generateSlug(form.title);

  // Ensure slug is unique among other projects
  let slugExists = items.some((p) => p.slug === slug && p.id !== form.id);
  let counter = 1;
  while (slugExists) {
    slug = `${slug}-${counter}`;
    slugExists = items.some((p) => p.slug === slug && p.id !== form.id);
    counter++;
  }

  const payload = { ...form, slug, userId: user?.id || 1 };

  try {
    const method = form.id ? "PUT" : "POST";
    const url = form.id ? API(`/api/projects/${form.id}`) : API("/api/projects");

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Server responded with ${res.status}: ${errorText}`);
    }

    // Reset form after saving
    setForm({
      title: "",
      slug: "",
      summary: "",
      description: "",
      githubUrl: "",
      liveUrl: "",
      userId: user?.id || 1,
      skillIds: [],
    });

    load(); // reload projects
    alert(`Project ${form.id ? "updated" : "created"} successfully!`);
  } catch (err) {
    console.error("Save failed:", err);
    alert("Save failed, please check the console.");
  }
};

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    await fetch(API(`/api/projects/${id}`), {
      method: "DELETE",
      headers: authHeader(),
    });
    load();
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-primary">Projects Admin</h1>

      {/* Project Form */}
<div className="row g-2">
  {/* Inputs */}
  <div className="col-md-6">
    <input
      className="form-control"
      placeholder="Title"
      value={form.title}
      onChange={(e) => setForm({ ...form, title: e.target.value })}
    />
  </div>
  {/* Slug input removed or disabled because it’s auto-generated */}
  <div className="col-md-12">
    <input
      className="form-control"
      placeholder="Summary"
      value={form.summary}
      onChange={(e) => setForm({ ...form, summary: e.target.value })}
    />
  </div>
  <div className="col-md-12">
    <textarea
      className="form-control"
      placeholder="Description"
      rows={3}
      value={form.description}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
    />
  </div>
  <div className="col-md-6">
    <input
      className="form-control"
      placeholder="GitHub URL"
      value={form.githubUrl}
      onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
    />
  </div>
  <div className="col-md-6">
    <input
      className="form-control"
      placeholder="Live URL"
      value={form.liveUrl}
      onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
    />
  </div>
  <div className="col-md-12">
    <label className="form-label">Skills</label>
    <Select
  isMulti
  value={(form.skillIds || []).map((id) => {
    const skill = (skills || []).find((s) => s.id === id);
    return skill ? { value: skill.id, label: skill.name } : null;
  }).filter(Boolean)}
  onChange={(selected) => {
    const newSkillIds = selected.map((s) => s.value);
    setForm({ ...form, skillIds: newSkillIds });
  }}
  options={(skills || []).map((s) => ({ value: s.id, label: s.name }))}
  placeholder="Select or type skills..."
  onCreateOption={(inputValue) => {
    fetch(API("/api/skills"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({ name: inputValue }),
    })
      .then((res) => res.json())
      .then((newSkill) => {
        setSkills([...skills, newSkill]);
        setForm({
          ...form,
          skillIds: [...(form.skillIds || []), newSkill.id],
        });
      });
  }}
  styles={{
    option: (provided, state) => ({
      ...provided,
      color: "black",
      backgroundColor: state.isFocused ? "#e0f0ff" : "white",
    }),
    multiValueLabel: (provided) => ({ ...provided, color: "#000" }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#555",
      ':hover': { backgroundColor: "#cce4ff", color: "#000" },
    }),
    control: (provided) => ({ ...provided, backgroundColor: "white" }),
    placeholder: (provided) => ({ ...provided, color: "#6c757d" }),
  }}
/>

  </div>
</div>

{/* Save button */}
<button
  className="btn btn-primary mt-3"
  onClick={save}
  disabled={
    !token ||  !form.title || !form.summary || !form.description
  }
  title={
    !token
      ? "You must be an admin to save projects"
      : !form.title || !form.summary || !form.description
      ? "Please fill in Title, Summary, and Description"
      : ""
  }
>
  Save Project
</button>

      {/* Project List */}
      <div className="card p-3 shadow-sm">
        <h4>Existing Projects</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Summary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.title}</td>
                <td>{i.slug}</td>
                <td>{i.summary}</td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary me-2"
                    onClick={() => {
                        setForm({
                          ...i,
                          skillIds: (i.skills || []).map((s) => s.skill.id), // map to IDs for the form
                        });
                    }}
                    disabled={!token}
                    title={!user || user.role !== "admin" ? "You must be an admin to edit projects" : ""}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => remove(i.id)}
                    disabled={!token} // disable delete for non-admins
                    title={!user || user.role !== "admin" ? "You must be an admin to delete projects" : ""}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No projects yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
