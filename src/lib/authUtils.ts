import { auth } from "@/auth";
import bcrypt from "bcrypt";
import { Session } from "next-auth";

/**
 * Validates the session.
 * This function is intended to be used on the server-side.
 *
 * @returns The session.
 * @throws Will throw an error if the session is invalid.
 */
export async function validateSession(): Promise<Session> {
  const session = await auth();

  if (!session) {
    throw new Error("Invalid session!");
  }

  return session;
}

/**
 * Hashes a password using bcrypt.
 *
 * @param password - The plain text password to be hashed.
 * @returns The hashed password.
 * @throws Will throw an error if hashing fails.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;

  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

/**
 * Compares a plain text password with a hashed password.
 *
 * @param password - The plain text password to compare.
 * @param hash - The hashed password to compare against.
 * @returns A boolean indicating if the passwords match.
 * @throws Will throw an error if comparison fails.
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw error;
  }
}
