"use server";

import { startSession } from "mongoose";
import { revalidatePath } from "next/cache";

import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";

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

  const session = await startSession();
  try {
    session.startTransaction();

    const communityObject = await Community.findOne({ id: communityId }).select(
      "_id"
    );

    const communityObjectId = communityObject ? communityObject._id : null;

    const thread = await Thread.create(
      [
        {
          text,
          author,
          community: communityObjectId,
        },
      ],
      { session }
    );

    await User.findByIdAndUpdate(
      author,
      { $push: { threads: thread[0]._id } },
      { session, runValidators: true }
    );

    if (communityId) {
      await Community.findByIdAndUpdate(
        communityObjectId,
        { $push: { threads: thread[0]._id } },
        { session, runValidators: true }
      );
    }

    await session.commitTransaction();
    await session.endSession();

    revalidatePath(path);
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(`Failed to create thread: ${error?.message}`);
  }
};

export const fetchPosts = async (pageNumber = 1, pageSize = 20) => {
  connectToDB();

  const skip = (pageNumber - 1) * pageSize;

  try {
    const postsQuery = Thread.find({
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
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name image",
        },
      });

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skip + posts.length;

    return { posts, isNext };
  } catch (error) {}
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
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name image",
            },
          },
        ],
      })
      .exec();

    return thread;
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

  const session = await startSession();

  try {
    session.startTransaction();

    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Thread not found");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save({ session });

    originalThread.children.push(savedCommentThread._id);
    await originalThread.save({ session });

    await User.findByIdAndUpdate(
      userId,
      { $push: { threads: savedCommentThread._id } },
      { session, runValidators: true }
    );

    await session.commitTransaction();
    await session.endSession();

    revalidatePath(path);
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

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
