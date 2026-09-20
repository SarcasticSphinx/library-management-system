"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { logoutAction } from "@/actions/authActions";
import { SessionUser } from "@/lib/auth";
import {
  BookOpen,
  LogOut,
  Menu,
  Shield,
  UserCheck,
  ChevronDown,
  Globe,
  LayoutDashboard,
  BookMarked,
  ArrowRightLeft,
} from "lucide-react";

interface NavbarProps {
  user: SessionUser | null;
  onMenuToggle?: () => void;
}

export default function Navbar({ user, onMenuToggle }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header suppressHydrationWarning className="h-16 border-b border-slate-200 bg-white sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      {/* Left: Mobile Menu Toggle & Brand */}
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            type="button"
            aria-label="Toggle navigation menu"
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#6395ee] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900 hidden sm:inline-block">
            RUET Library
          </span>
        </Link>
      </div>

      {/* Right: Public Home Link & User Profile Dropdown */}
      {user && (
        <div className="flex items-center gap-3">
          {/* Quick link to Landing Page */}
          <Link
            href="/"
            title="View Public Landing Page"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            Public Portal
          </Link>

          {/* User Profile Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {/* Avatar circle */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6395ee] to-[#8eb3f5] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {getInitials(user.name)}
              </div>

              {/* User text details */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-900 leading-tight">
                  {user.name}
                </span>
                <span className="text-[11px] text-slate-500 font-medium truncate max-w-[130px]">
                  {user.department || user.email}
                </span>
              </div>

              {/* Role badge */}
              <span
                className={`hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  isAdmin
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-blue-100 text-[#4d83e6] border border-blue-200"
                }`}
              >
                {isAdmin ? (
                  <>
                    <Shield className="w-3 h-3" />
                    Admin
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3 h-3" />
                    Member
                  </>
                )}
              </span>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 text-xs text-slate-700 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Profile card header */}
                <div className="p-3 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                  <div className="font-semibold text-slate-900 truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {user.email}
                  </div>
                  {user.studentId && (
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      Student ID: {user.studentId}
                    </div>
                  )}
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500">
                      {user.department || "RUET Central Library"}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        isAdmin
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {isAdmin ? "Librarian" : "Student"}
                    </span>
                  </div>
                </div>

                {/* Shortcuts */}
                <div className="space-y-0.5">
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#6395ee]" />
                    Dashboard Overview
                  </Link>

                  <Link
                    href="/dashboard/books"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    Book Catalog
                  </Link>

                  {!isAdmin ? (
                    <Link
                      href="/dashboard/my-loans"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                    >
                      <BookMarked className="w-4 h-4 text-amber-600" />
                      My Borrowed Books
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/loans"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                    >
                      <ArrowRightLeft className="w-4 h-4 text-amber-600" />
                      Circulation Desk
                    </Link>
                  )}

                  <Link
                    href="/"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                  >
                    <Globe className="w-4 h-4 text-slate-400" />
                    Return to Landing Page
                  </Link>
                </div>

                {/* Sign out */}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isPending}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition text-left cursor-pointer disabled:opacity-50"
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
    </header>
  );
}
