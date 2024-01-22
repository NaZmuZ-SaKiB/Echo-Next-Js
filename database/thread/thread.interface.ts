import { Types } from "mongoose";

export type TThread = {
  _id: Types.ObjectId;
  text: string;
  author: Types.ObjectId;
  community?: Types.ObjectId;
  parentId?: Types.ObjectId;
};
