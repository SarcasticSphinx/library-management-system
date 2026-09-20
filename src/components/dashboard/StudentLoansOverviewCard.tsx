import Link from "next/link";
import { BookMarked, ArrowRight, Calendar, AlertCircle } from "lucide-react";
import { BorrowStatus } from "@prisma/client";

interface StudentLoan {
  id: string;
  borrowDate: Date;
  dueDate: Date;
  status: BorrowStatus;
  fineAmount: number;
  book: {
    id: string;
    title: string;
    author: string;
    shelfLocation: string | null;
  };
}

interface StudentLoansOverviewCardProps {
  loans: StudentLoan[];
}

export default function StudentLoansOverviewCard({ loans }: StudentLoansOverviewCardProps) {
  const now = new Date();

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#eef4fe] text-[#4d83e6] flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-none">
                My Active Book Loans
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Books currently issued to your student card
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/my-loans"
            className="text-xs font-semibold text-[#4d83e6] hover:text-[#386ac9] inline-flex items-center gap-1 transition"
          >
            View all ({loans.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loans.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <BookMarked className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">No active book loans</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t checked out any books yet. Explore the university catalog to borrow up to 3 textbooks.
            </p>
            <div className="mt-5">
              <Link
                href="/dashboard/books"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6395ee] hover:bg-[#4d83e6] text-white text-xs font-semibold transition shadow-xs"
              >
                Browse Book Catalog
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 mt-3">
            {loans.map((loan) => {
              const due = new Date(loan.dueDate);
              const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              const isOverdue = loan.status === BorrowStatus.OVERDUE || diffDays < 0;

              return (
                <div
                  key={loan.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {loan.book.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {loan.book.author} &bull;{" "}
                      <span className="font-mono text-slate-600">
                        {loan.book.shelfLocation || "General Stack"}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 sm:text-right shrink-0">
                    <div className="text-xs">
                      <div className="flex items-center gap-1 text-slate-600 sm:justify-end">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          Due:{" "}
                          {due.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <div
                        className={`text-[11px] font-semibold mt-0.5 flex items-center gap-1 sm:justify-end ${
                          isOverdue ? "text-red-600" : "text-emerald-600"
                        }`}
                      >
                        {isOverdue ? (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            {Math.abs(diffDays)} day(s) overdue
                          </>
                        ) : (
                          `${diffDays} day(s) remaining`
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isOverdue
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {isOverdue ? "Overdue" : "Active"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {loans.length > 0 && loans.length < 3 && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>You can borrow {3 - loans.length} more textbook(s)</span>
          <Link
            href="/dashboard/books"
            className="text-xs font-semibold text-[#4d83e6] hover:underline"
          >
            Borrow more &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
