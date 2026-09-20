"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Book } from "@/types/book";
import AddBookButton from "./AddBookButton";
import BookCard from "./BookCard";
import BookDetailsModal from "./BookDetailsModal";
import BookFilterBar from "./BookFilterBar";
import BookFormModal from "./BookFormModal";
import BookTable from "./BookTable";
import CatalogStats from "./CatalogStats";
import DeleteBookDialog from "./DeleteBookDialog";

export default function BooksCatalog({ initialBooks }: { initialBooks: Book[] }) {
  const [books] = useState(initialBooks);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState<"all" | "available" | "out">("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<{ type: "details" | "form" | "delete"; book?: Book } | null>(null);
  const categories = [...new Set(books.map((book) => book.category))].sort();
  const filteredBooks = useMemo(() => books.filter((book) => {
    const matchesCategory = !category || book.category === category;
    const matchesAvailability = availability === "all" || (availability === "available" ? book.availableCopies > 0 : book.availableCopies === 0);
    const matchesQuery = !query || [book.title, book.author, book.isbn].some((value) => value.toLowerCase().includes(query.toLowerCase()));
    return matchesCategory && matchesAvailability && matchesQuery;
  }), [books, category, availability, query]);
  const refresh = () => window.location.reload();
  const handleSaved = (message: string) => { setModal(null); setNotice(message); setTimeout(refresh, 700); };
  const handleDeleted = () => { setModal(null); setNotice("Book deleted successfully."); setTimeout(refresh, 700); };

  return <div className="space-y-6">
    {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</div>}
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">Inventory control</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Book catalog</h1><p className="mt-2 max-w-xl text-sm text-slate-500">Search, organize, and maintain every title in the RUET library collection.</p></div><div className="flex items-center gap-2"><button type="button" title="Refresh catalog" onClick={refresh} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50"><RefreshCw size={17} /></button><AddBookButton onClick={() => setModal({ type: "form" })} /></div></div>
    <CatalogStats books={books} />
    <BookFilterBar query={query} category={category} availability={availability} categories={categories} view={view} onQueryChange={setQuery} onCategoryChange={setCategory} onAvailabilityChange={setAvailability} onViewChange={setView} />
    <div className="flex items-center justify-between"><p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-800">{filteredBooks.length}</span> of {books.length} titles</p>{query || category || availability !== "all" ? <button type="button" onClick={() => { setQuery(""); setCategory(""); setAvailability("all"); }} className="text-sm font-medium text-blue-600 hover:text-blue-700">Clear filters</button> : null}</div>
    {filteredBooks.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><h2 className="font-semibold text-slate-900">No books found</h2><p className="mt-2 text-sm text-slate-500">Try a different title, author, ISBN, or category.</p></div> : view === "table" ? <BookTable books={filteredBooks} onView={(book) => setModal({ type: "details", book })} onEdit={(book) => setModal({ type: "form", book })} onDelete={(book) => setModal({ type: "delete", book })} /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filteredBooks.map((book) => <BookCard key={book.id} book={book} onSelect={(selected) => setModal({ type: "details", book: selected })} />)}</div>}
    {modal?.type === "form" && <BookFormModal book={modal.book} onClose={() => setModal(null)} onSaved={handleSaved} />}
    {modal?.type === "details" && modal.book && <BookDetailsModal book={modal.book} onClose={() => setModal(null)} onEdit={() => setModal({ type: "form", book: modal.book })} />}
    {modal?.type === "delete" && modal.book && <DeleteBookDialog book={modal.book} onClose={() => setModal(null)} onDeleted={handleDeleted} />}
  </div>;
}
