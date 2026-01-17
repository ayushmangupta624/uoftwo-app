import Link from "next/link";
import { Sparkles, Heart, Users } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef6ff] via-white to-[#f6fbff] relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-[#007FA3]/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-[#002A5C]/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#002A5C] to-[#007FA3] rounded-3xl mb-6 shadow-2xl">
            <Heart className="h-10 w-10 text-white" fill="currentColor" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-[#002A5C] mb-6 leading-tight">
            Find Your Perfect Match
            <br />
            <span className="bg-gradient-to-r from-[#002A5C] to-[#007FA3] bg-clip-text text-transparent">
              at UofT
            </span>
          </h1>
          
          <p className="text-xl text-[#002A5C]/70 max-w-2xl mx-auto mb-12">
            Answer a few questions and we'll connect you with students who share your vibe, schedule, and interests.
          </p>

          <Link
            href="/questionnaire"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#002A5C] to-[#007FA3] text-white rounded-full text-lg font-bold shadow-2xl hover:shadow-[0_20px_60px_rgba(0,127,163,0.4)] hover:scale-105 transition-all duration-300"
          >
            <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
            Start Questionnaire
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white/80 backdrop-blur-sm border border-[#002A5C]/10 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-[#002A5C] to-[#007FA3] rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">📅</span>
            </div>
            <h3 className="text-xl font-bold text-[#002A5C] mb-3">
              Schedule Matching
            </h3>
            <p className="text-[#002A5C]/70">
              Upload your class schedule and we'll find people with compatible free time and shared courses.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-[#002A5C]/10 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-[#007FA3] to-[#0099cc] rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">🏛️</span>
            </div>
            <h3 className="text-xl font-bold text-[#002A5C] mb-3">
              Building Archetypes
            </h3>
            <p className="text-[#002A5C]/70">
              Discover your campus personality - from Bahen's tech hub to Robarts' dark academia vibes.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-[#002A5C]/10 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-[#002A5C] to-[#007FA3] rounded-2xl flex items-center justify-center mb-6">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#002A5C] mb-3">
              Smart Matches
            </h3>
            <p className="text-[#002A5C]/70">
              AI-powered matching based on your interests, values, and campus lifestyle.
            </p>
          </div>
        </div>

        {/* What to Expect */}
        <div className="mt-20 bg-white/80 backdrop-blur-sm border border-[#002A5C]/10 rounded-3xl p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-[#002A5C] mb-8 text-center">
            What to Expect
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#002A5C] to-[#007FA3] rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-[#002A5C] mb-1">Upload Your Schedule</h4>
                <p className="text-[#002A5C]/70">Start by uploading your class schedule PDF from ACORN</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#002A5C] to-[#007FA3] rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-[#002A5C] mb-1">Answer Questions</h4>
                <p className="text-[#002A5C]/70">Tell us about your hobbies, music taste, campus life, and what you're looking for</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#002A5C] to-[#007FA3] rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-[#002A5C] mb-1">Get Your Building Archetype</h4>
                <p className="text-[#002A5C]/70">Discover which iconic UofT building represents your personality</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#002A5C] to-[#007FA3] rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-[#002A5C] mb-1">Start Matching</h4>
                <p className="text-[#002A5C]/70">Browse the planet and connect with compatible students</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-[#002A5C]/60">
          Takes about 5-10 minutes · Your information is private and secure
        </div>
      </div>
    </div>
  );
}
