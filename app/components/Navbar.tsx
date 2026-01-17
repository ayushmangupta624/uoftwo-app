'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, User, Heart, Globe, Shuffle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { hasCompletedOnboarding } = useAuth();
  const [isTraveling, setIsTraveling] = useState(false);

  // Show different nav items based on completion status
  const navItems = hasCompletedOnboarding 
    ? [
        { name: 'Planet', href: '/planet', icon: Globe },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Profile', href: '/profile', icon: User },
      ]
    : [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Profile', href: '/profile', icon: User },
      ];

  // Random match function - mock user IDs from 1 to 20
  const handleRandomMatch = () => {
    const randomUserId = Math.floor(Math.random() * 20) + 1;
    setIsTraveling(true);
    
    // Navigate after animation completes
    setTimeout(() => {
      router.push(`/profile/${randomUserId}`);
      setTimeout(() => setIsTraveling(false), 500);
    }, 3500);
  };

  return (
    <>
      {/* Elegant Toronto/UofT Travel Animation */}
      {isTraveling && (
        <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-slate-100 via-slate-50 to-white overflow-hidden">
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(#002A5C 1px, transparent 1px), linear-gradient(90deg, #002A5C 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          ></div>

          {/* Minimalist buildings silhouettes */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-8 px-20">
            {/* CN Tower */}
            <div className="animate-building-rise opacity-0" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col items-center">
                <div className="w-2 h-96 bg-gradient-to-t from-slate-400 to-slate-300 shadow-lg"></div>
                <div className="w-20 h-64 bg-gradient-to-t from-slate-500 to-slate-400 shadow-xl"></div>
              </div>
            </div>

            {/* University College */}
            <div className="animate-building-rise opacity-0" style={{ animationDelay: '0.4s' }}>
              <div className="w-56 h-72 bg-gradient-to-t from-amber-200 to-amber-100 shadow-lg relative">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-amber-200"></div>
              </div>
            </div>

            {/* Robarts Library */}
            <div className="animate-building-rise opacity-0" style={{ animationDelay: '0.6s' }}>
              <div className="w-40 h-96 bg-gradient-to-t from-slate-300 to-slate-200 shadow-lg"></div>
            </div>

            {/* Modern Building 1 */}
            <div className="animate-building-rise opacity-0" style={{ animationDelay: '0.8s' }}>
              <div className="w-32 h-[500px] bg-gradient-to-t from-blue-200 to-blue-100 shadow-lg"></div>
            </div>

            {/* Convocation Hall */}
            <div className="animate-building-rise opacity-0" style={{ animationDelay: '1s' }}>
              <div className="relative">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-40 h-28 bg-gradient-to-t from-green-300 to-green-200 rounded-t-full"></div>
                <div className="w-48 h-56 bg-gradient-to-t from-amber-300 to-amber-200 rounded-t-3xl shadow-lg"></div>
              </div>
            </div>

            {/* Modern Building 2 */}
            <div className="animate-building-rise opacity-0" style={{ animationDelay: '1.2s' }}>
              <div className="w-28 h-80 bg-gradient-to-t from-slate-400 to-slate-300 shadow-lg"></div>
            </div>
          </div>

          {/* Elegant particle effect */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-slate-300 rounded-full animate-float-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>

          {/* Sleek car silhouette */}
          <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              {/* Motion blur trail */}
              <div className="absolute inset-0 -left-32">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`trail-${i}`}
                    className="absolute h-full w-40 bg-gradient-to-r from-transparent via-slate-300/20 to-transparent animate-motion-trail"
                    style={{
                      left: `${-i * 20}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>

              {/* Modern car silhouette */}
              <div className="relative w-48 h-20 animate-smooth-float">
                {/* Car body - minimalist design */}
                <svg viewBox="0 0 200 80" className="w-full h-full drop-shadow-2xl">
                  {/* Main body */}
                  <path
                    d="M 20 60 L 30 40 L 70 35 L 90 35 L 110 35 L 130 40 L 180 60 Z"
                    fill="url(#carGradient)"
                    stroke="#1e293b"
                    strokeWidth="2"
                  />
                  {/* Windshield */}
                  <path
                    d="M 75 35 L 85 25 L 115 25 L 125 35 Z"
                    fill="rgba(148, 163, 184, 0.3)"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                  {/* Wheels */}
                  <circle cx="50" cy="65" r="12" fill="#1e293b" className="animate-wheel-rotate">
                    <circle cx="50" cy="65" r="8" fill="#475569" />
                  </circle>
                  <circle cx="150" cy="65" r="12" fill="#1e293b" className="animate-wheel-rotate">
                    <circle cx="150" cy="65" r="8" fill="#475569" />
                  </circle>
                  
                  <defs>
                    <linearGradient id="carGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#002A5C" />
                      <stop offset="100%" stopColor="#007FA3" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Elegant status text */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="relative">
              {/* Subtle glow behind text */}
              <div className="absolute inset-0 blur-3xl bg-[#007FA3]/10"></div>
              
              <h2 className="relative text-6xl font-light text-[#002A5C] mb-4 tracking-wide">
                Finding Your Match
              </h2>
              <div className="relative flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#007FA3]"></div>
                <p className="text-lg text-slate-600 font-light tracking-wider uppercase">
                  Exploring Campus
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#007FA3]"></div>
              </div>
            </div>

            {/* Minimal loading indicator */}
            <div className="flex justify-center gap-2 mt-8">
              <div className="w-2 h-2 bg-[#002A5C] rounded-full animate-elegant-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-[#007FA3] rounded-full animate-elegant-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-elegant-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-sm"></div>
        </div>
      )}

      <nav className="sticky top-0 z-50 bg-[#002A5C] border-b-4 border-[#007FA3] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Heart className="h-8 w-8 text-white group-hover:text-[#007FA3] transition-colors" fill="currentColor" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#007FA3] rounded-full animate-pulse"></div>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              UofT<span className="text-[#007FA3]">wo</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-[#007FA3] text-white shadow-md' 
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Random Match Button - Center */}
          {hasCompletedOnboarding && (
            <button
              onClick={handleRandomMatch}
              className="absolute left-1/2 transform -translate-x-1/2 group"
            >
              <div className="relative">
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 animate-pulse"></div>
                
                {/* Button */}
                <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 p-[2px] rounded-full">
                  <div className="bg-[#002A5C] rounded-full px-5 py-2.5 flex items-center gap-2 group-hover:bg-[#003d7a] transition-colors">
                    <Shuffle className="h-5 w-5 text-white group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-white font-bold text-sm whitespace-nowrap">
                      Random Match
                    </span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </button>
          )}

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-[#007FA3] text-white' 
                      : 'text-white/90 hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* UofT themed accent line */}
      <div className="h-1 bg-gradient-to-r from-[#002A5C] via-[#007FA3] to-[#002A5C]"></div>
    </nav>

    {/* Elegant animations */}
    <style jsx global>{`
      @keyframes building-rise {
        0% {
          transform: translateY(100px);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes float-particle {
        0%, 100% {
          transform: translateY(0) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: 0.3;
        }
        50% {
          transform: translateY(-100px) translateX(20px);
          opacity: 0.6;
        }
        90% {
          opacity: 0.3;
        }
        100% {
          transform: translateY(-200px) translateX(40px);
          opacity: 0;
        }
      }

      @keyframes smooth-float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-12px);
        }
      }

      @keyframes wheel-rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes motion-trail {
        0% {
          opacity: 0;
          transform: translateX(0);
        }
        50% {
          opacity: 0.15;
        }
        100% {
          opacity: 0;
          transform: translateX(-60px);
        }
      }

      @keyframes elegant-bounce {
        0%, 100% {
          transform: translateY(0);
          opacity: 0.4;
        }
        50% {
          transform: translateY(-8px);
          opacity: 1;
        }

      }

      .animate-building-rise {
        animation: building-rise 1s ease-out forwards;
      }

      .animate-float-particle {
        animation: float-particle linear infinite;
      }

      .animate-smooth-float {
        animation: smooth-float 2s ease-in-out infinite;
      }

      .animate-wheel-rotate {
        animation: wheel-rotate 0.5s linear infinite;
        transform-origin: center;
      }

      .animate-motion-trail {
        animation: motion-trail 0.8s ease-out infinite;
      }

      .animate-elegant-bounce {
        animation: elegant-bounce 1.4s ease-in-out infinite;
      }
    `}</style>
    </>
  );
}

