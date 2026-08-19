import { useEffect, useRef } from "react";

function useFadeUp(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

export default function About() {
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const statsRef = useRef(null);

  useFadeUp(headingRef);
  useFadeUp(textRef);
  useFadeUp(statsRef);

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="about-grid">
          <div className="about-text">
            <div ref={headingRef} className="fade-up">
              <p className="section-label">About Me</p>
              <h2 className="section-title">Building things that matter</h2>
            </div>
            <div ref={textRef} className="fade-up delay-1">
              <p>
                I'm a passionate full-stack developer with a knack for turning
                complex problems into simple, elegant solutions. I love working
                at the intersection of design and engineering.
              </p>
              <p>
                When I'm not coding, I'm exploring new technologies, contributing
                to open-source projects, or thinking about how to make software
                more human.
              </p>
            </div>
            <div ref={statsRef} className="about-stats fade-up delay-2">
              <div className="stat-card">
                <div className="stat-number">2+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">20+</div>
                <div className="stat-label">Projects Built</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">10+</div>
                <div className="stat-label">Technologies</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">∞</div>
                <div className="stat-label">Cups of Coffee</div>
              </div>
            </div>
          </div>
          <div className="about-image-area fade-up delay-2">
            <div className="about-img-frame">
              <div style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #eef2ff 0%, #f3f4f6 100%)",
                fontSize: "5rem"
              }}>
                👨‍💻
              </div>
            </div>
            <div className="about-badge">
              <div className="about-badge-icon">🚀</div>
              <div>
                <div className="about-badge-text">Open to Opportunities</div>
                <div className="about-badge-sub">Full-time &amp; Freelance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
