"use client";

import BookFormModal from "./BookFormModal";
import type { Book } from "@/types/book";

export default function EditBookModal({ book, onClose, onSaved }: { book: Book; onClose: () => void; onSaved: (message: string) => void }) {
  return <BookFormModal book={book} onClose={onClose} onSaved={onSaved} />;
}