import { db } from "@/db";
import { account } from "@/db/schema/account";
import { user, UserInterface } from "@/db/schema/user";
import { eq, sql } from "drizzle-orm";

/**
 * Registers a new user in the database.
 *
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} hash - The hash of the user's password.
 * @returns {Promise<boolean>} A promise that resolves to true if the user was successfully registered, false otherwise.
 */
export async function RegisterUserByEmail(
  name: string,
  email: string,
  hash: string,
): Promise<boolean> {
  try {
    await db.transaction(async (trx) => {
      await trx
        .insert(user)
        .values({
          name: name,
          email: email,
          hash: hash,
        })
        .returning();
    });

    return true; // Explicitly return true if transaction is successful
  } catch (error) {
    console.error("Error registering user:", error);
    return false;
  }
}

/**
 * Fetches a single user by their email.
 *
 * @param {string} email - The email of the user to fetch.
 * @returns {Promise<UserInterface | null>} A promise that resolves to the user object or null if not found.
 */
export async function GetUserByEmail(
  email: string,
): Promise<UserInterface | null> {
  try {
    const result = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        joinedAt: user.joinedAt,
        emailVerified: user.emailVerified,
        role: user.role,
        hash: user.hash,
        totpIsConfirmed: user.totpIsConfirmed,
        accounts: sql<string[]>`ARRAY_AGG(${account.provider})`.as("accounts"),
      })
      .from(user)
      .leftJoin(account, eq(user.id, account.userId))
      .where(eq(user.email, email))
      .groupBy(user.id);

    return result[0] || null; // Ensure it returns a single user or null
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

/**
 * Fetches a single user by their id.
 *
 * @param {string} id - The id of the user to fetch.
 * @returns {Promise<UserInterface | null>} A promise that resolves to the user object or null if not found.
 */
export async function GetUserById(id: string): Promise<UserInterface | null> {
  try {
    const result = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        joinedAt: user.joinedAt,
        emailVerified: user.emailVerified,
        role: user.role,
        hash: user.hash,
        totpIsConfirmed: user.totpIsConfirmed,
        accounts: sql<string[]>`ARRAY_AGG(${account.provider})`.as("accounts"),
      })
      .from(user)
      .leftJoin(account, eq(user.id, account.userId))
      .where(eq(user.id, id))
      .groupBy(user.id);

    return result[0] || null; // Ensure it returns a single user or null
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

/**
 * Returns the providers of the user with the given ID.
 *
 * @param userId - The ID of the user to get the providers for.
 * @returns {Promise<string[]>} A promise that resolves to the user's providers.
 * @throws Will throw an error if the user's providers cannot be fetched.
 */
export async function GetUserProviders(userId: string): Promise<string[]> {
  try {
    const result = await db
      .select({
        accounts: sql<string[]>`ARRAY_AGG
                    (${account.provider})`.as("accounts"),
      })
      .from(account)
      .where(eq(account.userId, userId));

    return result[0]?.accounts || [];
  } catch (error) {
    console.error("Error fetching user providers:", error);
    throw new Error("Failed to fetch user providers");
  }
}

/**
 * Checks if a user with the given email exists in the database.
 *
 * @param {string} email - The email of the user to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the user exists, false otherwise.
 */
export async function CheckUserExistsByEmail(email: string): Promise<boolean> {
  try {
    const result = await db.select().from(user).where(eq(user.email, email));

    return result.length > 0;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}
