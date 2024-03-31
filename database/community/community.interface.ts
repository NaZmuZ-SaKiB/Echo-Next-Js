import { Types } from "mongoose";

export type TCommunity = {
  _id?: Types.ObjectId;
  username: string;
  name?: string;
  image?: string;
  bio?: string;
  createdBy: Types.ObjectId;
  members?: Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
};

export type TCommunityRequest = {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  communityId: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
};
