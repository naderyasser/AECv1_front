import { z } from "zod";

export const schema = z.object({
  email: z
    .string({
      message: "user email is Required",
    })
    .email({ message: "please provide a correct email" }),
  name: z.string().min(1, { message: "username is Required" }),
  sex: z.string().min(1, { message: "please choose your gender" }),
  password: z
    .string()
    .min(8, { message: "password at least must be 8 characters" }),
  category: z
    .string()
    .min(1, { message: "please choose the category you want" }),
  phone: z.string().min(1, { message: "please add your mobile number" }),
});
