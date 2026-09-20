import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/dashboard/StatCard";
import RecentMembersCard from "@/components/dashboard/RecentMembersCard";
import StudentLoansOverviewCard from "@/components/dashboard/StudentLoansOverviewCard";
import Link from "next/link";
import {
  Users,
  BookOpen,
  ArrowRightLeft,
  AlertTriangle,
  ArrowRight,
  Search,
  Clock,
  BookMarked,
  Receipt,
} from "lucide-react";
import { Role, BorrowStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard Overview - RUET Library Management System",
};

export default async function DashboardOverviewPage() {
  const session = await getSession();
  const isAdmin = session?.role === Role.ADMIN;
  const now = new Date();

  // Fetch admin metrics or student personal metrics based on role
  const [
    totalMembers,
    totalBooksCount,
    activeBorrowsCount,
    overdueBorrowsCount,
    recentMembers,
    studentLoans,
  ] = await Promise.all([
    // Admin: Total registered students
    isAdmin ? prisma.user.count({ where: { role: Role.MEMBER } }) : 0,
    // Total cataloged books
    prisma.book.count(),
    // Admin: Total active loans across entire library
    isAdmin
      ? prisma.borrowRecord.count({
          where: { status: { in: [BorrowStatus.BORROWED, BorrowStatus.OVERDUE] } },
        })
      : 0,
    // Admin: Total overdue loans across entire library
    isAdmin
      ? prisma.borrowRecord.count({
          where: {
            OR: [
              { status: BorrowStatus.OVERDUE },
              { status: BorrowStatus.BORROWED, dueDate: { lt: now } },
            ],
          },
        })
      : 0,
    // Admin: 5 most recent member registrations
    isAdmin
      ? prisma.user.findMany({
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
        })
      : [],
    // Student: Student's personal loans
    !isAdmin && session?.id
      ? prisma.borrowRecord.findMany({
          where: {
            userId: session.id,
            status: { in: [BorrowStatus.BORROWED, BorrowStatus.OVERDUE] },
          },
          orderBy: { dueDate: "asc" },
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                shelfLocation: true,
              },
            },
          },
        })
      : [],
  ]);

  // Student specific statistics
  const myActiveLoansCount = studentLoans.length;
  const myOverdueLoansCount = studentLoans.filter(
    (l) => l.status === BorrowStatus.OVERDUE || new Date(l.dueDate) < now
  ).length;
  const myTotalFines = studentLoans.reduce((sum, l) => sum + (l.fineAmount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#eef4fe] text-[#4d83e6] uppercase tracking-wider">
              {isAdmin ? "Librarian Administration" : "Student Member Portal"}
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6395ee] hover:bg-[#4d83e6] text-white text-xs sm:text-sm font-semibold transition shadow-xs"
          >
            <Search className="w-4 h-4" />
            {isAdmin ? "Manage Catalog" : "Search & Borrow Books"}
          </Link>
        </div>
      </div>

      {/* Metrics Row: Differentiated by Role */}
      {isAdmin ? (
        /* Admin Metrics */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Registered Students"
            value={totalMembers}
            description="Active library accounts"
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
            title="Total Active Loans"
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
      ) : (
        /* Student Metrics */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="My Borrowed Books"
            value={`${myActiveLoansCount} / 3`}
            description="Maximum 3 active loans allowed"
            icon={BookMarked}
            color="blue"
          />
          <StatCard
            title="Catalog Titles"
            value={totalBooksCount}
            description="Available university volumes"
            icon={BookOpen}
            color="emerald"
          />
          <StatCard
            title="Overdue Books"
            value={myOverdueLoansCount}
            description={myOverdueLoansCount > 0 ? "Immediate return required" : "All books on time"}
            icon={AlertTriangle}
            color="amber"
          />
          <StatCard
            title="Late Fees Due"
            value={`${myTotalFines} BDT`}
            description="5 BDT / day late fee rate"
            icon={Receipt}
            color="purple"
          />
        </div>
      )}

      {/* Main Grid: Differentiated by Role */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2">
          {isAdmin ? (
            <RecentMembersCard members={recentMembers} isAdmin={isAdmin} />
          ) : (
            <StudentLoansOverviewCard loans={studentLoans} />
          )}
        </div>

        {/* Right 1 Column: Quick Actions & System Info */}
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
                  {isAdmin ? "Inventory Catalog" : "Search & Borrow Books"}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              {isAdmin ? (
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
                      Circulation Desk
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </>
              ) : (
                <Link
                  href="/dashboard/my-loans"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <BookMarked className="w-4 h-4 text-amber-600" />
                    My Borrowed Books & History
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
                <span className="font-semibold text-white">Neon PostgreSQL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ORM Engine:</span>
                <span className="font-semibold text-white">Prisma v7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Access Level:</span>
                <span className="font-semibold text-white">
                  {isAdmin ? "Administrator" : "Student Member"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
