import { useEffect, useRef, useState } from "react";
import { getProjects } from "../api";

function useFadeUp(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  useFadeUp(headingRef);
  useFadeUp(gridRef);

  useEffect(() => {
    getProjects()
      .then((r) => setProjects(r.data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div ref={headingRef} className="fade-up">
          <p className="section-label">My Work</p>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-sub">
            A selection of things I've built — from side projects to production apps.
          </p>
        </div>

        <div ref={gridRef} className="fade-up delay-1">
          {loading ? (
            <div className="loading-area">
              <div className="spinner" />
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="projects-empty">
              No projects added yet — check the admin panel to add some!
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((p) => (
                <article key={p.id} className="project-card">
                  <div className="project-img">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} />
                    ) : (
                      <div className="project-img-placeholder">🛠️</div>
                    )}
                  </div>
                  <div className="project-body">
                    <h3 className="project-title">{p.title}</h3>
                    {p.description && (
                      <p className="project-desc">{p.description}</p>
                    )}
                    {p.tech_stack && p.tech_stack.length > 0 && (
                      <div className="tech-badges">
                        {p.tech_stack.map((t) => (
                          <span key={t} className="tech-badge">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="project-links">
                      {p.live_link && (
                        <a
                          href={p.live_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          <ExternalLinkIcon /> Live Demo
                        </a>
                      )}
                      {p.github_link && (
                        <a
                          href={p.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          <GitHubIcon /> Source
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
