"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { logoutAction } from "@/actions/authActions";
import { SessionUser } from "@/lib/auth";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  UserPlus,
  BookMarked,
  ArrowRightLeft,
  Users,
  Search,
} from "lucide-react";

interface LandingNavbarProps {
  user: SessionUser | null;
}

export default function LandingNavbar({ user }: LandingNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      setDropdownOpen(false);
    });
  };

  const isAdmin = user?.role === "ADMIN";

  // Initials for avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full py-4 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="container-fixed flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#6395ee] text-white flex items-center justify-center font-bold shadow-md shadow-[#6395ee]/30 group-hover:scale-105 transition">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white leading-tight">
              RUET Central Library
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              Academic Resource Portal
            </span>
          </div>
        </Link>

        {/* Center Quick Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <Link href="#featured-books" className="hover:text-white transition">
            Featured Catalog
          </Link>
          <Link href="#services" className="hover:text-white transition">
            Library Services
          </Link>
          <Link href="#info" className="hover:text-white transition">
            Hours & Location
          </Link>
          <Link
            href="/dashboard/books"
            className="flex items-center gap-1.5 hover:text-[#6395ee] transition"
          >
            <Search className="w-3.5 h-3.5" />
            Search Books
          </Link>
        </nav>

        {/* Auth State Actions */}
        <div className="flex items-center gap-3">
          {!user ? (
            /* Logged Out State: Industry standard Sign In & Register */
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="text-xs font-semibold px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#6395ee] hover:bg-[#4d83e6] text-white transition shadow-sm shadow-[#6395ee]/25 flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register
              </Link>
            </div>
          ) : (
            /* Logged In State: Dashboard CTA + User Avatar Dropdown */
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition border border-white/10"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#6395ee]" />
                Dashboard
              </Link>

              {/* User Avatar & Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#6395ee] to-[#8eb3f5] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {getInitials(user.name)}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-medium text-white max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-2 text-xs text-slate-200 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {/* User Profile Summary */}
                    <div className="p-3 border-b border-white/10 mb-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-white truncate">{user.name}</div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            isAdmin
                              ? "bg-purple-900/60 text-purple-300 border border-purple-700/40"
                              : "bg-blue-900/60 text-blue-300 border border-blue-700/40"
                          }`}
                        >
                          {isAdmin ? "Admin" : "Student"}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {user.email}
                      </div>
                      {user.studentId && (
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          ID: {user.studentId}
                        </div>
                      )}
                    </div>

                    {/* Navigation Menu */}
                    <div className="space-y-0.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#6395ee]" />
                        Dashboard Overview
                      </Link>

                      <Link
                        href="/dashboard/books"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
                      >
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        Book Catalog
                      </Link>

                      {!isAdmin ? (
                        <Link
                          href="/dashboard/my-loans"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
                        >
                          <BookMarked className="w-4 h-4 text-amber-400" />
                          My Borrowed Books
                        </Link>
                      ) : (
                        <>
                          <Link
                            href="/dashboard/loans"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
                          >
                            <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                            Circulation Desk
                          </Link>
                          <Link
                            href="/dashboard/members"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
                          >
                            <Users className="w-4 h-4 text-purple-400" />
                            Member Directory
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Divider & Sign Out */}
                    <div className="border-t border-white/10 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isPending}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left cursor-pointer disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {isPending ? "Signing out..." : "Sign Out"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
