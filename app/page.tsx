import Link from "next/link";
import { Heart, Upload, Users } from "lucide-react";
import AuthRedirect from "./components/AuthRedirect";

export default function Home() {
  return (
    <AuthRedirect>
    <div className="min-h-screen relative overflow-hidden">
      {/* Cartoon Winter Sky Background - FIXED */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#cfe9ff] via-[#e6f4ff] to-[#f5fbff]">
        {/* Soft cartoon clouds */}
        <div className="absolute inset-0 opacity-70">
          <div className="absolute top-16 left-8 h-14 w-44 rounded-full bg-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.05)]"></div>
          <div className="absolute top-24 left-28 h-12 w-36 rounded-full bg-white/70"></div>
          <div className="absolute top-12 right-12 h-16 w-56 rounded-full bg-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.05)]"></div>
          <div className="absolute top-24 right-32 h-12 w-40 rounded-full bg-white/70"></div>
          <div className="absolute top-52 left-1/3 h-14 w-48 rounded-full bg-white/70"></div>
        </div>
      </div>

      {/* Falling Snow - FIXED */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-[fall_linear_infinite]"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animationDuration: `${Math.random() * 10 + 8}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.6 + 0.4,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
            }}
          ></div>
        ))}
      </div>

      {/* Cartoon Building Background - FIXED */}
      <div className="fixed bottom-0 left-0 right-0 z-[1] h-[520px] pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-[#f7ecea] to-[#eedfdb]"></div>
        <svg
          className="absolute bottom-16 left-1/2 -translate-x-1/2 opacity-75"
          width="1100"
          height="420"
          viewBox="0 0 1100 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f1dede" />
              <stop offset="100%" stopColor="#e2c9c7" />
            </linearGradient>
            <linearGradient id="tower" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f6e8e8" />
              <stop offset="100%" stopColor="#e6cfcf" />
            </linearGradient>
            <linearGradient id="roof" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d6b3b3" />
              <stop offset="100%" stopColor="#c49a9a" />
            </linearGradient>
            <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d7e6f5" />
              <stop offset="100%" stopColor="#b7cde6" />
            </linearGradient>
          </defs>

          {/* Soft ground curves */}
          <path d="M40 370 C220 320 420 330 560 350 C720 375 880 385 1060 360" stroke="#b48a8a" strokeWidth="4" opacity="0.35" />
          <path d="M60 390 C260 355 470 360 620 380 C760 400 940 410 1040 395" stroke="#b48a8a" strokeWidth="4" opacity="0.25" />

          {/* Main long building */}
          <rect x="90" y="190" width="920" height="190" rx="14" fill="url(#stone)" stroke="#a97a7a" strokeWidth="4" />
          {/* Cornice line */}
          <rect x="90" y="180" width="920" height="8" fill="#cda7a7" opacity="0.6" />

          {/* Central tower */}
          <rect x="470" y="54" width="160" height="260" rx="12" fill="url(#tower)" stroke="#a97a7a" strokeWidth="4" />
          <polygon points="550,18 495,70 605,70" fill="url(#roof)" stroke="#a97a7a" strokeWidth="4" />
          <rect x="495" y="92" width="110" height="50" rx="12" fill="#f7eeee" stroke="#b58a8a" strokeWidth="3" />

          {/* Side turrets */}
          <rect x="200" y="120" width="72" height="140" rx="12" fill="url(#tower)" stroke="#a97a7a" strokeWidth="3.5" />
          <polygon points="236,82 200,130 272,130" fill="url(#roof)" stroke="#a97a7a" strokeWidth="3.5" />
          <rect x="828" y="120" width="72" height="140" rx="12" fill="url(#tower)" stroke="#a97a7a" strokeWidth="3.5" />
          <polygon points="864,82 828,130 900,130" fill="url(#roof)" stroke="#a97a7a" strokeWidth="3.5" />

          {/* Roof ridges */}
          <path d="M120 175 L300 175" stroke="#a97a7a" strokeWidth="4" />
          <path d="M800 175 L980 175" stroke="#a97a7a" strokeWidth="4" />
          <path d="M350 175 L750 175" stroke="#a97a7a" strokeWidth="4" />

          {/* Arched main entrance */}
          <path d="M550 324 C512 324 496 297 496 270 L496 242 C496 220 512 198 550 198 C588 198 604 220 604 242 L604 270 C604 297 588 324 550 324Z" fill="url(#window)" stroke="#7f9fc2" strokeWidth="4" />
          <rect x="524" y="262" width="52" height="60" rx="8" fill="#6f95c1" />

          {/* Window rows */}
          {Array.from({ length: 13 }).map((_, i) => (
            <rect key={`lw1-${i}`} x={130 + i * 60} y={220} width="30" height="38" rx="8" fill="url(#window)" stroke="#7f9fc2" strokeWidth="3" />
          ))}
          {Array.from({ length: 13 }).map((_, i) => (
            <rect key={`lw2-${i}`} x={130 + i * 60} y={270} width="30" height="38" rx="8" fill="url(#window)" stroke="#7f9fc2" strokeWidth="3" />
          ))}

          {/* Tower windows */}
          <rect x="502" y="150" width="44" height="52" rx="10" fill="url(#window)" stroke="#7f9fc2" strokeWidth="3" />
          <rect x="554" y="150" width="44" height="52" rx="10" fill="url(#window)" stroke="#7f9fc2" strokeWidth="3" />
          <rect x="502" y="215" width="96" height="42" rx="10" fill="url(#window)" stroke="#7f9fc2" strokeWidth="3" />

          {/* Ornamental linework */}
          <path d="M140 210 H960" stroke="#b88f8f" strokeWidth="2" opacity="0.35" />
          <path d="M140 260 H960" stroke="#b88f8f" strokeWidth="2" opacity="0.25" />

          {/* Cute hearts */}
          <path d="M250 80 C245 70 230 70 230 85 C230 100 250 110 250 110 C250 110 270 100 270 85 C270 70 255 70 250 80Z" fill="#d99aa0" opacity="0.55" />
          <path d="M820 90 C816 82 805 82 805 94 C805 105 820 112 820 112 C820 112 835 105 835 94 C835 82 824 82 820 90Z" fill="#d99aa0" opacity="0.55" />

          {/* Trees */}
          <circle cx="120" cy="300" r="38" fill="#deb1b1" stroke="#b27f7f" strokeWidth="3" />
          <rect x="112" y="330" width="16" height="40" fill="#a27a7a" opacity="0.6" />
          <circle cx="980" cy="300" r="38" fill="#deb1b1" stroke="#b27f7f" strokeWidth="3" />
          <rect x="972" y="330" width="16" height="40" fill="#a27a7a" opacity="0.6" />
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-visible z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          
          <div className="text-center relative z-10">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
              <span className="text-[#002A5C] drop-shadow-2xl">
                Find Your
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#002A5C] via-[#007FA3] to-[#002A5C] drop-shadow-2xl">
                UofT Match
              </span>
            </h1>
            <p className="mt-6 text-xl text-[#002A5C]/80 max-w-2xl mx-auto drop-shadow-md font-medium leading-relaxed">
              Connect with fellow University of Toronto students based on your schedule, 
              personality, and campus life. Discover your dorm archetype and find your perfect match.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href="/onboarding"
                className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#002A5C] to-[#007FA3] rounded-full hover:from-[#003d7a] hover:to-[#0099cc] transition-all shadow-2xl hover:shadow-[0_20px_60px_rgba(0,42,92,0.4)] hover:scale-105 border border-[#002A5C]/20"
              >
                <span className="relative z-10">Get Started</span>
                <Heart className="ml-2 h-5 w-5 relative z-10 group-hover:scale-110 transition-transform" fill="currentColor" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden z-30">
        {/* Elegant decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#007FA3]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#002A5C]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-center text-[#002A5C] mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#002A5C] to-[#007FA3]">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-gray-100 hover:border-[#007FA3]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-[#002A5C] to-[#003d7a] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                <Upload className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#002A5C] mb-3">
                1. Upload Your Schedule
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Share your class schedule so we can match you with students who have similar academic paths and free time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-gray-100 hover:border-[#007FA3]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-[#007FA3] to-[#0099cc] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#002A5C] mb-3">
                2. Discover Your Archetype
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Take a quick quiz to find your dorm personality - are you Oak House, Chestnut, New College, or more?
              </p>
            </div>

            {/* Step 3 */}
            <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-gray-100 hover:border-[#007FA3]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-[#002A5C] to-[#003d7a] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                <Heart className="h-10 w-10 text-white" fill="currentColor" />
              </div>
              <h3 className="text-xl font-semibold text-[#002A5C] mb-3">
                3. Connect & Match
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Start connecting with compatible students and attend campus events together!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dorm Archetypes Preview */}
      <section className="py-20 relative overflow-hidden z-30">
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a3d] via-[#002A5C] to-[#003d7a]"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-[#007FA3]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-[#0099cc]/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Elegant grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-center text-white mb-4 drop-shadow-2xl">
            Discover Your Dorm Archetype
          </h2>
          <p className="text-center text-white/80 mb-12 max-w-2xl mx-auto drop-shadow-lg font-light">
            Each personality is matched to iconic UofT residences. Which one are you?
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Oak House", trait: "Social Butterfly", color: "from-amber-400 to-orange-500" },
              { name: "Chestnut", trait: "Urban Explorer", color: "from-purple-400 to-pink-500" },
              { name: "New College", trait: "Academic Achiever", color: "from-blue-400 to-cyan-500" },
              { name: "Innis", trait: "Creative Soul", color: "from-green-400 to-teal-500" },
            ].map((dorm) => (
              <div
                key={dorm.name}
                className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md p-6 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,122,163,0.4)] transition-all duration-300 hover:scale-105 border border-white/20"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${dorm.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${dorm.color} rounded-2xl mb-4 shadow-lg flex items-center justify-center`}>
                    <Heart className="h-8 w-8 text-white" fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{dorm.name}</h3>
                  <p className="text-sm text-white/80 font-medium">{dorm.trait}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#001a3d] via-[#002A5C] to-[#001a3d] z-30">
        {/* Elegant decorative elements */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#007FA3]/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-[#0099cc]/30 to-transparent rounded-full blur-3xl"></div>
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,127,163,0.1)_0%,transparent_70%)]"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Glass card effect */}
          <div className="backdrop-blur-sm bg-white/5 rounded-3xl p-12 border border-white/10 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-2xl">
              Ready to Find Your Match?
            </h2>
            <p className="text-xl text-white/80 mb-8 drop-shadow-lg font-light">
              Join hundreds of UofT students already connecting on campus.
            </p>
            <Link
              href="/onboarding"
              className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-[#002A5C] bg-gradient-to-r from-white to-gray-50 rounded-full hover:from-gray-50 hover:to-white transition-all shadow-2xl hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)] hover:scale-105 border border-white/20"
            >
              <span className="relative z-10">Start Your Journey</span>
              <Heart className="ml-2 h-5 w-5 relative z-10 group-hover:scale-110 transition-transform" fill="currentColor" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#007FA3] to-[#00a8cc] opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </AuthRedirect>
  );
}
