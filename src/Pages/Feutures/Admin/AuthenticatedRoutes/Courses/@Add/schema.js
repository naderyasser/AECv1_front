import { z } from "zod";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"), // Changed from string to coerce.number()
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub Category is required"),
  level: z.string().min(1, "Level is required"),
  image: z.any().refine((file) => file instanceof File, {
    message: "Image is required",
  }),
  language: z.string().min(1, "Language is required"),
  courseFiles: z.array(z.any()).optional(),
});
