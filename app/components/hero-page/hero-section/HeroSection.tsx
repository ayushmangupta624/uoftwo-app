export default function HeroSection() {
  return (
    <div className="h-screen relative overflow-hidden flex items-center justify-center">
      <video className="absolute top-0 left-0 w-full h-full object-cover z-0" autoPlay loop muted playsInline>
        <source src="/hero-page/toronto-pano.mp4" type="video/mp4" />
      </video>
      <div className="text-center relative z-10">
        <h1>Meet the people you keep seeing in Robarts</h1>
        <h2>Your GPA isn't the only thing worth investing in.</h2>
      </div>
    </div>
  );
}
