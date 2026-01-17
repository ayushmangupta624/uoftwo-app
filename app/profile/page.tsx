import { Heart, MapPin, BookOpen, Calendar, Users, Edit, Settings, Award } from "lucide-react";

export default function Profile() {
  // Mock user data - replace with real data later
  const user = {
    name: "Alex Chen",
    age: 20,
    program: "Computer Science & Math",
    year: "3rd Year",
    dormArchetype: "New College",
    archetypeTraits: ["Academic Achiever", "Night Owl", "Library Dweller"],
    bio: "Looking for someone who enjoys deep conversations over coffee and isn't afraid of a spontaneous 2 AM study session. Let's conquer our problem sets together! 📚",
    interests: ["Machine Learning", "Philosophy", "Rock Climbing", "Coffee", "Indie Music"],
    location: "St. George Campus",
    matches: 12,
    events: 5,
    schedule: [
      { course: "CSC373", time: "Mon/Wed 10-11 AM", building: "Bahen Centre" },
      { course: "MAT237", time: "Tue/Thu 2-3 PM", building: "Sidney Smith" },
      { course: "CSC384", time: "Wed 3-5 PM", building: "Bahen Centre" },
    ],
  };

  const getArchetypeColor = (archetype: string) => {
    const colors: { [key: string]: string } = {
      "New College": "from-blue-400 to-cyan-500",
      "Oak House": "from-amber-400 to-orange-500",
      "Chestnut": "from-purple-400 to-pink-500",
      "Innis": "from-green-400 to-teal-500",
    };
    return colors[archetype] || "from-gray-400 to-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          {/* Cover Photo / Banner */}
          <div className={`h-32 bg-gradient-to-r ${getArchetypeColor(user.dormArchetype)} relative`}>
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-md">
                <Edit className="h-5 w-5 text-[#002A5C]" />
              </button>
              <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-md">
                <Settings className="h-5 w-5 text-[#002A5C]" />
              </button>
            </div>
          </div>

          <div className="px-8 pb-8">
            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
              <div className="w-32 h-32 bg-gradient-to-br from-[#002A5C] to-[#007FA3] rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {user.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>

              <div className="mt-4 sm:mt-0 sm:flex-1 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-[#002A5C]">
                      {user.name}, {user.age}
                    </h1>
                    <p className="text-gray-600 text-lg">
                      {user.program} • {user.year}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex gap-3">
                    <button className="px-6 py-2 bg-[#002A5C] text-white rounded-full font-semibold hover:bg-[#003d7a] transition-colors shadow-md">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                <div className="text-3xl font-bold text-[#002A5C]">{user.matches}</div>
                <div className="text-sm text-gray-600 mt-1">Matches</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-white rounded-xl border border-cyan-100">
                <div className="text-3xl font-bold text-[#007FA3]">{user.events}</div>
                <div className="text-sm text-gray-600 mt-1">Events</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                <div className="text-3xl font-bold text-[#002A5C]">{user.schedule.length}</div>
                <div className="text-sm text-gray-600 mt-1">Courses</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#002A5C] mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2" />
                About Me
              </h2>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </div>

            {/* Interests */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#002A5C] mb-4 flex items-center">
                <Heart className="h-6 w-6 mr-2" />
                Interests
              </h2>
              <div className="flex flex-wrap gap-3">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-[#002A5C] to-[#007FA3] text-white rounded-full text-sm font-medium shadow-md"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#002A5C] mb-4 flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                My Schedule
              </h2>
              <div className="space-y-3">
                {user.schedule.map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="font-semibold text-[#002A5C]">{course.course}</div>
                      <div className="text-sm text-gray-600">{course.time}</div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1 text-[#007FA3]" />
                      {course.building}
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-[#007FA3] hover:text-[#007FA3] transition-colors font-medium">
                + Update Schedule
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Dorm Archetype */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${getArchetypeColor(user.dormArchetype)} opacity-10`}></div>
              <div className="relative">
                <div className="flex items-center mb-4">
                  <Award className="h-6 w-6 mr-2 text-[#007FA3]" />
                  <h2 className="text-2xl font-bold text-[#002A5C]">Dorm Archetype</h2>
                </div>
                <div className={`bg-gradient-to-br ${getArchetypeColor(user.dormArchetype)} text-white p-6 rounded-xl shadow-lg mb-4`}>
                  <h3 className="text-2xl font-bold text-center">{user.dormArchetype}</h3>
                </div>
                <div className="space-y-2">
                  {user.archetypeTraits.map((trait, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <div className="w-2 h-2 bg-[#007FA3] rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">{trait}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full py-2 text-[#007FA3] border-2 border-[#007FA3] rounded-full font-semibold hover:bg-[#007FA3] hover:text-white transition-colors">
                  Retake Quiz
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-[#002A5C] mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Campus
              </h2>
              <p className="text-gray-700">{user.location}</p>
            </div>

            {/* Academic Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-[#002A5C] mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Academic Info
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Program</div>
                  <div className="text-gray-700 font-medium">{user.program}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Year</div>
                  <div className="text-gray-700 font-medium">{user.year}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

