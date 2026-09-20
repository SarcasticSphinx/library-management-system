import { Eye, Pencil, Trash2, BookMarked } from "lucide-react";
import AvailabilityBadge from "./AvailabilityBadge";
import type { Book } from "@/types/book";

interface BookTableProps {
  books: Book[];
  isAdmin: boolean;
  onView: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  onBorrow?: (book: Book) => void;
}

export default function BookTable({
  books,
  isAdmin,
  onView,
  onEdit,
  onDelete,
  onBorrow,
}: BookTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-4">Book Title</th>
            <th className="px-5 py-4">Category</th>
            <th className="px-5 py-4">Location</th>
            <th className="px-5 py-4">Stock Availability</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {books.map((book) => {
            const hasCopies = book.availableCopies > 0;

            return (
              <tr key={book.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onView(book)}
                    className="text-left group cursor-pointer"
                  >
                    <p className="font-semibold text-slate-900 group-hover:text-[#4d83e6] transition">
                      {book.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 font-light">
                      {book.author} &bull; <span className="font-mono">{book.isbn}</span>
                    </p>
                  </button>
                </td>
                <td className="px-5 py-4 text-slate-600 text-xs">{book.category}</td>
                <td className="px-5 py-4 text-slate-600 text-xs font-mono">
                  {book.shelfLocation || "Unassigned"}
                </td>
                <td className="px-5 py-4">
                  <AvailabilityBadge
                    availableCopies={book.availableCopies}
                    totalCopies={book.totalCopies}
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Details button */}
                    <button
                      type="button"
                      title="View book details"
                      onClick={() => onView(book)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-[#4d83e6] transition"
                    >
                      <Eye size={16} />
                    </button>

                    {/* Admin Only: Edit & Delete */}
                    {isAdmin && onEdit && onDelete && (
                      <>
                        <button
                          type="button"
                          title="Edit book metadata"
                          onClick={() => onEdit(book)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          title="Delete book"
                          onClick={() => onDelete(book)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}

                    {/* Normal User (Student): Borrow Button */}
                    {!isAdmin && onBorrow && (
                      <button
                        type="button"
                        onClick={() => onBorrow(book)}
                        disabled={!hasCopies}
                        title={hasCopies ? "Borrow this book" : "Out of stock"}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          hasCopies
                            ? "bg-[#6395ee] hover:bg-[#4d83e6] text-white shadow-2xs"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <BookMarked size={14} />
                        {hasCopies ? "Borrow" : "Unavailable"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
