import { z } from "zod";

export const SignUpValidation = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const ChangePasswordValidation = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(8),
});

export const ForgotPasswordValidation = z.object({
  email: z.string().email(),
});

export const ResetPasswordValidation = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});
