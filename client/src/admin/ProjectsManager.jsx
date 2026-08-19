import { useEffect, useState, useCallback } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api";

const EMPTY = {
  title: "",
  description: "",
  tech_stack: "",
  live_link: "",
  github_link: "",
  image_url: "",
};

function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className={`toast ${type}`}>{message}</div>;
}

function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(
    project
      ? {
          ...project,
          tech_stack: Array.isArray(project.tech_stack)
            ? project.tech_stack.join(", ")
            : project.tech_stack || "",
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setErr("Title is required."); return; }
    setSaving(true);
    setErr("");
    try {
      const payload = {
        ...form,
        tech_stack: form.tech_stack
          ? form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await onSave(payload);
      onClose();
    } catch {
      setErr("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{project ? "Edit Project" : "Add Project"}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Project name" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What does this project do?" style={{ resize: "vertical" }} />
            </div>
            <div className="form-group">
              <label className="form-label">Tech Stack (comma-separated)</label>
              <input className="form-input" value={form.tech_stack} onChange={(e) => set("tech_stack", e.target.value)} placeholder="React, Node.js, PostgreSQL" />
            </div>
            <div className="form-group">
              <label className="form-label">Live Link</label>
              <input className="form-input" value={form.live_link} onChange={(e) => set("live_link", e.target.value)} placeholder="https://myapp.com" />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub Link</label>
              <input className="form-input" value={form.github_link} onChange={(e) => set("github_link", e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input className="form-input" value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://..." />
            </div>
            {err && <div className="form-error">{err}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? "Saving…" : project ? "Save Changes" : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | project object
  const [toast, setToast] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getProjects()
      .then((r) => setProjects(r.data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleSave = async (payload) => {
    if (modal && modal.id) {
      await updateProject(modal.id, payload);
      showToast("Project updated!");
    } else {
      await createProject(payload);
      showToast("Project added!");
    }
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await deleteProject(id);
    showToast("Project deleted.", "error");
    load();
  };

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
      {modal !== null && (
        <ProjectModal
          project={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <div className="admin-panel-header">
        <h2 className="admin-panel-title">Projects ({projects.length})</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setModal("add")}>
          + Add Project
        </button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="loading-area"><div className="spinner" /> Loading…</div>
        ) : projects.length === 0 ? (
          <div className="admin-empty">No projects yet. Add your first one!</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Tech Stack</th>
                <th>Links</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className="td-main">{p.title}</td>
                  <td>
                    <div className="tech-badges" style={{ gap: 4 }}>
                      {(p.tech_stack || []).slice(0, 3).map((t) => (
                        <span key={t} className="tech-badge">{t}</span>
                      ))}
                      {(p.tech_stack || []).length > 3 && (
                        <span className="tech-badge">+{p.tech_stack.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {p.live_link && <a href={p.live_link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontSize: "0.8rem", marginRight: 8 }}>Live ↗</a>}
                    {p.github_link && <a href={p.github_link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontSize: "0.8rem" }}>GitHub ↗</a>}
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
