"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import HeroSection from "./components/hero-page/hero-section/HeroSection";

export default function Home() {
  // Show full landing page for authenticated users
  return (
    <div className="min-h-screen relative overflow-hidden">
      <HeroSection />

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-[#C9A3A3] to-[#B08989] relative overflow-hidden z-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#8B5F5F]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#6B4646]/10 to-transparent rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-center text-[#4a2e2e] mb-6">
            How it works
          </h2>
          <p className="text-center text-[#5a3939] max-w-2xl mx-auto mb-14 leading-relaxed">
            UofTwo is built for meeting people you actually cross paths with.
            Keep it simple: set up your profile, share your schedule, and start
            matching.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group relative flex flex-col text-left p-8 rounded-3xl bg-[#D9C4C4] border border-[#A67C7C] hover:border-[#8B5F5F]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] opacity-70" />
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#4a2e2e]/80 mb-5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E6D4D4] text-[#4a2e2e] border border-[#A67C7C]/40">
                  1
                </span>
                Profile
              </div>
              <h3 className="text-2xl font-semibold text-[#4a2e2e] mb-3">
                Set up your profile
              </h3>
              <p className="text-[#5a3939] leading-relaxed">
                Add a few photos and a short bio. Keep it real—this isn’t a
                résumé.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative flex flex-col text-left p-8 rounded-3xl bg-[#D9C4C4] border border-[#A67C7C] hover:border-[#8B5F5F]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8B5F5F] to-[#9d7070] opacity-70" />
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#4a2e2e]/80 mb-5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E6D4D4] text-[#4a2e2e] border border-[#A67C7C]/40">
                  2
                </span>
                Schedule
              </div>
              <h3 className="text-2xl font-semibold text-[#4a2e2e] mb-3">
                Add your schedule
              </h3>
              <p className="text-[#5a3939] leading-relaxed">
                Upload your timetable to get better suggestions for when and
                where to meet between classes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative flex flex-col text-left p-8 rounded-3xl bg-[#D9C4C4] border border-[#A67C7C] hover:border-[#8B5F5F]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#6B4646] to-[#5a3939] opacity-70" />
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#4a2e2e]/80 mb-5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E6D4D4] text-[#4a2e2e] border border-[#A67C7C]/40">
                  3
                </span>
                Match
              </div>
              <h3 className="text-2xl font-semibold text-[#4a2e2e] mb-3">
                Match and meet on campus
              </h3>
              <p className="text-[#5a3939] leading-relaxed">
                Swipe, match, then pick something low-pressure—coffee, a walk to
                Robarts, or a quick study break.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built for campus */}
      <section className="py-20 relative overflow-hidden z-30">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a2e2e] via-[#6B4646] to-[#5a3939]" />

        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-[#8B5F5F]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-[#9d7070]/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-center text-[#F5E6E6] mb-4 drop-shadow-2xl">
            Built for campus
          </h2>
          <p className="text-center text-[#E6D4D4]/90 mb-12 max-w-2xl mx-auto drop-shadow-lg font-light">
            A dating app that actually fits UofT life—busy schedules, short
            windows between classes, and real places to meet.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Schedule-aware",
                desc: "Find overlap and suggest easy meetups between classes.",
              },
              {
                title: "Student-first",
                desc: "Designed around UofT routines and campus hangouts.",
              },
              {
                title: "Privacy controls",
                desc: "Choose what to share and keep your schedule optional.",
              },
              {
                title: "Start a convo",
                desc: "Open with prompts that don’t feel like small talk.",
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-3xl bg-[#8B5F5F]/20 backdrop-blur-md p-6 shadow-2xl hover:shadow-[0_20px_60px_rgba(139,95,95,0.35)] transition-all duration-300 hover:scale-[1.03] border border-[#A67C7C]/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#E6D4D4] to-[#D9C4C4] opacity-10 group-hover:opacity-15 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold tracking-wider uppercase text-[#E6D4D4]/80">
                      Feature
                    </span>
                    <span className="text-xs font-semibold text-[#E6D4D4]/70">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F5E6E6] mb-2 drop-shadow-lg">
                    {item.title}
                  </h3>
                  <div className="h-px w-10 bg-[#E6D4D4]/40 mb-3" />
                  <p className="text-sm text-[#E6D4D4]/90 font-medium leading-relaxed">
                    {item.desc}
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
              Join UofT students connecting on campus.
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
