export default function HeroSection() {
  return (
    <div className="h-screen relative overflow-hidden flex items-center justify-center">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/hero-page/u-of-t-illustration.png')",
          // filter: "brightness(1.5)",
        }}
      />
      <div className="text-center relative z-10">
        <h1>Meet the people you keep seeing in Robarts</h1>
        <h2>Your GPA isn't the only thing worth investing in.</h2>
      </div>
    </div>
  );
}
