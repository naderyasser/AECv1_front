import { z } from "zod";

export const schema = ({ isSigned } = {}) => {
  return z.object({
    first_name: z.string().min(1, "first name required"),
    middle_name: z.string().min(1, "middle name required"),
    last_name: z.string().min(1, "last name required"),
    age: z
      .number({
        message: "Invalid age",
      })
      .min(18, "Must be at least 18 years old")
      .max(100, "Invalid age"),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().min(1, "Sub category is required"),
    nationality: z.string().min(1, "Nationality is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    degree: z.string().min(1, "University degree is required"),
    place: z.string().min(1, "Place is required"),
    sex: z.string().min(1, "Gender is required"),
    cv: z.any().optional(),
    certificate: z.any().optional(),
    image: z.any().optional(),
    password: isSigned
      ? z.any()
      : z
          .string()
          .min(8, { message: "password at least must be 8 characters" }),
  });
};
