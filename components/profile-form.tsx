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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load initial profile data if available
  useEffect(() => {
    if (initialProfile) {
      setGender(initialProfile.gender);
      setGenderPreferences(initialProfile.gender_preference || []);
      setFname(initialProfile.fname || "");
      setLname(initialProfile.lname || "");
      setAreasOfStudy(initialProfile.areas_of_study || []);
      setEthnicity(initialProfile.ethnicity || "OTHER");
    }
  }, [initialProfile]);

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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save profile");
      }

      // Redirect to dashboard after successful save
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
