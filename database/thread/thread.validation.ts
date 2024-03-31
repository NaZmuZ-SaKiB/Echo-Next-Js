import { z } from "zod";

export const ThreadValidation = z.object({
  thread: z
    .string()
    .min(3, { message: "Echo must be at least 3 characters long" }),
  communityId: z.string().optional(),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .min(3, { message: "Echo must be at least 3 characters long" }),
});
