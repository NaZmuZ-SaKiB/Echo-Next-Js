"use server";

import { revalidatePath } from "next/cache";
import { FilterQuery, SortOrder } from "mongoose";

import { connectToDB } from "@/database/mongoose";
import User from "@/database/user/user.model";
import Community from "@/database/community/community.model";
import Thread from "../thread/thread.model";

type TUpdateUserParams = {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
};

type TSearchUseresParams = {
  userId: string;
  searchString?: string;
  pageNumber: number;
  pageSize: number;
  sortBy: SortOrder;
};

export const updateUser = async ({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: TUpdateUserParams): Promise<void> => {
  connectToDB();
  try {
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true, new: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error?.message}`);
  }
};

export const fetchUser = async (userId: string) => {
  try {
    connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error?.message}`);
  }
};

export const fetchUserThreads = async (userId: string) => {
  connectToDB();
  try {
    const threads = await Thread.find({
      author: userId,
      parentThread: { $in: [undefined, null] },
    })
      .populate({
        path: "community",
        model: Community,
      })
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      });
    const replies = await Thread.find({
      parentThread: { $in: threads.map((thread) => thread._id) },
    }).populate({
      path: "author",
      model: User,
      select: "_id id name image",
    });

    const threadsWithReplies = threads.map((thread) => {
      const threadReplies = replies.filter(
        (reply) => reply.parentThread!.toString() === thread._id.toString()
      );
      return {
        ...thread.toObject(),
        replies: threadReplies,
      };
    });

    return threadsWithReplies;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error?.message}`);
  }
};

export const getUserThreadsCount = async (userId: string) => {
  connectToDB();

  try {
    const threadsCount = await Thread.countDocuments({
      author: userId,
      parentThread: { $in: [undefined, null] },
    });

    return threadsCount;
  } catch (error: any) {
    throw new Error(`Failed to fetch user threads count: ${error?.message}`);
  }
};

export const fetchUsersReplies = async (userId: string) => {
  connectToDB();
  try {
    const threads = await Thread.find({
      author: userId,
      parentThread: { $in: [undefined, null] },
    }).select("_id");

    const replyThreads = await Thread.find({
      parentThread: { $in: threads.map((thread) => thread._id) },
      author: { $ne: userId },
    })
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "parentThread",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "_id id name image",
        },
      });

    const repliesOfReplyThreads = await Thread.find({
      parentThread: { $in: replyThreads.map((thread) => thread._id) },
    }).populate({
      path: "author",
      model: User,
      select: "_id id name image",
    });

    const replyThreadsWithReplies = replyThreads.map((singleReplyThread) => {
      const threadReplies = repliesOfReplyThreads.filter(
        (reply) =>
          reply.parentThread!.toString() === singleReplyThread._id.toString()
      );
      return {
        ...singleReplyThread.toObject(),
        replies: threadReplies,
      };
    });

    return replyThreadsWithReplies;
  } catch (error: any) {
    throw new Error(`Failed to fetch user replies: ${error?.message}`);
  }
};

export const searchUsers = async ({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: TSearchUseresParams) => {
  connectToDB();
  const skip = (pageNumber - 1) * pageSize;

  try {
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNextPage = totalUsersCount > skip + users.length;

    return { users, isNextPage };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error?.message}`);
  }
};

export const getUserActivity = async (userId: string) => {
  // connectToDB();

  // try {
  //   const userThreads = await Thread.find({ author: userId });

  //   const childThreadIds = userThreads.reduce((acc, thread) => {
  //     return acc.concat(thread.children);
  //   }, []);

  //   const replies = await Thread.find({
  //     _id: { $in: childThreadIds },
  //     author: { $ne: userId },
  //   })
  //     .populate({
  //       path: "author",
  //       model: User,
  //       select: "id name image _id",
  //     })
  //     .populate({
  //       path: "parentThread",
  //       model: Thread,
  //       populate: [
  //         {
  //           path: "author",
  //           model: User,
  //         },
  //         {
  //           path: "children",
  //           model: Thread,
  //           populate: {
  //             path: "author",
  //             model: User,
  //             select: "id name image _id",
  //           },
  //         },
  //       ],
  //     });
  //   return replies;
  // } catch (error: any) {
  //   throw new Error(`Failed to fetch user activity: ${error?.message}`);
  // }

  return [];
};
