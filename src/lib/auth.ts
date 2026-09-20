import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  studentId?: string | null;
  department?: string | null;
}

const SESSION_COOKIE_NAME = "lms_session";
const SESSION_SECRET = process.env.AUTH_SECRET || "ruet-lms-fallback-secret-key-cse3206";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Hash a plain text password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compare a plain text password with a bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create an HMAC-signed session token string
 */
function createSignedToken(payload: SessionUser): string {
  const dataString = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(dataString)
    .digest("base64url");
  return `${dataString}.${signature}`;
}

/**
 * Verify and decode an HMAC-signed session token
 */
function verifySignedToken(token: string): SessionUser | null {
  try {
    const [dataString, signature] = token.split(".");
    if (!dataString || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(dataString)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    const json = Buffer.from(dataString, "base64url").toString("utf-8");
    return JSON.parse(json) as SessionUser;
  } catch {
    return null;
  }
}

/**
 * Save the user session inside an HTTP-only cookie
 */
export async function setSessionCookie(user: SessionUser): Promise<void> {
  try {
    const token = createSignedToken(user);
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE_SECONDS,
    });
  } catch {
    // Gracefully handle execution outside of request scope (e.g. CLI/tests)
  }
}

/**
 * Retrieve and verify the current session from cookies
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    return verifySignedToken(sessionCookie.value);
  } catch {
    return null;
  }
}

/**
 * Delete the session cookie (Logout)
 */
export async function clearSessionCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // Gracefully handle outside request context
  }
}
