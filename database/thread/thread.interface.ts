import { Types } from "mongoose";

export type TThread = {
  text: string;
  author: Types.ObjectId;
  community?: Types.ObjectId;
  parentId?: Types.ObjectId;
  children?: Types.ObjectId[];
};