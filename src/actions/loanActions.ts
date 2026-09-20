'use server';

import { revalidatePath } from 'next/cache';
import { BorrowStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import type { IssueBookInput, ReturnBookInput, LoanRecord } from '@/types/loan';

/**
 * Issue a book to a user with atomic transaction
 * - Verifies user exists and is ACTIVE
 * - Checks book availability (availableCopies > 0)
 * - Creates BorrowRecord and decrements availableCopies atomically
 */
export async function issueBookAction(input: IssueBookInput) {
  const { userId, bookId, loanDays = 14, notes } = input;

  try {
    // Execute atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify user exists and is ACTIVE
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, status: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.status !== 'ACTIVE') {
        throw new Error(`Cannot issue book: User account is ${user.status}`);
      }

      // 2. Check book availability
      const book = await tx.book.findUnique({
        where: { id: bookId },
        select: { 
          id: true, 
          title: true, 
          availableCopies: true,
          totalCopies: true
        },
      });

      if (!book) {
        throw new Error('Book not found');
      }

      if (book.availableCopies <= 0) {
        throw new Error(`Book "${book.title}" is currently unavailable (0 copies remaining)`);
      }

      // 3. Calculate due date
      const borrowDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + loanDays);

      // 4. Create borrow record and decrement available copies atomically
      const borrowRecord = await tx.borrowRecord.create({
        data: {
          userId,
          bookId,
          borrowDate,
          dueDate,
          status: BorrowStatus.BORROWED,
          notes: notes || null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              studentId: true,
              department: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              isbn: true,
              category: true,
              coverImage: true,
            },
          },
        },
      });

      // 5. Decrement available copies
      await tx.book.update({
        where: { id: bookId },
        data: {
          availableCopies: {
            decrement: 1,
          },
        },
      });

      return borrowRecord;
    });

    // Revalidate relevant pages
    revalidatePath('/dashboard/loans');
    revalidatePath('/dashboard/books');
    revalidatePath(`/dashboard/my-loans`);

    return {
      success: true,
      data: result,
      message: `Book "${result.book.title}" successfully issued to ${result.user.name}`,
    };
  } catch (error) {
    console.error('Error issuing book:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to issue book',
    };
  }
}

/**
 * Return a borrowed book with atomic transaction
 * - Fetches active record and verifies it hasn't been returned
 * - Calculates overdue fines if applicable
 * - Marks status as RETURNED, sets returnDate, and increments availableCopies atomically
 */
export async function returnBookAction(input: ReturnBookInput) {
  const { recordId } = input;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch the borrow record
      const record = await tx.borrowRecord.findUnique({
        where: { id: recordId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              studentId: true,
              department: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              isbn: true,
              category: true,
              coverImage: true,
            },
          },
        },
      });

      if (!record) {
        throw new Error('Borrow record not found');
      }

      if (record.status === BorrowStatus.RETURNED) {
        throw new Error('This book has already been returned');
      }

      // 2. Calculate overdue fine if applicable
      const returnDate = new Date();
      const dueDate = new Date(record.dueDate);
      let fineAmount = 0;

      if (returnDate > dueDate) {
        // Calculate overdue days
        const overdueDays = Math.ceil(
          (returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        // Fine rate: 5 BDT per day
        fineAmount = overdueDays * 5;
      }

      // 3. Update borrow record
      const updatedRecord = await tx.borrowRecord.update({
        where: { id: recordId },
        data: {
          status: BorrowStatus.RETURNED,
          returnDate,
          fineAmount,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              studentId: true,
              department: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              isbn: true,
              category: true,
              coverImage: true,
            },
          },
        },
      });

      // 4. Increment available copies
      await tx.book.update({
        where: { id: record.bookId },
        data: {
          availableCopies: {
            increment: 1,
          },
        },
      });

      return { record: updatedRecord, fineAmount };
    });

    // Revalidate relevant pages
    revalidatePath('/dashboard/loans');
    revalidatePath('/dashboard/books');
    revalidatePath(`/dashboard/my-loans`);

    const fineMessage = result.fineAmount > 0 
      ? ` Overdue fine: ${result.fineAmount} BDT`
      : '';

    return {
      success: true,
      data: result.record,
      message: `Book "${result.record.book.title}" successfully returned.${fineMessage}`,
      fineAmount: result.fineAmount,
    };
  } catch (error) {
    console.error('Error returning book:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to return book',
    };
  }
}

/**
 * Get circulation records with optional status filter
 * Includes user and book relations
 */
export async function getCirculationRecordsAction(statusFilter?: BorrowStatus) {
  try {
    const now = new Date();

    const records = await prisma.borrowRecord.findMany({
      where: statusFilter ? { status: statusFilter } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true,
            department: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            category: true,
            coverImage: true,
          },
        },
      },
      orderBy: {
        borrowDate: 'desc',
      },
    });

    // Update overdue status for borrowed books past due date
    const recordsWithStatus = records.map((record) => {
      if (
        record.status === BorrowStatus.BORROWED &&
        new Date(record.dueDate) < now
      ) {
        return {
          ...record,
          status: BorrowStatus.OVERDUE as BorrowStatus,
        };
      }
      return record;
    });

    return {
      success: true,
      data: recordsWithStatus as LoanRecord[],
    };
  } catch (error) {
    console.error('Error fetching circulation records:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch records',
      data: [],
    };
  }
}

/**
 * Get borrow history for a specific user
 * Returns all active and past loans
 */
export async function getUserBorrowHistoryAction(userId: string) {
  try {
    const now = new Date();

    const records = await prisma.borrowRecord.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true,
            department: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            category: true,
            coverImage: true,
          },
        },
      },
      orderBy: {
        borrowDate: 'desc',
      },
    });

    // Update overdue status
    const recordsWithStatus = records.map((record) => {
      if (
        record.status === BorrowStatus.BORROWED &&
        new Date(record.dueDate) < now
      ) {
        return {
          ...record,
          status: BorrowStatus.OVERDUE as BorrowStatus,
        };
      }
      return record;
    });

    return {
      success: true,
      data: recordsWithStatus as LoanRecord[],
    };
  } catch (error) {
    console.error('Error fetching user borrow history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch history',
      data: [],
    };
  }
}

/**
 * Get circulation statistics
 */
export async function getCirculationStatsAction() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalActive, totalOverdue, returnedThisMonth, finesData] = await Promise.all([
      // Total active borrows
      prisma.borrowRecord.count({
        where: { status: BorrowStatus.BORROWED },
      }),
      
      // Total overdue loans
      prisma.borrowRecord.count({
        where: {
          status: BorrowStatus.BORROWED,
          dueDate: { lt: now },
        },
      }),
      
      // Books returned this month
      prisma.borrowRecord.count({
        where: {
          status: BorrowStatus.RETURNED,
          returnDate: { gte: startOfMonth },
        },
      }),
      
      // Total accrued fines
      prisma.borrowRecord.aggregate({
        _sum: { fineAmount: true },
        where: { fineAmount: { gt: 0 } },
      }),
    ]);

    return {
      success: true,
      data: {
        totalActive,
        totalOverdue,
        returnedThisMonth,
        totalFines: finesData._sum.fineAmount || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching circulation stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch stats',
      data: {
        totalActive: 0,
        totalOverdue: 0,
        returnedThisMonth: 0,
        totalFines: 0,
      },
    };
  }
}
