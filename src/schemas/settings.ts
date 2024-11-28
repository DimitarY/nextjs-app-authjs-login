import * as z from "zod";

export const GeneralSettings_Profile = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
});
