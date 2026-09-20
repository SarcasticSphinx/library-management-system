'use client';

import Image from 'next/image';
import { BorrowStatus } from '@prisma/client';
import LoanStatusBadge from './LoanStatusBadge';
import type { LoanRecord } from '@/types/loan';

interface UserLoanHistoryTableProps {
  loans: LoanRecord[];
}

export default function UserLoanHistoryTable({ loans }: UserLoanHistoryTableProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeLoans = loans.filter(
    (loan) => loan.status === BorrowStatus.BORROWED || loan.status === BorrowStatus.OVERDUE
  );
  const pastLoans = loans.filter((loan) => loan.status === BorrowStatus.RETURNED);

  return (
    <div className="space-y-8">
      {/* Active Loans Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Currently Borrowed ({activeLoans.length})
        </h2>
        {activeLoans.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="mt-4 text-gray-600">You have no active book loans</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrowed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeLoans.map((loan) => {
                  const daysUntilDue = getDaysUntilDue(loan.dueDate);
                  const isOverdue = loan.status === BorrowStatus.OVERDUE;

                  return (
                    <tr key={loan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {loan.book.coverImage && (
                            <div className="relative w-10 h-14 mr-3 flex-shrink-0">
                              <Image
                                src={loan.book.coverImage}
                                alt={loan.book.title}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {loan.book.title}
                            </div>
                            <div className="text-sm text-gray-500">{loan.book.author}</div>
                            <div className="text-xs text-gray-400">{loan.book.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(loan.borrowDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(loan.dueDate)}</div>
                        <div
                          className={`text-xs mt-1 ${
                            isOverdue
                              ? 'text-red-600 font-semibold'
                              : daysUntilDue <= 3
                              ? 'text-yellow-600 font-medium'
                              : 'text-gray-500'
                          }`}
                        >
                          {isOverdue
                            ? `${Math.abs(daysUntilDue)} days overdue!`
                            : daysUntilDue === 0
                            ? 'Due today!'
                            : daysUntilDue === 1
                            ? 'Due tomorrow'
                            : `${daysUntilDue} days left`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <LoanStatusBadge status={loan.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Past Loans Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Reading History ({pastLoans.length})
        </h2>
        {pastLoans.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="mt-4 text-gray-600">No reading history yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrowed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Returned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fine
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pastLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {loan.book.coverImage && (
                          <div className="relative w-10 h-14 mr-3 flex-shrink-0">
                            <Image
                              src={loan.book.coverImage}
                              alt={loan.book.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {loan.book.title}
                          </div>
                          <div className="text-sm text-gray-500">{loan.book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(loan.borrowDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {loan.returnDate ? formatDate(loan.returnDate) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {loan.fineAmount > 0 ? (
                        <span className="text-sm font-medium text-red-600">
                          {loan.fineAmount.toFixed(2)} BDT
                        </span>
                      ) : (
                        <span className="text-sm text-green-600">No fine</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
