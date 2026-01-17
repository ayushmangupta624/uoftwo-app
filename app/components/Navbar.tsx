'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, User, Heart, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { hasCompletedOnboarding } = useAuth();

  // Show different nav items based on completion status
  const navItems = hasCompletedOnboarding 
    ? [
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Profile', href: '/profile', icon: User },
      ]
    : [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Profile', href: '/profile', icon: User },
      ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#6B4646] border-b-4 border-[#8B5F5F] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Heart className="h-8 w-8 text-white group-hover:text-[#D9C4C4] transition-colors" fill="currentColor" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#D9C4C4] rounded-full animate-pulse"></div>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              UofT<span className="text-[#D9C4C4]">wo</span>
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
                      ? 'bg-[#8B5F5F] text-white shadow-md' 
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
                      ? 'bg-[#8B5F5F] text-white' 
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
      <div className="h-1 bg-gradient-to-r from-[#6B4646] via-[#8B5F5F] to-[#6B4646]"></div>
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

