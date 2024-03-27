import { Types } from "mongoose";

export type TCommunity = {
  _id?: Types.ObjectId;
  username: string;
  name?: string;
  image?: string;
  bio?: string;
  createdBy: Types.ObjectId;
  members?: Types.ObjectId[];
};
