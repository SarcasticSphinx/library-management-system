import { BookOpen, MapPin } from "lucide-react";
import AvailabilityBadge from "./AvailabilityBadge";
import type { Book } from "@/types/book";

export default function BookCard({ book, onSelect }: { book: Book; onSelect: (book: Book) => void }) {
  return <button type="button" onClick={() => onSelect(book)} className="group text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><div className="mb-5 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 text-white"><BookOpen size={38} strokeWidth={1.4} /></div><div className="flex items-start justify-between gap-3"><div><p className="line-clamp-2 font-semibold text-slate-900">{book.title}</p><p className="mt-1 text-sm text-slate-500">{book.author}</p></div><AvailabilityBadge availableCopies={book.availableCopies} totalCopies={book.totalCopies} /></div><div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>{book.category}</span><span className="flex items-center gap-1"><MapPin size={13} />{book.shelfLocation || "Unassigned"}</span></div></button>;
}
