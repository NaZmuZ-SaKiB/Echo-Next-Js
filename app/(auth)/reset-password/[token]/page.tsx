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
import { resetPassword } from "@/database/auth/auth.actions";
import { ResetPasswordValidation } from "@/database/auth/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type TProps = {
  params: {
    token: string;
  };
};

const ResetPasswordPage = ({ params }: TProps) => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(ResetPasswordValidation),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordValidation>) => {
    setError(null);

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword(params.token, values.password);
      form.reset();
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
          <h1 className="head-text">Reset Password</h1>

          {error && (
            <div className="bg-red-500 text-white p-2 text-sm">{error}</div>
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  New Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className={`bg-primary-500 disabled:bg-gray-1 disabled:animate-pulse`}
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting ? "Reset Password" : "Updating..."}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
