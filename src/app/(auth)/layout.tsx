import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-[#6395ee] selection:text-white">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_50%,transparent_100%)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6395ee]/15 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full py-6">
        <div className="container-fixed flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#6395ee] text-white flex items-center justify-center shadow-md group-hover:bg-[#4d83e6] transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-semibold text-base sm:text-lg tracking-tight text-white group-hover:text-slate-200 transition">
              RUET Library
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-medium text-slate-400 hover:text-white transition tracking-wide"
          >
            &larr; Back to Home
          </Link>
        </div>
      </header>

      {/* Main Form Wrapper */}
      <main className="relative z-10 container-fixed flex items-center justify-center my-auto py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6">
        <div className="container-fixed text-center text-xs text-slate-500 font-light tracking-wide">
          Department of Computer Science & Engineering &bull; RUET
        </div>
      </footer>
    </div>
  );
}
