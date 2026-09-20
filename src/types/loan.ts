import { BorrowStatus } from '@prisma/client';

export interface LoanRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  status: BorrowStatus;
  fineAmount: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    studentId: string | null;
    department: string | null;
  };
  book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    coverImage: string | null;
  };
}

export interface IssueBookInput {
  userId: string;
  bookId: string;
  loanDays?: number;
  notes?: string;
}

export interface ReturnBookInput {
  recordId: string;
}

export interface LoanFilters {
  status?: BorrowStatus;
  searchQuery?: string;
  userId?: string;
}

export interface LoanStats {
  totalActive: number;
  totalOverdue: number;
  returnedThisMonth: number;
  totalFines: number;
}
