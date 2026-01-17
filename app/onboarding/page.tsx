import Link from "next/link";
import { ArrowRight, ClipboardList, UploadCloud } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef6ff] via-white to-[#f6fbff]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-[#007FA3] uppercase">
            Get Started
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-[#002A5C]">
            Upload your schedule
          </h1>
          <p className="mt-4 text-lg text-[#002A5C]/70">
            Add your class schedule as a PDF so we can find the best matches for
            your week.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-[#002A5C]/10 rounded-3xl shadow-2xl p-8 sm:p-10">
          <div className="grid gap-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#002A5C] to-[#007FA3] flex items-center justify-center shadow-lg">
                <UploadCloud className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[#002A5C]">
                  Upload your PDF schedule
                </h2>
                <p className="mt-2 text-[#002A5C]/70">
                  Accepted format: PDF only. We use this to compare free time
                  and shared course interests.
                </p>
              </div>
            </div>

            <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-[#007FA3]/40 rounded-2xl px-6 py-12 text-center cursor-pointer hover:border-[#007FA3] hover:bg-[#007FA3]/5 transition">
              <input
                type="file"
                accept="application/pdf"
                className="sr-only"
              />
              <UploadCloud className="h-10 w-10 text-[#007FA3] group-hover:scale-105 transition-transform" />
              <p className="mt-4 text-lg font-semibold text-[#002A5C]">
                Click to upload your PDF
              </p>
              <p className="mt-2 text-sm text-[#002A5C]/60">
                You can drag and drop here if your browser supports it.
              </p>
            </label>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#007FA3] to-[#0099cc] flex items-center justify-center shadow-lg">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[#002A5C]">
                  Start the questionnaire
                </h2>
                <p className="mt-2 text-[#002A5C]/70">
                  Tell us about your dorm vibe, study habits, and campus life so
                  we can match you with the right people.
                </p>
                <Link
                  href="/questionnaire"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#002A5C] to-[#007FA3] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-[#003d7a] hover:to-[#0099cc] transition"
                >
                  Start Questionnaire
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-[#002A5C]/60">
          Your schedule is used only for matching and is never shared publicly.
        </div>
      </div>
    </div>
  );
}

