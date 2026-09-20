"use server";

import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  setSessionCookie,
  clearSessionCookie,
  getSession,
  SessionUser,
} from "@/lib/auth";
import { Role, UserStatus } from "@prisma/client";
import { redirect } from "next/navigation";

export interface AuthActionResult<T = unknown> {
  success: boolean;
  message?: string;
  user?: T;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  studentId?: string;
  department?: string;
  phone?: string;
  role?: Role;
}

/**
 * Server action to authenticate a user by email and password
 */
export async function loginAction(
  emailInput: string,
  passwordInput: string
): Promise<AuthActionResult<SessionUser>> {
  try {
    const email = emailInput?.trim().toLowerCase();
    const password = passwordInput;

    if (!email || !password) {
      return { success: false, message: "Please provide both email and password." };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: "Invalid email or password." };
    }

    if (user.status === UserStatus.SUSPENDED) {
      return {
        success: false,
        message: "Your library account has been suspended. Please contact the administrator.",
      };
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid email or password." };
    }

    const sessionPayload: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      studentId: user.studentId,
      department: user.department,
    };

    await setSessionCookie(sessionPayload);

    return {
      success: true,
      message: "Login successful.",
      user: sessionPayload,
    };
  } catch (error) {
    console.error("Login action error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during login. Please try again.",
    };
  }
}

/**
 * Server action to register a new student or library member
 */
export async function registerAction(
  data: RegisterInput
): Promise<AuthActionResult<SessionUser>> {
  try {
    const name = data.name?.trim();
    const email = data.email?.trim().toLowerCase();
    const password = data.password;
    const studentId = data.studentId?.trim() || null;
    const department = data.department?.trim() || "CSE";
    const phone = data.phone?.trim() || null;
    const role = data.role || Role.MEMBER;

    if (!name || !email || !password) {
      return { success: false, message: "Name, email, and password are required." };
    }

    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    // Check if email already registered
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return { success: false, message: "A user with this email already exists." };
    }

    // Check if studentId already registered (if provided)
    if (studentId) {
      const existingStudentId = await prisma.user.findUnique({
        where: { studentId },
      });

      if (existingStudentId) {
        return { success: false, message: "A user with this Student ID already exists." };
      }
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        status: UserStatus.ACTIVE,
        studentId,
        department,
        phone,
      },
    });

    const sessionPayload: SessionUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      studentId: newUser.studentId,
      department: newUser.department,
    };

    await setSessionCookie(sessionPayload);

    return {
      success: true,
      message: "Registration successful.",
      user: sessionPayload,
    };
  } catch (error) {
    console.error("Register action error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during registration. Please try again.",
    };
  }
}

/**
 * Server action to terminate the session and clear cookies
 */
export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}

/**
 * Server action to get the currently authenticated user
 */
export async function getCurrentUserAction(): Promise<SessionUser | null> {
  return getSession();
}
