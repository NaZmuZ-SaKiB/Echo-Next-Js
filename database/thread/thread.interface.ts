import { Types } from "mongoose";
import { TUser } from "../user/user.interface";
import { TCommunity } from "../community/community.interface";

export type TThread = {
  _id?: Types.ObjectId;
  text: string;
  author: Types.ObjectId;
  community?: Types.ObjectId;
  parentThread?: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
};

export type TLike = {
  _id?: Types.ObjectId;
  threadId: Types.ObjectId;
  likedBy: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
};

export type TThreadPopulated = {
  _id: Types.ObjectId;
  text: string;
  author: TUser;
  community?: TCommunity | null;
  parentThread?: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
};

export type TThreadProfilePage = {
  _id: Types.ObjectId;
  text: string;
  likes: string[];
  replies: TThreadPopulated[];
  author: TUser;
  community: TCommunity | null;
  createdAt: string;
  updatedAt: string;
};
