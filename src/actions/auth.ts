"use server";

import { signIn } from "@/auth";
import { CheckUserExistsByEmail, RegisterUserByEmail } from "@/db/querys";
import { hashPassword } from "@/lib/authUtils";
import { LoginSchema, RegisterSchema } from "@/schemas/auth";
import { z } from "zod";

export const LoginAction = async (
  values: z.infer<typeof LoginSchema>,
): Promise<{ success: true } | { success: false; error: string }> => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid fields!");
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("LoginAction error:", error);

    return { success: false, error: "Invalid login credentials" };
  }
};

export const RegisterAction = async (
  values: z.infer<typeof RegisterSchema>,
): Promise<{ success: true } | { success: false; error: string }> => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid fields!");
  }

  const { name, email, password } = validatedFields.data;
  let userExists = false;
  let success = false;

  try {
    userExists = await CheckUserExistsByEmail(email);

    if (!userExists) {
      const hashedPassword = await hashPassword(password);
      success = await RegisterUserByEmail(name, email, hashedPassword);
    }
  } catch (error) {
    console.error("Error registering user:", error);

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }

  if (userExists) {
    return { success: false, error: "User with this email already exists!" };
  }

  if (success) {
    return { success: true };
  } else {
    return {
      success: false,
      error: "User creation failed. Please try again later.",
    };
  }
};
