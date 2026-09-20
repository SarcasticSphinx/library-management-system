"use client";

import { useState } from "react";
import { BookOpen, Calendar, MapPin, AlertCircle, CheckCircle2, X } from "lucide-react";
import { borrowBookAction } from "@/actions/bookActions";
import type { Book } from "@/types/book";

interface BorrowBookModalProps {
  book: Book;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function BorrowBookModal({ book, onClose, onSuccess }: BorrowBookModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const formattedDueDate = dueDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");

    try {
      const result = await borrowBookAction(book.id);
      if (result.success) {
        onSuccess(result.message || `Successfully borrowed "${book.title}"`);
      } else {
        setError(result.error || "Failed to borrow book.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eef4fe] text-[#4d83e6] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Confirm Book Loan</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Book Summary Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{book.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{book.author}</p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-mono">{book.isbn}</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#4d83e6]" />
                {book.shelfLocation || "General Stack"}
              </span>
            </div>
          </div>

          {/* Loan Conditions */}
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Loan Duration</span>
              <span className="font-semibold text-slate-800">14 Days</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#4d83e6]" />
                Return Due Date
              </span>
              <span className="font-bold text-slate-900">{formattedDueDate}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Overdue Fine Policy</span>
              <span className="text-slate-700">5 BDT / overdue day</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4d83e6] shrink-0 mt-0.5" />
            <span>
              This book will be immediately issued to your account and added to your personal reading record.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 p-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || book.availableCopies <= 0}
            className="px-5 py-2 rounded-xl bg-[#6395ee] hover:bg-[#4d83e6] text-white text-xs font-semibold transition shadow-xs disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? "Checking out..." : "Confirm Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
