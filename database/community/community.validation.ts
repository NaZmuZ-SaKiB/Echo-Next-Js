import { z } from "zod";

export const CommunityValidation = z.object({
  image: z.string().url(),
  name: z.string().min(3).max(30),
  username: z.string().min(3).max(30),
  bio: z.string().min(3).max(100),
});
