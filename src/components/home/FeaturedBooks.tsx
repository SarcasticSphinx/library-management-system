"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, AlertCircle, ArrowRight, MapPin, Tag } from "lucide-react";
import type { Book } from "@/types/book";

interface FeaturedBooksProps {
  initialBooks: Book[];
}

export default function FeaturedBooks({ initialBooks }: FeaturedBooksProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = useMemo(() => {
    const set = new Set(initialBooks.map((b) => b.category));
    return ["ALL", ...Array.from(set)];
  }, [initialBooks]);

  const filteredBooks = useMemo(() => {
    if (selectedCategory === "ALL") return initialBooks.slice(0, 8);
    return initialBooks.filter((b) => b.category === selectedCategory).slice(0, 8);
  }, [initialBooks, selectedCategory]);

  return (
    <section id="featured-books" className="relative z-10 w-full py-16 sm:py-24 border-t border-white/5 bg-slate-950/70">
      <div className="container-fixed">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-[#6395ee] uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Digital University Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Featured Academic Volumes
            </h2>
            <p className="mt-2 text-sm text-slate-400 font-light leading-relaxed">
              Explore core engineering textbooks, syllabus references, and foundational sciences cataloged across RUET departments.
            </p>
          </div>

          <Link
            href="/dashboard/books"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition self-start md:self-auto group"
          >
            <span>Browse Full Catalog ({initialBooks.length} titles)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#6395ee] text-white shadow-md shadow-[#6395ee]/25 font-semibold"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 hover:border-white/15"
              }`}
            >
              {cat === "ALL" ? "All Disciplines" : cat}
            </button>
          ))}
        </div>

        {/* Books Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const isAvailable = book.availableCopies > 0;

            return (
              <div
                key={book.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#6395ee]/40 transition duration-300 p-4 overflow-hidden shadow-lg"
              >
                {/* Book Cover Container */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-900 border border-white/5 mb-4">
                  {book.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-800 text-slate-400">
                      <BookOpen className="w-8 h-8 text-[#6395ee] mb-2 opacity-80" />
                      <span className="text-xs font-semibold line-clamp-2">{book.title}</span>
                    </div>
                  )}

                  {/* Top Badge: Availability */}
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md shadow-xs ${
                        isAvailable
                          ? "bg-emerald-500/90 text-white"
                          : "bg-amber-500/90 text-white"
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {book.availableCopies} Copies Left
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-2.5 h-2.5" />
                          Checked Out
                        </>
                      )}
                    </span>
                  </div>

                  {/* Bottom Category Tag */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-200 backdrop-blur-md border border-white/10">
                      <Tag className="w-2.5 h-2.5 text-[#6395ee]" />
                      {book.category}
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#6395ee] transition line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-light mt-1 line-clamp-1">
                      {book.author}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <MapPin className="w-3 h-3 text-[#6395ee]" />
                      {book.shelfLocation || "General Stack"}
                    </span>
                    <Link
                      href="/dashboard/books"
                      className="text-xs font-semibold text-[#6395ee] hover:text-[#8eb3f5] transition inline-flex items-center gap-0.5"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
