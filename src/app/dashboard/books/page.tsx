import { getBooksAction } from "@/actions/bookActions";
import BooksCatalog from "@/components/books/BooksCatalog";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const books = await getBooksAction();
  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8"><div className="mx-auto max-w-7xl"><BooksCatalog initialBooks={books} /></div></main>;
}
