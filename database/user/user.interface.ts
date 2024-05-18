import { Types } from "mongoose";

export type TUser = {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  username: string;
  name?: string;
  image?: string;
  bio?: string;
  onboarded?: boolean;
  communities?: Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
};
