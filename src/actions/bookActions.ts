'use server';

import prisma from '@/lib/prisma';

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
        title: 'asc',
      },
    });

    return {
      success: true,
      data: books,
    };
  } catch (error) {
    console.error('Error fetching available books:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch books',
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
        title: 'asc',
      },
    });

    return {
      success: true,
      data: books,
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch books',
      data: [],
    };
  }
}
