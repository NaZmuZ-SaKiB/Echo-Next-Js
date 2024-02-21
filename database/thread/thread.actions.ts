"use server";

import { startSession } from "mongoose";
import { revalidatePath } from "next/cache";

import { connectToDB } from "@/database/mongoose";
import User from "@/database/user/user.model";
import Thread, { Like } from "@/database/thread/thread.model";
import Community from "@/database/community/community.model";

type TCreateThreadParams = {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
};

type TCreateCommentParams = {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
};

export const createThread = async ({
  text,
  author,
  communityId,
  path,
}: TCreateThreadParams) => {
  connectToDB();

  try {
    const communityObject = await Community.findOne({ id: communityId }).select(
      "_id"
    );

    const communityObjectId = communityObject ? communityObject._id : null;

    await Thread.create({
      text,
      author,
      community: communityObjectId,
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error?.message}`);
  }
};

export const fetchThreads = async (pageNumber: number, pageSize: number) => {
  connectToDB();

  const skip = (pageNumber - 1) * pageSize;

  try {
    const totalthreadsCount = await Thread.countDocuments({
      parentThread: { $in: [null, undefined] },
    });

    const threads = await Thread.aggregate([
      {
        $match: { parentThread: { $in: [null, undefined] } },
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
                text: 1,
                author: 1,
                community: { $toString: "$community" },
                parentThread: { $toString: "$parentThread" },
                createdAt: 1,
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
    throw new Error(`Failed to fetch threads : ${error.message}`);
  }
};

export const fetchThreadById = async (id: string) => {
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
      })
      .exec();

    if (!thread) {
      throw new Error(`Faild to fetch thread. Thread not found`);
    }

    const mainThreadLikes = await Like.find({
      threadId: thread._id,
    }).exec();

    const mainThreadWithLikes = {
      ...thread.toObject(),
      likes: mainThreadLikes.map((like) => like.likedBy.toString()),
    };

    const replies = await Thread.find({
      parentThread: thread._id,
    }).populate({
      path: "author",
      model: User,
      select: "_id id name image",
    });

    const replyLikes = await Like.find({
      threadId: { $in: replies.map((reply) => reply._id) },
    }).exec();

    const repliesWithLikes = replies.map((reply) => {
      const likes = replyLikes
        .filter((like) => like.threadId.toString() === reply._id.toString())
        .map((like) => like.likedBy.toString());
      return {
        ...reply.toObject(),
        likes,
      };
    });

    const nestedReplies = await Thread.find({
      parentThread: { $in: replies.map((reply) => reply._id) },
    }).populate({
      path: "author",
      model: User,
      select: "_id id name image",
    });

    const mainThreadWithReplies = {
      ...mainThreadWithLikes,
      replies: repliesWithLikes.map((reply) => {
        const repliesToReply = nestedReplies.filter(
          (replyToReply) =>
            replyToReply.parentThread!.toString() === reply._id.toString()
        );
        return {
          ...reply,
          replies: repliesToReply,
        };
      }),
    };

    return mainThreadWithReplies;
  } catch (error: any) {
    throw new Error(`Failed to fetch thread: ${error?.message}`);
  }
};

export const addCommentToThread = async ({
  threadId,
  commentText,
  userId,
  path,
}: TCreateCommentParams) => {
  connectToDB();

  try {
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Thread not found");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentThread: threadId,
    });

    await commentThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to add comment to thread: ${error?.message}`);
  }
};

const fetchAllChildThreads = async (threadId: string): Promise<any[]> => {
  const childThreads = await Thread.find({ parentThread: threadId })
    .populate("author")
    .populate({
      path: "community",
      model: Community,
    });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id.toString());
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
};

export const deleteThread = async (id: string, path: string) => {
  connectToDB();

  const session = await startSession();

  try {
    const mainThread = await Thread.findById(id).populate("author").populate({
      path: "community",
      model: Community,
    });

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    const descendantThreads = await fetchAllChildThreads(id);

    const threadsIdsToDelete = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    let likeIdsToDelete: string[];

    const likes = await Like.find({
      threadId: { $in: threadsIdsToDelete },
    }).exec();

    if (likes.length) {
      likeIdsToDelete = likes.map((like) => like._id.toString());
    } else {
      likeIdsToDelete = [];
    }

    // * Main Transaction with DB starts here

    session.startTransaction();

    await Thread.deleteMany({ _id: { $in: threadsIdsToDelete } });

    await Like.deleteMany({ _id: { $in: likeIdsToDelete } });

    await session.commitTransaction();
    await session.endSession();

    revalidatePath(path);

    return { success: true };
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(`Failed to delete thread: ${error?.message}`);
  }
};

//* ------------------------------------------------ *//
//* --------------- Like Actions ------------------ *//
//* ------------------------------------------------ *//

export const handleLikeTherad = async (
  threadId: string,
  userId: string,
  pathname: string
) => {
  connectToDB();

  try {
    const like = await Like.findOne({
      threadId,
      likedBy: userId,
    });

    if (like) {
      await like.deleteOne();

      if (pathname !== "/") {
        revalidatePath(pathname);
      }
      return { liked: false };
    } else {
      await Like.create({
        likedBy: userId,
        threadId,
      });

      if (pathname !== "/") {
        revalidatePath(pathname);
      }
      return { liked: true };
    }
  } catch (error: any) {
    throw new Error(`Failed to like thread: ${error?.message}`);
  }
};
