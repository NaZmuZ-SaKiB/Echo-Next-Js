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
                      _id: 1,
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
                _id: 1,
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
                _id: 1,
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
      // {
      //   $skip: skip,
      // },
      // {
      //   $limit: pageSize,
      // },

      // Projecting the final result
      {
        $project: {
          _id: 1,
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

    return threads;
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
                      _id: 1,
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
                            _id: 1,
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
                _id: 1,
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
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          text: 1,
          author: 1,
          replies: 1,
        },
      },
    ]);

    return threads;
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
