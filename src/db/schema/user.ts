import { user_roles, UserRole, UserRoleType } from "@/db/schema/enumerated";
import { env } from "@/env";
import { init } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

const createId = init({
  length: 12,
  fingerprint: env.CUID_FINGERPRINT,
});

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: user_roles("role").default(UserRole.Viewer).notNull(),
  hash: text("hash"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  totpSecret: text("totpSecret"),
  totpIsConfirmed: timestamp("totpIsConfirmed", { mode: "date" }),
  lastTotpToken: text("lastTotpToken"),
  recoveryCode: text("recoveryCode"),
});

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  role: UserRoleType;
  hash: string | null;
  image: string | null;
  totpIsConfirmed: Date | null;
  accounts: string[];
}
