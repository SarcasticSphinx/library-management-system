import { BookOpen, MapPin, BookMarked } from "lucide-react";
import AvailabilityBadge from "./AvailabilityBadge";
import type { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
  isAdmin: boolean;
  onSelect: (book: Book) => void;
  onBorrow?: (book: Book) => void;
}

export default function BookCard({ book, isAdmin, onSelect, onBorrow }: BookCardProps) {
  const hasCopies = book.availableCopies > 0;

  return (
    <div className="group text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Cover / Icon */}
        <div
          onClick={() => onSelect(book)}
          className="mb-4 flex h-36 items-center justify-center rounded-xl bg-slate-900 text-white overflow-hidden cursor-pointer relative"
        >
          {book.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950 text-white">
              <BookOpen size={36} strokeWidth={1.4} />
            </div>
          )}
        </div>

        {/* Title & Availability */}
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => onSelect(book)}
            className="text-left font-semibold text-slate-900 line-clamp-2 hover:text-[#4d83e6] transition cursor-pointer"
          >
            {book.title}
          </button>
          <AvailabilityBadge
            availableCopies={book.availableCopies}
            totalCopies={book.totalCopies}
          />
        </div>
        <p className="mt-1 text-xs text-slate-500 line-clamp-1">{book.author}</p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 font-mono text-[11px]">
          <MapPin size={13} className="text-[#4d83e6]" />
          {book.shelfLocation || "Unassigned"}
        </span>

        {/* Student Borrow Action */}
        {!isAdmin && onBorrow ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBorrow(book);
            }}
            disabled={!hasCopies}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              hasCopies
                ? "bg-[#6395ee] hover:bg-[#4d83e6] text-white shadow-2xs cursor-pointer"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <BookMarked size={13} />
            {hasCopies ? "Borrow" : "Out"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSelect(book)}
            className="text-xs font-semibold text-[#4d83e6] hover:underline cursor-pointer"
          >
            Details &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
