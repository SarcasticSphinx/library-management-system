export default function LibraryServices() {
  const capabilities = [
    {
      index: "01",
      title: "Real-Time Catalog Search",
      description:
        "Instantly filter and discover academic textbooks across CSE, EEE, ME, Civil, and Sciences with exact rack locations and shelf codes.",
    },
    {
      index: "02",
      title: "Automated Circulation Desk",
      description:
        "Atomic book checkout and check-in with synchronized stock quantities and zero race conditions during peak semester borrowing hours.",
    },
    {
      index: "03",
      title: "Overdue Tracking & Fines",
      description:
        "Automated overdue calculation at 5 BDT per day with clear receipts and status badges for seamless return compliance and student transparency.",
    },
    {
      index: "04",
      title: "Personal Student Dashboard",
      description:
        "RUET students can log in anytime to review active borrowings, check upcoming return due dates, and monitor their academic reading history.",
    },
    {
      index: "05",
      title: "Inventory & Stock Control",
      description:
        "Librarians can easily register new academic titles, edit copy quantities, track missing volumes, and monitor circulation in real-time.",
    },
    {
      index: "06",
      title: "Role-Based Security",
      description:
        "Secure HMAC-signed session cookies and role guards ensure student privacy, protect account integrity, and restrict administrative operations.",
    },
  ];

  return (
    <section id="services" className="relative z-10 w-full py-16 sm:py-24 border-t border-white/5 bg-slate-950/90">
      <div className="container-fixed">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#6395ee] uppercase tracking-wider mb-3">
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Library Management Platform
          </h2>
          <p className="mt-3 text-sm text-slate-400 font-light leading-relaxed">
            Engineered specifically to support the academic workflows and borrowing requirements of Rajshahi University of Engineering & Technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((c) => (
            <div
              key={c.index}
              className="p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#6395ee]/40 transition duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="text-xs font-mono font-bold text-[#6395ee] tracking-widest mb-4">
                  CAPABILITY {c.index}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-[#6395ee] transition">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mt-3">
                  {c.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
