"use server";

import { FilterQuery, SortOrder, Types, startSession } from "mongoose";

import Community, { CommunityRequest } from "./community.model";
import Thread from "../thread/thread.model";
import User from "../user/user.model";

import { connectToDB } from "@/database/mongoose";
import { revalidatePath } from "next/cache";
import { TCommunity, TCommunityRequestPopulated } from "./community.interface";
import Notification from "../notification/notification.model";
import { notificationTypeEnum } from "@/constants";

type TCreateCommunity = {
  name: string;
  username: string;
  image: string;
  bio: string;
  createdById: string;
};

export const createCommunity = async ({
  name,
  username,
  image,
  bio,
  createdById,
}: TCreateCommunity) => {
  connectToDB();
  const session = await startSession();
  try {
    // Find the user with the provided unique id
    const user = await User.findById(createdById);

    if (!user) {
      throw new Error("User not found");
    }

    session.startTransaction();
    const newCommunity = new Community({
      name,
      username,
      image,
      bio,
      createdBy: user._id,
    });

    const createdCommunity = await newCommunity.save({ session });

    // Update User model
    if (user.communities) {
      user.communities.push(createdCommunity._id);
    } else {
      user.communities = [createdCommunity._id];
    }
    await user.save({ session });

    // commit the transaction
    await session.commitTransaction();
    await session.endSession();

    console.log("Community created successfully", createdCommunity);

    return JSON.stringify(createdCommunity);
  } catch (error: any) {
    // Handle any errors
    console.log("Error creating community:", error);

    await session.abortTransaction();
    await session.endSession();
    throw new Error(error?.message || "Failed to create community");
  }
};

export const getUsersCommunities = async (userId: string) => {
  try {
    connectToDB();

    const communities = await Community.find({
      $or: [
        {
          createdBy: userId,
        },
        {
          members: { $in: [userId] },
        },
      ],
    }).select("_id name image");

    return communities;
  } catch (error) {
    throw new Error("Failed to fetch user communities");
  }
};

export const fetchCommunityInfo = async (id: string) => {
  try {
    connectToDB();

    const communityInfo = await Community.findById(id);

    return communityInfo;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community info:", error);
    throw new Error("Failed to fetch community info");
  }
};

export const fetchCommunityDetails = async (id: string) => {
  try {
    connectToDB();

    const communityDetails = await Community.findById(id).populate([
      "createdBy",
      {
        path: "members",
        model: User,
        select: "name username image _id",
      },
    ]);

    const joinRequests = await CommunityRequest.find({
      communityId: id,
    });

    const joinRequestIds = joinRequests.map((item) => `${item.userId}`);

    const combineData: TCommunity & { requests: string[] } = {
      ...(communityDetails?.toObject() as TCommunity),
      requests: joinRequestIds,
    };

    return combineData;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community details:", error);
    throw error;
  }
};

export const fetchCommunityThreads = async (
  communityId: string,
  pageNumber: number,
  pageSize: number
) => {
  connectToDB();

  const skip = (pageNumber - 1) * pageSize;
  try {
    const totalthreadsCount = await Thread.countDocuments({
      community: communityId,
    });

    const threads = await Thread.aggregate([
      {
        $match: {
          community: new Types.ObjectId(communityId),
        },
      },
      // Lookup for replies
      {
        $lookup: {
          from: "threads",
          let: { threadId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$parentThread", "$$threadId"],
                },
              },
            },
            // Lookup for replies author
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
                pipeline: [
                  {
                    $project: {
                      _id: { $toString: "$_id" },
                      name: 1,
                      image: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: "$author",
            },
            {
              $project: {
                _id: { $toString: "$_id" },
                author: 1,
              },
            },
          ],
          as: "replies",
        },
      },
      // Lookup for likes
      {
        $lookup: {
          from: "likes",
          let: { threadId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$threadId", "$$threadId"],
                },
              },
            },
          ],
          as: "likes",
        },
      },
      // Lookup for author
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
          pipeline: [
            {
              $project: {
                _id: { $toString: "$_id" },
                name: 1,
                image: 1,
              },
            },
          ],
        },
      },
      // Unwind author
      {
        $unwind: "$author",
      },
      // Lookup for community
      {
        $lookup: {
          from: "communities",
          localField: "community",
          foreignField: "_id",
          as: "community",
          pipeline: [
            {
              $project: {
                _id: { $toString: "$_id" },
                name: 1,
                image: 1,
              },
            },
          ],
        },
      },
      // Unwind community
      {
        $unwind: {
          path: "$community",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Pagination
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: pageSize,
      },

      // Projecting the final result
      {
        $project: {
          _id: { $toString: "$_id" },
          text: 1,
          likes: {
            $map: {
              input: "$likes",
              as: "like",
              in: { $toString: "$$like.likedBy" }, // Convert ObjectId to string
            },
          },
          replies: 1,
          author: 1,
          community: {
            $ifNull: ["$community", null],
          },
          createdAt: 1,
        },
      },
    ]);

    const isNext = totalthreadsCount > skip + threads.length;
    // console.log("total", totalthreadsCount);
    // console.log("skip", skip);
    // console.log("isnext", isNext);
    // console.log(threads);

    return { threads: threads, isNext };
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community posts:", error);
    throw error;
  }
};

export const getCommunityThreadsCount = async (communityId: string) => {
  connectToDB();

  try {
    const threadsCount = await Thread.countDocuments({
      community: communityId,
      parentThread: { $in: [undefined, null] },
    });

    return threadsCount;
  } catch (error: any) {
    throw new Error(`Failed to fetch user threads count: ${error?.message}`);
  }
};

export const searchCommunities = async ({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) => {
  try {
    connectToDB();

    // Calculate the number of communities to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof Community> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members");

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await Community.countDocuments(query);

    const communities = await communitiesQuery.exec();

    // Check if there are more communities beyond the current page.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
};

export const addMemberToCommunity = async (
  communityId: string,
  memberId: string
) => {
  try {
    connectToDB();

    // Find the community by its unique id
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    // Find the user by their unique id
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is already a member of the community
    if (community?.members?.includes(user._id)) {
      throw new Error("User is already a member of the community");
    }

    // Add the user's _id to the members array in the community
    if (community.members) {
      community.members.push(user._id);
    } else {
      community.members = [user._id];
    }
    await community.save();

    // Add the community's _id to the communities array in the user
    if (user.communities) {
      user.communities.push(community._id);
    } else {
      user.communities = [community._id];
    }
    await user.save();

    return community;
  } catch (error) {
    // Handle any errors
    console.error("Error adding member to community:", error);
    throw error;
  }
};

export const removeUserFromCommunity = async (
  userId: string,
  communityId: string
) => {
  try {
    connectToDB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error("User not found");
    }

    if (!communityIdObject) {
      throw new Error("Community not found");
    }

    // Remove the user's _id from the members array in the community
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    // Remove the community's _id from the communities array in the user
    await User.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error("Error removing user from community:", error);
    throw error;
  }
};

type TUpdateCommunity = {
  communityId: string;
  name: string;
  username: string;
  image: string;
  bio: string;
};

export const updateCommunityInfo = async ({
  communityId,
  name,
  username,
  image,
  bio,
}: TUpdateCommunity) => {
  try {
    connectToDB();

    // Find the community by its _id and update the information
    const updatedCommunity = await Community.findByIdAndUpdate(communityId, {
      name,
      username,
      image,
      bio,
    });

    if (!updatedCommunity) {
      throw new Error("Community not found");
    }

    revalidatePath("/community/[id]".replace("[id]", communityId));

    return updatedCommunity;
  } catch (error) {
    // Handle any errors
    throw new Error("Failed to update community information");
  }
};

export const deleteCommunity = async (communityId: string) => {
  connectToDB();

  const session = await startSession();
  try {
    session.startTransaction();
    // Find the community by its ID and delete it
    const deletedCommunity = await Community.findOneAndDelete(
      {
        id: communityId,
      },
      { session }
    );

    if (!deletedCommunity) {
      throw new Error("Community not found");
    }

    // Delete all threads associated with the community
    await Thread.deleteMany({ community: communityId }, { session });

    // Find all users who are part of the community
    const communityUsers = await User.find({ communities: communityId }).select(
      "_id"
    );

    // Remove the community from the 'communities' array for each user
    const updateUserPromises = communityUsers.map((user) => {
      User.findByIdAndUpdate(
        user._id,
        {
          $pull: { communities: communityId },
        },
        { session }
      );
    });

    await Promise.all(updateUserPromises);

    await session.commitTransaction();
    await session.endSession();

    return deletedCommunity;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    console.error("Error deleting community: ", error);
    throw error;
  }
};

//* ------------------------------------------------------------ *//
//* --------------- Community Request Actions ------------------ *//
//* ------------------------------------------------------------ *//

export const fetchCommunityJoinRequests = async (communityId: string) => {
  connectToDB();
  try {
    const requests = await CommunityRequest.find({
      communityId,
    }).populate({
      path: "userId",
      model: User,
      select: "_id name image username",
    });

    return requests as unknown as TCommunityRequestPopulated[];
  } catch (error) {
    console.error("Error fetching community requests: ", error);
    throw new Error("Error fetching community requests");
  }
};

export const createCommunityJoinRequest = async (
  communityId: string,
  userId: string
) => {
  try {
    connectToDB();

    const isAlreadyRequested = await CommunityRequest.findOne({
      communityId,
      userId,
    });
    if (isAlreadyRequested) return;

    await CommunityRequest.create({
      communityId,
      userId,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error sending community join request:", error);
    throw new Error("Failed to send join request!");
  }
};

export const cancelCommunityJoinRequest = async (
  communityId: string,
  userId: string
) => {
  try {
    connectToDB();

    await CommunityRequest.findOneAndDelete({
      communityId,
      userId,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error sending community join request:", error);
    throw new Error("Failed to send join request!");
  }
};

export const acceptCommunityJoinRequest = async (
  communityRequestId: string,
  pathName: string
) => {
  connectToDB();
  const session = await startSession();
  try {
    // Checking if request exists
    const joinRequest = await CommunityRequest.findById(communityRequestId);
    if (!joinRequest) {
      throw new Error(
        "Request not found. Try refreshing the page may solve the problem."
      );
    }

    session.startTransaction();

    await Community.findByIdAndUpdate(
      joinRequest?.communityId,
      {
        $addToSet: { members: joinRequest.userId },
      },
      { runValidators: true, session }
    );

    await User.findByIdAndUpdate(joinRequest.userId, {
      $addToSet: { communities: joinRequest.communityId },
    });

    await CommunityRequest.findByIdAndDelete(communityRequestId, { session });

    await session.commitTransaction();
    await session.endSession();

    revalidatePath(pathName);
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    // Handle any errors
    console.error("Error accepting community join request:", error);
    throw new Error("Failed to accept join request!");
  }
};

export const rejectCommunityJoinRequest = async (
  communityRequestId: string,
  pathName: string
) => {
  try {
    connectToDB();

    await CommunityRequest.findByIdAndDelete(communityRequestId);

    revalidatePath(pathName);
  } catch (error) {
    // Handle any errors
    console.error("Error sending community join request:", error);
    throw new Error("Failed to send join request!");
  }
};

export const kickCommunityMember = async (
  communityId: string,
  memberId: string,
  pathName: string
) => {
  try {
    connectToDB();

    await Community.findByIdAndUpdate(
      communityId,
      {
        $pull: { members: memberId },
      },
      { runValidators: true }
    );

    await User.findByIdAndUpdate(
      memberId,
      {
        $pull: { communities: communityId },
      },
      { runValidators: true }
    );

    revalidatePath(pathName);
  } catch (error) {
    // Handle any errors
    console.error("Error kicking community member:", error);
    throw new Error("Failed to kick community member!");
  }
};

export const getInvitedUsersList = async (communityId: string) => {
  connectToDB();

  try {
    const notifications = await Notification.find({
      type: notificationTypeEnum.INVITED,
      communityId: communityId,
    });

    const invitedUsers: string[] = notifications.map(
      (notification) => `${notification.user}`
    );

    return invitedUsers;
  } catch (error: any) {
    throw new Error(`Failed to fetch invited users list: ${error?.message}`);
  }
};
