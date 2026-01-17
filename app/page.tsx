import Link from "next/link";
import { Heart, Upload, Users } from "lucide-react";
import AuthRedirect from "./components/AuthRedirect";
import HeroSection from "./components/hero-page/hero-section/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <HeroSection />

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-[#C9A3A3] to-[#B08989] relative overflow-hidden z-30">
        {/* Elegant decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#8B5F5F]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#6B4646]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-center text-[#4a2e2e] mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#6B4646] to-[#8B5F5F]">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-[#D9C4C4] border border-[#A67C7C] hover:border-[#8B5F5F]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-[#6B4646] to-[#5a3939] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                <Upload className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#4a2e2e] mb-3">
                1. Upload Your Schedule
              </h3>
              <p className="text-[#5a3939] leading-relaxed">
                Share your class schedule so we can match you with students who
                have similar academic paths and free time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-[#D9C4C4] border border-[#A67C7C] hover:border-[#8B5F5F]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-[#8B5F5F] to-[#9d7070] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#4a2e2e] mb-3">
                2. Discover Your Archetype
              </h3>
              <p className="text-[#5a3939] leading-relaxed">
                Take a quick quiz to find your dorm personality - are you Oak
                House, Chestnut, New College, or more?
              </p>
            </div>

            {/* Step 3 */}
            <div className="group flex flex-col items-center text-center p-8 rounded-3xl bg-[#D9C4C4] border border-[#A67C7C] hover:border-[#8B5F5F]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-[#6B4646] to-[#5a3939] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                <Heart className="h-10 w-10 text-white" fill="currentColor" />
              </div>
              <h3 className="text-xl font-semibold text-[#4a2e2e] mb-3">
                3. Connect & Match
              </h3>
              <p className="text-[#5a3939] leading-relaxed">
                Start connecting with compatible students and attend campus
                events together!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dorm Archetypes Preview */}
      <section className="py-20 relative overflow-hidden z-30">
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a2e2e] via-[#6B4646] to-[#5a3939]"></div>

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-[#8B5F5F]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-[#9d7070]/20 rounded-full blur-3xl"></div>
        </div>

        {/* Elegant grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-center text-[#F5E6E6] mb-4 drop-shadow-2xl">
            Discover Your Dorm Archetype
          </h2>
          <p className="text-center text-[#E6D4D4]/90 mb-12 max-w-2xl mx-auto drop-shadow-lg font-light">
            Each personality is matched to iconic UofT residences. Which one are
            you?
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Oak House",
                trait: "Social Butterfly",
                color: "from-amber-400 to-orange-500",
              },
              {
                name: "Chestnut",
                trait: "Urban Explorer",
                color: "from-purple-400 to-pink-500",
              },
              {
                name: "New College",
                trait: "Academic Achiever",
                color: "from-blue-400 to-cyan-500",
              },
              {
                name: "Innis",
                trait: "Creative Soul",
                color: "from-green-400 to-teal-500",
              },
            ].map((dorm) => (
              <div
                key={dorm.name}
                className="group relative overflow-hidden rounded-3xl bg-[#8B5F5F]/20 backdrop-blur-md p-6 shadow-2xl hover:shadow-[0_20px_60px_rgba(139,95,95,0.4)] transition-all duration-300 hover:scale-105 border border-[#A67C7C]/30"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${dorm.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                ></div>
                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${dorm.color} rounded-2xl mb-4 shadow-lg flex items-center justify-center`}
                  >
                    <Heart className="h-8 w-8 text-white" fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-bold text-[#F5E6E6] mb-2 drop-shadow-lg">
                    {dorm.name}
                  </h3>
                  <p className="text-sm text-[#E6D4D4]/90 font-medium">
                    {dorm.trait}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#4a2e2e] via-[#6B4646] to-[#4a2e2e] z-30">
        {/* Elegant decorative elements */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#8B5F5F]/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-[#9d7070]/30 to-transparent rounded-full blur-3xl"></div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,95,95,0.1)_0%,transparent_70%)]"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Glass card effect */}
          <div className="backdrop-blur-sm bg-[#8B5F5F]/10 rounded-3xl p-12 border border-[#A67C7C]/20 shadow-2xl">
            <h2 className="text-4xl font-bold text-[#F5E6E6] mb-6 drop-shadow-2xl">
              Ready to Find Your Match?
            </h2>
            <p className="text-xl text-[#E6D4D4]/90 mb-8 drop-shadow-lg font-light">
              Join hundreds of UofT students already connecting on campus.
            </p>
            <Link
              href="/auth/sign-up"
              className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-[#4a2e2e] bg-gradient-to-r from-[#E6D4D4] to-[#D9C4C4] rounded-full hover:from-[#D9C4C4] hover:to-[#E6D4D4] transition-all shadow-2xl hover:shadow-[0_20px_60px_rgba(217,196,196,0.3)] hover:scale-105 border border-[#A67C7C]/30"
            >
              <span className="relative z-10">Start Your Journey</span>
              <Heart
                className="ml-2 h-5 w-5 relative z-10 group-hover:scale-110 transition-transform"
                fill="currentColor"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B5F5F] to-[#9d7070] opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
