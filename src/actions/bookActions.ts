"use server";

import { revalidatePath } from "next/cache";
import { Prisma, Role, BorrowStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import type { BookInput } from "@/types/book";

const catalogPath = "/dashboard/books";

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Safely ignore when called outside Next.js request context
  }
}

function validateBookInput(data: Partial<BookInput>) {
  if (!data.title?.trim() || !data.author?.trim() || !data.isbn?.trim() || !data.category?.trim()) {
    return "Title, author, ISBN, and category are required.";
  }
  if (!Number.isInteger(data.totalCopies) || (data.totalCopies ?? 0) < 1) {
    return "Total copies must be a positive whole number.";
  }
  if (!/^(?:\d{9}[\dXx]|\d{13})$/.test(data.isbn.replace(/[-\s]/g, ""))) {
    return "ISBN must be a valid ISBN-10 or ISBN-13 value.";
  }
  if (data.publishedYear !== undefined && data.publishedYear !== null && (!Number.isInteger(data.publishedYear) || data.publishedYear < 0)) {
    return "Published year must be a valid whole number.";
  }
  return null;
}

function validateUpdateInput(data: Partial<BookInput>) {
  if (data.title !== undefined && !data.title.trim()) return "Title cannot be empty.";
  if (data.author !== undefined && !data.author.trim()) return "Author cannot be empty.";
  if (data.isbn !== undefined && !data.isbn.trim()) return "ISBN cannot be empty.";
  if (data.isbn !== undefined && !/^(?:\d{9}[\dXx]|\d{13})$/.test(data.isbn.replace(/[-\s]/g, ""))) return "ISBN must be a valid ISBN-10 or ISBN-13 value.";
  if (data.category !== undefined && !data.category.trim()) return "Category cannot be empty.";
  if (data.totalCopies !== undefined && (!Number.isInteger(data.totalCopies) || data.totalCopies < 1)) return "Total copies must be a positive whole number.";
  if (data.publishedYear !== undefined && data.publishedYear !== null && (!Number.isInteger(data.publishedYear) || data.publishedYear < 0)) return "Published year must be a valid whole number.";
  return null;
}

export async function getBooksAction(query = "", category = "") {
  const search = query.trim();
  return prisma.book.findMany({
    where: {
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { author: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { isbn: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { borrowRecords: true } } },
  });
}

export async function getBookByIdAction(id: string) {
  return prisma.book.findUnique({ where: { id } });
}

/**
 * Add a new book to the library catalog (Admin Only)
 */
export async function createBookAction(data: BookInput) {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) {
    return { success: false, error: "Access denied. Only library administrators can add books." };
  }

  const validationError = validateBookInput(data);
  if (validationError) return { success: false, error: validationError };

  try {
    await prisma.book.create({
      data: {
        title: data.title.trim(),
        author: data.author.trim(),
        isbn: data.isbn.trim(),
        category: data.category.trim(),
        description: data.description?.trim() || null,
        publisher: data.publisher?.trim() || null,
        publishedYear: data.publishedYear || null,
        shelfLocation: data.shelfLocation?.trim() || null,
        totalCopies: data.totalCopies,
        availableCopies: data.totalCopies,
      },
    });
    safeRevalidatePath(catalogPath);
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "A book with this ISBN already exists." };
    }
    return { success: false, error: "Unable to create the book." };
  }
}

/**
 * Modify book metadata or copy stock (Admin Only)
 */
export async function updateBookAction(id: string, data: Partial<BookInput>) {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) {
    return { success: false, error: "Access denied. Only library administrators can modify books." };
  }

  const validationError = validateUpdateInput(data);
  if (validationError) return { success: false, error: validationError };

  try {
    const current = await prisma.book.findUnique({
      where: { id },
      select: { totalCopies: true, availableCopies: true },
    });
    if (!current) return { success: false, error: "Book not found." };
    const checkedOut = current.totalCopies - current.availableCopies;
    const totalCopies = data.totalCopies ?? current.totalCopies;
    if (totalCopies < checkedOut) {
      return { success: false, error: `Total copies cannot be lower than ${checkedOut} active loan(s).` };
    }
    await prisma.book.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.author !== undefined && { author: data.author.trim() }),
        ...(data.isbn !== undefined && { isbn: data.isbn.trim() }),
        ...(data.category !== undefined && { category: data.category.trim() }),
        ...(data.description !== undefined && { description: data.description.trim() || null }),
        ...(data.publisher !== undefined && { publisher: data.publisher.trim() || null }),
        ...(data.publishedYear !== undefined && { publishedYear: data.publishedYear || null }),
        ...(data.shelfLocation !== undefined && { shelfLocation: data.shelfLocation.trim() || null }),
        ...(data.totalCopies !== undefined && { totalCopies, availableCopies: totalCopies - checkedOut }),
      },
    });
    safeRevalidatePath(catalogPath);
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "A book with this ISBN already exists." };
    }
    return { success: false, error: "Unable to update the book." };
  }
}

/**
 * Delete a book from the library catalog (Admin Only)
 */
export async function deleteBookAction(id: string) {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) {
    return { success: false, error: "Access denied. Only library administrators can delete books." };
  }

  try {
    const activeLoans = await prisma.borrowRecord.count({
      where: { bookId: id, status: { in: [BorrowStatus.BORROWED, BorrowStatus.OVERDUE] } },
    });
    if (activeLoans > 0) {
      return { success: false, error: "This book cannot be deleted while it is checked out." };
    }
    await prisma.book.delete({ where: { id } });
    safeRevalidatePath(catalogPath);
    return { success: true };
  } catch {
    return { success: false, error: "Unable to delete the book." };
  }
}

/**
 * Student Self-Service Borrow Action
 * Normal users can borrow any book with availableCopies > 0
 */
export async function borrowBookAction(bookId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in to your library account to borrow books." };
  }

  try {
    // 1. Verify user status
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, status: true },
    });

    if (!user || user.status !== "ACTIVE") {
      return { success: false, error: "Your account is not active. Please contact the librarian." };
    }

    // 2. Check active loans limit (max 3 books per student)
    const activeLoansCount = await prisma.borrowRecord.count({
      where: {
        userId: session.id,
        status: { in: [BorrowStatus.BORROWED, BorrowStatus.OVERDUE] },
      },
    });

    if (activeLoansCount >= 3) {
      return {
        success: false,
        error: "Borrowing limit reached (maximum 3 active books allowed per student). Please return an existing loan first.",
      };
    }

    // 3. Check if user already holds an active copy of this exact book
    const existingLoan = await prisma.borrowRecord.findFirst({
      where: {
        userId: session.id,
        bookId,
        status: { in: [BorrowStatus.BORROWED, BorrowStatus.OVERDUE] },
      },
    });

    if (existingLoan) {
      return {
        success: false,
        error: "You currently have an active loan for this book. Multiple copies of the same title are not permitted.",
      };
    }

    // 4. Atomic transaction to decrement available copies and create BorrowRecord
    const result = await prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { id: bookId },
        select: { id: true, title: true, availableCopies: true },
      });

      if (!book) {
        throw new Error("Book not found.");
      }

      if (book.availableCopies <= 0) {
        throw new Error(`"${book.title}" is currently out of stock.`);
      }

      const borrowDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 14-day standard loan

      const record = await tx.borrowRecord.create({
        data: {
          userId: session.id,
          bookId,
          borrowDate,
          dueDate,
          status: BorrowStatus.BORROWED,
          notes: "Student self-service checkout",
        },
      });

      await tx.book.update({
        where: { id: bookId },
        data: { availableCopies: { decrement: 1 } },
      });

      return { record, bookTitle: book.title, dueDate };
    });

    safeRevalidatePath(catalogPath);
    safeRevalidatePath("/dashboard/my-loans");
    safeRevalidatePath("/dashboard");

    const formattedDue = result.dueDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return {
      success: true,
      message: `"${result.bookTitle}" successfully checked out! Due date: ${formattedDue}.`,
    };
  } catch (error) {
    console.error("borrowBookAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to borrow book.",
    };
  }
}

/**
 * Get all books with available copies for borrowing
 */
export async function getAvailableBooksAction() {
  try {
    const books = await prisma.book.findMany({
      where: {
        availableCopies: {
          gt: 0,
        },
      },
      select: {
        id: true,
        title: true,
        author: true,
        isbn: true,
        category: true,
        availableCopies: true,
        totalCopies: true,
        coverImage: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return {
      success: true,
      data: books,
    };
  } catch (error) {
    console.error("Error fetching available books:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch books",
      data: [],
    };
  }
}

/**
 * Get all books including those with zero available copies
 */
export async function getAllBooksAction() {
  try {
    const books = await prisma.book.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        isbn: true,
        category: true,
        availableCopies: true,
        totalCopies: true,
        coverImage: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return {
      success: true,
      data: books,
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch books",
      data: [],
    };
  }
}
