import { Types } from "mongoose";

export type TCommunity = {
  _id: Types.ObjectId;
  id: string;
  username: string;
  name?: string;
  image?: string;
  bio?: string;
  createdBy: Types.ObjectId;
  threads: Types.ObjectId[];
  members: Types.ObjectId[];
};
