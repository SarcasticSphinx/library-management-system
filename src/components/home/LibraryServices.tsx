import {
  Search,
  ArrowRightLeft,
  Clock,
  BookMarked,
  ShieldCheck,
  Layers,
} from "lucide-react";

export default function LibraryServices() {
  const services = [
    {
      title: "Real-Time Catalog Search",
      description:
        "Instantly filter and discover academic textbooks across CSE, EEE, ME, Civil, and Sciences with exact rack locations.",
      icon: Search,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Automated Circulation Desk",
      description:
        "Atomic book checkout and check-in with synchronized stock quantities and zero race conditions during peak hours.",
      icon: ArrowRightLeft,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Overdue Tracking & Fines",
      description:
        "Automated overdue calculation at 5 BDT per day with clear receipts and status badges for seamless return compliance.",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Personal Student Dashboard",
      description:
        "RUET students can log in anytime to review active borrowings, check due dates, and monitor their academic reading history.",
      icon: BookMarked,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Inventory & Stock Control",
      description:
        "Librarians can easily register new academic titles, edit copy quantities, and monitor circulation volumes in real-time.",
      icon: Layers,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      title: "Role-Based Security",
      description:
        "Secure HMAC-signed session cookies and role guards ensure student privacy and protect administrative operations.",
      icon: ShieldCheck,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
  ];

  return (
    <section id="services" className="relative z-10 w-full py-16 sm:py-24 border-t border-white/5 bg-slate-950/90">
      <div className="container-fixed">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#6395ee] uppercase tracking-wider mb-3">
            <span>Modern Academic Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Library Management Capabilities
          </h2>
          <p className="mt-3 text-sm text-slate-400 font-light leading-relaxed">
            Designed specifically to meet the academic requirements and borrowing workflows of Rajshahi University of Engineering & Technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.border} border ${s.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
