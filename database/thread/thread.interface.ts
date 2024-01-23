import { Types } from "mongoose";

export type TThread = {
  _id?: Types.ObjectId;
  text: string;
  author: Types.ObjectId;
  community?: Types.ObjectId;
  parentThread?: Types.ObjectId;
  createdAt?: string;
};

export type TLike = {
  _id?: Types.ObjectId;
  threadId: Types.ObjectId;
  likedBy: Types.ObjectId;
};
