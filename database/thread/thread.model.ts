import { Model, Schema, model, models } from "mongoose";
import { TThread } from "./thread.interface";

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

const Thread: Model<TThread> =
  models.Thread || model<TThread>("Thread", threadSchema);

export default Thread;
