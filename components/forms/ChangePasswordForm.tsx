"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChangePasswordValidation } from "@/database/auth/auth.validation";
import { changePassword, signOut } from "@/database/auth/auth.actions";

const ChangePasswordForm = ({ userId }: { userId: string }) => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(ChangePasswordValidation),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ChangePasswordValidation>) => {
    setError(null);

    if (values.oldPassword === values.newPassword) {
      setError("Old password and new password should not be the same.");
      return;
    }

    try {
      await changePassword(userId, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      form.reset();
      await signOut();
    } catch (error: any) {
      setError(error?.message || "An error occurred.");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10 max-sm:gap-6"
      >
        {error && (
          <div className="bg-red-500 text-white p-2 text-sm">{error}</div>
        )}

        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Old Password
              </FormLabel>
              <FormControl>
                <Input
                  className="account-form_input no-focus w-full"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                New Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="account-form_input no-focus w-full"
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
          {!form.formState.isSubmitting ? "Change Password" : "Updating..."}
        </Button>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
