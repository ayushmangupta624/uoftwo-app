'use client';

import { Suspense, useState, useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock user data - simplified without archetypes
const mockUsers = [
  {
    id: 1,
    name: "Emma Wilson",
    age: 21,
    program: "Computer Science",
    year: "3rd Year",
    bio: "Love coding and coffee! Looking for study buddies and maybe something more 💻☕",
    interests: ["Coding", "Coffee", "Gaming"],
    image: "💻"
  },
  {
    id: 2,
    name: "James Chen",
    age: 20,
    program: "Engineering",
    year: "2nd Year",
    bio: "Engineering student who loves hiking and late-night problem sets",
    interests: ["Hiking", "Photography", "Music"],
    image: "🌳"
  },
  {
    id: 3,
    name: "Sophie Martinez",
    age: 22,
    program: "Psychology & Philosophy",
    year: "4th Year",
    bio: "Deep conversations over tea? Count me in! 🍵",
    interests: ["Reading", "Art", "Yoga"],
    image: "☕"
  },
  {
    id: 4,
    name: "Alex Kim",
    age: 19,
    program: "Business",
    year: "1st Year",
    bio: "Always down for campus events and making new friends!",
    interests: ["Networking", "Sports", "Travel"],
    image: "🦋"
  },
  {
    id: 5,
    name: "Maya Patel",
    age: 21,
    program: "Biology",
    year: "3rd Year",
    bio: "Pre-med student looking for someone to explore the city with",
    interests: ["Medicine", "Cooking", "Dancing"],
    image: "🦉"
  },
  {
    id: 6,
    name: "Ryan O'Connor",
    age: 20,
    program: "English Literature",
    year: "2nd Year",
    bio: "Bookworm seeking fellow literature lover for coffee dates",
    interests: ["Writing", "Poetry", "Theatre"],
    image: "📚"
  },
  {
    id: 7,
    name: "Zara Ahmed",
    age: 22,
    program: "Mathematics",
    year: "4th Year",
    bio: "Math nerd by day, indie music enthusiast by night 🎵",
    interests: ["Math", "Music", "Astronomy"],
    image: "💻"
  },
  {
    id: 8,
    name: "Lucas Silva",
    age: 21,
    program: "Economics",
    year: "3rd Year",
    bio: "Entrepreneur mindset, looking for my co-founder in life",
    interests: ["Startups", "Finance", "Fitness"],
    image: "🦋"
  },
  {
    id: 9,
    name: "Chloe Wong",
    age: 19,
    program: "Architecture",
    year: "1st Year",
    bio: "Building dreams one sketch at a time ✏️",
    interests: ["Design", "Art", "Photography"],
    image: "🎨"
  },
  {
    id: 10,
    name: "Daniel Lee",
    age: 20,
    program: "Political Science",
    year: "2nd Year",
    bio: "Debater, thinker, and hopeless romantic",
    interests: ["Politics", "Debate", "History"],
    image: "🏛️"
  },
  {
    id: 11,
    name: "Isabella Romano",
    age: 22,
    program: "Chemistry",
    year: "4th Year",
    bio: "We have chemistry... literally! Let's find out if we have it figuratively too",
    interests: ["Science", "Wine", "Jazz"],
    image: "💻"
  },
  {
    id: 12,
    name: "Tyler Brown",
    age: 21,
    program: "Kinesiology",
    year: "3rd Year",
    bio: "Athletic trainer looking for gym partner and life partner!",
    interests: ["Fitness", "Nutrition", "Basketball"],
    image: "💪"
  },
  {
    id: 13,
    name: "Olivia Zhang",
    age: 20,
    program: "Music Performance",
    year: "2nd Year",
    bio: "Violinist seeking my perfect harmony 🎻",
    interests: ["Classical Music", "Concert", "Ballet"],
    image: "🎨"
  },
  {
    id: 14,
    name: "Nathan Park",
    age: 19,
    program: "Computer Engineering",
    year: "1st Year",
    bio: "Building robots and relationships, one line of code at a time",
    interests: ["Robotics", "AI", "Anime"],
    image: "💻"
  },
  {
    id: 15,
    name: "Ava Johnson",
    age: 21,
    program: "Environmental Science",
    year: "3rd Year",
    bio: "Saving the planet, one date at a time 🌍",
    interests: ["Sustainability", "Hiking", "Photography"],
    image: "🌳"
  },
  {
    id: 16,
    name: "Marcus Thompson",
    age: 22,
    program: "Film Studies",
    year: "4th Year",
    bio: "Filmmaker looking for my leading lady/man",
    interests: ["Cinema", "Directing", "Screenwriting"],
    image: "🎨"
  },
  {
    id: 17,
    name: "Lily Chen",
    age: 20,
    program: "Neuroscience",
    year: "2nd Year",
    bio: "Mind reader (almost). Let me figure you out over coffee",
    interests: ["Brain Science", "Puzzles", "Meditation"],
    image: "🧘"
  },
  {
    id: 18,
    name: "Ethan Davis",
    age: 21,
    program: "History",
    year: "3rd Year",
    bio: "Living in the past, dreaming of our future",
    interests: ["History", "Museums", "Travel"],
    image: "🏛️"
  },
  {
    id: 19,
    name: "Grace Park",
    age: 19,
    program: "Sociology",
    year: "1st Year",
    bio: "Understanding society, but still trying to understand love ❤️",
    interests: ["Social Justice", "Community", "Podcasts"],
    image: "🦋"
  },
  {
    id: 20,
    name: "Benjamin Taylor",
    age: 22,
    program: "Physics",
    year: "4th Year",
    bio: "There's a strong gravitational pull between us 🌟",
    interests: ["Space", "Astronomy", "Sci-Fi"],
    image: "🦉"
  }
];

interface UserDotProps {
  position: [number, number, number];
  user: typeof mockUsers[0];
  onClick: (user: typeof mockUsers[0]) => void;
  isBoosted?: boolean;
}

function UserDot({ position, user, onClick, isBoosted = false }: UserDotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.1);
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  const color = useMemo(() => {
    // Generate consistent color based on user ID
    const hue = (user.id * 137.5) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }, [user.id]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={() => onClick(user)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[isBoosted ? 0.12 : 0.08, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isBoosted ? 1.2 : (hovered ? 0.6 : 0.3)}
        roughness={0.3}
        metalness={0.8}
      />
      {(hovered || isBoosted) && (
        <Html distanceFactor={10}>
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl border border-gray-200 whitespace-nowrap pointer-events-none">
            <p className="font-semibold text-[#002A5C] text-sm">{user.name}</p>
            <p className="text-xs text-gray-600">{user.program}</p>
          </div>
        </Html>
      )}
    </mesh>
  );
}

function UserSphere({ onUserClick, boostedUserId, users }: { onUserClick: (user: typeof mockUsers[0]) => void; boostedUserId: number | null; users: typeof mockUsers }) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate positions on a sphere using Fibonacci spiral
  const positions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const radius = 4;
    const samples = users.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle

    for (let i = 0; i < samples; i++) {
      const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      positions.push([x * radius, y * radius, z * radius]);
    }

    return positions;
  }, [users.length]);

  return (
    <group ref={groupRef}>
      {users.map((user, index) => (
        <UserDot
          key={user.id}
          position={positions[index]}
          user={user}
          onClick={onUserClick}
          isBoosted={user.id === boostedUserId}
        />
      ))}
      {/* Subtle sphere outline */}
      <mesh>
        <sphereGeometry args={[4, 64, 64]} />
        <meshBasicMaterial
          color="#c0c0c8"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

function Scene({ 
  onUserClick, 
  boostedUserId, 
  users,
}: { 
  onUserClick: (user: typeof mockUsers[0]) => void; 
  boostedUserId: number | null; 
  users: typeof mockUsers;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />
      
      <UserSphere onUserClick={onUserClick} boostedUserId={boostedUserId} users={users} />
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={6}
        maxDistance={18}
        rotateSpeed={0.5}
      />
    </>
  );
}

interface UserProfileModalProps {
  user: typeof mockUsers[0] | null;
  onClose: () => void;
}

function UserProfileModal({ user, onClose }: UserProfileModalProps) {
  const router = useRouter();
  
  if (!user) return null;

  const handleConnect = () => {
    router.push(`/profile/${user.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
        {/* Header with gradient */}
        <div className="relative h-32 bg-gradient-to-br from-[#002A5C] to-[#007FA3] p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 transition-all"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center text-5xl border-4 border-white">
              {user.image}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 pb-6 px-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-[#002A5C]">{user.name}, {user.age}</h2>
            <p className="text-gray-600">{user.program} • {user.year}</p>
          </div>
          
          {/* Bio */}
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">{user.bio}</p>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#002A5C] mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#007FA3]/10 text-[#007FA3] rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={handleConnect}
              className="flex-1 bg-gradient-to-r from-[#002A5C] to-[#007FA3] text-white py-3 rounded-full font-semibold hover:from-[#003d7a] hover:to-[#0099cc] transition-all shadow-lg"
            >
              View Full Profile
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-400 transition-all"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlanetPage() {
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [boostedUserId, setBoostedUserId] = useState<number | null>(null);
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !hasCompletedOnboarding) {
      router.push('/');
    }
  }, [isAuthenticated, hasCompletedOnboarding, router]);

  const handleBoost = () => {
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    setBoostedUserId(randomUser.id);
    setTimeout(() => setBoostedUserId(null), 3000);
  };

  if (!isAuthenticated || !hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a2a3a] to-[#2d3a47] flex items-center justify-center">
        <div className="text-white text-xl">Checking authorization...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0f172a] via-[#1a2a3a] to-[#2d3a47] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-[#007FA3]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-[#0099cc]/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-2xl">
              Discover Matches
            </h1>
            <p className="text-white/80 text-lg drop-shadow-lg mt-2">
              Rotate the sphere and click on profiles to explore potential matches
            </p>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative z-0 h-[calc(100%-120px)]">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          className="cursor-grab active:cursor-grabbing"
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={
            <Html center>
              <div className="text-white text-xl">Loading profiles...</div>
            </Html>
          }>
            <Scene 
              onUserClick={setSelectedUser} 
              boostedUserId={boostedUserId} 
              users={mockUsers}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-8 z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20">
          <p className="text-white text-xs font-medium">
            🖱️ Drag to rotate
            <br />
            🔍 Scroll to zoom
            <br />
            👆 Click dots for profiles
          </p>
        </div>
      </div>

      {/* Stats & Controls */}
      <div className="absolute top-24 right-8 z-10 space-y-3">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20">
          <p className="text-white/70 text-xs uppercase tracking-wide mb-1">
            Online Users
          </p>
          <p className="text-white text-2xl font-bold">{mockUsers.length}</p>
        </div>
        <button
          onClick={handleBoost}
          className="w-full bg-gradient-to-r from-[#002A5C] to-[#007FA3] hover:opacity-90 text-white px-4 py-3 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl"
        >
          ✨ Random Profile
        </button>
      </div>

      {/* Profile Modal */}
      <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
