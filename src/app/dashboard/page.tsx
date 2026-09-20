import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/dashboard/StatCard";
import RecentMembersCard from "@/components/dashboard/RecentMembersCard";
import Link from "next/link";
import {
  Users,
  BookOpen,
  ArrowRightLeft,
  AlertTriangle,
  ArrowRight,
  Database,
  Search,
  PlusCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Role, BorrowStatus, UserStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard Overview - RUET Library Management System",
};

export default async function DashboardOverviewPage() {
  const session = await getSession();

  // Parallel database metrics queries
  const [
    totalMembers,
    totalBooksCount,
    activeBorrowsCount,
    overdueBorrowsCount,
    recentMembers,
  ] = await Promise.all([
    prisma.user.count({ where: { role: Role.MEMBER } }),
    prisma.book.count(),
    prisma.borrowRecord.count({
      where: { status: { in: [BorrowStatus.BORROWED, BorrowStatus.OVERDUE] } },
    }),
    prisma.borrowRecord.count({ where: { status: BorrowStatus.OVERDUE } }),
    prisma.user.findMany({
      where: { role: Role.MEMBER },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
        department: true,
        createdAt: true,
      },
    }),
  ]);

  const isAdmin = session?.role === Role.ADMIN;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#eef4fe] text-[#4d83e6] uppercase tracking-wider">
              {isAdmin ? "Librarian Portal" : "Student Portal"}
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
            Welcome back, {session?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            RUET Library Management System &bull; {session?.department || "Department of CSE"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/books"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6395ee] hover:bg-[#4d83e6] text-white text-xs sm:text-sm font-semibold transition shadow-sm"
          >
            <Search className="w-4 h-4" />
            Explore Catalog
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Students"
          value={totalMembers}
          description="Active library cards"
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Cataloged Book Titles"
          value={totalBooksCount}
          description="Unique textbook entries"
          icon={BookOpen}
          color="emerald"
        />

        <StatCard
          title="Active Loans"
          value={activeBorrowsCount}
          description="Books currently issued"
          icon={ArrowRightLeft}
          color="amber"
        />

        <StatCard
          title="Overdue Returns"
          value={overdueBorrowsCount}
          description="Requires return follow-up"
          icon={AlertTriangle}
          color="purple"
        />
      </div>

      {/* Main Grid: Recent Members & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Members Widget */}
        <div className="lg:col-span-2">
          <RecentMembersCard members={recentMembers} isAdmin={isAdmin} />
        </div>

        {/* Right 1 Col: Quick Actions & System Info */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3">
              Quick Shortcuts
            </h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/books"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-[#4d83e6]" />
                  Search Catalog & Stock
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              {isAdmin && (
                <>
                  <Link
                    href="/dashboard/members"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs font-semibold text-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-emerald-600" />
                      Manage Registered Members
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    href="/dashboard/loans"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs font-semibold text-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <ArrowRightLeft className="w-4 h-4 text-amber-600" />
                      Circulation & Issue Book
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </>
              )}

              {!isAdmin && (
                <Link
                  href="/dashboard/my-loans"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <ArrowRightLeft className="w-4 h-4 text-amber-600" />
                    My Borrowed Books
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              )}
            </div>
          </div>

          {/* System Environment Status */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Environment
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 font-mono pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database:</span>
                <span className="font-semibold text-white">Neon Serverless</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ORM Engine:</span>
                <span className="font-semibold text-white">Prisma v7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">App Framework:</span>
                <span className="font-semibold text-white">Next.js 16</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
