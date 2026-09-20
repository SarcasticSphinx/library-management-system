import { MapPin, Clock, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LibraryInfo() {
  return (
    <section id="info" className="relative z-10 w-full py-16 sm:py-24 border-t border-white/5 bg-slate-950">
      <div className="container-fixed">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 7 cols: Location & Operating Hours */}
          <div className="lg:col-span-7 rounded-3xl bg-white/[0.02] border border-white/10 p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-4">
                <Clock className="w-3.5 h-3.5" />
                <span>Visit & Access</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Central Library Building
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-light mt-2 leading-relaxed">
                The Central Library is located at the academic heart of the RUET campus, featuring multiple reading rooms, digital reference terminals, and departmental book racks.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Physical Location */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#6395ee]/10 text-[#6395ee] border border-[#6395ee]/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Campus Location</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Central Library Building<br />
                      RUET Campus, Kazla<br />
                      Rajshahi-6204, Bangladesh
                    </p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Circulation Desk Hours</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Sunday &ndash; Thursday: 08:00 AM &ndash; 08:00 PM<br />
                      Friday &ndash; Saturday: Closed<br />
                      <span className="text-[11px] text-slate-400 italic">Circulation issues close 30m prior</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Borrowing Rules */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Standard 14-day loan duration
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Max 3 active books per student
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Overdue fine rate: 5 BDT/day
              </span>
            </div>
          </div>

          {/* Right 5 cols: Student Membership Callout */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#6395ee]/20 to-slate-900/80 border border-[#6395ee]/30 p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6395ee]/20 border border-[#6395ee]/40 text-[11px] font-semibold text-[#8eb3f5] uppercase tracking-wider mb-4">
                <FileText className="w-3.5 h-3.5" />
                <span>Student Registration</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Get Your Digital Library Account
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-3 leading-relaxed">
                All currently enrolled RUET undergraduate and postgraduate students can register with their student ID and department email for immediate catalog access.
              </p>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6395ee]" />
                  Instant access to check out course textbooks
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6395ee]" />
                  View real-time remaining copies across campus
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6395ee]" />
                  Automated return and renewal reminders
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="flex-1 text-center py-3 rounded-xl bg-[#6395ee] hover:bg-[#4d83e6] text-white text-xs font-semibold transition shadow-md shadow-[#6395ee]/20"
              >
                Register as Student &rarr;
              </Link>
              <Link
                href="/login"
                className="flex-1 text-center py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition border border-white/10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
