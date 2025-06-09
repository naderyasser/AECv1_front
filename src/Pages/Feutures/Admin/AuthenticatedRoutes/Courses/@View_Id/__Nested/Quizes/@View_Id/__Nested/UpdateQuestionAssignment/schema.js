import { z } from "zod";

const QuizOptionSchema = z.object({
  key: z.enum(["a", "b", "c", "d"]),
  value: z.string().trim().min(1, { message: "Option value is required" }),
});

const QuizQuestionSchema = z.object({
  question: z.string().trim().min(1, { message: "Question is required" }),
  options: z
    .array(QuizOptionSchema)
    .length(4, { message: "Each question must have 4 options" }),
  correctAnswer: z.enum(["a", "b", "c", "d"], {
    required_error: "A correct answer must be selected",
    invalid_type_error: "The correct answer must be 'a', 'b', 'c', or 'd'",
  }),
  attachment: z.any(),
});

export const schema = z.object({
  questions: z
    .array(QuizQuestionSchema)
    .min(1, { message: "At least one question is required" })
    .max(50, { message: "No more than 50 questions are allowed" }),
});
