import { z } from "zod";

export const LessonCreationSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a text",
    })
    .min(3, {
      message: "Title must be at least 3 characters",
    })
    .max(100, {
      message: "Title must not exceed 100 characters",
    }),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a text",
    })
    .min(10, {
      message: "Description must be at least 10 characters",
    })
    .max(500, {
      message: "Description must not exceed 500 characters",
    }),
  video: z.any().optional(), // Optional because existing lessons may already have videos
  day_limit: z.coerce
    .number({ message: "Days limit required" })
    .min(1, { message: "Days limit must be at least 1" })
    .max(365, { message: "Days limit cannot exceed 365" }),
  views_limit: z.coerce
    .number({ message: "Views limit required" })
    .min(1, { message: "Views limit must be at least 1" })
    .max(1000, { message: "Views limit cannot exceed 1000" }),
  order_id: z.coerce
    .number({ message: "Lesson order is required" })
    .min(1, { message: "Order must be at least 1" }),
  is_published: z.boolean().optional(),
  section: z.string({ required_error: "Section is required" }),
  lessonFiles: z.array(z.any()).optional(),
});
