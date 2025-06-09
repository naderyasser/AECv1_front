import { z } from "zod";

export const schema = z.object({
  email: z.string().email("invalid email").min(1, "email is required"),
  password: z.string().min(1, { message: "please fill the password field" }),
});
