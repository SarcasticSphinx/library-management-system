export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string | null;
  publisher: string | null;
  publishedYear: number | null;
  shelfLocation: string | null;
  coverImage: string | null;
  totalCopies: number;
  availableCopies: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: { borrowRecords: number };
};

export type BookInput = {
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  publisher?: string;
  publishedYear?: number;
  shelfLocation?: string;
  totalCopies: number;
};

export type BookActionResult = {
  success: boolean;
  error?: string;
};
