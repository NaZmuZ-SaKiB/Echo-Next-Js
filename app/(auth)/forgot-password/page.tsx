"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sendPasswordResetEmail } from "@/database/auth/auth.actions";
import { ForgotPasswordValidation } from "@/database/auth/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const page = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(ForgotPasswordValidation),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ForgotPasswordValidation>) => {
    setError(null);
    setSuccess(null);

    try {
      await sendPasswordResetEmail(values.email);
      form.reset();
      setSuccess("Check your email. Password reset link has been sent.");
    } catch (error: any) {
      setError(error?.message || "An error occurred.");
    }
  };
  return (
    <div className="w-full max-w-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10 max-sm:gap-6"
        >
          <h1 className="head-text">Get Password Reset Link</h1>

          {error && (
            <div className="bg-red-500 text-white p-2 text-sm">{error}</div>
          )}
          {success && (
            <div className="bg-green-700 text-white p-2 text-sm">{success}</div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  Email
                </FormLabel>
                <FormControl>
                  <Input className="account-form_input no-focus" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="text-light-1">
            <Link href="/sign-in" className="text-primary-500">
              Back to sign in page
            </Link>
          </p>

          <Button
            className={`bg-primary-500 disabled:bg-gray-1 disabled:animate-pulse`}
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting ? "Get Reset Link" : "Sending..."}
          </Button>
        </form>
        <p className="text-light-1 mt-3">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-primary-500">
            Sign up
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default page;
