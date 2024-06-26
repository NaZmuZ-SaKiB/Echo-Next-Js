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
import { signIn } from "@/database/auth/auth.actions";
import { SignInValidation } from "@/database/auth/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SignInPage = () => {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInValidation>) => {
    setError(null);

    try {
      await signIn(values.email, values.password);
      form.reset();
      router.push("/");
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
          <h1 className="head-text">Sign in</h1>

          {error && (
            <div className="bg-red-500 text-white p-2 text-sm">{error}</div>
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  Password
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

          <p className="text-light-1">
            <Link href="/forgot-password" className="text-primary-500">
              Forgot Password?
            </Link>
          </p>

          <Button
            className={`bg-primary-500 disabled:bg-gray-1 disabled:animate-pulse`}
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting ? "Sign In" : "Signing In..."}
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

export default SignInPage;
