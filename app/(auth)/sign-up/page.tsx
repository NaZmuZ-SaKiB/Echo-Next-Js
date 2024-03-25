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
import { sendVerificationEmail, signUp } from "@/database/auth/auth.actions";
import { SignUpValidation } from "@/database/auth/auth.validation";
import { generateVerificationCode, verifyCode } from "@/utils/verificationCode";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SignUpPage = () => {
  const [verified, setVerified] = useState<false | string>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<{
    code: string;
    createdAt: number;
  } | null>(null);
  const [code, setCode] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const sendVerificationCode = async () => {
    setError(null);
    const result = generateVerificationCode();
    setVerificationCode(result);

    const isEmail = z.string().email().safeParse(form.getValues("email"));
    if (!isEmail.success) {
      setError("Invalid email address.");
      return;
    }

    if (loading) return;

    if (!result.code) return;

    setLoading(true);

    try {
      await sendVerificationEmail(form.getValues("email"), result.code);
      setCodeSent(true);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof SignUpValidation>) => {
    setError(null);
    if (!verified) return;
    if (verified !== values.email) {
      setError("Email changed. Please verify again.");
      setVerified(false);
      setVerificationCode(null);
      setCodeSent(false);
      setCode("");
      return;
    }

    await signUp({
      email: values.email,
      password: values.password,
      username: values.username,
    });

    form.reset();
    setVerified(false);
    setVerificationCode(null);
    setCodeSent(false);
    setCode("");
    setError(null);
  };

  return (
    <div className="w-full max-w-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10 max-sm:gap-6"
        >
          <h1 className="head-text">Sign up</h1>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  Username
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

          {!verified && form.getValues("email") && !codeSent && (
            <Button
              className={`bg-primary-500 disabled:bg-gray-1 disabled:animate-pulse`}
              type="button"
              disabled={loading}
              onClick={sendVerificationCode}
            >
              {!loading
                ? "Send Verification Code"
                : "Sending verification code..."}
            </Button>
          )}

          {codeSent && !verified && (
            <div>
              <div className="text-base-semibold text-light-2 mb-3">
                Enter Verification Code
              </div>
              <Input
                className="account-form_input no-focus"
                placeholder="code"
                onChange={(e) => setCode(e.target.value)}
              />

              <Button
                onClick={() =>
                  verifyCode(
                    code,
                    form.getValues("email"),
                    verificationCode?.code || "",
                    setVerified,
                    setError
                  )
                }
                className={`bg-primary-500 mt-2`}
                type="button"
              >
                Verify
              </Button>
            </div>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {verified && (
            <Button
              className={`bg-primary-500 disabled:bg-gray-1 disabled:animate-pulse`}
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {!form.formState.isSubmitting
                ? "Sign Up"
                : "Creating new account..."}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default SignUpPage;
