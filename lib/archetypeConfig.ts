// lib/archetypeConfig.ts

import { BuildingMetadata } from '@/types';

export interface ArchetypeConfig {
  name: string;
  building: BuildingMetadata;
}

/**
 * Centralized, customizable archetype configuration
 * Easy to add, remove, or modify archetypes without changing business logic
 */
export const ARCHETYPES_CONFIG: Record<string, ArchetypeConfig> = {
  'STEM Scholar': {
    name: 'STEM Scholar',
    building: {
      name: 'Bahen Centre for Information Technology',
      shortName: 'Bahen Centre',
      description: 'The modern hub of innovation where code meets creativity. Home to computer science, engineering, and tech enthusiasts who thrive in collaborative spaces.',
      colorGradient: 'from-indigo-500 to-purple-600',
      primaryColor: '#6366f1',
      secondaryColor: '#9333ea',
      icon: '💻',
      architecturalStyle: 'Modern Tech Hub',
      vibe: 'Innovative, Collaborative, Cutting-edge',
      commonActivities: ['Coding sessions', 'Study groups', 'Tech talks', 'Problem solving'],
      aesthetic: 'Clean tech, blueprints, coffee-stained notes'
    }
  },
  'Dark Academia': {
    name: 'Dark Academia',
    building: {
      name: 'Robarts Library',
      shortName: 'Robarts Library',
      description: 'The iconic brutalist fortress of knowledge. Where late-night study sessions meet deep intellectual conversations. A sanctuary for those who find beauty in the pursuit of wisdom.',
      colorGradient: 'from-slate-700 to-gray-900',
      primaryColor: '#475569',
      secondaryColor: '#1e293b',
      icon: '📚',
      architecturalStyle: 'Brutalist Monument',
      vibe: 'Scholarly, Mysterious, Timeless',
      commonActivities: ['Late-night studying', 'Philosophical discussions', 'Research sessions', 'Reading marathons'],
      aesthetic: 'Gothic libraries, vintage books, candlelight'
    }
  },
  'Outdoorsy Explorer': {
    name: 'Outdoorsy Explorer',
    building: {
      name: "King's College Circle",
      shortName: "King's College Circle",
      description: 'The heart of campus where paths converge. Surrounded by historic buildings and green spaces, perfect for those who love fresh air, walks, and outdoor adventures.',
      colorGradient: 'from-green-500 to-emerald-600',
      primaryColor: '#22c55e',
      secondaryColor: '#059669',
      icon: '🌳',
      architecturalStyle: 'Historic Campus Green',
      vibe: 'Fresh, Open, Energetic',
      commonActivities: ['Campus walks', 'Outdoor study sessions', 'Frisbee', 'People watching'],
      aesthetic: 'Hiking boots, campus trails, sunset photos'
    }
  },
  'Creative Spirit': {
    name: 'Creative Spirit',
    building: {
      name: 'Hart House',
      shortName: 'Hart House',
      description: 'The cultural soul of UofT. Where art, music, theater, and creativity flourish. A place for those who express themselves through various mediums and appreciate the arts.',
      colorGradient: 'from-rose-500 to-pink-600',
      primaryColor: '#f43f5e',
      secondaryColor: '#db2777',
      icon: '🎨',
      architecturalStyle: 'Gothic Revival',
      vibe: 'Artistic, Expressive, Vibrant',
      commonActivities: ['Art exhibitions', 'Music performances', 'Theater shows', 'Creative workshops'],
      aesthetic: 'Art supplies, indie playlists, film cameras'
    }
  },
  'Social Butterfly': {
    name: 'Social Butterfly',
    building: {
      name: 'Sidney Smith Hall',
      shortName: 'Sidney Smith',
      description: 'The UTSU hub where social connections flourish. Perfect for those who love group activities, events, and building community.',
      colorGradient: 'from-amber-500 to-orange-600',
      primaryColor: '#f59e0b',
      secondaryColor: '#ea580c',
      icon: '🦋',
      architecturalStyle: 'Modern Community',
      vibe: 'Welcoming, Social, Energetic',
      commonActivities: ['Social events', 'Game nights', 'Community gatherings', 'Networking'],
      aesthetic: 'Group photos, event tickets, club badges'
    }
  },
  'Coffee Shop Philosopher': {
    name: 'Coffee Shop Philosopher',
    building: {
      name: 'University College',
      shortName: 'University College',
      description: 'Where deep conversations happen over coffee. A historic building perfect for those who love to discuss ideas, philosophy, and life over a good brew.',
      colorGradient: 'from-amber-700 to-amber-900',
      primaryColor: '#b45309',
      secondaryColor: '#78350f',
      icon: '☕',
      architecturalStyle: 'Historic Academic',
      vibe: 'Thoughtful, Warm, Conversational',
      commonActivities: ['Coffee chats', 'Philosophical discussions', 'Study sessions', 'Debates'],
      aesthetic: 'Latte art, worn journals, cozy corner tables'
    }
  },
  'Gym Rat / Athlete': {
    name: 'Gym Rat / Athlete',
    building: {
      name: 'Athletic Centre',
      shortName: 'Athletic Centre',
      description: 'Where strength meets determination. The epicenter of fitness, sports, and physical activity for those who live an active lifestyle and push their limits.',
      colorGradient: 'from-red-600 to-red-800',
      primaryColor: '#dc2626',
      secondaryColor: '#991b1b',
      icon: '💪',
      architecturalStyle: 'Modern Athletic',
      vibe: 'Energetic, Competitive, Motivated',
      commonActivities: ['Workouts', 'Sports', 'Training sessions', 'Fitness classes'],
      aesthetic: 'Athletic gear, protein shakers, Varsity Blues'
    }
  },
  'Night Owl Grinder': {
    name: 'Night Owl Grinder',
    building: {
      name: 'Knox College Library',
      shortName: 'Knox College Library',
      description: 'The 24/7 sanctuary for night owls. Where late-night study sessions, research, and academic dedication meet. Open all night for those who work best when the world sleeps.',
      colorGradient: 'from-blue-600 to-indigo-800',
      primaryColor: '#2563eb',
      secondaryColor: '#3730a3',
      icon: '🦉',
      architecturalStyle: 'Modern Academic',
      vibe: 'Focused, Dedicated, Nocturnal',
      commonActivities: ['All-night study sessions', 'Research', 'Late-night coding', 'Academic grind'],
      aesthetic: 'Energy drinks, neon lights, 3AM study vibes'
    }
  },
  'Culture Enthusiast': {
    name: 'Culture Enthusiast',
    building: {
      name: 'Multi-Faith Centre',
      shortName: 'Multi-Faith Centre',
      description: 'Where diverse cultures, traditions, and perspectives converge. A space for those who appreciate cultural exchange, interfaith dialogue, and global understanding.',
      colorGradient: 'from-purple-600 to-violet-800',
      primaryColor: '#9333ea',
      secondaryColor: '#6b21a8',
      icon: '🏛️',
      architecturalStyle: 'Modern Cultural',
      vibe: 'Cultured, Curious, Refined',
      commonActivities: ['Cultural events', 'Interfaith dialogue', 'Cultural appreciation', 'Community gatherings'],
      aesthetic: 'Concert tickets, cultural society flags, food spots'
    }
  },
  'Chill Minimalist': {
    name: 'Chill Minimalist',
    building: {
      name: 'Victoria College',
      shortName: 'Victoria College',
      description: 'Simple, elegant, and balanced. A place for those who appreciate clean aesthetics, minimalism, and finding peace in simplicity. Where less is more.',
      colorGradient: 'from-cyan-500 to-blue-600',
      primaryColor: '#06b6d4',
      secondaryColor: '#2563eb',
      icon: '🧘',
      architecturalStyle: 'Modern Minimalist',
      vibe: 'Calm, Balanced, Zen',
      commonActivities: ['Meditation', 'Quiet study', 'Mindful walks', 'Simple pleasures'],
      aesthetic: 'Clean aesthetic, plants, lo-fi playlists'
    }
  }
};

/**
 * Get all archetype names (dynamically generated from config)
 */
export function getAllArchetypeNames(): string[] {
  return Object.keys(ARCHETYPES_CONFIG);
}

/**
 * Get archetype configuration by name
 */
export function getArchetypeConfig(archetypeName: string): ArchetypeConfig | undefined {
  return ARCHETYPES_CONFIG[archetypeName];
}

/**
 * Get building metadata for an archetype
 */
export function getArchetypeBuilding(archetypeName: string): BuildingMetadata | null {
  const config = ARCHETYPES_CONFIG[archetypeName];
  return config ? config.building : null;
}

/**
 * Check if an archetype exists
 */
export function isValidArchetype(archetypeName: string): boolean {
  return archetypeName in ARCHETYPES_CONFIG;
}

/**
 * Get count of available archetypes
 */
export function getArchetypeCount(): number {
  return Object.keys(ARCHETYPES_CONFIG).length;
}
