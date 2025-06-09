import { z } from "zod";

export const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.string().min(1, "Quiz type is required"),
  timer: z
    .number({ invalid_type_error: "Timer must be a number" })
    .min(1, "Timer must be at least 1 minute"),
  unlocks_at: z.string().min(1, "Unlock date is required"),
  time_tracker: z.string().min(1, "Time tracker date is required"),
  // is_done: z.boolean(),
  // is_exam: z.boolean(),
});
