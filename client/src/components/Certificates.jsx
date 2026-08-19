import { useEffect, useRef, useState } from "react";
import { getCertificates } from "../api";

function useFadeUp(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  useFadeUp(headingRef);
  useFadeUp(gridRef);

  useEffect(() => {
    getCertificates()
      .then((r) => setCerts(r.data))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  return (
    <section id="certificates" className="section section-alt">
      <div className="container">
        <div ref={headingRef} className="fade-up">
          <p className="section-label">Credentials</p>
          <h2 className="section-title">Certifications</h2>
          <p className="section-sub">
            Courses, certifications, and credentials I've earned along the way.
          </p>
        </div>

        <div ref={gridRef} className="fade-up delay-1">
          {loading ? (
            <div className="loading-area">
              <div className="spinner" />
              Loading certificates...
            </div>
          ) : certs.length === 0 ? (
            <div className="certs-empty">
              No certificates added yet — add some from the admin panel!
            </div>
          ) : (
            <div className="certs-grid">
              {certs.map((c) => (
                <div key={c.id} className="cert-card">
                  <div className="cert-icon">🏅</div>
                  <div className="cert-name">{c.name}</div>
                  {c.issuer && <div className="cert-issuer">{c.issuer}</div>}
                  {c.date && <div className="cert-date">{formatDate(c.date)}</div>}
                  {c.credential_link && (
                    <a
                      href={c.credential_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cert-link"
                    >
                      View Credential →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
