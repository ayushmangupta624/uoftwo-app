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
import { useRouter } from "next/navigation";
import { Upload, X, ImageIcon } from "lucide-react";

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
  const router = useRouter();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load initial profile data if available
  useEffect(() => {
    if (initialProfile) {
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

      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
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