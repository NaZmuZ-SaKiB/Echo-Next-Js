import { Types } from "mongoose";

export type TUser = {
  _id: Types.ObjectId;
  id: string;
  username: string;
  name?: string;
  image?: string;
  bio?: string;
  onboarded?: boolean;
  communities?: Types.ObjectId[];
};
