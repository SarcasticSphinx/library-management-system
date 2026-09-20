'use client';

import { useState, useEffect, useCallback } from 'react';
import { issueBookAction } from '@/actions/loanActions';
import { getActiveUsersAction } from '@/actions/userActions';
import { getAvailableBooksAction } from '@/actions/bookActions';

interface User {
  id: string;
  name: string;
  email: string;
  studentId: string | null;
  department: string | null;
}

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
}

interface IssueBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function IssueBookModal({
  isOpen,
  onClose,
  onSuccess,
}: IssueBookModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [loanDays, setLoanDays] = useState(14);
  const [notes, setNotes] = useState('');

  // Search states
  const [userSearch, setUserSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [usersResult, booksResult] = await Promise.all([
        getActiveUsersAction(),
        getAvailableBooksAction(),
      ]);

      if (usersResult.success) {
        setUsers(usersResult.data);
      } else {
        setError(usersResult.error || 'Failed to load users');
      }

      if (booksResult.success) {
        setBooks(booksResult.data);
      } else {
        setError(booksResult.error || 'Failed to load books');
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load users and books when modal opens
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadData();
    }
  }, [isOpen, loadData]);

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.studentId?.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Filter books based on search
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      book.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
      book.isbn.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (!selectedUserId || !selectedBookId) {
      setError('Please select both a student and a book');
      setSubmitting(false);
      return;
    }

    try {
      const result = await issueBookAction({
        userId: selectedUserId,
        bookId: selectedBookId,
        loanDays,
        notes: notes.trim() || undefined,
      });

      if (result.success) {
        setSuccess(result.message || 'Book issued successfully');
        // Reset form
        setSelectedUserId('');
        setSelectedBookId('');
        setLoanDays(14);
        setNotes('');
        setUserSearch('');
        setBookSearch('');
        
        // Close modal and refresh after short delay
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Failed to issue book');
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
      setSuccess('');
      setSelectedUserId('');
      setSelectedBookId('');
      setLoanDays(14);
      setNotes('');
      setUserSearch('');
      setBookSearch('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Issue Book</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
              <p className="mt-2 text-gray-600">Loading data...</p>
            </div>
          ) : (
            <>
              {/* Student Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student *
                </label>
                <input
                  type="text"
                  placeholder="Search by name or student ID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
                <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No active students found
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <label
                        key={user.id}
                        className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                          selectedUserId === user.id ? 'bg-brand-light' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="user"
                          value={user.id}
                          checked={selectedUserId === user.id}
                          onChange={(e) => setSelectedUserId(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.studentId} • {user.department}
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Book Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Book *
                </label>
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
                <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {filteredBooks.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No available books found
                    </div>
                  ) : (
                    filteredBooks.map((book) => (
                      <label
                        key={book.id}
                        className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                          selectedBookId === book.id ? 'bg-brand-light' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="book"
                          value={book.id}
                          checked={selectedBookId === book.id}
                          onChange={(e) => setSelectedBookId(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {book.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {book.author} • {book.category}
                          </div>
                          <div className="text-xs text-green-600 font-medium mt-1">
                            {book.availableCopies} of {book.totalCopies} copies available
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Loan Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Duration
                </label>
                <div className="flex gap-2">
                  {[7, 14, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setLoanDays(days)}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        loanDays === days
                          ? 'bg-brand text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {days} days
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any special notes about this loan..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                />
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loading || !selectedUserId || !selectedBookId}
              className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Issuing...' : 'Issue Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
