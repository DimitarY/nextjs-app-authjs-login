import { GetUserByEmail } from "@/db/querys";
import { UserInterface } from "@/db/schema/user";
import { comparePassword } from "@/lib/authUtils";
import { LoginSchema } from "@/schemas/auth";
import { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const SessionMaxAge = 60 * 60 * 24 * 30; // 30 days

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        let email;
        let password;
        let userRecord: UserInterface | null;
        let pwMatch;

        try {
          const { email: lEmail, password: lPassword } =
            await LoginSchema.parseAsync(credentials);
          email = lEmail;
          password = lPassword;

          userRecord = await GetUserByEmail(email);
        } catch (error) {
          console.error("Error authorizing credentials:", error);
          return null;
        }

        if (!userRecord) {
          console.error("Credentials authorize: User not found.");
          return null;
        }

        if (!userRecord.hash) {
          console.error("Credentials authorize: User has no password.");
          return null;
        }

        try {
          pwMatch = await comparePassword(password, userRecord.hash);
        } catch (error) {
          console.error("Error authorizing credentials:", error);
          return null;
        }

        if (!pwMatch) {
          console.error("Credentials authorize: Invalid password.");
          return null;
        }

        // Convert UserInterface to User
        const user: User = {
          id: userRecord.id,
          name: userRecord.name,
          email: userRecord.email,
          image: userRecord.image,
          emailVerified: userRecord.emailVerified,
          role: userRecord.role,
          accounts: userRecord.accounts,
        };

        // return a user object with their profile data
        return user;
      },
    }),
    Google,
    Github,
  ],
  pages: {
    signIn: "/auth/sign-in",
    // error: "/auth/error", // TODO: Create this page
    // signOut: "/auth/sign-out", // TODO: Create this page
    // verifyRequest: "/auth/verify-request", // TODO: Create this page
  },
  session: {
    maxAge: SessionMaxAge,
  },
} satisfies NextAuthConfig;
