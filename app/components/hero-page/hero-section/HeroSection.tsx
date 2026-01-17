import "./HeroSection.css";

export default function HeroSection() {
  return (
    <div className="hero-section-container">
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src="/hero-page/toronto-pano.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <div className="hero-text">
        <h1>Meet the people you keep seeing in Robarts</h1>
      </div>
    </div>
  );
}
