import { useEffect, useState, useContext } from "react";
import { API, authHeader } from "../../api/http";
import { AuthCtx } from "../../context/AuthContext";

export default function SkillsAdmin() {
  const { token } = useContext(AuthCtx);
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(API("/api/skills"), { headers: authHeader() });
      if (!res.ok) throw new Error("Failed to fetch skills");
      setSkills(await res.json());
      setError("");
    } catch (err) {
      console.error(err);
      setError("Could not load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  const save = async () => {
    if (!name.trim()) {
      setError("Skill name cannot be empty");
      return;
    }
    try {
      await fetch(API("/api/skills"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ name }),
      });
      setName("");
      setError("");
      load();
    } catch (err) {
      console.error(err);
      setError("Failed to save skill.");
    }
  };

  const update = async (id) => {
    if (!editName.trim()) {
      setError("Skill name cannot be empty");
      return;
    }
    try {
      await fetch(API(`/api/skills/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ name: editName }),
      });
      setEditing(null);
      setEditName("");
      setError("");
      load();
    } catch (err) {
      console.error(err);
      setError("Failed to update skill.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await fetch(API(`/api/skills/${id}`), {
        method: "DELETE",
        headers: authHeader(),
      });
      load();
    } catch (err) {
      console.error(err);
      setError("Failed to delete skill.");
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-primary mb-4">Skills Admin</h1>

      {/* Add Skill Form */}
      <div className="card p-3 mb-4 shadow-sm">
        <h4>Add a New Skill</h4>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Skill Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn btn-success" onClick={save} disabled={!token}>
            Add
          </button>
        </div>
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>

      {/* Skills List */}
      <div className="card p-3 shadow-sm">
        <h4>Existing Skills</h4>
        {loading ? (
          <p className="text-muted">Loading skills...</p>
        ) : (
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Skill</th>
                <th style={{ width: "160px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id}>
                  <td>
                    {editing === s.id ? (
                      <input
                        className="form-control"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      s.name
                    )}
                  </td>
                  <td>
                    {editing === s.id ? (
                      <>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => update(s.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setEditing(null);
                            setEditName("");
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => {
                            setEditing(s.id);
                            setEditName(s.name);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => remove(s.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {skills.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center text-muted">
                    No skills found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
