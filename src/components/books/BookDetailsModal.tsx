"use client";

import { BookOpen, MapPin, X, BookMarked, Pencil } from "lucide-react";
import AvailabilityBadge from "./AvailabilityBadge";
import type { Book } from "@/types/book";

interface BookDetailsModalProps {
  book: Book;
  isAdmin: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onBorrow?: (book: Book) => void;
}

export default function BookDetailsModal({
  book,
  isAdmin,
  onClose,
  onEdit,
  onBorrow,
}: BookDetailsModalProps) {
  const hasCopies = book.availableCopies > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Close Button Header */}
        <div className="flex justify-end p-4 pb-0">
          <button
            type="button"
            onClick={onClose}
            title="Close modal"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Cover */}
          {book.coverImage ? (
            <div
              role="img"
              aria-label={`${book.title} cover`}
              className="mb-5 h-44 w-full rounded-xl bg-cover bg-center border border-slate-100 shadow-inner"
              style={{ backgroundImage: `url(${book.coverImage})` }}
            />
          ) : (
            <div className="mb-5 flex h-36 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 text-white">
              <BookOpen size={48} strokeWidth={1.2} />
            </div>
          )}

          {/* Title & Author */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{book.title}</h2>
              <p className="mt-1 text-sm text-slate-500 font-light">{book.author}</p>
            </div>
            <AvailabilityBadge
              availableCopies={book.availableCopies}
              totalCopies={book.totalCopies}
            />
          </div>

          {/* Metadata Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold uppercase">ISBN</p>
              <p className="mt-1 font-mono text-xs text-slate-800 font-medium">{book.isbn}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold uppercase">Category</p>
              <p className="mt-1 font-medium text-slate-800 text-xs">{book.category}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold uppercase">Publisher</p>
              <p className="mt-1 font-medium text-slate-800 text-xs truncate">
                {book.publisher || "-"} {book.publishedYear ? `(${book.publishedYear})` : ""}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold uppercase">Location</p>
              <p className="mt-1 flex items-center gap-1 font-mono text-xs text-slate-800 font-medium">
                <MapPin size={13} className="text-[#4d83e6]" />
                {book.shelfLocation || "General Stack"}
              </p>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                About this title
              </p>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                {book.description}
              </p>
            </div>
          )}

          {/* Action Button: Role-Differentiated */}
          {isAdmin ? (
            <button
              type="button"
              onClick={onEdit}
              className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Pencil size={15} />
              Edit Book Details
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (hasCopies && onBorrow) {
                  onClose();
                  onBorrow(book);
                }
              }}
              disabled={!hasCopies}
              className={`mt-6 w-full rounded-xl py-3 text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-xs ${
                hasCopies
                  ? "bg-[#6395ee] hover:bg-[#4d83e6] text-white cursor-pointer shadow-md shadow-[#6395ee]/25"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              }`}
            >
              <BookMarked size={16} />
              {hasCopies ? "Borrow This Book (14-Day Loan)" : "Currently Checked Out"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
