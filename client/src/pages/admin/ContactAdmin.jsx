import { useEffect, useState, useContext } from "react";
import { API, authHeader } from "../../api/http";
import { AuthCtx } from "../../context/AuthContext";

export default function ContactAdmin() {
  const { token } = useContext(AuthCtx);
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(API("/api/contact"), { headers: authHeader() });
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setMsgs(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Could not load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  const remove = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await fetch(API(`/api/contact/${id}`), {
        method: "DELETE",
        headers: authHeader(),
      });
      load();
    } catch (err) {
      console.error(err);
      setError("Failed to delete message.");
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-primary mb-4">Contact Admin</h1>

      {!token && <p className="text-danger">Login required.</p>}

      {token && (
        <div className="card p-3 shadow-sm">
          <h4>Messages</h4>

          {loading ? (
            <p className="text-muted">Loading messages...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : msgs.length === 0 ? (
            <p className="text-muted">No messages found.</p>
          ) : (
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th style={{ width: "120px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {msgs.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.subject}</td>
                    <td>{m.message}</td>
                    <td>
                      {m.createdAt
                        ? new Date(m.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => remove(m.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
