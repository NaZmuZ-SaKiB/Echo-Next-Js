"use server";

import { Types } from "mongoose";
import Community from "../community/community.model";
import { connectToDB } from "../mongoose";
import Notification from "./notification.model";
import { notificationTypeEnum } from "@/constants";

export const createCommunityInvitationNotification = async (
  communityId: string,
  userId: string
) => {
  connectToDB();

  try {
    const community = await Community.findById(communityId);
    if (community?.members?.includes(new Types.ObjectId(userId))) {
      return;
    }

    const isAlreadyInvited = await Notification.findOne({
      type: notificationTypeEnum.INVITED,
      user: userId,
      communityId: communityId,
    });

    if (isAlreadyInvited) {
      await Notification.findByIdAndDelete(isAlreadyInvited?._id);
    }

    await Notification.create({
      type: notificationTypeEnum.INVITED,
      link: `/communities/${communityId}`,
      user: userId,
      communityId: communityId,
    });
  } catch (error: any) {
    throw new Error(`Failed to send invitation: ${error?.message}`);
  }
};

export const readNotification = async (notificationId: string) => {
  connectToDB();

  try {
    await Notification.findByIdAndUpdate(notificationId, {
      read: true,
    });
  } catch (error: any) {
    console.log(`Failed to read notification: ${error?.message}`);
  }
};

export const getMyNotifications = async (userId: string) => {
  connectToDB();

  try {
    const notifications = await Notification.find({
      user: userId,
    })
      .populate("communityId people")
      .sort({ createdAt: -1 });

    return notifications;
  } catch (error: any) {
    console.log(`Failed to get notifications: ${error?.message}`);
  }
};
