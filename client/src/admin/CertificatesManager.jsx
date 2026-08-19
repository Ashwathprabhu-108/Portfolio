import { useEffect, useState, useCallback } from "react";
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "../api";

const EMPTY = { name: "", issuer: "", date: "", credential_link: "" };

function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className={`toast ${type}`}>{message}</div>;
}

function CertModal({ cert, onClose, onSave }) {
  const [form, setForm] = useState(
    cert
      ? { ...cert, date: cert.date ? cert.date.slice(0, 10) : "" }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setErr("Name is required."); return; }
    setSaving(true);
    setErr("");
    try {
      await onSave({ ...form, date: form.date || null });
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
          <span className="modal-title">{cert ? "Edit Certificate" : "Add Certificate"}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Certificate Name *</label>
              <input className="form-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. AWS Certified Solutions Architect" />
            </div>
            <div className="form-group">
              <label className="form-label">Issuing Organization</label>
              <input className="form-input" value={form.issuer} onChange={(e) => set("issuer", e.target.value)} placeholder="e.g. Amazon Web Services" />
            </div>
            <div className="form-group">
              <label className="form-label">Issue Date</label>
              <input type="date" className="form-input" value={form.date} onChange={(e) => set("date", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Credential Link</label>
              <input className="form-input" value={form.credential_link} onChange={(e) => set("credential_link", e.target.value)} placeholder="https://..." />
            </div>
            {err && <div className="form-error">{err}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? "Saving…" : cert ? "Save Changes" : "Add Certificate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CertificatesManager() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getCertificates()
      .then((r) => setCerts(r.data))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleSave = async (payload) => {
    if (modal && modal.id) {
      await updateCertificate(modal.id, payload);
      showToast("Certificate updated!");
    } else {
      await createCertificate(payload);
      showToast("Certificate added!");
    }
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certificate?")) return;
    await deleteCertificate(id);
    showToast("Certificate deleted.", "error");
    load();
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      {modal !== null && (
        <CertModal
          cert={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <div className="admin-panel-header">
        <h2 className="admin-panel-title">Certificates ({certs.length})</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setModal("add")}>+ Add Certificate</button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="loading-area"><div className="spinner" /> Loading…</div>
        ) : certs.length === 0 ? (
          <div className="admin-empty">No certificates yet. Add your first one!</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Issuer</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c.id}>
                  <td className="td-main">{c.name}</td>
                  <td>{c.issuer || "—"}</td>
                  <td>{formatDate(c.date)}</td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal(c)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
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
