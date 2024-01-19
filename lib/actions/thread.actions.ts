"use server";

import { startSession } from "mongoose";
import { revalidatePath } from "next/cache";

import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

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

    const thread = await Thread.create(
      [
        {
          text,
          author,
          community: null,
        },
      ],
      { session }
    );

    await User.findByIdAndUpdate(
      author,
      { $push: { threads: thread[0]._id } },
      { session, runValidators: true }
    );

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
    // todo: populate community
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
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

    await session.commitTransaction();
    await session.endSession();

    revalidatePath(path);
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(`Failed to add comment to thread: ${error?.message}`);
  }
};
