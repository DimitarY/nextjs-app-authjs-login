import authConfig, { SessionMaxAge } from "@/auth.config";
import { db } from "@/db";
import { GetUserProviders } from "@/db/querys";
import { account } from "@/db/schema/account";
import { session } from "@/db/schema/session";
import { user } from "@/db/schema/user";
import { verificationToken } from "@/db/schema/verificationToken";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { randomUUID } from "crypto";
import NextAuth, { DefaultSession } from "next-auth";
import { encode } from "next-auth/jwt";

const databaseAdapter = DrizzleAdapter(db, {
  usersTable: user,
  accountsTable: account,
  sessionsTable: session,
  verificationTokensTable: verificationToken,
});

export const { handlers, signIn, signOut, unstable_update, auth } = NextAuth({
  adapter: databaseAdapter,
  ...authConfig,
  jwt: {
    // We convert JWT for credentials to sessionId
    maxAge: SessionMaxAge,
    async encode(arg) {
      return (arg.token?.sessionId as string) ?? (await encode(arg));
    },
  },
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        const expires = new Date(Date.now() + SessionMaxAge * 1000);
        const sessionToken = randomUUID();

        const session = await databaseAdapter.createSession!({
          userId: user.id!,
          sessionToken,
          expires,
        });

        token.sessionId = session.sessionToken;
      }

      return token;
    },
    async session({ session, user }) {
      const accounts: string[] = await GetUserProviders(user.id);

      session.user.role = user.role;
      session.user.accounts = accounts;

      return session;
    },
  },
});

declare module "next-auth" {
  interface User {
    emailVerified: Date | null;
    role: string;
    accounts: string[];
  }

  interface Session {
    user: User & DefaultSession;
  }
}
