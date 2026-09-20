import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/dashboard/StatCard";
import RecentMembersCard from "@/components/dashboard/RecentMembersCard";
import StudentLoansOverviewCard from "@/components/dashboard/StudentLoansOverviewCard";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Clock,
  BookOpen,
  MapPin,
  Calendar,
  AlertCircle,
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
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-light">
            RUET Library Management System &bull; {session?.department || "Department of CSE"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/books"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6395ee] hover:bg-[#4d83e6] text-white text-xs sm:text-sm font-semibold transition shadow-xs"
          >
            <Search className="w-4 h-4" />
            {isAdmin ? "Manage Catalog" : "Search & Borrow Books"}
          </Link>
        </div>
      </div>

      {/* Metrics Row: Pure Typography, No Multi-Color Icons */}
      {isAdmin ? (
        /* Admin Metrics */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Registered Students"
            value={totalMembers}
            description="Active library cards"
          />
          <StatCard
            title="Cataloged Book Titles"
            value={totalBooksCount}
            description="Unique textbook entries"
          />
          <StatCard
            title="Total Active Loans"
            value={activeBorrowsCount}
            description="Books currently issued"
          />
          <StatCard
            title="Overdue Returns"
            value={overdueBorrowsCount}
            description="Requires return follow-up"
          />
        </div>
      ) : (
        /* Student Metrics */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="My Borrowed Books"
            value={`${myActiveLoansCount} / 3`}
            description="Maximum 3 active loans allowed"
          />
          <StatCard
            title="Catalog Titles"
            value={totalBooksCount}
            description="Available university volumes"
          />
          <StatCard
            title="Overdue Books"
            value={myOverdueLoansCount}
            description={myOverdueLoansCount > 0 ? "Immediate return required" : "All books on time"}
          />
          <StatCard
            title="Late Fees Due"
            value={`${myTotalFines} BDT`}
            description="5 BDT / day late fee rate"
          />
        </div>
      )}

      {/* Main Grid: Left Widget & Right Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2">
          {isAdmin ? (
            <RecentMembersCard members={recentMembers} isAdmin={isAdmin} />
          ) : (
            <StudentLoansOverviewCard loans={studentLoans} />
          )}
        </div>

        {/* Right 1 Column: Quick Actions & Real Library Info (No Dev Things) */}
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
                      <BookOpen className="w-4 h-4 text-[#4d83e6]" />
                      Manage Registered Members
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    href="/dashboard/loans"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs font-semibold text-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#4d83e6]" />
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
                    <BookOpen className="w-4 h-4 text-[#4d83e6]" />
                    My Borrowed Books & History
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              )}
            </div>
          </div>

          {/* Central Library Desk & Guidelines (Real Library Info, No Dev Tech) */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Library Desk
              </span>
              <span className="text-[11px] font-semibold text-[#8eb3f5] bg-[#6395ee]/15 px-2.5 py-0.5 rounded-full border border-[#6395ee]/30">
                RUET Central
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300 font-light pt-1">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#6395ee] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Desk Hours</div>
                  <div className="text-[11px] text-slate-400">Sun &ndash; Thu: 08:00 AM &ndash; 08:00 PM</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#6395ee] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Borrowing Window</div>
                  <div className="text-[11px] text-slate-400">Standard 14 days per book loan</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#6395ee] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Overdue Fine Rate</div>
                  <div className="text-[11px] text-slate-400">5 BDT per overdue day per volume</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#6395ee] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Physical Location</div>
                  <div className="text-[11px] text-slate-400">Central Library Building, RUET Campus</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
