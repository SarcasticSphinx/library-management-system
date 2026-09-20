import type { Book } from "@/types/book";

export default function CatalogStats({ books }: { books: Book[] }) {
  const totalCopies = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableCopies = books.reduce((sum, book) => sum + book.availableCopies, 0);
  const lowStock = books.filter(
    (book) =>
      book.availableCopies === 0 ||
      book.availableCopies <= Math.max(1, Math.floor(book.totalCopies * 0.2))
  ).length;

  const stats = [
    { label: "Book Titles", value: books.length, subtext: "Unique catalog entries" },
    { label: "Total Physical Copies", value: totalCopies, subtext: "All registered copies" },
    { label: "Available Now", value: availableCopies, subtext: "Ready for checkout" },
    { label: "Low / Out of Stock", value: lowStock, subtext: "Titles needing restock" },
  ];

  const categories = [...new Set(books.map((book) => book.category))].sort();

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className="text-3xl font-bold tracking-tight text-slate-900 mt-1">{s.value}</p>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-light">{s.subtext}</p>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Disciplines:
        </span>
        {categories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
          >
            {category}: {books.filter((book) => book.category === category).length}
          </span>
        ))}
      </div>
    </div>
  );
}
