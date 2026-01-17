import "./HeroSection.css";

export default function HeroSection() {
  return (
    <div className="hero-section-container">
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src="/hero-page/toronto-pano.mp4" type="video/mp4" />
      </video>
      <div className="text-center relative z-10">
        <h1>Meet the people you keep seeing in Robarts</h1>
        <h2>Your GPA isn't the only thing worth investing in.</h2>
      </div>
    </div>
  );
}
