import Link from "next/link";

export default function QuestionnairePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7fbff] via-white to-[#eef6ff]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-bold text-[#002A5C]">
          Questionnaire Coming Soon
        </h1>
        <p className="mt-4 text-lg text-[#002A5C]/70">
          We’re polishing the dorm vibe questionnaire. Check back shortly to
          start matching with the right people.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full border border-[#002A5C]/20 bg-white px-6 py-3 text-sm font-semibold text-[#002A5C] shadow-sm hover:bg-[#002A5C]/5 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

