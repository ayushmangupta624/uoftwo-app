import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/db-helpers";

/**
 * POST /api/questionnaire
 * Saves the user's complete questionnaire responses to the database
 */
export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log(body);
    const {
      campus,
      hobbies,
      favoriteBands,
      musicGenres,
      sportsTeams,
      footballPreference,
      clubs,
      studyPreference,
      favCampusSpots,
      personalityTraits,
      values,
      goingOutFrequency,
      idealWeekend,
      aboutMe,
      lookingFor,
      dealBreakers,
    } = body;

    // Validate required fields
    if (!campus || !campus.trim()) {
      return NextResponse.json(
        { error: "Campus is required" },
        { status: 400 },
      );
    }

    if (!Array.isArray(hobbies) || hobbies.length === 0) {
      return NextResponse.json(
        { error: "At least one hobby is required" },
        { status: 400 },
      );
    }

    if (!aboutMe || !aboutMe.trim()) {
      return NextResponse.json(
        { error: "About me is required" },
        { status: 400 },
      );
    }

    // Valid hobbies from the Hobbies enum
    const validHobbies = new Set([
      "playing_music",
      "singing",
      "djing",
      "music_production",
      "dancing",
      "ballet",
      "theater",
      "stand_up_comedy",
      "running",
      "basketball",
      "baseball",
      "soccer",
      "football",
      "tennis",
      "volleyball",
      "swimming",
      "surfing",
      "skiing",
      "snowboarding",
      "skateboarding",
      "rock_climbing",
      "bouldering",
      "cycling",
      "yoga",
      "pilates",
      "martial_arts",
      "boxing",
      "weightlifting",
      "crossfit",
      "hiking",
      "camping",
      "chess",
      "board_games",
      "card_games",
      "video_games",
      "esports",
      "poker",
      "puzzles",
      "escape_rooms",
      "painting",
      "drawing",
      "sculpting",
      "pottery",
      "photography",
      "videography",
      "graphic_design",
      "fashion_design",
      "interior_design",
      "writing",
      "poetry",
      "calligraphy",
      "knitting",
      "crocheting",
      "sewing",
      "woodworking",
      "metalworking",
      "jewelry_making",
      "coding",
      "web_development",
      "app_development",
      "game_development",
      "robotics",
      "threed_printing",
      "electronics",
      "hacking",
      "cooking",
      "baking",
      "mixology",
      "wine_tasting",
      "coffee_roasting",
      "gardening",
      "birdwatching",
      "fishing",
      "hunting",
      "horseback_riding",
      "pet_care",
      "reading",
      "book_clubs",
      "learning_languages",
      "traveling",
      "museums",
      "astronomy",
      "history",
      "philosophy",
      "meditation",
      "volunteering",
      "activism",
      "debating",
      "public_speaking",
      "networking",
      "mentoring",
      "collecting",
      "thrifting",
      "vintage_shopping",
      "antiques",
      "coin_collecting",
      "stamp_collecting",
      "magic_tricks",
      "juggling",
      "origami",
      "model_building",
      "drones",
      "podcasting",
      "blogging",
      "vlogging",
      "streaming",
      "cosplay",
      "anime",
      "comics",
      "cars",
      "motorcycles",
    ]);

    // Convert hobby strings to Hobbies enum values
    const hobbiesEnum = hobbies
      .map((hobby: string) => {
        // Convert to lowercase and replace spaces with underscores
        const normalized = hobby.toLowerCase().replace(/\s+/g, "_");
        return normalized;
      })
      .filter((hobby: string) => validHobbies.has(hobby)); // Only keep valid enum values

    // Convert music genre strings to Genres enum values
    const genreMap: { [key: string]: string } = {
      Pop: "pop",
      "Hip-Hop": "hiphop",
      Rock: "rock",
      Metal: "metal",
      Blues: "blues",
      Latin: "latin",
      Bollywood: "bollywood",
      "R&B": "pop", // Map to closest match
      Indie: "rock",
      Electronic: "pop",
      Jazz: "blues",
      Classical: "pop",
      Country: "pop",
      "K-Pop": "pop",
      Alternative: "rock",
    };

    const musicGenresEnum = musicGenres
      .map((genre: string) => genreMap[genre] || null)
      .filter((genre: string | null): genre is string => genre !== null);

    // Create or update the user's profile with questionnaire data
    const updatedProfile = await prisma.user.upsert({
      where: { userId },
      create: {
        userId,
        gender: "null",
        fname: "",
        lname: "",
        ethnicity: "OTHER",
        campus: campus.trim(),
        hobbies: hobbiesEnum as any,
        favoriteBands: favoriteBands || [],
        musicGenres: musicGenresEnum as any,
        sportsTeams: sportsTeams || [],
        footballPreference: footballPreference || null,
        clubs: clubs || [],
        studyPreference: studyPreference || null,
        favCampusSpots: favCampusSpots || [],
        personalityTraits: personalityTraits || [],
        values: values || [],
        goingOutFrequency: goingOutFrequency || null,
        idealWeekend: idealWeekend || null,
        description: aboutMe.trim(),
        lookingFor: lookingFor?.trim() || null,
        dealBreakers: dealBreakers || [],
      },
      update: {
        campus: campus.trim(),
        hobbies: hobbiesEnum as any,
        favoriteBands: favoriteBands || [],
        musicGenres: musicGenresEnum as any,
        sportsTeams: sportsTeams || [],
        footballPreference: footballPreference || null,
        clubs: clubs || [],
        studyPreference: studyPreference || null,
        favCampusSpots: favCampusSpots || [],
        personalityTraits: personalityTraits || [],
        values: values || [],
        goingOutFrequency: goingOutFrequency || null,
        idealWeekend: idealWeekend || null,
        description: aboutMe.trim(),
        lookingFor: lookingFor?.trim() || null,
        dealBreakers: dealBreakers || [],
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Questionnaire saved successfully",
      profile: {
        id: updatedProfile.id,
        userId: updatedProfile.userId,
        description: updatedProfile.description,
      },
    });
  } catch (error) {
    console.error("Error saving questionnaire:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
