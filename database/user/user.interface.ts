import { Types } from "mongoose";

export type TUser = {
  id: string;
  username: string;
  name?: string;
  image?: string;
  bio?: string;
  threads?: Types.ObjectId[];
  onboarded?: boolean;
  communities?: Types.ObjectId[];
};
