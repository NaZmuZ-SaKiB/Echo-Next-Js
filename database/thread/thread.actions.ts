"use server";

import { Types, startSession } from "mongoose";
import { revalidatePath } from "next/cache";

import { connectToDB } from "@/database/mongoose";
import User from "@/database/user/user.model";
import Thread from "@/database/thread/thread.model";
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

export const fetchThreads = async (pageNumber = 1, pageSize = 20) => {
  connectToDB();

  const skip = (pageNumber - 1) * pageSize;

  try {
    const threadsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "community",
        model: Community,
      });

    const totalthreadsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const threads = await threadsQuery.exec();

    const replies = await Thread.find({
      parentId: { $in: threads.map((thread) => thread._id) },
    }).populate({
      path: "author",
      model: User,
      select: "_id id name image",
    });

    const threadsWithReplies = threads.map((thread) => {
      const threadReplies = replies.filter(
        (reply) => reply.parentId.toString() === thread._id.toString()
      );
      return {
        ...thread.toObject(),
        replies: threadReplies,
      };
    });

    const isNext = totalthreadsCount > skip + threads.length;

    return { threads: threadsWithReplies, isNext };
  } catch (error) {}
};

export const fetchUserThreads = async (userId: Types.ObjectId) => {
  connectToDB();
  try {
    const threads = await Thread.find({
      author: userId,
      parentId: { $in: [undefined, null] },
    })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      });
    const replies = await Thread.find({
      parentId: { $in: threads.map((thread) => thread._id) },
    }).populate({
      path: "author",
      model: User,
      select: "_id id name image",
    });

    const threadsWithReplies = threads.map((thread) => {
      const threadReplies = replies.filter(
        (reply) => reply.parentId.toString() === thread._id.toString()
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

export const fetchUsersReplies = async (userId: Types.ObjectId) => {
  connectToDB();
  try {
    const threads = await Thread.find({
      author: userId,
      parentId: { $in: [undefined, null] },
    }).select("_id");

    const replyThreads = await Thread.find({
      parentId: { $in: threads.map((thread) => thread._id) },
    })
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "parentId",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "_id id name image",
        },
      });

    const repliesOfReplyThreads = await Thread.find({
      parentId: { $in: replyThreads.map((thread) => thread._id) },
    }).populate({
      path: "author",
      model: User,
      select: "_id id name image",
    });

    const replyThreadsWithReplies = replyThreads.map((singleReplyThread) => {
      const threadReplies = repliesOfReplyThreads.filter(
        (reply) =>
          reply.parentId.toString() === singleReplyThread._id.toString()
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
        select: "_id id name image",
      })
      .exec();

    const replies = await Thread.find({
      parentId: thread._id,
    }).populate({
      path: "author",
      model: User,
      select: "_id id name image",
    });

    const replyToAllReplies = await Thread.find({
      parentId: { $in: replies.map((reply) => reply._id) },
    }).populate({
      path: "author",
      model: User,
      select: "_id id name image",
    });

    const threadWithReplies = {
      ...thread.toObject(),
      replies: replies.map((reply) => {
        const repliesToReply = replyToAllReplies.filter(
          (replyToReply) =>
            replyToReply.parentId.toString() === reply._id.toString()
        );
        return {
          ...reply.toObject(),
          replies: repliesToReply,
        };
      }),
    };

    return threadWithReplies;
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
      parentId: threadId,
    });

    await commentThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to add comment to thread: ${error?.message}`);
  }
};

const fetchAllChildThreads = async (threadId: string): Promise<any[]> => {
  const childThreads = await Thread.find({ parentId: threadId }).populate(
    "author community"
  );

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
};

export const deleteThread = async (id: string, path: string) => {
  connectToDB();

  const session = await startSession();

  try {
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    const descendantThreads = await fetchAllChildThreads(id);

    const threadsIdsToDelete = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    const uniqueAuthorIds = new Set(
      [
        mainThread?.author?._id?.toString(),
        ...descendantThreads.map((thread) => thread?.author?._id?.toString()),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        mainThread?.community?._id?.toString(),
        ...descendantThreads.map((thread) => thread.community?._id?.toString()),
      ].filter((id) => id !== undefined)
    );

    // * Main Transaction with DB starts here

    session.startTransaction();

    await Thread.deleteMany({ _id: { $in: threadsIdsToDelete } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: threadsIdsToDelete } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: threadsIdsToDelete } } }
    );

    await session.commitTransaction();
    await session.endSession();

    revalidatePath(path);
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(`Failed to delete thread: ${error?.message}`);
  }
};
