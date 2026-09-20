import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroAnimation from "@/components/home/HeroAnimation";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between font-sans bg-slate-950 text-white selection:bg-[#6395ee] selection:text-white overflow-hidden">
      {/* Simple Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000_60%,transparent_100%)]" />
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#6395ee]/12 rounded-full blur-[140px]" />
      </div>

      {/* Minimal Header */}
      <header className="relative z-10 w-full py-6">
        <div className="container-fixed flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wider uppercase text-slate-300">
            RUET Library
          </span>
          <Link
            href="/login"
            className="text-xs font-medium text-slate-300 hover:text-white transition tracking-wide"
          >
            Sign In &rarr;
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container-fixed flex flex-col md:flex-row items-center justify-between gap-10 my-auto py-10 sm:py-14">
        {/* Left: Typography, Quote & CTA */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left max-w-xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            <span className="inline-block sm:whitespace-nowrap">Library Management</span>{" "}
            <span className="inline-block text-[#6395ee]">System</span>
          </h1>

          <blockquote className="mt-6 max-w-lg text-base sm:text-lg text-slate-300 font-light italic leading-relaxed">
            &ldquo;The only thing that you absolutely have to know, is the location of the library.&rdquo;
            <footer className="not-italic text-xs text-[#6395ee] font-medium mt-2 tracking-wide">
              &mdash; Albert Einstein
            </footer>
          </blockquote>

          <div className="mt-8 sm:mt-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#6395ee] hover:bg-[#4d83e6] text-white text-sm font-medium transition shadow-lg shadow-[#6395ee]/25"
            >
              Enter Library
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right: Enlarged Lottie Animation */}
        <div className="flex-1 flex items-center justify-center md:justify-end">
          <HeroAnimation />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 w-full py-6">
        <div className="container-fixed text-center text-xs text-slate-500 font-light tracking-wide">
          Rajshahi University of Engineering & Technology
        </div>
      </footer>
    </div>
  );
}
