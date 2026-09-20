'use client';

import { useState, useMemo } from 'react';
import { BorrowStatus } from '@prisma/client';
import LoanStatusBadge from './LoanStatusBadge';
import type { LoanRecord } from '@/types/loan';

interface LoanTableProps {
  loans: LoanRecord[];
  onReturnBook?: (recordId: string) => void;
}

export default function LoanTable({ loans, onReturnBook }: LoanTableProps) {
  const [statusFilter, setStatusFilter] = useState<BorrowStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search logic
  const filteredLoans = useMemo(() => {
    let filtered = loans;

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((loan) => loan.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (loan) =>
          loan.user.name.toLowerCase().includes(query) ||
          loan.user.studentId?.toLowerCase().includes(query) ||
          loan.book.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [loans, statusFilter, searchQuery]);

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

  return (
    <div>
      {/* Filter Bar */}
      <div className="mb-6 space-y-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {['ALL', BorrowStatus.BORROWED, BorrowStatus.OVERDUE, BorrowStatus.RETURNED].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter as BorrowStatus | 'ALL')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === filter
                    ? 'bg-brand text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter === 'ALL'
                  ? 'All Loans'
                  : filter === BorrowStatus.BORROWED
                  ? 'Active Loans'
                  : filter === BorrowStatus.OVERDUE
                  ? 'Overdue Only'
                  : 'Returned History'}
              </button>
            )
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by student name, student ID, or book title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrower
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrow Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLoans.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No loans found matching your criteria
                </td>
              </tr>
            ) : (
              filteredLoans.map((loan) => {
                const daysUntilDue = getDaysUntilDue(loan.dueDate);
                const isOverdue = loan.status === BorrowStatus.OVERDUE;
                const isActive = loan.status === BorrowStatus.BORROWED;

                return (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {loan.book.title}
                          </div>
                          <div className="text-sm text-gray-500">{loan.book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{loan.user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {loan.user.studentId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(loan.borrowDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(loan.dueDate)}</div>
                      {(isActive || isOverdue) && (
                        <div
                          className={`text-xs ${
                            isOverdue
                              ? 'text-red-600 font-medium'
                              : daysUntilDue <= 3
                              ? 'text-yellow-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {isOverdue
                            ? `${Math.abs(daysUntilDue)} days overdue`
                            : `${daysUntilDue} days left`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <LoanStatusBadge status={loan.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {loan.status !== BorrowStatus.RETURNED && onReturnBook && (
                        <button
                          onClick={() => onReturnBook(loan.id)}
                          className="text-brand hover:text-brand-hover font-medium"
                        >
                          Return
                        </button>
                      )}
                      {loan.status === BorrowStatus.RETURNED && loan.returnDate && (
                        <div className="text-xs text-gray-500">
                          Returned: {formatDate(loan.returnDate)}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Results Summary */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredLoans.length} of {loans.length} loans
      </div>
    </div>
  );
}
