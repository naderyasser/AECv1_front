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
  video: z
    .union([
      z.instanceof(File, {
        message: "Please upload a valid video file",
      }),
      z.object({
        url: z.string().url("Invalid video URL"),
      }),
      z.undefined(),
    ])
    .optional(),
  day_limit: z.number({ message: "days limit required" }),
  views_limit: z.number({ message: "views limit required" }),
});
