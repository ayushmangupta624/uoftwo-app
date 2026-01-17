'use client';

import { useParams, useRouter } from 'next/navigation';
import { Heart, MapPin, Calendar, ArrowLeft, MessageCircle, UserPlus } from 'lucide-react';
import { use, useMemo } from 'react';

// Mock users data (same as in planet page)
const mockUsers = [
  {
    id: 1,
    name: "Emma Wilson",
    age: 21,
    program: "Computer Science",
    year: "3rd Year",
    dormArchetype: "New College",
    bio: "Love coding and coffee! Looking for study buddies and maybe something more 💻☕",
    interests: ["Coding", "Coffee", "Gaming"],
    image: "💙",
    schedule: [
      { course: "CSC373", time: "Mon/Wed 10-11 AM", building: "Bahen Centre" },
      { course: "CSC369", time: "Tue/Thu 2-3 PM", building: "Bahen Centre" },
    ]
  },
  {
    id: 2,
    name: "James Chen",
    age: 20,
    program: "Engineering",
    year: "2nd Year",
    dormArchetype: "Chestnut",
    bio: "Engineering student who loves hiking and late-night problem sets",
    interests: ["Hiking", "Photography", "Music"],
    image: "💜",
    schedule: [
      { course: "ECE259", time: "Mon/Wed 1-2 PM", building: "Sandford Fleming" },
      { course: "MAT292", time: "Tue/Thu 10-11 AM", building: "Sidney Smith" },
    ]
  },
  {
    id: 3,
    name: "Sophie Martinez",
    age: 22,
    program: "Psychology & Philosophy",
    year: "4th Year",
    dormArchetype: "Innis",
    bio: "Deep conversations over tea? Count me in! 🍵",
    interests: ["Reading", "Art", "Yoga"],
    image: "💚",
    schedule: [
      { course: "PSY270", time: "Mon 3-5 PM", building: "Sidney Smith" },
      { course: "PHL245", time: "Wed 2-4 PM", building: "Jackman Humanities" },
    ]
  },
  {
    id: 4,
    name: "Alex Kim",
    age: 19,
    program: "Business",
    year: "1st Year",
    dormArchetype: "Oak House",
    bio: "Always down for campus events and making new friends!",
    interests: ["Networking", "Sports", "Travel"],
    image: "🧡",
    schedule: [
      { course: "RSM100", time: "Mon/Wed 11-12 PM", building: "Rotman" },
      { course: "ECO101", time: "Tue/Thu 1-2 PM", building: "Sidney Smith" },
    ]
  },
  {
    id: 5,
    name: "Maya Patel",
    age: 21,
    program: "Biology",
    year: "3rd Year",
    dormArchetype: "New College",
    bio: "Pre-med student looking for someone to explore the city with",
    interests: ["Medicine", "Cooking", "Dancing"],
    image: "💙",
    schedule: [
      { course: "BIO230", time: "Mon/Wed 9-10 AM", building: "Ramsay Wright" },
      { course: "BCH210", time: "Tue/Thu 11-12 PM", building: "Medical Sciences" },
    ]
  },
  {
    id: 6,
    name: "Ryan O'Connor",
    age: 20,
    program: "English Literature",
    year: "2nd Year",
    dormArchetype: "Innis",
    bio: "Bookworm seeking fellow literature lover for coffee dates",
    interests: ["Writing", "Poetry", "Theatre"],
    image: "💚",
    schedule: [
      { course: "ENG235", time: "Tue 3-5 PM", building: "Jackman Humanities" },
      { course: "ENG140", time: "Thu 1-3 PM", building: "University College" },
    ]
  },
  {
    id: 7,
    name: "Zara Ahmed",
    age: 22,
    program: "Mathematics",
    year: "4th Year",
    dormArchetype: "New College",
    bio: "Math nerd by day, indie music enthusiast by night 🎵",
    interests: ["Math", "Music", "Astronomy"],
    image: "💙",
    schedule: [
      { course: "MAT357", time: "Mon/Wed 2-3 PM", building: "Sidney Smith" },
      { course: "MAT327", time: "Tue/Thu 4-5 PM", building: "Bahen Centre" },
    ]
  },
  {
    id: 8,
    name: "Lucas Silva",
    age: 21,
    program: "Economics",
    year: "3rd Year",
    dormArchetype: "Chestnut",
    bio: "Entrepreneur mindset, looking for my co-founder in life",
    interests: ["Startups", "Finance", "Fitness"],
    image: "💜",
    schedule: [
      { course: "ECO220", time: "Mon/Wed 10-11 AM", building: "Sidney Smith" },
      { course: "ECO206", time: "Tue/Thu 2-3 PM", building: "Max Gluskin House" },
    ]
  },
  {
    id: 9,
    name: "Chloe Wong",
    age: 19,
    program: "Architecture",
    year: "1st Year",
    dormArchetype: "Oak House",
    bio: "Building dreams one sketch at a time ✏️",
    interests: ["Design", "Art", "Photography"],
    image: "🧡",
    schedule: [
      { course: "ARC100", time: "Mon 1-4 PM", building: "John H. Daniels" },
      { course: "VIS102", time: "Wed 2-5 PM", building: "John H. Daniels" },
    ]
  },
  {
    id: 10,
    name: "Daniel Lee",
    age: 20,
    program: "Political Science",
    year: "2nd Year",
    dormArchetype: "Innis",
    bio: "Debater, thinker, and hopeless romantic",
    interests: ["Politics", "Debate", "History"],
    image: "💚",
    schedule: [
      { course: "POL200", time: "Tue 10-12 PM", building: "Sidney Smith" },
      { course: "POL214", time: "Thu 2-4 PM", building: "Munk School" },
    ]
  },
  {
    id: 11,
    name: "Isabella Romano",
    age: 22,
    program: "Chemistry",
    year: "4th Year",
    dormArchetype: "New College",
    bio: "We have chemistry... literally! Let's find out if we have it figuratively too",
    interests: ["Science", "Wine", "Jazz"],
    image: "💙",
    schedule: [
      { course: "CHM347", time: "Mon/Wed 11-12 PM", building: "Lash Miller" },
      { course: "CHM410", time: "Tue 1-3 PM", building: "Davenport" },
    ]
  },
  {
    id: 12,
    name: "Tyler Brown",
    age: 21,
    program: "Kinesiology",
    year: "3rd Year",
    dormArchetype: "Oak House",
    bio: "Athletic trainer looking for gym partner and life partner!",
    interests: ["Fitness", "Nutrition", "Basketball"],
    image: "🧡",
    schedule: [
      { course: "KIN301", time: "Mon/Wed 9-10 AM", building: "Athletic Centre" },
      { course: "KIN232", time: "Tue/Thu 11-12 PM", building: "Athletic Centre" },
    ]
  },
  {
    id: 13,
    name: "Olivia Zhang",
    age: 20,
    program: "Music Performance",
    year: "2nd Year",
    dormArchetype: "Innis",
    bio: "Violinist seeking my perfect harmony 🎻",
    interests: ["Classical Music", "Concert", "Ballet"],
    image: "💚",
    schedule: [
      { course: "MUS207", time: "Tue 3-5 PM", building: "Edward Johnson" },
      { course: "MUS300", time: "Thu 1-3 PM", building: "Edward Johnson" },
    ]
  },
  {
    id: 14,
    name: "Nathan Park",
    age: 19,
    program: "Computer Engineering",
    year: "1st Year",
    dormArchetype: "Chestnut",
    bio: "Building robots and relationships, one line of code at a time",
    interests: ["Robotics", "AI", "Anime"],
    image: "💜",
    schedule: [
      { course: "ECE110", time: "Mon/Wed 10-11 AM", building: "Bahen Centre" },
      { course: "MAT188", time: "Tue/Thu 9-10 AM", building: "Sidney Smith" },
    ]
  },
  {
    id: 15,
    name: "Ava Johnson",
    age: 21,
    program: "Environmental Science",
    year: "3rd Year",
    dormArchetype: "Innis",
    bio: "Saving the planet, one date at a time 🌍",
    interests: ["Sustainability", "Hiking", "Photography"],
    image: "💚",
    schedule: [
      { course: "ENV200", time: "Mon 2-4 PM", building: "Earth Sciences" },
      { course: "ENV221", time: "Wed 10-12 PM", building: "Earth Sciences" },
    ]
  },
  {
    id: 16,
    name: "Marcus Thompson",
    age: 22,
    program: "Film Studies",
    year: "4th Year",
    dormArchetype: "Oak House",
    bio: "Filmmaker looking for my leading lady/man",
    interests: ["Cinema", "Directing", "Screenwriting"],
    image: "🧡",
    schedule: [
      { course: "CIN301", time: "Tue 1-3 PM", building: "Innis College" },
      { course: "CIN401", time: "Thu 3-5 PM", building: "Innis College" },
    ]
  },
  {
    id: 17,
    name: "Lily Chen",
    age: 20,
    program: "Neuroscience",
    year: "2nd Year",
    dormArchetype: "New College",
    bio: "Mind reader (almost). Let me figure you out over coffee",
    interests: ["Brain Science", "Puzzles", "Meditation"],
    image: "💙",
    schedule: [
      { course: "PSL300", time: "Mon/Wed 1-2 PM", building: "Medical Sciences" },
      { course: "HMB265", time: "Tue/Thu 10-11 AM", building: "Medical Sciences" },
    ]
  },
  {
    id: 18,
    name: "Ethan Davis",
    age: 21,
    program: "History",
    year: "3rd Year",
    dormArchetype: "Innis",
    bio: "Living in the past, dreaming of our future",
    interests: ["History", "Museums", "Travel"],
    image: "💚",
    schedule: [
      { course: "HIS250", time: "Mon 11-1 PM", building: "Sidney Smith" },
      { course: "HIS344", time: "Wed 2-4 PM", building: "University College" },
    ]
  },
  {
    id: 19,
    name: "Grace Park",
    age: 19,
    program: "Sociology",
    year: "1st Year",
    dormArchetype: "Oak House",
    bio: "Understanding society, but still trying to understand love ❤️",
    interests: ["Social Justice", "Community", "Podcasts"],
    image: "🧡",
    schedule: [
      { course: "SOC101", time: "Mon/Wed 2-3 PM", building: "Sidney Smith" },
      { course: "SOC150", time: "Tue/Thu 1-2 PM", building: "Munk School" },
    ]
  },
  {
    id: 20,
    name: "Benjamin Taylor",
    age: 22,
    program: "Physics",
    year: "4th Year",
    dormArchetype: "New College",
    bio: "There's a strong gravitational pull between us 🌟",
    interests: ["Space", "Astronomy", "Sci-Fi"],
    image: "💙",
    schedule: [
      { course: "PHY354", time: "Mon/Wed 3-4 PM", building: "McLennan Physical Labs" },
      { course: "PHY452", time: "Tue 1-3 PM", building: "McLennan Physical Labs" },
    ]
  }
];

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = parseInt(params.id as string);

  const user = useMemo(() => {
    return mockUsers.find(u => u.id === userId);
  }, [userId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#6B4646] mb-4">User Not Found</h1>
          <button
            onClick={() => router.push('/planet')}
            className="px-6 py-3 bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white rounded-full font-semibold hover:from-[#003d7a] hover:to-[#0099cc] transition-all"
          >
            Back to Planet
          </button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          {/* Cover gradient */}
          <div className={`relative h-48 bg-gradient-to-br ${getArchetypeColor(user.dormArchetype)}`}>
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center text-7xl border-4 border-white">
                {user.image}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 pb-6 px-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-[#6B4646] mb-2">
                  {user.name}, {user.age}
                </h1>
                <p className="text-xl text-gray-600 mb-3">
                  {user.program} • {user.year}
                </p>
                <div className="inline-block">
                  <div className={`px-5 py-2 rounded-full bg-gradient-to-r ${getArchetypeColor(user.dormArchetype)} text-white font-bold shadow-lg`}>
                    {user.dormArchetype}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white rounded-full font-semibold hover:from-[#003d7a] hover:to-[#0099cc] transition-all shadow-lg">
                  <MessageCircle className="h-5 w-5" />
                  Message
                </button>
                <button className="flex items-center gap-2 px-6 py-3 border-2 border-[#8B5F5F] text-[#8B5F5F] rounded-full font-semibold hover:bg-[#8B5F5F] hover:text-white transition-all">
                  <UserPlus className="h-5 w-5" />
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#6B4646] mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{user.bio}</p>
            </div>

            {/* Interests */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#6B4646] mb-4">Interests</h2>
              <div className="flex flex-wrap gap-3">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-[#8B5F5F]/10 to-[#6B4646]/10 text-[#6B4646] rounded-full font-medium border border-[#8B5F5F]/20"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#6B4646] mb-4 flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                Class Schedule
              </h2>
              <div className="space-y-3">
                {user.schedule.map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="font-semibold text-[#6B4646] text-lg">{course.course}</div>
                      <div className="text-sm text-gray-600">{course.time}</div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1 text-[#8B5F5F]" />
                      {course.building}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#8B5F5F]/20">
              <h3 className="text-lg font-bold text-[#6B4646] mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-[#8B5F5F] mt-1" fill="currentColor" />
                  <div>
                    <div className="text-sm text-gray-500">Dorm Archetype</div>
                    <div className="font-semibold text-[#6B4646]">{user.dormArchetype}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#8B5F5F] mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Year</div>
                    <div className="font-semibold text-[#6B4646]">{user.year}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#8B5F5F] mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Program</div>
                    <div className="font-semibold text-[#6B4646]">{user.program}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compatibility placeholder */}
            <div className="bg-gradient-to-br from-[#6B4646] to-[#8B5F5F] rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Match Score</h3>
              <div className="text-5xl font-bold mb-2">87%</div>
              <p className="text-sm text-white/80">Based on your schedules and interests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

