import { z } from "zod";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "image/jpeg",
  "image/png",
];

// Modified imageSchema to be optional for updates
const imageSchema = z.union([
  z
    .instanceof(File, { message: "Image must be a valid file." })
    .refine((file) => file.size < 50 * 1024 * 1024, {
      message: "Image size must be less than 50MB.",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Only JPG, PNG, or WEBP images are allowed.",
      }
    ),
  z.string().optional(), // Allow string URLs for existing images
  z.undefined(), // Allow undefined for no changes
]);

export const schema = z.object({
  image: imageSchema.optional(), // Make image optional for updates
  title: z.string().min(3, "Title should be at least 3 characters"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"], {
    message: "Level must be one of: beginner, intermediate, or advanced.",
  }),
  price: z.coerce.number().int().nonnegative("Price cannot be negative"),
  language: z
    .string({
      message: "Language is Required",
    })
    .length(2, { message: "Language must be a valid 2-letter code." }),
  category: z.string().min(1, "Please select a category"),
  subCategory: z.string().min(1, "Please select a sub category"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters"),

  // Add validation for course files
  courseFiles: z
    .array(
      z.union([
        z
          .instanceof(File)
          .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            "Each file must be less than 20MB"
          ),
        z.object({
          id: z.string(),
          url: z.string(),
        }),
        z.string(), // For URL strings
      ])
    )
    .optional(),
});
