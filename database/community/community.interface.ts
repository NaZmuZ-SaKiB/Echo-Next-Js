import { Types } from "mongoose";
import { TUser } from "../user/user.interface";

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

export type TCommunityRequestPopulated = {
  _id?: Types.ObjectId;
  userId: TUser;
  communityId: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
};
