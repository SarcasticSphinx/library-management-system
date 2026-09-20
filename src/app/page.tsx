import Link from "next/link";
import { ArrowRight, BookOpen, UserPlus, Library, ShieldCheck, Clock } from "lucide-react";
import HeroAnimation from "@/components/home/HeroAnimation";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between font-sans bg-slate-950 text-white selection:bg-[#6395ee] selection:text-white overflow-x-hidden">
      {/* Simple Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,#000_60%,transparent_100%)]" />
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#6395ee]/15 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full py-5 border-b border-white/5 bg-slate-950/40 backdrop-blur-md">
        <div className="container-fixed flex items-center justify-between">
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

          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/register"
              className="text-xs font-semibold text-slate-300 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5 hidden sm:inline-flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition border border-white/10 flex items-center gap-1.5 shadow-xs"
            >
              Sign In &rarr;
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container-fixed flex flex-col lg:flex-row items-center justify-between gap-12 my-auto py-10 sm:py-16">
        {/* Left Column: Context, Typography & Actions */}
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

          {/* Clear Descriptive Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl">
            A modernized digital platform for RUET students, faculty, and library staff.
            Search textbooks across engineering departments, track live shelf availability, and manage book loans seamlessly.
          </p>

          {/* Quote Block */}
          <blockquote className="mt-5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 max-w-lg text-xs sm:text-sm text-slate-300 font-light italic leading-relaxed">
            &ldquo;The only thing that you absolutely have to know, is the location of the library.&rdquo;
            <footer className="not-italic text-[11px] text-[#6395ee] font-semibold mt-1.5 tracking-wide">
              &mdash; Albert Einstein
            </footer>
          </blockquote>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
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
          </div>

          {/* Key Platform Pillars */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-6 border-t border-white/10 text-left">
            <div className="flex items-start gap-2.5">
              <Library className="w-4 h-4 text-[#6395ee] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">Full Catalog</h4>
                <p className="text-[11px] text-slate-400 font-light">CSE, EEE, ME, Civil & Sciences</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">Live Circulation</h4>
                <p className="text-[11px] text-slate-400 font-light">Instant loan issuance & return</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
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

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 border-t border-white/5 bg-slate-950/60">
        <div className="container-fixed flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-light tracking-wide">
          <span>Rajshahi University of Engineering & Technology (RUET)</span>
          <span>Central Library &bull; Department of Computer Science & Engineering</span>
        </div>
      </footer>
    </div>
  );
}
