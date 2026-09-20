'use client';

import { useState } from 'react';
import { returnBookAction } from '@/actions/loanActions';
import type { LoanRecord } from '@/types/loan';

interface ReturnBookDialogProps {
  isOpen: boolean;
  loan: LoanRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReturnBookDialog({
  isOpen,
  loan,
  onClose,
  onSuccess,
}: ReturnBookDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !loan) return null;

  const calculateOverdueDays = () => {
    const now = new Date();
    const dueDate = new Date(loan.dueDate);
    if (now <= dueDate) return 0;
    
    const diffTime = now.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const overdueDays = calculateOverdueDays();
  const estimatedFine = overdueDays * 5; // 5 BDT per day

  const handleReturn = async () => {
    setSubmitting(true);
    setError('');

    try {
      const result = await returnBookAction({ recordId: loan.id });

      if (result.success) {
        // Show success and close
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 800);
      } else {
        setError(result.error || 'Failed to return book');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setError('');
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Return Book</h2>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Book</p>
              <p className="text-base font-semibold text-gray-900">{loan.book.title}</p>
              <p className="text-sm text-gray-500">{loan.book.author}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Borrower</p>
              <p className="text-base font-medium text-gray-900">{loan.user.name}</p>
              <p className="text-sm text-gray-500">
                {loan.user.studentId} • {loan.user.department}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Borrowed Date</p>
                <p className="text-base text-gray-900">{formatDate(loan.borrowDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="text-base text-gray-900">{formatDate(loan.dueDate)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Return Date</p>
              <p className="text-base font-medium text-gray-900">
                {formatDate(new Date())} (Today)
              </p>
            </div>

            {/* Overdue Information */}
            {overdueDays > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-red-900">Overdue Return</p>
                    <p className="text-sm text-red-800 mt-1">
                      This book is {overdueDays} day{overdueDays > 1 ? 's' : ''} overdue.
                    </p>
                    <p className="text-sm font-semibold text-red-900 mt-2">
                      Estimated Fine: {estimatedFine} BDT
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      (5 BDT per day overdue)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {overdueDays === 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-900">On Time Return</p>
                    <p className="text-sm text-green-800 mt-1">
                      No late fees will be charged.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Are you sure you want to process this return?
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleReturn}
            disabled={submitting}
            className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Processing...' : 'Confirm Return'}
          </button>
        </div>
      </div>
    </div>
  );
}
