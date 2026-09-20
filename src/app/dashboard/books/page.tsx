import { getSession } from "@/lib/auth";
import { getBooksAction } from "@/actions/bookActions";
import BooksCatalog from "@/components/books/BooksCatalog";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book Catalog - RUET Library Management System",
};

export default async function BooksPage() {
  const [session, books] = await Promise.all([
    getSession(),
    getBooksAction(),
  ]);

  const isAdmin = session?.role === Role.ADMIN;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <BooksCatalog initialBooks={books} isAdmin={isAdmin} />
      </div>
    </main>
  );
}
