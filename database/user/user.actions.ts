"use server";

import { revalidatePath } from "next/cache";
import { FilterQuery, PipelineStage, SortOrder, Types } from "mongoose";

import { connectToDB } from "@/database/mongoose";
import User from "@/database/user/user.model";
import Community from "@/database/community/community.model";
import Thread, { Like } from "../thread/thread.model";

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
    await User.findByIdAndUpdate(
      userId,
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { runValidators: true, new: true }
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

    const user = await User.findById(userId).populate({
      path: "communities",
      model: Community,
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error: any) {
    console.log(`Failed to fetch user: ${error?.message}`);
    return null;
  }
};

export const fetchUserThreads = async (
  userId: string,
  pageNumber: number,
  pageSize: number
) => {
  connectToDB();

  const skip = (pageNumber - 1) * pageSize;
  try {
    const totalthreadsCount = await Thread.countDocuments({
      author: userId,
      parentThread: { $in: [null, undefined] },
    });

    const threads = await Thread.aggregate([
      {
        $match: {
          parentThread: { $in: [null, undefined] },
          author: new Types.ObjectId(userId),
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
                      id: 1,
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
                id: 1,
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
                id: 1,
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

    return { threads: threads, isNext };
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

export const fetchUsersReplies = async (
  userId: string,
  pageNumber: number,
  pageSize: number
) => {
  connectToDB();

  const skip = (pageNumber - 1) * pageSize;
  try {
    const usersAllThreads = await Thread.find({
      author: userId,
      parentThread: { $in: [null, undefined] },
    })
      .select("_id")
      .exec();

    const usersAllIds = usersAllThreads.map((thread) => thread._id);

    const totalthreadsCount = await Thread.countDocuments({
      parentThread: { $in: usersAllIds },
    });

    const threads = await Thread.aggregate([
      {
        $match: {
          author: new Types.ObjectId(userId),
          parentThread: { $in: [undefined, null] },
        },
      },
      // lookup for author
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
                id: 1,
                name: 1,
                image: 1,
              },
            },
          ],
        },
      },
      // unwind author
      {
        $unwind: "$author",
      },
      // lookup for main replies
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
                      id: 1,
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
            // Lookup for replies likes
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
            // lookup for nested replies
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
                  // Lookup for nested replies author
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
                            id: 1,
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
                ],
                as: "replies",
              },
            },
            {
              $project: {
                _id: { $toString: "$_id" },
                author: 1,
                text: 1,
                replies: 1,
                likes: {
                  $map: {
                    input: "$likes",
                    as: "like",
                    in: { $toString: "$$like.likedBy" }, // Convert ObjectId to string
                  },
                },
                createdAt: 1,
              },
            },
          ],
          as: "replies",
        },
      },
      // filter out threads with no replies
      {
        $match: { replies: { $ne: [] } },
      },
      // sorting
      {
        $unwind: "$replies",
      },
      {
        $sort: { "replies.createdAt": -1 },
      },
      // pagination
      {
        $skip: skip,
      },
      {
        $limit: pageSize,
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          text: 1,
          author: 1,
          replies: 1,
        },
      },
    ]);

    const isNext = totalthreadsCount > skip + threads.length;

    return { threads: threads, isNext };
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
      _id: { $ne: userId },
      onboarded: true,
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
        { email: { $regex: regex } },
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
