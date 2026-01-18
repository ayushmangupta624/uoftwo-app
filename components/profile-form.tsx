// "use client";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Gender, UserProfile, Ethnicity } from "@/types/profile";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const GENDERS: Gender[] = ["male", "female", "other", "non-binary"];

// const ETHNICITIES: { value: Ethnicity; label: string }[] = [
//   { value: "ASIAN", label: "Asian" },
//   { value: "BLACK", label: "Black" },
//   { value: "HISPANIC", label: "Hispanic" },
//   { value: "WHITE", label: "White" },
//   { value: "NATIVE", label: "Native American" },
//   { value: "MIDDLE_EASTERN", label: "Middle Eastern" },
//   { value: "OTHER", label: "Other" },
// ];

// interface ProfileFormProps {
//   initialProfile?: UserProfile | null;
//   className?: string;
// }

// export function ProfileForm({ initialProfile, className }: ProfileFormProps) {
//   const [gender, setGender] = useState<Gender>("male");
//   const [genderPreferences, setGenderPreferences] = useState<Gender[]>([]);
//   const [fname, setFname] = useState("");
//   const [lname, setLname] = useState("");
//   const [areasOfStudy, setAreasOfStudy] = useState<string[]>([]);
//   const [currentArea, setCurrentArea] = useState("");
//   const [ethnicity, setEthnicity] = useState<Ethnicity>("OTHER");
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   // Load initial profile data if available
//   useEffect(() => {
//     if (initialProfile) {
//       setGender(initialProfile.gender);
//       setGenderPreferences(initialProfile.gender_preference || []);
//       setFname(initialProfile.fname || "");
//       setLname(initialProfile.lname || "");
//       setAreasOfStudy(initialProfile.areas_of_study || []);
//       setEthnicity(initialProfile.ethnicity || "OTHER");
//     }
//   }, [initialProfile]);

//   const handleGenderChange = (selectedGender: Gender) => {
//     setGender(selectedGender);
//   };

//   const handlePreferenceToggle = (pref: Gender) => {
//     setGenderPreferences((prev) => {
//       if (prev.includes(pref)) {
//         return prev.filter((p) => p !== pref);
//       } else {
//         return [...prev, pref];
//       }
//     });
//   };

//   const handleAddArea = () => {
//     const trimmed = currentArea.trim();
//     if (trimmed && !areasOfStudy.includes(trimmed)) {
//       setAreasOfStudy([...areasOfStudy, trimmed]);
//       setCurrentArea("");
//     }
//   };

//   const handleRemoveArea = (area: string) => {
//     setAreasOfStudy(areasOfStudy.filter((a) => a !== area));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     // Validation
//     if (!fname.trim()) {
//       setError("First name is required");
//       setIsLoading(false);
//       return;
//     }

//     if (!lname.trim()) {
//       setError("Last name is required");
//       setIsLoading(false);
//       return;
//     }

//     if (genderPreferences.length === 0) {
//       setError("Please select at least one gender preference");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch("/api/profile", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           gender,
//           gender_preference: genderPreferences,
//           fname: fname.trim(),
//           lname: lname.trim(),
//           areas_of_study: areasOfStudy,
//           ethnicity,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to save profile");
//       }

//       // Redirect to image upload page after successful save
//       router.push("/upload-images");
//       router.refresh();
//     } catch (error: unknown) {
//       setError(error instanceof Error ? error.message : "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={cn("flex flex-col gap-6", className)}>
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">
//             {initialProfile ? "Edit Profile" : "Complete Your Profile"}
//           </CardTitle>
//           <CardDescription>
//             {initialProfile
//               ? "Update your profile information"
//               : "Fill in your information to start matching with other users"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div className="flex flex-col gap-6">
//               {/* Name Fields */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="fname">First Name *</Label>
//                   <Input
//                     id="fname"
//                     type="text"
//                     placeholder="John"
//                     required
//                     value={fname}
//                     onChange={(e) => setFname(e.target.value)}
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="lname">Last Name *</Label>
//                   <Input
//                     id="lname"
//                     type="text"
//                     placeholder="Doe"
//                     required
//                     value={lname}
//                     onChange={(e) => setLname(e.target.value)}
//                   />
//                 </div>
//               </div>

//               {/* Gender */}
//               <div className="grid gap-3">
//                 <Label>Your Gender *</Label>
//                 <div className="grid grid-cols-2 gap-3">
//                   {GENDERS.map((g) => (
//                     <label
//                       key={g}
//                       className={cn(
//                         "flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-accent",
//                         gender === g && "border-primary bg-accent"
//                       )}
//                     >
//                       <input
//                         type="radio"
//                         name="gender"
//                         value={g}
//                         checked={gender === g}
//                         onChange={() => handleGenderChange(g)}
//                         className="h-4 w-4"
//                       />
//                       <span className="capitalize">{g}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Gender Preferences */}
//               <div className="grid gap-3">
//                 <Label>Interested In *</Label>
//                 <div className="space-y-3">
//                   {GENDERS.map((g) => (
//                     <div key={g} className="flex items-center space-x-2">
//                       <Checkbox
//                         id={`pref-${g}`}
//                         checked={genderPreferences.includes(g)}
//                         onCheckedChange={() => handlePreferenceToggle(g)}
//                       />
//                       <label
//                         htmlFor={`pref-${g}`}
//                         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
//                       >
//                         {g}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//                 {genderPreferences.length === 0 && (
//                   <p className="text-sm text-muted-foreground">
//                     Select at least one preference to see matches
//                   </p>
//                 )}
//               </div>

//               {/* Ethnicity */}
//               <div className="grid gap-3">
//                 <Label>Ethnicity *</Label>
//                 <div className="grid grid-cols-2 gap-3">
//                   {ETHNICITIES.map((eth) => (
//                     <label
//                       key={eth.value}
//                       className={cn(
//                         "flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-accent",
//                         ethnicity === eth.value && "border-primary bg-accent"
//                       )}
//                     >
//                       <input
//                         type="radio"
//                         name="ethnicity"
//                         value={eth.value}
//                         checked={ethnicity === eth.value}
//                         onChange={(e) => setEthnicity(e.target.value as Ethnicity)}
//                         className="h-4 w-4"
//                       />
//                       <span>{eth.label}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Areas of Study */}
//               <div className="grid gap-3">
//                 <Label>Areas of Study</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     type="text"
//                     placeholder="e.g., Computer Science, Biology"
//                     value={currentArea}
//                     onChange={(e) => setCurrentArea(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         handleAddArea();
//                       }
//                     }}
//                   />
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={handleAddArea}
//                     disabled={!currentArea.trim()}
//                   >
//                     Add
//                   </Button>
//                 </div>
//                 {areasOfStudy.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {areasOfStudy.map((area) => (
//                       <div
//                         key={area}
//                         className="flex items-center gap-2 px-3 py-1 bg-accent rounded-md text-sm"
//                       >
//                         <span>{area}</span>
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveArea(area)}
//                           className="hover:text-destructive"
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <p className="text-sm text-muted-foreground">
//                   Add areas of study you're interested in (e.g., your major, fields of interest)
//                 </p>
//               </div>

//               {error && <p className="text-sm text-red-500">{error}</p>}

//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading
//                   ? "Saving..."
//                   : initialProfile
//                     ? "Update Profile"
//                     : "Complete Profile"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Upload, X, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Gender, UserProfile, Ethnicity } from "@/types/profile";
import { useState, useEffect, useRef } from "react";

const GENDERS: Gender[] = ["male", "female", "other", "non-binary"];

const ETHNICITIES: { value: Ethnicity; label: string }[] = [
  { value: "ASIAN", label: "Asian" },
  { value: "BLACK", label: "Black" },
  { value: "HISPANIC", label: "Hispanic" },
  { value: "WHITE", label: "White" },
  { value: "NATIVE", label: "Native American" },
  { value: "MIDDLE_EASTERN", label: "Middle Eastern" },
  { value: "OTHER", label: "Other" },
];

// Genre mapping between display names and database enum values
const GENRE_MAPPING: { [key: string]: string } = {
  'Pop': 'pop',
  'Hip-Hop': 'hiphop',
  'R&B': 'pop', // Map to pop as R&B is not in enum
  'Rock': 'rock',
  'Indie': 'rock', // Map to rock as indie is not in enum
  'Electronic': 'pop', // Map to pop as electronic is not in enum
  'Jazz': 'blues', // Map to blues as jazz is not in enum
  'Classical': 'pop', // Map to pop as classical is not in enum
  'K-Pop': 'pop',
  'Metal': 'metal',
  'Blues': 'blues',
  'Latin': 'latin',
  'Bollywood': 'bollywood',
};

// Reverse mapping from database values to display names
const GENRE_DISPLAY_MAPPING: { [key: string]: string } = {
  'pop': 'Pop',
  'hiphop': 'Hip-Hop',
  'rock': 'Rock',
  'metal': 'Metal',
  'blues': 'Blues',
  'latin': 'Latin',
  'bollywood': 'Bollywood',
};

// Helper to convert database hobby format to display format
const formatHobbyForDisplay = (hobby: string): string => {
  return hobby
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper to convert display format to database format
const formatHobbyForDatabase = (hobby: string): string => {
  return hobby.toLowerCase().replace(/\s+/g, '_');
};

interface ProfileFormProps {
  initialProfile?: UserProfile | null;
  className?: string;
}

export function ProfileForm({ initialProfile, className }: ProfileFormProps) {
  const [gender, setGender] = useState<Gender>("male");
  const [genderPreferences, setGenderPreferences] = useState<Gender[]>([]);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [areasOfStudy, setAreasOfStudy] = useState<string[]>([]);
  const [currentArea, setCurrentArea] = useState("");
  const [ethnicity, setEthnicity] = useState<Ethnicity>("OTHER");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>(["", "", "", ""]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    // Force a full page reload to clear all state and cached data
    window.location.href = "/auth/login";
  };
  
  // Questionnaire fields
  const [campus, setCampus] = useState("");
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [favoriteBands, setFavoriteBands] = useState<string[]>([]);
  const [musicGenres, setMusicGenres] = useState<string[]>([]);
  const [sportsTeams, setSportsTeams] = useState<string[]>([]);
  const [footballPreference, setFootballPreference] = useState("");
  const [clubs, setClubs] = useState<string[]>([]);
  const [studyPreference, setStudyPreference] = useState("");
  const [favCampusSpots, setFavCampusSpots] = useState<string[]>([]);
  const [personalityTraits, setPersonalityTraits] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [goingOutFrequency, setGoingOutFrequency] = useState("");
  const [idealWeekend, setIdealWeekend] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [dealBreakers, setDealBreakers] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [showQuestionnaireSection, setShowQuestionnaireSection] = useState(false);

  // Load initial profile data if available
  useEffect(() => {
    if (initialProfile) {
      console.log("Loading profile data:", initialProfile);
      
      setGender(initialProfile.gender);
      setGenderPreferences(initialProfile.gender_preference || []);
      setFname(initialProfile.fname || "");
      setLname(initialProfile.lname || "");
      setAreasOfStudy(initialProfile.areas_of_study || []);
      setEthnicity(initialProfile.ethnicity || "OTHER");
      setDescription(initialProfile.description || "");
      
      // Load images
      const profileImages = initialProfile.images || [];
      const paddedImages = [...profileImages];
      while (paddedImages.length < 4) {
        paddedImages.push("");
      }
      setImages(paddedImages.slice(0, 4));
      
      // Load questionnaire data directly from initialProfile
      if (initialProfile.campus) {
        console.log("Loading campus:", initialProfile.campus);
        setCampus(initialProfile.campus);
      }
      if (initialProfile.hobbies) {
        console.log("Loading hobbies from DB:", initialProfile.hobbies);
        // Convert database format (e.g., 'playing_music') to display format (e.g., 'Playing Music')
        const displayHobbies = initialProfile.hobbies.map(h => formatHobbyForDisplay(h));
        console.log("Converted to display format:", displayHobbies);
        setHobbies(displayHobbies);
      }
      if (initialProfile.favoriteBands) {
        console.log("Loading favorite bands:", initialProfile.favoriteBands);
        setFavoriteBands(initialProfile.favoriteBands);
      }
      if (initialProfile.musicGenres) {
        console.log("Loading music genres from DB:", initialProfile.musicGenres);
        // Convert database enum values to display format
        const displayGenres = initialProfile.musicGenres
          .map(g => GENRE_DISPLAY_MAPPING[g.toLowerCase()] || g)
          .filter(Boolean);
        console.log("Converted to display format:", displayGenres);
        setMusicGenres(displayGenres);
      }
      if (initialProfile.sportsTeams) {
        setSportsTeams(initialProfile.sportsTeams);
      }
      if (initialProfile.footballPreference) {
        setFootballPreference(initialProfile.footballPreference);
      }
      if (initialProfile.clubs) {
        setClubs(initialProfile.clubs);
      }
      if (initialProfile.studyPreference) {
        console.log("Loading study preference:", initialProfile.studyPreference);
        setStudyPreference(initialProfile.studyPreference);
      }
      if (initialProfile.favCampusSpots) {
        setFavCampusSpots(initialProfile.favCampusSpots);
      }
      if (initialProfile.personalityTraits) {
        console.log("Loading personality traits:", initialProfile.personalityTraits);
        setPersonalityTraits(initialProfile.personalityTraits);
      }
      if (initialProfile.values) {
        setValues(initialProfile.values);
      }
      if (initialProfile.goingOutFrequency) {
        setGoingOutFrequency(initialProfile.goingOutFrequency);
      }
      if (initialProfile.idealWeekend) {
        setIdealWeekend(initialProfile.idealWeekend);
      }
      if (initialProfile.lookingFor) {
        setLookingFor(initialProfile.lookingFor);
      }
      if (initialProfile.dealBreakers) {
        setDealBreakers(initialProfile.dealBreakers);
      }
      
      // Show questionnaire section if any data exists
      if (initialProfile.hobbies && initialProfile.hobbies.length > 0) {
        setShowQuestionnaireSection(true);
      }
    }
  }, [initialProfile]);

  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size too large. Maximum size is 5MB.");
      return;
    }

    setUploadingIndex(index);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("index", index.toString());

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      
      // Update images array with new URL
      setImages((prev) => {
        const updated = [...prev];
        updated[index] = data.url;
        return updated;
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleImageDelete = async (index: number) => {
    if (!images[index]) return;

    setUploadingIndex(index);
    setError(null);

    try {
      const response = await fetch(`/api/upload-image?index=${index}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete image");
      }

      // Update images array
      setImages((prev) => {
        const updated = [...prev];
        updated[index] = "";
        return updated;
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete image");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleGenderChange = (selectedGender: Gender) => {
    setGender(selectedGender);
  };

  const handlePreferenceToggle = (pref: Gender) => {
    setGenderPreferences((prev) => {
      if (prev.includes(pref)) {
        return prev.filter((p) => p !== pref);
      } else {
        return [...prev, pref];
      }
    });
  };

  const handleAddArea = () => {
    const trimmed = currentArea.trim();
    if (trimmed && !areasOfStudy.includes(trimmed)) {
      setAreasOfStudy([...areasOfStudy, trimmed]);
      setCurrentArea("");
    }
  };

  const handleRemoveArea = (area: string) => {
    setAreasOfStudy(areasOfStudy.filter((a) => a !== area));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!fname.trim()) {
      setError("First name is required");
      setIsLoading(false);
      return;
    }

    if (!lname.trim()) {
      setError("Last name is required");
      setIsLoading(false);
      return;
    }

    if (genderPreferences.length === 0) {
      setError("Please select at least one gender preference");
      setIsLoading(false);
      return;
    }

    try {
      // Save basic profile
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender,
          gender_preference: genderPreferences,
          fname: fname.trim(),
          lname: lname.trim(),
          areas_of_study: areasOfStudy,
          ethnicity,
          description: description.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save profile");
      }
      
      // Save questionnaire data if any exists (regardless of whether section is expanded)
      const hasQuestionnaireData = hobbies.length > 0 || 
        musicGenres.length > 0 || 
        favoriteBands.length > 0 || 
        sportsTeams.length > 0 || 
        clubs.length > 0 || 
        favCampusSpots.length > 0 || 
        personalityTraits.length > 0 || 
        values.length > 0 || 
        dealBreakers.length > 0 ||
        campus || 
        footballPreference || 
        studyPreference || 
        goingOutFrequency || 
        idealWeekend;
      
      if (hasQuestionnaireData) {
        // Convert display formats back to database formats
        const dbHobbies = hobbies.map(h => formatHobbyForDatabase(h));
        const dbMusicGenres = musicGenres.map(g => GENRE_MAPPING[g] || g.toLowerCase());
        
        const questionnaireResponse = await fetch("/api/questionnaire", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campus: campus || "",
            hobbies: dbHobbies,
            favoriteBands,
            musicGenres: dbMusicGenres,
            sportsTeams,
            footballPreference,
            clubs,
            studyPreference,
            favCampusSpots,
            personalityTraits,
            values,
            goingOutFrequency,
            idealWeekend,
            aboutMe: description.trim(),
            lookingFor,
            dealBreakers,
          }),
        });

        if (!questionnaireResponse.ok) {
          console.error("Failed to save questionnaire data");
          // Don't fail the whole submission if questionnaire fails
        }
      }

      // Always redirect to dashboard after saving profile
      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper functions for array fields
  const addToArray = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (value.trim()) {
      setter((prev) => [...prev, value.trim()]);
      setCurrentInput("");
    }
  };

  const removeFromArray = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleInArray = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    currentArray: string[],
    value: string
  ) => {
    if (currentArray.includes(value)) {
      setter(currentArray.filter((item) => item !== value));
    } else {
      setter([...currentArray, value]);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Logout Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {initialProfile ? "Edit Profile" : "Complete Your Profile"}
          </CardTitle>
          <CardDescription>
            {initialProfile
              ? "Update your profile information"
              : "Fill in your information to start matching with other users"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Profile Images */}
              <div className="grid gap-3">
                <Label>Profile Photos</Label>
                <div className="grid grid-cols-2 gap-4">
                  {images.map((imageUrl, index) => (
                    <div key={index} className="relative aspect-square">
                      <input
                        ref={(el) => {
                          fileInputRefs.current[index] = el;
                        }}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(index, file);
                          }
                        }}
                      />
                      
                      {imageUrl ? (
                        <div className="relative w-full h-full group">
                          <img
                            src={imageUrl}
                            alt={`Profile ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {uploadingIndex === index && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                              <div className="text-white">Processing...</div>
                            </div>
                          )}
                          {uploadingIndex !== index && (
                            <button
                              type="button"
                              onClick={() => handleImageDelete(index)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[index]?.click()}
                          disabled={uploadingIndex === index}
                          className="w-full h-full bg-muted rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted/80 transition-colors border-2 border-dashed border-muted-foreground/25"
                        >
                          {uploadingIndex === index ? (
                            <div className="text-muted-foreground">Uploading...</div>
                          ) : (
                            <>
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Add Photo {index + 1}
                              </span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload up to 4 photos. JPEG, PNG, or WebP. Max 5MB each.
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fname">First Name *</Label>
                  <Input
                    id="fname"
                    type="text"
                    placeholder="John"
                    required
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lname">Last Name *</Label>
                  <Input
                    id="lname"
                    type="text"
                    placeholder="Doe"
                    required
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="grid gap-3">
                <Label>Your Gender *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {GENDERS.map((g) => (
                    <label
                      key={g}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-accent",
                        gender === g && "border-primary bg-accent"
                      )}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={gender === g}
                        onChange={() => handleGenderChange(g)}
                        className="h-4 w-4"
                      />
                      <span className="capitalize">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender Preferences */}
              <div className="grid gap-3">
                <Label>Interested In *</Label>
                <div className="space-y-3">
                  {GENDERS.map((g) => (
                    <div key={g} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pref-${g}`}
                        checked={genderPreferences.includes(g)}
                        onCheckedChange={() => handlePreferenceToggle(g)}
                      />
                      <label
                        htmlFor={`pref-${g}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
                      >
                        {g}
                      </label>
                    </div>
                  ))}
                </div>
                {genderPreferences.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Select at least one preference to see matches
                  </p>
                )}
              </div>

              {/* Ethnicity */}
              <div className="grid gap-3">
                <Label>Ethnicity *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {ETHNICITIES.map((eth) => (
                    <label
                      key={eth.value}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-accent",
                        ethnicity === eth.value && "border-primary bg-accent"
                      )}
                    >
                      <input
                        type="radio"
                        name="ethnicity"
                        value={eth.value}
                        checked={ethnicity === eth.value}
                        onChange={(e) => setEthnicity(e.target.value as Ethnicity)}
                        className="h-4 w-4"
                      />
                      <span>{eth.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Areas of Study */}
              <div className="grid gap-3">
                <Label>Areas of Study</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g., Computer Science, Biology"
                    value={currentArea}
                    onChange={(e) => setCurrentArea(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddArea();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddArea}
                    disabled={!currentArea.trim()}
                  >
                    Add
                  </Button>
                </div>
                {areasOfStudy.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {areasOfStudy.map((area) => (
                      <div
                        key={area}
                        className="flex items-center gap-2 px-3 py-1 bg-accent rounded-md text-sm"
                      >
                        <span>{area}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveArea(area)}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Add areas of study you're interested in (e.g., your major, fields of interest)
                </p>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">About Me</Label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="Tell us about yourself... (e.g., your interests, hobbies, what you're looking for, etc.)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-sm text-muted-foreground">
                  An AI summary will be generated from your description when you save your profile.
                </p>
              </div>

              {/* Questionnaire Section Toggle */}
              {initialProfile && (
                <div className="border-t pt-6">
                  <button
                    type="button"
                    onClick={() => setShowQuestionnaireSection(!showQuestionnaireSection)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">Questionnaire Details</h3>
                      <p className="text-sm text-muted-foreground">
                        Edit your matching preferences and interests
                      </p>
                    </div>
                    <span className="text-2xl">{showQuestionnaireSection ? "−" : "+"}</span>
                  </button>
                </div>
              )}

              {/* Questionnaire Fields */}
              {showQuestionnaireSection && (
                <div className="space-y-6 border-t pt-6">
                  {/* Campus */}
                  <div className="grid gap-3">
                    <Label>Campus</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["St. George", "Mississauga", "Scarborough"].map((campusOption) => (
                        <button
                          key={campusOption}
                          type="button"
                          onClick={() => setCampus(campusOption)}
                          className={cn(
                            "px-4 py-3 rounded-lg font-medium transition",
                            campus === campusOption
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          {campusOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hobbies */}
                  <div className="grid gap-3">
                    <Label>Hobbies</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addToArray(setHobbies, currentInput);
                          }
                        }}
                        placeholder="Add hobbies..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addToArray(setHobbies, currentInput)}
                        disabled={!currentInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    {hobbies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {hobbies.map((hobby, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-3 py-1 bg-accent rounded-md text-sm"
                          >
                            <span>{hobby}</span>
                            <button
                              type="button"
                              onClick={() => removeFromArray(setHobbies, idx)}
                              className="hover:text-destructive"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Music Genres */}
                  <div className="grid gap-3">
                    <Label>Music Genres</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Pop", "Hip-Hop", "R&B", "Rock", "Indie", "Electronic", "Jazz", "Classical", "K-Pop"].map(
                        (genre) => (
                          <button
                            key={genre}
                            type="button"
                            onClick={() => toggleInArray(setMusicGenres, musicGenres, genre)}
                            className={cn(
                              "px-3 py-2 rounded-lg text-sm font-medium transition",
                              musicGenres.includes(genre)
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                            )}
                          >
                            {genre}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Favorite Bands */}
                  <div className="grid gap-3">
                    <Label>Favorite Bands/Artists</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addToArray(setFavoriteBands, currentInput);
                          }
                        }}
                        placeholder="Add favorite bands or artists..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addToArray(setFavoriteBands, currentInput)}
                        disabled={!currentInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    {favoriteBands.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {favoriteBands.map((band, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-3 py-1 bg-accent rounded-md text-sm"
                          >
                            <span>{band}</span>
                            <button
                              type="button"
                              onClick={() => removeFromArray(setFavoriteBands, idx)}
                              className="hover:text-destructive"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Personality Traits */}
                  <div className="grid gap-3">
                    <Label>Personality Traits</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Outgoing", "Introverted", "Adventurous", "Homebody", "Spontaneous", "Planner", "Creative", "Analytical"].map(
                        (trait) => (
                          <button
                            key={trait}
                            type="button"
                            onClick={() => toggleInArray(setPersonalityTraits, personalityTraits, trait)}
                            className={cn(
                              "px-3 py-2 rounded-lg text-sm font-medium transition",
                              personalityTraits.includes(trait)
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                            )}
                          >
                            {trait}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Study Preference */}
                  <div className="grid gap-3">
                    <Label>Study Preference</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Solo in the library", "Study groups", "Coffee shops", "Flexible"].map((pref) => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => setStudyPreference(pref)}
                          className={cn(
                            "px-4 py-3 rounded-lg font-medium transition",
                            studyPreference === pref
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ideal Weekend */}
                  <div className="grid gap-2">
                    <Label htmlFor="idealWeekend">Ideal Weekend</Label>
                    <textarea
                      id="idealWeekend"
                      rows={3}
                      placeholder="Describe your ideal weekend..."
                      value={idealWeekend}
                      onChange={(e) => setIdealWeekend(e.target.value)}
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  {/* Looking For */}
                  <div className="grid gap-2">
                    <Label htmlFor="lookingFor">Looking For</Label>
                    <textarea
                      id="lookingFor"
                      rows={3}
                      placeholder="What are you looking for? (e.g., friends, study partners, dating...)"
                      value={lookingFor}
                      onChange={(e) => setLookingFor(e.target.value)}
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : initialProfile
                    ? "Update Profile"
                    : "Complete Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}