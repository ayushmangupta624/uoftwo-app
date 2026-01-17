'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Upload, Check } from 'lucide-react';

// Define all the steps in the questionnaire
const TOTAL_STEPS = 18; // 0-17: PDF upload + campus + 15 questions + final review

// Valid hobbies that match the database enum
const VALID_HOBBIES = [
  { value: 'photography', label: 'Photography' },
  { value: 'video_games', label: 'Gaming' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'baking', label: 'Baking' },
  { value: 'reading', label: 'Reading' },
  { value: 'writing', label: 'Writing' },
  { value: 'painting', label: 'Painting' },
  { value: 'drawing', label: 'Drawing' },
  { value: 'playing_music', label: 'Playing Music' },
  { value: 'singing', label: 'Singing' },
  { value: 'dancing', label: 'Dancing' },
  { value: 'running', label: 'Running' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'soccer', label: 'Soccer' },
  { value: 'football', label: 'Football' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'volleyball', label: 'Volleyball' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'hiking', label: 'Hiking' },
  { value: 'camping', label: 'Camping' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'weightlifting', label: 'Weightlifting' },
  { value: 'rock_climbing', label: 'Rock Climbing' },
  { value: 'skiing', label: 'Skiing' },
  { value: 'snowboarding', label: 'Snowboarding' },
  { value: 'surfing', label: 'Surfing' },
  { value: 'skateboarding', label: 'Skateboarding' },
  { value: 'traveling', label: 'Traveling' },
  { value: 'coding', label: 'Coding' },
  { value: 'web_development', label: 'Web Development' },
  { value: 'app_development', label: 'App Development' },
  { value: 'game_development', label: 'Game Development' },
  { value: 'graphic_design', label: 'Graphic Design' },
  { value: 'videography', label: 'Videography' },
  { value: 'podcasting', label: 'Podcasting' },
  { value: 'blogging', label: 'Blogging' },
  { value: 'vlogging', label: 'Vlogging' },
  { value: 'streaming', label: 'Streaming' },
  { value: 'chess', label: 'Chess' },
  { value: 'board_games', label: 'Board Games' },
  { value: 'card_games', label: 'Card Games' },
  { value: 'esports', label: 'Esports' },
  { value: 'poker', label: 'Poker' },
  { value: 'puzzles', label: 'Puzzles' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'pet_care', label: 'Pet Care' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'museums', label: 'Visiting Museums' },
  { value: 'theater', label: 'Theater' },
  { value: 'movies', label: 'Watching Movies' },
  { value: 'anime', label: 'Anime' },
  { value: 'comics', label: 'Comics' },
  { value: 'cosplay', label: 'Cosplay' },
  { value: 'fashion_design', label: 'Fashion Design' },
  { value: 'thrifting', label: 'Thrifting' },
  { value: 'vintage_shopping', label: 'Vintage Shopping' },
  { value: 'collecting', label: 'Collecting' },
  { value: 'pottery', label: 'Pottery' },
  { value: 'sculpting', label: 'Sculpting' },
  { value: 'knitting', label: 'Knitting' },
  { value: 'crocheting', label: 'Crocheting' },
  { value: 'sewing', label: 'Sewing' },
  { value: 'woodworking', label: 'Woodworking' },
  { value: 'jewelry_making', label: 'Jewelry Making' },
  { value: 'mixology', label: 'Mixology' },
  { value: 'wine_tasting', label: 'Wine Tasting' },
  { value: 'coffee_roasting', label: 'Coffee Roasting' },
  { value: 'astronomy', label: 'Astronomy' },
  { value: 'history', label: 'History' },
  { value: 'philosophy', label: 'Philosophy' },
  { value: 'learning_languages', label: 'Learning Languages' },
  { value: 'book_clubs', label: 'Book Clubs' },
  { value: 'debating', label: 'Debating' },
  { value: 'public_speaking', label: 'Public Speaking' },
  { value: 'martial_arts', label: 'Martial Arts' },
  { value: 'boxing', label: 'Boxing' },
  { value: 'bouldering', label: 'Bouldering' },
  { value: 'crossfit', label: 'CrossFit' },
  { value: 'baseball', label: 'Baseball' },
  { value: 'fishing', label: 'Fishing' },
  { value: 'horseback_riding', label: 'Horseback Riding' },
  { value: 'birdwatching', label: 'Birdwatching' },
  { value: 'cars', label: 'Cars' },
  { value: 'motorcycles', label: 'Motorcycles' },
  { value: 'drones', label: 'Drones' },
  { value: 'robotics', label: 'Robotics' },
  { value: 'threed_printing', label: '3D Printing' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'model_building', label: 'Model Building' },
  { value: 'magic_tricks', label: 'Magic Tricks' },
  { value: 'juggling', label: 'Juggling' },
  { value: 'origami', label: 'Origami' },
  { value: 'calligraphy', label: 'Calligraphy' },
  { value: 'poetry', label: 'Poetry' },
  { value: 'djing', label: 'DJing' },
  { value: 'music_production', label: 'Music Production' },
  { value: 'ballet', label: 'Ballet' },
  { value: 'stand_up_comedy', label: 'Stand-up Comedy' },
  { value: 'interior_design', label: 'Interior Design' },
  { value: 'metalworking', label: 'Metalworking' },
  { value: 'hacking', label: 'Hacking' },
  { value: 'activism', label: 'Activism' },
  { value: 'networking', label: 'Networking' },
  { value: 'mentoring', label: 'Mentoring' },
  { value: 'antiques', label: 'Antiques' },
  { value: 'coin_collecting', label: 'Coin Collecting' },
  { value: 'stamp_collecting', label: 'Stamp Collecting' },
  { value: 'escape_rooms', label: 'Escape Rooms' },
  { value: 'hunting', label: 'Hunting' },
].sort((a, b) => a.label.localeCompare(b.label));

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [showHobbyDropdown, setShowHobbyDropdown] = useState(false);
  const [filteredHobbies, setFilteredHobbies] = useState(VALID_HOBBIES);
  
  // Test mode - allows skipping PDF for development
  const [testMode] = useState(typeof window !== 'undefined' && window.location.search.includes('test=true'));
  
  // Form data
  const [formData, setFormData] = useState({
    campus: '',
    hobbies: [] as string[],
    favoriteBands: [] as string[],
    musicGenres: [] as string[],
    sportsTeams: [] as string[],
    footballPreference: '',
    clubs: [] as string[],
    studyPreference: '',
    favCampusSpots: [] as string[],
    personalityTraits: [] as string[],
    values: [] as string[],
    goingOutFrequency: '',
    idealWeekend: '',
    aboutMe: '',
    lookingFor: '',
    dealBreakers: [] as string[]
  });

  // Temporary input states for multi-select questions
  const [currentInput, setCurrentInput] = useState('');

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfPreview(file.name);
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentInput('');
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentInput('');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // TODO: Upload PDF if provided (schedule upload functionality to be implemented)
      // For now, we'll skip PDF upload and focus on questionnaire data
      
      // Submit questionnaire data to API
      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit questionnaire');
      }

      const result = await response.json();
      console.log('Questionnaire submitted successfully:', result);

      // Redirect to profile page to add photos and name
      router.push('/profile');
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit questionnaire. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addToArray = (field: keyof typeof formData, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
      setCurrentInput('');
    }
  };

  const addHobby = (hobbyValue: string, hobbyLabel: string) => {
    if (!formData.hobbies.includes(hobbyValue)) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, hobbyValue]
      }));
    }
    setCurrentInput('');
    setShowHobbyDropdown(false);
    setFilteredHobbies(VALID_HOBBIES);
  };

  const handleHobbyInputChange = (value: string) => {
    setCurrentInput(value);
    setShowHobbyDropdown(true);
    
    // Always filter out already selected hobbies
    const availableHobbies = VALID_HOBBIES.filter(hobby =>
      !formData.hobbies.includes(hobby.value)
    );
    
    if (value.trim() === '') {
      setFilteredHobbies(availableHobbies);
    } else {
      const filtered = availableHobbies.filter(hobby =>
        hobby.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredHobbies(filtered);
    }
  };

  const handleHobbyFocus = () => {
    setShowHobbyDropdown(true);
    // Update filtered list on focus to exclude already selected
    const availableHobbies = VALID_HOBBIES.filter(hobby =>
      !formData.hobbies.includes(hobby.value)
    );
    setFilteredHobbies(availableHobbies);
  };

  const removeFromArray = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const toggleInArray = (field: keyof typeof formData, value: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: currentArray.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, value]
      }));
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return testMode || pdfFile !== null;
      case 1: return formData.campus !== '';
      case 2: return formData.hobbies.length > 0;
      case 3: return formData.favoriteBands.length > 0;
      case 4: return formData.musicGenres.length > 0;
      case 5: return formData.sportsTeams.length > 0;
      case 6: return formData.footballPreference !== '';
      case 7: return formData.clubs.length > 0;
      case 8: return formData.studyPreference !== '';
      case 9: return formData.favCampusSpots.length > 0;
      case 10: return formData.personalityTraits.length > 0;
      case 11: return formData.values.length > 0;
      case 12: return formData.goingOutFrequency !== '';
      case 13: return formData.idealWeekend !== '';
      case 14: return formData.aboutMe !== '';
      case 15: return formData.lookingFor !== '';
      case 16: return formData.dealBreakers.length > 0;
      default: return true;
    }
  };

  const progressPercentage = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef6ff] via-white to-[#f6fbff] relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#8B5F5F]/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-[#6B4646]/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-[#8B5F5F]">
              Step {currentStep + 1} of {TOTAL_STEPS}
            </span>
            <span className="text-sm text-[#5a3939]/80">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-[#E6D4D4] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[#E6D4D4]/90 backdrop-blur-sm border border-[#A67C7C]/30 rounded-3xl shadow-2xl p-8 sm:p-12 min-h-[500px] flex flex-col">
          
          {/* Step 0: Upload PDF Schedule */}
          {currentStep === 0 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#4a2e2e] mb-4">
                  Upload Your Schedule 📅
                </h2>
                <p className="text-lg text-[#5a3939]/90">
                  First, let's add your class schedule as a PDF so we can find the best matches for your week.
                </p>
              </div>

              <label className="flex-1 group relative flex flex-col items-center justify-center border-2 border-dashed border-[#8B5F5F]/40 rounded-2xl px-6 py-16 text-center cursor-pointer hover:border-[#8B5F5F] hover:bg-[#8B5F5F]/5 transition">
                <input
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={handlePdfUpload}
                />
                {pdfFile ? (
                  <>
                    <Check className="h-16 w-16 text-green-500 mb-4" />
                    <p className="text-xl font-semibold text-[#4a2e2e]">
                      {pdfPreview}
                    </p>
                    <p className="mt-2 text-sm text-[#5a3939]/80">
                      Click to change file
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-16 w-16 text-[#8B5F5F] group-hover:scale-105 transition-transform" />
                    <p className="mt-4 text-xl font-semibold text-[#4a2e2e]">
                      Click to upload your PDF
                    </p>
                    <p className="mt-2 text-sm text-[#5a3939]/80">
                      Or drag and drop here
                    </p>
                  </>
                )}
              </label>
            </div>
          )}

          {/* Step 1: Campus Selection */}
          {currentStep === 1 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#4a2e2e] mb-4">
                  Which UofT campus are you on? 🏫
                </h2>
                <p className="text-lg text-[#5a3939]/90">
                  Select your main campus
                </p>
              </div>

              <div className="grid gap-4">
                    {[
                      { value: 'St. George', icon: '🏛️', description: 'Downtown Toronto - Main Campus' },
                      { value: 'Mississauga', icon: '🌳', description: 'UTM - Mississauga Campus' },
                      { value: 'Scarborough', icon: '🏞️', description: 'UTSC - Scarborough Campus' }
                    ].map((campus) => (
                      <button
                        key={campus.value}
                        onClick={() => setFormData(prev => ({ ...prev, campus: campus.value }))}
                        className={`px-6 py-5 rounded-xl font-medium text-left transition ${
                          formData.campus === campus.value
                            ? 'bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white'
                            : 'bg-[#8B5F5F]/10 text-[#6B4646] hover:bg-[#8B5F5F]/20'
                        }`}
                      >
                        <div className="text-2xl mb-1">{campus.icon}</div>
                        <div className="font-semibold">{campus.value}</div>
                        <div className="text-sm opacity-80">{campus.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
    
              {/* Step 2: Hobbies */}
              {currentStep === 2 && (
                <div className="flex-1 flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                      What are your hobbies? 🎨
                    </h2>
                    <p className="text-lg text-[#6B4646]/70">
                      Search and select from our list of hobbies
                    </p>
                  </div>
    
                  <div className="relative mb-4">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => handleHobbyInputChange(e.target.value)}
                      onFocus={handleHobbyFocus}
                      onBlur={() => setTimeout(() => setShowHobbyDropdown(false), 200)}
                      placeholder="Search hobbies... (e.g., Photography, Gaming, Cooking)"
                      className="w-full px-4 py-3 border-2 border-[#8B5F5F]/30 rounded-xl focus:outline-none focus:border-[#8B5F5F] text-[#6B4646]"
                    />
                    
                    {showHobbyDropdown && filteredHobbies.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border-2 border-[#8B5F5F]/30 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {filteredHobbies.slice(0, 10).map((hobby) => (
                          <button
                            key={hobby.value}
                            onClick={() => addHobby(hobby.value, hobby.label)}
                            className="w-full px-4 py-3 text-left hover:bg-[#8B5F5F]/10 text-[#6B4646] transition border-b border-[#8B5F5F]/10 last:border-b-0"
                          >
                            {hobby.label}
                          </button>
                        ))}
                        {filteredHobbies.length > 10 && (
                          <div className="px-4 py-2 text-sm text-[#6B4646]/50 italic">
                            + {filteredHobbies.length - 10} more... Keep typing to filter
                          </div>
                        )}
                      </div>
                    )}
                    
                    {showHobbyDropdown && currentInput && filteredHobbies.length === 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border-2 border-[#8B5F5F]/30 rounded-xl shadow-lg p-4 text-center text-[#6B4646]/70">
                        No matching hobbies found. Try different keywords!
                      </div>
                    )}
                  </div>
    
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.hobbies.map((hobby, idx) => {
                      const hobbyLabel = VALID_HOBBIES.find(h => h.value === hobby)?.label || hobby;
                      return (
                        <span
                          key={idx}
                          onClick={() => removeFromArray('hobbies', idx)}
                          className="px-4 py-2 bg-[#8B5F5F]/10 text-[#6B4646] rounded-full text-sm font-medium cursor-pointer hover:bg-red-100 hover:text-red-600 transition"
                        >
                          {hobbyLabel} ×
                        </span>
                      );
                    })}
                  </div>
                  
                  {formData.hobbies.length === 0 && (
                    <p className="text-sm text-[#6B4646]/50 italic">
                      Start typing to search from {VALID_HOBBIES.length} available hobbies
                    </p>
                  )}
            </div>
          )}

          {/* Step 3: Favorite Bands/Artists */}
          {currentStep === 3 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  Favorite Bands or Artists? 🎵
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Who's on your playlist?
                </p>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToArray('favoriteBands', currentInput)}
                  placeholder="e.g., The Weeknd, Taylor Swift..."
                  className="flex-1 px-4 py-3 border-2 border-[#8B5F5F]/30 rounded-xl focus:outline-none focus:border-[#8B5F5F] text-[#6B4646]"
                />
                <button
                  onClick={() => addToArray('favoriteBands', currentInput)}
                  className="px-6 py-3 bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white rounded-xl hover:shadow-lg transition font-semibold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.favoriteBands.map((band, idx) => (
                  <span
                    key={idx}
                    onClick={() => removeFromArray('favoriteBands', idx)}
                    className="px-4 py-2 bg-[#8B5F5F]/10 text-[#6B4646] rounded-full text-sm font-medium cursor-pointer hover:bg-red-100 hover:text-red-600 transition"
                  >
                    {band} ×
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Music Genres */}
          {currentStep === 4 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  What music genres do you vibe with? 🎧
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Select all that apply
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Pop', 'Hip-Hop', 'R&B', 'Rock', 'Indie', 'Electronic', 'Jazz', 'Classical', 'Country', 'K-Pop', 'Latin', 'Alternative'].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleInArray('musicGenres', genre)}
                    className={`px-4 py-3 rounded-xl font-medium transition ${
                      formData.musicGenres.includes(genre)
                        ? 'bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white'
                        : 'bg-[#8B5F5F]/10 text-[#6B4646] hover:bg-[#8B5F5F]/20'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Sports Teams */}
          {currentStep === 5 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  Do you follow any sports teams? 🏀
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Add your favorite teams (or skip if not into sports)
                </p>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToArray('sportsTeams', currentInput)}
                  placeholder="e.g., Raptors, Maple Leafs, Blue Jays..."
                  className="flex-1 px-4 py-3 border-2 border-[#8B5F5F]/30 rounded-xl focus:outline-none focus:border-[#8B5F5F] text-[#6B4646]"
                />
                <button
                  onClick={() => addToArray('sportsTeams', currentInput)}
                  className="px-6 py-3 bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white rounded-xl hover:shadow-lg transition font-semibold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.sportsTeams.map((team, idx) => (
                  <span
                    key={idx}
                    onClick={() => removeFromArray('sportsTeams', idx)}
                    className="px-4 py-2 bg-[#8B5F5F]/10 text-[#6B4646] rounded-full text-sm font-medium cursor-pointer hover:bg-red-100 hover:text-red-600 transition"
                  >
                    {team} ×
                  </span>
                ))}
              </div>

              {formData.sportsTeams.length === 0 && (
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, sportsTeams: ['Not into sports'] }));
                  }}
                  className="mt-4 text-[#8B5F5F] hover:text-[#6B4646] font-medium"
                >
                  Skip - I'm not into sports
                </button>
              )}
            </div>
          )}

          {/* Step 6: Football Preference */}
          {currentStep === 6 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  American Football or Soccer? ⚽🏈
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Which one do you call "football"?
                </p>
              </div>

              <div className="grid gap-4">
                {['American Football', 'Soccer (Football)', 'Both!', 'Neither'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData(prev => ({ ...prev, footballPreference: option }))}
                    className={`px-6 py-4 rounded-xl font-medium text-lg transition ${
                      formData.footballPreference === option
                        ? 'bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white'
                        : 'bg-[#8B5F5F]/10 text-[#6B4646] hover:bg-[#8B5F5F]/20'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: UofT Clubs */}
          {currentStep === 7 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  What UofT clubs are you in? 🎓
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  List any campus organizations you're part of
                </p>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToArray('clubs', currentInput)}
                  placeholder="e.g., CSSU, Debate Club, Varsity Blues..."
                  className="flex-1 px-4 py-3 border-2 border-[#8B5F5F]/30 rounded-xl focus:outline-none focus:border-[#8B5F5F] text-[#6B4646]"
                />
                <button
                  onClick={() => addToArray('clubs', currentInput)}
                  className="px-6 py-3 bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white rounded-xl hover:shadow-lg transition font-semibold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.clubs.map((club, idx) => (
                  <span
                    key={idx}
                    onClick={() => removeFromArray('clubs', idx)}
                    className="px-4 py-2 bg-[#8B5F5F]/10 text-[#6B4646] rounded-full text-sm font-medium cursor-pointer hover:bg-red-100 hover:text-red-600 transition"
                  >
                    {club} ×
                  </span>
                ))}
              </div>

              {formData.clubs.length === 0 && (
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, clubs: ['Not in any clubs yet'] }));
                  }}
                  className="mt-4 text-[#8B5F5F] hover:text-[#6B4646] font-medium"
                >
                  Skip - I'm not in any clubs yet
                </button>
              )}
            </div>
          )}

          {/* Step 8: Study Preference */}
          {currentStep === 8 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  How do you prefer to study? 📚
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Choose your study style
                </p>
              </div>

              <div className="grid gap-4">
                {['Solo in the library', 'Study groups', 'Coffee shops', 'Flexible - depends on the mood'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData(prev => ({ ...prev, studyPreference: option }))}
                    className={`px-6 py-4 rounded-xl font-medium text-lg transition ${
                      formData.studyPreference === option
                        ? 'bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white'
                        : 'bg-[#8B5F5F]/10 text-[#6B4646] hover:bg-[#8B5F5F]/20'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 9: Favorite Campus Spots */}
          {currentStep === 9 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  Favorite spots on campus? 🏛️
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Where do you like to hang out?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {['Robarts Library', 'Bahen Centre', 'Hart House', 'King\'s College Circle', 'Sidney Smith', 'Athletic Centre', 'University College', 'Gerstein Library'].map((spot) => (
                  <button
                    key={spot}
                    onClick={() => toggleInArray('favCampusSpots', spot)}
                    className={`px-4 py-3 rounded-xl font-medium transition ${
                      formData.favCampusSpots.includes(spot)
                        ? 'bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white'
                        : 'bg-[#8B5F5F]/10 text-[#6B4646] hover:bg-[#8B5F5F]/20'
                    }`}
                  >
                    {spot}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToArray('favCampusSpots', currentInput)}
                  placeholder="Add other spots..."
                  className="flex-1 px-4 py-3 border-2 border-[#8B5F5F]/30 rounded-xl focus:outline-none focus:border-[#8B5F5F] text-[#6B4646] text-sm"
                />
                <button
                  onClick={() => addToArray('favCampusSpots', currentInput)}
                  className="px-4 py-3 bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white rounded-xl hover:shadow-lg transition font-semibold text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Step 10: Personality Traits */}
          {currentStep === 10 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  How would you describe yourself? 💭
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Select your personality traits
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {['Outgoing', 'Introverted', 'Adventurous', 'Homebody', 'Spontaneous', 'Planner', 'Creative', 'Analytical', 'Chill', 'Energetic', 'Thoughtful', 'Funny'].map((trait) => (
                  <button
                    key={trait}
                    onClick={() => toggleInArray('personalityTraits', trait)}
                    className={`px-4 py-3 rounded-xl font-medium transition ${
                      formData.personalityTraits.includes(trait)
                        ? 'bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white'
                        : 'bg-[#8B5F5F]/10 text-[#6B4646] hover:bg-[#8B5F5F]/20'
                    }`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 11: Core Values */}
          {currentStep === 11 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  What values matter most to you? 💫
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Choose your top values
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {['Honesty', 'Ambition', 'Kindness', 'Independence', 'Family', 'Adventure', 'Creativity', 'Stability', 'Growth', 'Humor', 'Loyalty', 'Open-mindedness'].map((value) => (
                  <button
                    key={value}
                    onClick={() => toggleInArray('values', value)}
                    className={`px-4 py-3 rounded-xl font-medium transition ${
                      formData.values.includes(value)
                        ? 'bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white'
                        : 'bg-[#8B5F5F]/10 text-[#6B4646] hover:bg-[#8B5F5F]/20'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 12: Going Out Frequency */}
          {currentStep === 12 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  How often do you go out? 🌃
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Social events, parties, etc.
                </p>
              </div>

              <div className="grid gap-4">
                {['Every weekend', '2-3 times a month', 'Once a month', 'Rarely', 'Never - I prefer staying in'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData(prev => ({ ...prev, goingOutFrequency: option }))}
                    className={`px-6 py-4 rounded-xl font-medium text-lg transition ${
                      formData.goingOutFrequency === option
                        ? 'bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white'
                        : 'bg-[#8B5F5F]/10 text-[#6B4646] hover:bg-[#8B5F5F]/20'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 13: Ideal Weekend */}
          {currentStep === 13 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  What's your ideal weekend? 🌅
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Paint us a picture
                </p>
              </div>

              <textarea
                value={formData.idealWeekend}
                onChange={(e) => setFormData(prev => ({ ...prev, idealWeekend: e.target.value }))}
                placeholder="e.g., Saturday morning hike, brunch with friends, exploring the city, then a chill movie night..."
                className="flex-1 px-4 py-3 border-2 border-[#8B5F5F]/30 rounded-xl focus:outline-none focus:border-[#8B5F5F] text-[#6B4646] resize-none"
                rows={6}
              />
            </div>
          )}

          {/* Step 14: About Me */}
          {currentStep === 14 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  Tell us about yourself! ✨
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Write a short bio - be yourself!
                </p>
              </div>

              <textarea
                value={formData.aboutMe}
                onChange={(e) => setFormData(prev => ({ ...prev, aboutMe: e.target.value }))}
                placeholder="Share what makes you unique, your passions, what you're studying, what you love about UofT..."
                className="flex-1 px-4 py-3 border-2 border-[#8B5F5F]/30 rounded-xl focus:outline-none focus:border-[#8B5F5F] text-[#6B4646] resize-none"
                rows={8}
              />
            </div>
          )}

          {/* Step 15: Looking For */}
          {currentStep === 15 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  What are you looking for? 💕
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Friends, dating, study partners, or all of the above?
                </p>
              </div>

              <textarea
                value={formData.lookingFor}
                onChange={(e) => setFormData(prev => ({ ...prev, lookingFor: e.target.value }))}
                placeholder="e.g., Looking to meet new people, find study buddies, maybe something romantic if the connection is there..."
                className="flex-1 px-4 py-3 border-2 border-[#8B5F5F]/30 rounded-xl focus:outline-none focus:border-[#8B5F5F] text-[#6B4646] resize-none"
                rows={6}
              />
            </div>
          )}

          {/* Step 16: Deal Breakers */}
          {currentStep === 16 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  Any deal breakers? 🚫
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Things that are important to you
                </p>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToArray('dealBreakers', currentInput)}
                  placeholder="e.g., Smoking, No ambition, Bad communication..."
                  className="flex-1 px-4 py-3 border-2 border-[#8B5F5F]/30 rounded-xl focus:outline-none focus:border-[#8B5F5F] text-[#6B4646]"
                />
                <button
                  onClick={() => addToArray('dealBreakers', currentInput)}
                  className="px-6 py-3 bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white rounded-xl hover:shadow-lg transition font-semibold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.dealBreakers.map((dealBreaker, idx) => (
                  <span
                    key={idx}
                    onClick={() => removeFromArray('dealBreakers', idx)}
                    className="px-4 py-2 bg-[#8B5F5F]/10 text-[#6B4646] rounded-full text-sm font-medium cursor-pointer hover:bg-red-100 hover:text-red-600 transition"
                  >
                    {dealBreaker} ×
                  </span>
                ))}
              </div>

              {formData.dealBreakers.length === 0 && (
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, dealBreakers: ['None in particular'] }));
                  }}
                  className="mt-4 text-[#8B5F5F] hover:text-[#6B4646] font-medium"
                >
                  Skip - No specific deal breakers
                </button>
              )}
            </div>
          )}

          {/* Final Review Step */}
          {currentStep === 17 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-[#6B4646] mb-4">
                  Almost Done! 🎉
                </h2>
                <p className="text-lg text-[#6B4646]/70">
                  Review your profile before we generate your matches
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="p-4 bg-[#8B5F5F]/5 rounded-xl">
                  <h3 className="font-semibold text-[#6B4646] mb-2">Schedule</h3>
                  <p className="text-sm text-[#6B4646]/70">{pdfPreview}</p>
                </div>
                <div className="p-4 bg-[#8B5F5F]/5 rounded-xl">
                  <h3 className="font-semibold text-[#6B4646] mb-2">Campus</h3>
                  <p className="text-sm text-[#6B4646]/70">{formData.campus}</p>
                </div>
                <div className="p-4 bg-[#8B5F5F]/5 rounded-xl">
                  <h3 className="font-semibold text-[#6B4646] mb-2">Hobbies</h3>
                  <p className="text-sm text-[#6B4646]/70">{formData.hobbies.join(', ')}</p>
                </div>
                <div className="p-4 bg-[#8B5F5F]/5 rounded-xl">
                  <h3 className="font-semibold text-[#6B4646] mb-2">Music</h3>
                  <p className="text-sm text-[#6B4646]/70">{formData.musicGenres.join(', ')}</p>
                </div>
                <div className="p-4 bg-[#8B5F5F]/5 rounded-xl">
                  <h3 className="font-semibold text-[#6B4646] mb-2">About</h3>
                  <p className="text-sm text-[#6B4646]/70">{formData.aboutMe}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#6B4646]/10">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'text-[#6B4646] hover:bg-[#8B5F5F]/10'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition ${
                canProceed() && !isSubmitting
                  ? 'bg-gradient-to-r from-[#6B4646] to-[#8B5F5F] text-white hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Submitting...
                </>
              ) : (
                <>
                  {currentStep === TOTAL_STEPS - 1 ? 'Complete' : 'Next'}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
