import { Calendar, MapPin, Users, Clock, Heart } from "lucide-react";

export default function Events() {
  const events = [
    {
      id: 1,
      title: "Coffee & Connect @ Robarts",
      date: "Friday, Jan 24, 2026",
      time: "3:00 PM - 5:00 PM",
      location: "Robarts Library, 5th Floor Lounge",
      attendees: 24,
      spots: 30,
      category: "Social",
      description: "Casual meet-up for UofTwo members. Bring your study materials or just come to chat!",
    },
    {
      id: 2,
      title: "Speed Dating @ Hart House",
      date: "Saturday, Jan 25, 2026",
      time: "7:00 PM - 9:00 PM",
      location: "Hart House Great Hall",
      attendees: 42,
      spots: 50,
      category: "Dating",
      description: "Classic speed dating event with a UofT twist. 5-minute conversations with fellow students.",
    },
    {
      id: 3,
      title: "Study Buddy Mixer",
      date: "Monday, Jan 27, 2026",
      time: "6:00 PM - 8:00 PM",
      location: "Gerstein Science Library",
      attendees: 18,
      spots: 25,
      category: "Academic",
      description: "Find a study partner who shares your courses and study habits!",
    },
    {
      id: 4,
      title: "Winter Campus Walk",
      date: "Wednesday, Jan 29, 2026",
      time: "4:00 PM - 6:00 PM",
      location: "Meet at King's College Circle",
      attendees: 15,
      spots: 20,
      category: "Outdoors",
      description: "Enjoy a scenic walk through campus and get to know other UofT students.",
    },
    {
      id: 5,
      title: "Game Night @ Innis",
      date: "Friday, Jan 31, 2026",
      time: "8:00 PM - 11:00 PM",
      location: "Innis College Residence",
      attendees: 32,
      spots: 40,
      category: "Social",
      description: "Board games, card games, and video games. All skill levels welcome!",
    },
    {
      id: 6,
      title: "Brunch & Books",
      date: "Sunday, Feb 2, 2026",
      time: "11:00 AM - 1:00 PM",
      location: "New College Residence Dining",
      attendees: 12,
      spots: 20,
      category: "Social",
      description: "Discuss your favorite books over brunch with fellow book lovers.",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Social":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Dating":
        return "bg-pink-100 text-pink-700 border-pink-200";
      case "Academic":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Outdoors":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#002A5C] mb-4">
            Campus Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet fellow UofT students at exciting events across campus. 
            RSVP now and make meaningful connections!
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {["All", "Social", "Dating", "Academic", "Outdoors"].map((filter) => (
            <button
              key={filter}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === "All"
                  ? "bg-[#002A5C] text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-100 hover:scale-105 duration-300"
            >
              {/* Category Badge */}
              <div className="p-6 pb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                    event.category
                  )}`}
                >
                  {event.category}
                </span>
              </div>

              {/* Event Details */}
              <div className="px-6 pb-6">
                <h3 className="text-2xl font-bold text-[#002A5C] mb-3">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start text-sm text-gray-700">
                    <Calendar className="h-4 w-4 mt-0.5 mr-2 text-[#007FA3] flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-700">
                    <Clock className="h-4 w-4 mt-0.5 mr-2 text-[#007FA3] flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-700">
                    <MapPin className="h-4 w-4 mt-0.5 mr-2 text-[#007FA3] flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Users className="h-4 w-4 mr-2 text-[#007FA3]" />
                    <span>
                      {event.attendees} / {event.spots} attending
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#007FA3] h-2 rounded-full transition-all"
                      style={{
                        width: `${(event.attendees / event.spots) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* RSVP Button */}
                <button className="w-full bg-[#002A5C] text-white py-3 rounded-full font-semibold hover:bg-[#003d7a] transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                  <span>RSVP Now</span>
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Event CTA */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-[#002A5C] mb-4">
            Want to Host an Event?
          </h2>
          <p className="text-gray-600 mb-6">
            Create your own campus event and bring the UofT community together!
          </p>
          <button className="px-8 py-3 bg-[#007FA3] text-white rounded-full font-semibold hover:bg-[#006a8a] transition-colors shadow-md hover:shadow-lg">
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}

