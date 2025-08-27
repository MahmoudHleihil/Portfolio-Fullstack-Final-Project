import { useEffect, useState, useContext } from "react";
import { API, authHeader } from "../../api/http";
import { AuthCtx } from "../../context/AuthContext";

export default function BlogAdmin() {
  const { token, user } = useContext(AuthCtx);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    userId: user?.id || 1,
    title: "",
    slug: "",
    contentHtml: "<p>Hello</p>",
    coverUrl: "",
    publishedAt: "",
  });
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch(API("/api/blogs"));
      if (!res.ok) throw new Error("Failed to fetch blogs");
      setPosts(await res.json());
    } catch (err) {
      console.error(err);
      setError("Could not load blog posts.");
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  const generateSlug = (title) =>
    title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

const save = async () => {
  if (!form.title.trim()) {
    setError("Title is required.");
    return;
  }

  // Remove slug from the payload; backend generates it
  const { slug, ...payload } = form;

  try {
    const method = form.id ? "PUT" : "POST";
    const url = form.id ? API(`/api/blogs/${form.id}`) : API("/api/blogs");

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Server responded with ${res.status}`);

    setForm({
      id: null,
      userId: user?.id || 1,
      title: "",
      contentHtml: "",
      coverUrl: "",
      publishedAt: "",
    });
    setError("");
    load();
  } catch (err) {
    console.error(err);
    setError("Failed to save blog post.");
  }
};


  const remove = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await fetch(API(`/api/blogs/${id}`), {
        method: "DELETE",
        headers: authHeader(),
      });
      load();
    } catch (err) {
      console.error(err);
      setError("Failed to delete post.");
    }
  };

const edit = (post) => {
  setForm({
    ...post,
    slug: post.slug || "",
    title: post.title || "",
    coverUrl: post.coverUrl || "",
    contentHtml: post.contentHtml || "<p>Hello</p>",
    publishedAt: post.publishedAt || "",
    userId: user?.id || 1,
  });
};



  return (
    <div className="container my-4">
      <h1 className="text-primary mb-4">Blog Admin</h1>
      {!token && <p className="text-danger">Login required.</p>}

      {/* Blog Form */}
      <div className="card p-3 mb-4 shadow-sm">
        <h4>{form.id ? "Edit Blog Post" : "Add New Blog Post"}</h4>
        <input
          className="form-control my-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="form-control my-2"
          placeholder="Slug (optional)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <input
          className="form-control my-2"
          placeholder="Cover URL"
          value={form.coverUrl}
          onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
        />
        <input
          className="form-control my-2"
          placeholder="PublishedAt (YYYY-MM-DD)"
          value={form.publishedAt}
          onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
        />
        <textarea
          className="form-control my-2"
          rows={6}
          placeholder="HTML content"
          value={form.contentHtml || "<p>Hello</p>"}
          onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
        />
        <button className="btn btn-success mt-2" onClick={save} disabled={!token}>
          {form.id ? "Update" : "Save"}
        </button>
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>

      {/* Posts List */}
      <div className="card p-3 shadow-sm">
        <h4>Existing Blog Posts</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Published</th>
              <th style={{ width: "140px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.coverUrl ? (
                      <img
                        src={p.coverUrl}
                        alt="cover"
                        style={{ width: "60px", borderRadius: "4px" }}
                      />
                    ) : (
                      <span className="text-muted">No Cover</span>
                    )}
                  </td>
                  <td>{p.title}</td>
                  <td>{p.publishedAt || "Draft"}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary me-2" onClick={() => {
                      setForm({
                          ...p,
                          slug: p.slug || "",
                          title: p.title || "",
                          coverUrl: p.coverUrl || "",
                          contentHtml: p.contentHtml || "<p>Hello</p>", // fallback
                          publishedAt: p.publishedAt || "",
                          userId: user?.id || 1,
                        });
                    }}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No blog posts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
