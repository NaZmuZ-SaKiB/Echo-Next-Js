"use server";

import { Types } from "mongoose";
import Community from "../community/community.model";
import { connectToDB } from "../mongoose";
import Notification from "./notification.model";
import { notificationTypeEnum } from "@/constants";
import Thread from "../thread/thread.model";

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

export const createThreadLikeNotification = async (
  threadId: string,
  userId: string
) => {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId);

    const isLikeNotificationExists = await Notification.findOne({
      type: notificationTypeEnum.LIKED,
      thread: threadId,
    });

    if (!isLikeNotificationExists) {
      await Notification.create({
        type: notificationTypeEnum.LIKED,
        link: `/echo/${threadId}`,
        user: thread?.author,
        peopleCount: 1,
        people: [userId],
        thread: threadId,
      });
    } else {
      const read = (isLikeNotificationExists.peopleCount as number) / 3 === 0;

      await Notification.findByIdAndUpdate(isLikeNotificationExists._id, {
        $inc: { peopleCount: 1 },
        $push: {
          people: {
            $each: [userId],
            $position: 0,
            $slice: 3,
          },
        },
        read: !read,
      });
    }
  } catch (error: any) {
    console.log(`Failed to create thread like notification: ${error?.message}`);
    throw new Error(
      `Failed to create thread like notification: ${error?.message}`
    );
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
      .sort({ updatedAt: -1 });

    return notifications;
  } catch (error: any) {
    console.log(`Failed to get notifications: ${error?.message}`);
  }
};
