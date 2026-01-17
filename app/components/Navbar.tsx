'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, User, Heart, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { hasCompletedOnboarding } = useAuth();

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

  return (
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
  );
}

