"use client";

import { useMemo, useState } from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import type { Book } from "@/types/book";
import AddBookButton from "./AddBookButton";
import BookCard from "./BookCard";
import BookDetailsModal from "./BookDetailsModal";
import BookFilterBar from "./BookFilterBar";
import BookFormModal from "./BookFormModal";
import BookTable from "./BookTable";
import CatalogStats from "./CatalogStats";
import DeleteBookDialog from "./DeleteBookDialog";
import BorrowBookModal from "./BorrowBookModal";

interface BooksCatalogProps {
  initialBooks: Book[];
  isAdmin?: boolean;
}

export default function BooksCatalog({ initialBooks, isAdmin = false }: BooksCatalogProps) {
  const [books] = useState(initialBooks);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState<"all" | "available" | "out">("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [notice, setNotice] = useState("");

  // Modals state
  const [modal, setModal] = useState<{ type: "details" | "form" | "delete"; book?: Book } | null>(null);
  const [borrowBook, setBorrowBook] = useState<Book | null>(null);

  const categories = useMemo(
    () => [...new Set(books.map((book) => book.category))].sort(),
    [books]
  );

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory = !category || book.category === category;
      const matchesAvailability =
        availability === "all" ||
        (availability === "available"
          ? book.availableCopies > 0
          : book.availableCopies === 0);
      const matchesQuery =
        !query ||
        [book.title, book.author, book.isbn].some((val) =>
          val.toLowerCase().includes(query.toLowerCase())
        );
      return matchesCategory && matchesAvailability && matchesQuery;
    });
  }, [books, category, availability, query]);

  const refresh = () => window.location.reload();

  const handleSaved = (message: string) => {
    setModal(null);
    setNotice(message);
    setTimeout(refresh, 800);
  };

  const handleDeleted = () => {
    setModal(null);
    setNotice("Book title deleted successfully.");
    setTimeout(refresh, 800);
  };

  const handleBorrowed = (message: string) => {
    setBorrowBook(null);
    setNotice(message);
    setTimeout(refresh, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {notice && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-xs font-semibold text-emerald-800 flex items-center gap-2 shadow-xs animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Catalog Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#4d83e6]">
            {isAdmin ? "Librarian Administration" : "Academic Library Catalog"}
          </p>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Book Catalog & Circulation
          </h1>
          <p className="mt-1 max-w-xl text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            {isAdmin
              ? "Search, add, modify, or retire book volumes from the RUET Central Library inventory."
              : "Search textbooks across RUET departments, check live shelf copies, and check out books for 14 days."}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            title="Refresh catalog"
            onClick={refresh}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50 transition shadow-2xs"
          >
            <RefreshCw size={17} />
          </button>

          {/* Admin Only: Add Book Button */}
          {isAdmin && <AddBookButton onClick={() => setModal({ type: "form" })} />}
        </div>
      </div>

      {/* Stats Bar */}
      <CatalogStats books={books} />

      {/* Filter and Search Bar */}
      <BookFilterBar
        query={query}
        category={category}
        availability={availability}
        categories={categories}
        view={view}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
        onAvailabilityChange={setAvailability}
        onViewChange={setView}
      />

      {/* Results Count & Clear */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>
          Showing <span className="font-semibold text-slate-800">{filteredBooks.length}</span> of{" "}
          {books.length} titles
        </p>
        {query || category || availability !== "all" ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("");
              setAvailability("all");
            }}
            className="font-semibold text-[#4d83e6] hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {/* Main Content: Table or Grid */}
      {filteredBooks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="font-semibold text-slate-900">No books found</h2>
          <p className="mt-1.5 text-xs text-slate-500 font-light">
            Try adjusting your search keywords, title, author, or category filter.
          </p>
        </div>
      ) : view === "table" ? (
        <BookTable
          books={filteredBooks}
          isAdmin={isAdmin}
          onView={(b) => setModal({ type: "details", book: b })}
          onEdit={isAdmin ? (b) => setModal({ type: "form", book: b }) : undefined}
          onDelete={isAdmin ? (b) => setModal({ type: "delete", book: b }) : undefined}
          onBorrow={!isAdmin ? (b) => setBorrowBook(b) : undefined}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((b) => (
            <BookCard
              key={b.id}
              book={b}
              isAdmin={isAdmin}
              onSelect={(selected) => setModal({ type: "details", book: selected })}
              onBorrow={!isAdmin ? (selected) => setBorrowBook(selected) : undefined}
            />
          ))}
        </div>
      )}

      {/* Admin Modals */}
      {isAdmin && modal?.type === "form" && (
        <BookFormModal
          book={modal.book}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {isAdmin && modal?.type === "delete" && modal.book && (
        <DeleteBookDialog
          book={modal.book}
          onClose={() => setModal(null)}
          onDeleted={handleDeleted}
        />
      )}

      {/* Shared Details Modal */}
      {modal?.type === "details" && modal.book && (
        <BookDetailsModal
          book={modal.book}
          isAdmin={isAdmin}
          onClose={() => setModal(null)}
          onEdit={isAdmin ? () => setModal({ type: "form", book: modal.book }) : undefined}
          onBorrow={!isAdmin ? (b) => setBorrowBook(b) : undefined}
        />
      )}

      {/* Student Self-Service Borrow Modal */}
      {!isAdmin && borrowBook && (
        <BorrowBookModal
          book={borrowBook}
          onClose={() => setBorrowBook(null)}
          onSuccess={handleBorrowed}
        />
      )}
    </div>
  );
}
