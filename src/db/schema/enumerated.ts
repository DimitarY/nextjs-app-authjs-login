import { pgEnum } from "drizzle-orm/pg-core";

// Note: Do not change the order of items in these lists.
// Changing the order will cause the migration to fail because the enum values will be out of sync with the database.
// If you want to add a new item, add it to the end of the list.

const createEnumObject = <T extends readonly [string, ...string[]]>(
  values: T,
): Record<T[number], T[number]> => {
  const obj: Record<string, T[number]> = {};
  for (const value of values) {
    obj[value] = value;
  }
  return obj;
};

const UserRoleList = [
  "Administrator",
  "Moderator",
  "Contributor",
  "Viewer",
] as const;

export const UserRole = createEnumObject(UserRoleList);

export type UserRoleType = keyof typeof UserRole;

export const user_roles = pgEnum("user_roles", UserRoleList);
