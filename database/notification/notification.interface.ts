import { Types } from "mongoose";
import { TUser } from "../user/user.interface";
import { TCommunity } from "../community/community.interface";

export type TNotificationType = "liked" | "replied" | "invited";

export type TNotification = {
  _id?: Types.ObjectId;
  type: TNotificationType;
  link: string;
  user: Types.ObjectId;
  people?: Types.ObjectId[];
  read: boolean;
  communityId?: Types.ObjectId;
  accepted?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TNotificationPopulated = {
  _id?: Types.ObjectId;
  type: TNotificationType;
  link: string;
  user: TUser;
  people?: TUser[];
  read: boolean;
  communityId?: TCommunity;
  accepted?: boolean;
  createdAt: string;
  updatedAt: string;
};
