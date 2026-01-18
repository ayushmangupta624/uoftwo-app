"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  User,
  Heart,
  Globe,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { hasCompletedOnboarding, isAuthenticated, user } = useAuth();
  const [userName, setUserName] = useState<string>("");
  const [actuallyAuthenticated, setActuallyAuthenticated] = useState<boolean>(false);

  // Check actual Supabase authentication state
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setActuallyAuthenticated(!!authUser);
      } catch (error) {
        console.error('Error checking auth:', error);
        setActuallyAuthenticated(false);
      }
    }
    
    checkAuth();
  }, []);

  // Fetch actual user name from database
  useEffect(() => {
    async function fetchUserName() {
      if (!isAuthenticated) return;
      
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          const response = await fetch('/api/profile');
          if (response.ok) {
            const data = await response.json();
            if (data.profile?.fname) {
              setUserName(data.profile.fname);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    }

    fetchUserName();
  }, [isAuthenticated]);

  // Determine logo destination based on actual Supabase auth state
  const logoHref = actuallyAuthenticated ? "/dashboard" : "/";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#6B4646] border-b-4 border-[#8B5F5F] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link href={logoHref} className="flex items-center group">
              <div className="relative h-10 w-10">
                <Image
                  src="/uoftwo-logo.png"
                  alt="U of Two Logo"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-200"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-white/90 font-medium">
                  Hey, {userName || "there"}!
                </span>
                <Link
                  href="/messages"
                  className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${
                    pathname === "/messages" ||
                    pathname.startsWith("/messages/")
                      ? "bg-[#8B5F5F] text-white shadow-md"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }
                `}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Messages</span>
                </Link>
                <Link
                  href="/profile"
                  className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${
                    pathname === "/profile" || pathname.startsWith("/profile/")
                      ? "bg-[#8B5F5F] text-white shadow-md"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }
                `}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-[#D9C4C4] text-[#4a2e2e] hover:bg-[#C9B4B4] font-semibold">
                    Create Account
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Navigation */}
            {isAuthenticated ? (
              <div className="flex md:hidden items-center space-x-1">
                <Link
                  href="/messages"
                  className={`
                  flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200
                  ${
                    pathname === "/messages" ||
                    pathname.startsWith("/messages/")
                      ? "bg-[#8B5F5F] text-white"
                      : "text-white/90 hover:bg-white/10"
                  }
                `}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-xs mt-1">Messages</span>
                </Link>
                <Link
                  href="/profile"
                  className={`
                  flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200
                  ${
                    pathname === "/profile" || pathname.startsWith("/profile/")
                      ? "bg-[#8B5F5F] text-white"
                      : "text-white/90 hover:bg-white/10"
                  }
                `}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs mt-1">Profile</span>
                </Link>
              </div>
            ) : (
              <div className="flex md:hidden items-center space-x-2">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button
                    size="sm"
                    className="bg-[#D9C4C4] text-[#4a2e2e] hover:bg-[#C9B4B4] font-semibold"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
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
          0%,
          100% {
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
          0%,
          100% {
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
          0%,
          100% {
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
