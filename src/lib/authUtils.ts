import bcrypt from "bcrypt";

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
