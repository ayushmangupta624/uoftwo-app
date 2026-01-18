import Image from 'next/image';

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
      <div className="text-center relative z-10 px-4 max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="relative h-40 w-40">
            <Image
              src="/uoftwo-logo.png"
              alt="U of Two Logo"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
        
        {/* Main Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
          <span className="font-[family-name:var(--font-geist-sans)] bg-clip-text text-transparent bg-gradient-to-r from-[#F5E6E6] via-[#D9C4C4] to-[#F5E6E6] drop-shadow-[0_4px_20px_rgba(217,196,196,0.9)] animate-pulse">
            Meet the people
          </span>
          <br />
          <span className="font-[family-name:var(--font-manrope)] text-[#FFFFFF] drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
            you keep seeing
          </span>
          <br />
          <span className="font-[family-name:var(--font-geist-mono)] italic text-[#F5E6E6] drop-shadow-[0_4px_30px_rgba(139,95,95,0.9)]">
            in Robarts
          </span>
        </h1>
        
        {/* Subheadline */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light font-[family-name:var(--font-manrope)] text-[#E6D4D4] drop-shadow-[0_2px_15px_rgba(0,0,0,0.7)] max-w-4xl mx-auto leading-relaxed">
          Your <span className="font-bold italic text-[#D9C4C4]">GPA</span> isn't the only thing worth investing in.
        </h2>
      </div>
    </div>
  );
}
