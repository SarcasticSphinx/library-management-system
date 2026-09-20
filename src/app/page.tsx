import Link from "next/link";
import { ArrowRight, Search, UserPlus, Library, Clock, ShieldCheck, LayoutDashboard } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getBooksAction } from "@/actions/bookActions";
import LandingNavbar from "@/components/home/LandingNavbar";
import HeroAnimation from "@/components/home/HeroAnimation";
import FeaturedBooks from "@/components/home/FeaturedBooks";
import LibraryServices from "@/components/home/LibraryServices";
import LibraryInfo from "@/components/home/LibraryInfo";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "RUET Library Management System - Central Library Portal",
  description:
    "Rajshahi University of Engineering & Technology (RUET) Central Library digital catalog, textbook loans, and circulation management.",
};

export default async function Home() {
  const [user, books] = await Promise.all([
    getSession(),
    getBooksAction(),
  ]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between font-sans bg-slate-950 text-white selection:bg-[#6395ee] selection:text-white overflow-x-hidden">
      {/* Simple Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,#000_60%,transparent_100%)]" />
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#6395ee]/15 rounded-full blur-[150px]" />
      </div>

      {/* Dynamic Navbar with Auth State */}
      <LandingNavbar user={user} />

      {/* Hero Section */}
      <main className="relative z-10 container-fixed flex flex-col lg:flex-row items-center justify-between gap-12 py-12 sm:py-20">
        {/* Left Column: Context, Typography, Search & Actions */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl">
          {/* Institutional Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#6395ee] animate-pulse" />
            <span>Rajshahi University of Engineering & Technology</span>
          </div>

          {/* Main Title - Library Management kept together */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            <span className="inline-block whitespace-normal sm:whitespace-nowrap">
              Library Management
            </span>{" "}
            <span className="inline-block text-[#6395ee]">System</span>
          </h1>

          {/* Descriptive Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl">
            A centralized digital platform for RUET students, faculty, and library staff.
            Search textbooks across engineering departments, track live shelf availability, and manage book loans seamlessly.
          </p>

          {/* Quote Block */}
          <blockquote className="mt-5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 max-w-lg text-xs sm:text-sm text-slate-300 font-light italic leading-relaxed">
            &ldquo;The only thing that you absolutely have to know, is the location of the library.&rdquo;
            <footer className="not-italic text-[11px] text-[#6395ee] font-semibold mt-1.5 tracking-wide">
              &mdash; Albert Einstein
            </footer>
          </blockquote>

          {/* Hero Quick Search Bar */}
          <div className="mt-8 w-full max-w-md">
            <Link
              href="/dashboard/books"
              className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition group text-left"
            >
              <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200">
                <Search className="w-4 h-4 text-[#6395ee]" />
                <span className="text-xs sm:text-sm font-light">
                  Search 22+ books by title, author, or ISBN...
                </span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 group-hover:text-white">
                Catalog
              </span>
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#6395ee] hover:bg-[#4d83e6] text-white text-sm font-semibold transition shadow-lg shadow-[#6395ee]/30 hover:scale-[1.02]"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard Portal
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/dashboard/books"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition hover:border-white/20"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  Browse Catalog
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#6395ee] hover:bg-[#4d83e6] text-white text-sm font-semibold transition shadow-lg shadow-[#6395ee]/30 hover:scale-[1.02]"
                >
                  Enter Library Portal
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition hover:border-white/20"
                >
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  Student Registration
                </Link>
              </>
            )}
          </div>

          {/* Key Platform Highlights */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-6 border-t border-white/10 text-left">
            <div className="flex items-start gap-2.5">
              <Library className="w-4 h-4 text-[#6395ee] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">Full Catalog</h4>
                <p className="text-[11px] text-slate-400 font-light">CSE, EEE, ME, Civil & Sciences</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#6395ee] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">Live Circulation</h4>
                <p className="text-[11px] text-slate-400 font-light">Instant loan issuance & return</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#6395ee] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">Role-Based Access</h4>
                <p className="text-[11px] text-slate-400 font-light">Admin desk & student dashboards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Enlarged Lottie Animation */}
        <div className="flex-1 flex items-center justify-center lg:justify-end">
          <HeroAnimation />
        </div>
      </main>

      {/* Featured Catalog Showcase */}
      <FeaturedBooks initialBooks={books} />

      {/* Library Services & Technical Capabilities */}
      <LibraryServices />

      {/* Campus Location, Operating Hours & Policy */}
      <LibraryInfo />

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 border-t border-white/10 bg-slate-950">
        <div className="container-fixed flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-light tracking-wide">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-semibold text-slate-400">Rajshahi University of Engineering & Technology (RUET)</span>
            <span className="hidden sm:inline">&bull;</span>
            <span>Central Library Management System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Kazla, Rajshahi-6204, Bangladesh</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
