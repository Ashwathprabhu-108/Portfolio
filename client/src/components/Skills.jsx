import { useEffect, useRef, useState } from "react";
import { getSkills } from "../api";

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

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const headingRef = useRef(null);
  const bodyRef = useRef(null);

  useFadeUp(headingRef);
  useFadeUp(bodyRef);

  useEffect(() => {
    getSkills()
      .then((r) => setSkills(r.data))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, []);

  // Group skills by category
  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="section section-alt">
      <div className="container">
        <div ref={headingRef} className="fade-up">
          <p className="section-label">What I Know</p>
          <h2 className="section-title">Skills &amp; Technologies</h2>
          <p className="section-sub">
            A collection of tools and technologies I work with regularly.
          </p>
        </div>

        <div ref={bodyRef} className="fade-up delay-1">
          {loading ? (
            <div className="loading-area">
              <div className="spinner" />
              Loading skills...
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="skills-empty">No skills added yet — check back soon!</div>
          ) : (
            <div className="skills-categories">
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <div className="skills-category-label">{cat}</div>
                  <div className="skills-pills">
                    {items.map((s) => (
                      <div key={s.id} className="skill-pill">
                        {s.name}
                        {s.proficiency && (
                          <div className="pill-dots">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <div
                                key={n}
                                className={`dot ${n <= s.proficiency ? "filled" : ""}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
