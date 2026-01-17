// components/Questionnaire.tsx
'use client';

import { useState } from 'react';
import { QuestionnaireData } from '@/types';

const HOBBIES_OPTIONS = [
  'Reading', 'Gaming', 'Sports', 'Music', 'Cooking', 'Photography',
  'Hiking', 'Art', 'Dance', 'Fitness', 'Travel', 'Writing',
  'Coding', 'Board Games', 'Movies/TV', 'Podcasts'
];

const MUSIC_GENRES = [
  'Pop', 'Rock', 'Hip Hop', 'R&B', 'Electronic', 'Jazz',
  'Classical', 'Country', 'Indie', 'Metal', 'K-Pop', 'Latin'
];

const PERSONALITY_TRAITS = [
  'Outgoing', 'Introverted', 'Ambitious', 'Laid-back', 'Creative',
  'Analytical', 'Adventurous', 'Homebody', 'Spontaneous', 'Organized',
  'Empathetic', 'Independent', 'Collaborative', 'Curious'
];

const VALUES = [
  'Honesty', 'Ambition', 'Kindness', 'Intelligence', 'Humor',
  'Family', 'Career', 'Adventure', 'Stability', 'Creativity',
  'Social Justice', 'Personal Growth', 'Loyalty', 'Open-mindedness'
];

const UOFT_CLUBS = [
  'Engineering Society', 'UTSU', 'Hart House', 'Varsity Blues',
  'Debate Club', 'Drama Club', 'Film Society', 'Music Society',
  'Cultural Clubs', 'Academic Societies', 'Volunteer Organizations'
];

const CAMPUS_SPOTS = [
  'Robarts Library', 'Gerstein Library', 'Bahen Centre', 'Sidney Smith',
  'Hart House', 'UC Quad', 'Kings College Circle', 'St. George Campus',
  'Med Sci Building', 'Con Hall', 'Victoria College'
];

interface QuestionnaireProps {
  onSubmit: (data: QuestionnaireData) => void;
  initialData?: Partial<QuestionnaireData>;
}

export default function Questionnaire({ onSubmit, initialData }: QuestionnaireProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<QuestionnaireData>>(initialData || {
    hobbies: [],
    favoriteBands: [],
    musicGenres: [],
    sportsTeams: [],
    clubs: [],
    favCampusSpots: [],
    personalityTraits: [],
    values: [],
    dealBreakers: []
  });

  const toggleArrayItem = (field: keyof QuestionnaireData, item: string) => {
    const current = (formData[field] as string[]) || [];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    
    setFormData({ ...formData, [field]: updated });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData as QuestionnaireData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">What are your hobbies?</h2>
            <p className="text-gray-600">Select all that apply</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {HOBBIES_OPTIONS.map(hobby => (
                <button
                  key={hobby}
                  onClick={() => toggleArrayItem('hobbies', hobby)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.hobbies?.includes(hobby)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {hobby}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Music Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Favorite Bands/Artists
                </label>
                <input
                  type="text"
                  placeholder="e.g., The Weeknd, Taylor Swift, Drake"
                  className="w-full p-3 border rounded-lg"
                  onBlur={(e) => {
                    const bands = e.target.value.split(',').map(b => b.trim()).filter(Boolean);
                    setFormData({ ...formData, favoriteBands: bands });
                  }}
                  defaultValue={formData.favoriteBands?.join(', ')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Music Genres
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {MUSIC_GENRES.map(genre => (
                    <button
                      key={genre}
                      onClick={() => toggleArrayItem('musicGenres', genre)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.musicGenres?.includes(genre)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Sports & Teams</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Favorite Sports Teams
                </label>
                <input
                  type="text"
                  placeholder="e.g., Toronto Raptors, Manchester United"
                  className="w-full p-3 border rounded-lg"
                  onBlur={(e) => {
                    const teams = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                    setFormData({ ...formData, sportsTeams: teams });
                  }}
                  defaultValue={formData.sportsTeams?.join(', ')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Football: Real Madrid or Barcelona?
                </label>
                <div className="flex gap-3">
                  {['real_madrid', 'barca', 'neither', 'dont_follow'].map(option => (
                    <button
                      key={option}
                      onClick={() => setFormData({ ...formData, footballPreference: option as any })}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        formData.footballPreference === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option === 'real_madrid' ? 'Real Madrid' : 
                       option === 'barca' ? 'Barcelona' :
                       option === 'neither' ? 'Neither' : "Don't Follow"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">UofT Life</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Clubs & Organizations
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {UOFT_CLUBS.map(club => (
                    <button
                      key={club}
                      onClick={() => toggleArrayItem('clubs', club)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.clubs?.includes(club)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {club}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Study Preference
                </label>
                <div className="flex gap-3">
                  {['alone', 'groups', 'flexible'].map(pref => (
                    <button
                      key={pref}
                      onClick={() => setFormData({ ...formData, studyPreference: pref as any })}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all capitalize ${
                        formData.studyPreference === pref
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Favorite Campus Spots
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {CAMPUS_SPOTS.map(spot => (
                    <button
                      key={spot}
                      onClick={() => toggleArrayItem('favCampusSpots', spot)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.favCampusSpots?.includes(spot)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {spot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Personality & Values</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Personality Traits
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PERSONALITY_TRAITS.map(trait => (
                    <button
                      key={trait}
                      onClick={() => toggleArrayItem('personalityTraits', trait)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.personalityTraits?.includes(trait)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Core Values
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {VALUES.map(value => (
                    <button
                      key={value}
                      onClick={() => toggleArrayItem('values', value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.values?.includes(value)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  How often do you go out?
                </label>
                <div className="flex gap-3">
                  {['rarely', 'sometimes', 'often', 'very_often'].map(freq => (
                    <button
                      key={freq}
                      onClick={() => setFormData({ ...formData, goingOutFrequency: freq as any })}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        formData.goingOutFrequency === freq
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {freq.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">About You</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Describe your ideal weekend
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={4}
                  placeholder="Sleeping in, brunch with friends, exploring the city..."
                  value={formData.idealWeekend || ''}
                  onChange={(e) => setFormData({ ...formData, idealWeekend: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  About Me (Optional)
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={4}
                  placeholder="Tell us more about yourself..."
                  value={formData.aboutMe || ''}
                  onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What are you looking for?
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={4}
                  placeholder="Someone who shares my love for adventure..."
                  value={formData.lookingFor || ''}
                  onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deal Breakers (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Smoking, different life goals, etc."
                  className="w-full p-3 border rounded-lg"
                  onBlur={(e) => {
                    const dealBreakers = e.target.value.split(',').map(d => d.trim()).filter(Boolean);
                    setFormData({ ...formData, dealBreakers });
                  }}
                  defaultValue={formData.dealBreakers?.join(', ')}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.hobbies && formData.hobbies.length > 0;
      case 2:
        return formData.musicGenres && formData.musicGenres.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Step {step} of 6</span>
          <span className="text-sm text-gray-500">{Math.round((step / 6) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      {renderStep()}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all"
          >
            Back
          </button>
        )}
        
        <div className={step === 1 ? 'ml-auto' : ''}>
          {step < 6 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
