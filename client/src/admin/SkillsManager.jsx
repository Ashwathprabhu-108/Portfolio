import { useEffect, useState, useCallback } from "react";
import { getSkills, createSkill, updateSkill, deleteSkill } from "../api";

const CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Mobile", "Tools", "Other"];
const EMPTY = { name: "", category: "Frontend", proficiency: 3 };

function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className={`toast ${type}`}>{message}</div>;
}

function SkillModal({ skill, onClose, onSave }) {
  const [form, setForm] = useState(skill || EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setErr("Name is required."); return; }
    setSaving(true);
    setErr("");
    try {
      await onSave({ ...form, proficiency: Number(form.proficiency) });
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
          <span className="modal-title">{skill ? "Edit Skill" : "Add Skill"}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Skill Name *</label>
              <input className="form-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. React, Python, Docker" />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Proficiency (1–5)</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set("proficiency", n)}
                    style={{
                      width: 36, height: 36, borderRadius: "50%",
                      border: `2px solid ${n <= form.proficiency ? "var(--accent)" : "var(--border)"}`,
                      background: n <= form.proficiency ? "var(--accent)" : "var(--bg)",
                      color: n <= form.proficiency ? "#fff" : "var(--text-muted)",
                      fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {n}
                  </button>
                ))}
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: 4 }}>
                  {["", "Beginner", "Basic", "Intermediate", "Advanced", "Expert"][form.proficiency]}
                </span>
              </div>
            </div>
            {err && <div className="form-error">{err}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? "Saving…" : skill ? "Save Changes" : "Add Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getSkills()
      .then((r) => setSkills(r.data))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleSave = async (payload) => {
    if (modal && modal.id) {
      await updateSkill(modal.id, payload);
      showToast("Skill updated!");
    } else {
      await createSkill(payload);
      showToast("Skill added!");
    }
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    await deleteSkill(id);
    showToast("Skill deleted.", "error");
    load();
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      {modal !== null && (
        <SkillModal
          skill={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <div className="admin-panel-header">
        <h2 className="admin-panel-title">Skills ({skills.length})</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setModal("add")}>+ Add Skill</button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="loading-area"><div className="spinner" /> Loading…</div>
        ) : skills.length === 0 ? (
          <div className="admin-empty">No skills yet. Add your first one!</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Proficiency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id}>
                  <td className="td-main">{s.name}</td>
                  <td>
                    <span className="tech-badge">{s.category}</span>
                  </td>
                  <td>
                    <div className="prof-dots">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className={`prof-dot ${n <= (s.proficiency || 0) ? "filled" : ""}`} />
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
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
