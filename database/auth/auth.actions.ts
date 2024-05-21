"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import sendMail from "@/utils/sendEmail";
import { signUpVerificationTemplate } from "@/utils/verificationCode";
import { connectToDB } from "../mongoose";
import User from "../user/user.model";
import { jwtHelpers } from "@/utils/jwt";
import { redirect } from "next/navigation";
import generatePasswordResetLinkHtml from "@/utils/generatePasswordResetLinkHtml";

export const sendVerificationEmail = async (email: string, code: string) => {
  if (!code) return;

  await sendMail({
    to: email,
    subject: "Echo | Verify your email",
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

export const signIn = async (email: string, password: string) => {
  try {
    connectToDB();

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("User not found.");
    }

    const isCorrectPassword: Boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (!isCorrectPassword) {
      throw new Error("Invalid credentials.");
    }

    const token = await jwtHelpers.generateToken(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      process.env.JWT_EXPIRES_IN as string
    );

    cookies().set("jwt", token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
      path: "/",
      sameSite: "strict",
    });
  } catch (error: any) {
    throw new Error(`Failed to login user: ${error?.message}`);
  }
};

export const currentUser = async () => {
  try {
    connectToDB();

    const jwt = cookies().get("jwt");
    if (!jwt?.value) {
      return null;
    }

    const decoded = await jwtHelpers.verifyToken(
      jwt.value,
      process.env.JWT_SECRET as string
    );

    const user = await User.findById(decoded.payload.id);
    if (!user) return null;

    return user;
  } catch (error) {
    return null;
  }
};

export const isUserLoggedIn = async () => {
  try {
    const jwt = cookies().get("jwt");
    if (!jwt?.value) {
      return null;
    }

    const decoded = await jwtHelpers.verifyToken(
      jwt.value,
      process.env.JWT_SECRET as string
    );

    return { userId: `${decoded.payload?.id}`, email: decoded.payload?.email };
  } catch (error) {
    return null;
  }
};

export const signOut = async () => {
  cookies().delete("jwt");
  redirect("/sign-in");
};

type TChangePasswordParams = {
  oldPassword: string;
  newPassword: string;
};

export const changePassword = async (
  userId: string,
  { oldPassword, newPassword }: TChangePasswordParams
) => {
  connectToDB();

  try {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new Error("User not found.");
    }

    const isCorrectPassword: Boolean = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isCorrectPassword) {
      throw new Error("Invalid credentials.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error: any) {
    console.log(`Failed to change password: ${error.message}`);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string) => {
  connectToDB();

  try {
    const user = await User.findOne({ email }).select("_id");

    if (!user) {
      throw new Error(`User not found with email : ${email}.`);
    }

    const token = await jwtHelpers.generateToken(
      { id: user._id },
      process.env.JWT_SECRET as string,
      "5m"
    );

    const resetUrl = process.env.LIVE_SITE_URL + `/reset-password/${token}`;

    await sendMail({
      to: email,
      subject: "Echo | Password Reset Link",
      html: generatePasswordResetLinkHtml(resetUrl),
    });

    return { success: true };
  } catch (error: any) {
    console.log(`Failed to send password reset email:`, error);
    throw error;
  }
};

export const resetPassword = async (token: string, password: string) => {
  connectToDB();

  try {
    const decoded = await jwtHelpers.verifyToken(
      token,
      process.env.JWT_SECRET as string
    );

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.findByIdAndUpdate(decoded.payload.id, {
      password: hashedPassword,
    });

    redirect("/sign-in");
  } catch (error: any) {
    console.log(`Failed to reset password: ${error.message}`);
    throw error;
  }
};
