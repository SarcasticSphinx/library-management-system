"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Role, UserStatus, BorrowStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface MemberListItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  studentId: string | null;
  department: string | null;
  phone: string | null;
  createdAt: Date;
  activeBorrowsCount: number;
}

export interface MemberActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Fetch all registered users/members with search, department filtering, and active borrow counts
 */
export async function getMembersAction(
  searchQuery?: string,
  departmentFilter?: string
): Promise<MemberListItem[]> {
  let session = null;
  try {
    session = await getSession();
    if (session && session.role !== Role.ADMIN) {
      return [];
    }
  } catch {
    session = null;
  }


  const query = searchQuery?.trim();
  const department = departmentFilter?.trim();

  const whereClause: Prisma.UserWhereInput = {};

  if (query) {
    whereClause.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { studentId: { contains: query, mode: "insensitive" } },
    ];
  }

  if (department && department !== "ALL") {
    whereClause.department = { contains: department, mode: "insensitive" };
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      borrowRecords: {
        where: {
          status: { in: [BorrowStatus.BORROWED, BorrowStatus.OVERDUE] },
        },
        select: { id: true },
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    studentId: user.studentId,
    department: user.department,
    phone: user.phone,
    createdAt: user.createdAt,
    activeBorrowsCount: user.borrowRecords.length,
  }));
}

/**
 * Toggle member status between ACTIVE and SUSPENDED
 */
export async function toggleMemberStatusAction(
  userId: string
): Promise<MemberActionResult<UserStatus>> {
  try {
    const session = await getSession();
    if (!session || session.role !== Role.ADMIN) {
      return { success: false, message: "Unauthorized. Admin access required." };
    }

    if (session.id === userId) {
      return { success: false, message: "You cannot change your own account status." };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return { success: false, message: "User not found." };
    }

    const newStatus =
      targetUser.status === UserStatus.ACTIVE
        ? UserStatus.SUSPENDED
        : UserStatus.ACTIVE;

    await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });

    revalidatePath("/dashboard/members");

    return {
      success: true,
      message: `Member status updated to ${newStatus}.`,
      data: newStatus,
    };
  } catch (error) {
    console.error("toggleMemberStatusAction error:", error);
    return { success: false, message: "Failed to update member status." };
  }
}
