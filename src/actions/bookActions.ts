"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { BookInput } from "@/types/book";

const catalogPath = "/dashboard/books";

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

export async function createBookAction(data: BookInput) {
  const validationError = validateBookInput(data);
  if (validationError) return { success: false, error: validationError };

  try {
    await prisma.book.create({
      data: {
        title: data.title.trim(), author: data.author.trim(), isbn: data.isbn.trim(), category: data.category.trim(),
        description: data.description?.trim() || null, publisher: data.publisher?.trim() || null,
        publishedYear: data.publishedYear || null, shelfLocation: data.shelfLocation?.trim() || null,
        totalCopies: data.totalCopies, availableCopies: data.totalCopies,
      },
    });
    revalidatePath(catalogPath);
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { success: false, error: "A book with this ISBN already exists." };
    return { success: false, error: "Unable to create the book." };
  }
}

export async function updateBookAction(id: string, data: Partial<BookInput>) {
  const validationError = validateUpdateInput(data);
  if (validationError) return { success: false, error: validationError };

  try {
    const current = await prisma.book.findUnique({ where: { id }, select: { totalCopies: true, availableCopies: true } });
    if (!current) return { success: false, error: "Book not found." };
    const checkedOut = current.totalCopies - current.availableCopies;
    const totalCopies = data.totalCopies ?? current.totalCopies;
    if (totalCopies < checkedOut) return { success: false, error: `Total copies cannot be lower than ${checkedOut} active loan(s).` };
    await prisma.book.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }), ...(data.author !== undefined && { author: data.author.trim() }),
        ...(data.isbn !== undefined && { isbn: data.isbn.trim() }), ...(data.category !== undefined && { category: data.category.trim() }),
        ...(data.description !== undefined && { description: data.description.trim() || null }), ...(data.publisher !== undefined && { publisher: data.publisher.trim() || null }),
        ...(data.publishedYear !== undefined && { publishedYear: data.publishedYear || null }), ...(data.shelfLocation !== undefined && { shelfLocation: data.shelfLocation.trim() || null }),
        ...(data.totalCopies !== undefined && { totalCopies, availableCopies: totalCopies - checkedOut }),
      },
    });
    revalidatePath(catalogPath);
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { success: false, error: "A book with this ISBN already exists." };
    return { success: false, error: "Unable to update the book." };
  }
}

export async function deleteBookAction(id: string) {
  try {
    const activeLoans = await prisma.borrowRecord.count({ where: { bookId: id, status: { in: ["BORROWED", "OVERDUE"] } } });
    if (activeLoans > 0) return { success: false, error: "This book cannot be deleted while it is checked out." };
    await prisma.book.delete({ where: { id } });
    revalidatePath(catalogPath);
    return { success: true };
  } catch {
    return { success: false, error: "Unable to delete the book." };
  }
}
