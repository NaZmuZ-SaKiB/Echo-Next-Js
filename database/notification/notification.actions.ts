"use server";

import { Types } from "mongoose";
import Community from "../community/community.model";
import { connectToDB } from "../mongoose";
import Notification from "./notification.model";

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
      user: userId,
      communityId: communityId,
    });

    if (isAlreadyInvited) {
      await Notification.findByIdAndDelete(isAlreadyInvited?._id);
    }

    await Notification.create({
      link: `/communities/${communityId}`,
      user: userId,
      communityId: communityId,
    });
  } catch (error: any) {
    throw new Error(`Failed to send invitation: ${error?.message}`);
  }
};
