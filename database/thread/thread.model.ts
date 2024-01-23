import { Model, Schema, model, models } from "mongoose";
import { TLike, TThread } from "./thread.interface";

const threadSchema = new Schema<TThread>(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
    },
    parentThread: {
      type: Schema.Types.ObjectId,
      ref: "Thread",
    },
  },
  {
    timestamps: true,
  }
);

const likeSchema = new Schema<TLike>(
  {
    threadId: {
      type: Schema.Types.ObjectId,
      ref: "Thread",
      required: true,
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Thread: Model<TThread> =
  models.Thread || model<TThread>("Thread", threadSchema);

export const Like: Model<TLike> =
  models.Like || model<TLike>("Like", likeSchema);

export default Thread;
