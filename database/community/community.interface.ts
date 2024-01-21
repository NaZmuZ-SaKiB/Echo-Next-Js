import { Types } from "mongoose";

export type TCommunity = {
  id: string;
  username: string;
  name?: string;
  image?: string;
  bio?: string;
  createdBy: Types.ObjectId;
  threads: Types.ObjectId[];
  members: Types.ObjectId[];
};
