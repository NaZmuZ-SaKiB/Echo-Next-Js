"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";

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

export const fetchUserPosts = async (userId: string) => {
  connectToDB();
  try {
    const threads = await User.findOne({
      id: userId,
      parentId: { $in: [undefined, null] },
    }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "id name image _id",
          },
        },
      ],
    });

    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error?.message}`);
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
  connectToDB();

  try {
    const userThreads = await Thread.find({ author: userId });

    const childThreadIds = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "id name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch user activity: ${error?.message}`);
  }
};
