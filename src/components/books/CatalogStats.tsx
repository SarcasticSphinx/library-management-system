import { AlertTriangle, Archive, BookOpen, Boxes } from "lucide-react";
import type { Book } from "@/types/book";

export default function CatalogStats({ books }: { books: Book[] }) {
  const totalCopies = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableCopies = books.reduce((sum, book) => sum + book.availableCopies, 0);
  const lowStock = books.filter((book) => book.availableCopies === 0 || book.availableCopies <= Math.max(1, Math.floor(book.totalCopies * 0.2))).length;
  const stats = [
    [BookOpen, "Book titles", books.length, "text-blue-600 bg-blue-50"], [Boxes, "Physical copies", totalCopies, "text-violet-600 bg-violet-50"],
    [Archive, "Available now", availableCopies, "text-emerald-600 bg-emerald-50"], [AlertTriangle, "Low stock", lowStock, "text-amber-600 bg-amber-50"],
  ] as const;
  const categories = [...new Set(books.map((book) => book.category))].sort();
  return <div className="space-y-3"><section className="grid grid-cols-2 gap-3 lg:grid-cols-4">{stats.map(([Icon, label, value, color]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${color}`}><Icon size={18} /></div><p className="text-2xl font-semibold text-slate-900">{value}</p><p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p></div>)}</section><div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">By category</span>{categories.map((category) => <span key={category} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{category}: {books.filter((book) => book.category === category).length}</span>)}</div></div>;
}
