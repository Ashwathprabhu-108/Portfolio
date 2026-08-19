export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container">
        <div className="hero-content fade-up visible">
          <div className="hero-eyebrow">Available for work</div>
          <h1 className="hero-name">
            Hi, I'm <span>Ashwath Prabhu</span>
          </h1>
          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary">
              View My Work
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#contact" className="btn btn-outline">
              Get in Touch
            </a>
          </div>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        Scroll
      </div>
    </section>
  );
}
