import { z } from "zod";

export const CommentValidation = z.object({
  thread: z
    .string()
    .min(3, { message: "Thread must be at least 3 characters long" }),
});
