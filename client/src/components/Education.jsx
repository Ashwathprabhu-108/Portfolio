import { useEffect, useRef } from "react";

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

const EDU = [
  {
    degree: "MCA",
    detail: "Course: Machine Learning",
    institution: "Mangalore Institute of Technology & Engineering, Moodbidri",
    period: "2025 – 2027",
  },
  {
    degree: "BCA",
    detail: "CGPA: 8.60",
    institution: "St. Mary's College, Shirva",
    period: "2022 – 2025",
  },
  {
    degree: "PUC",
    detail: "87.67%",
    institution: "Dr. NSAM College, Nitte",
    period: "2020 – 2022",
  },
  {
    degree: "SSLC",
    detail: "88.16%",
    institution: "A.B.M.V. Shastri High School, Inna",
    period: "2019 – 2020",
  },
];



export default function Education() {
  const headingRef = useRef(null);
  const listRef = useRef(null);

  useFadeUp(headingRef);
  useFadeUp(listRef);

  return (
    <section id="education" className="section">
      <div className="container">
        <div ref={headingRef} className="fade-up">
          <p className="section-label">Background</p>
          <h2 className="section-title">Education</h2>
        </div>

        <div ref={listRef} className="fade-up delay-1">
          <div className="education-list">
            {EDU.map((e, i) => (
              <div key={i} className="edu-item">
                <div className="edu-dot" />
                <div className="edu-period">{e.period}</div>
                <div className="edu-degree">
                  {e.degree}
                  {e.detail && <span className="edu-detail"> — {e.detail}</span>}
                </div>
                <div className="edu-institution">{e.institution}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
