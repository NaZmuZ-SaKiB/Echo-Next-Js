"use server";

import bcrypt from "bcryptjs";
import sendMail from "@/utils/sendEmail";
import { signUpVerificationTemplate } from "@/utils/verificationCode";
import { connectToDB } from "../mongoose";
import User from "../user/user.model";

export const sendVerificationEmail = async (email: string, code: string) => {
  if (!code) return;

  await sendMail({
    to: email,
    subject: "Verify your email",
    html: signUpVerificationTemplate(code),
  });
};

type TSignUpParams = {
  email: string;
  password: string;
  username: string;
};
export const signUp = async ({ email, password, username }: TSignUpParams) => {
  try {
    connectToDB();
    const hashedPassword = await bcrypt.hash(password, 12);

    return await User.create({ email, username, password: hashedPassword });
  } catch (error: any) {
    throw new Error(`Failed to create user: ${error?.message}`);
  }
};
