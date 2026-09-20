'use server';

import prisma from '@/lib/prisma';
import { UserStatus } from '@prisma/client';

/**
 * Get all active users/members for selection
 */
export async function getActiveUsersAction() {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
        department: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error('Error fetching active users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch users',
      data: [],
    };
  }
}
