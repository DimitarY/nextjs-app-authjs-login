import { user } from "@/db/schema/user";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});
