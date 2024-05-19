import { Model, Schema, model, models } from "mongoose";
import { TNotification } from "./notification.interface";
import { notificationTypeEnum } from "@/constants";

const notificationSchema = new Schema<TNotification>(
  {
    type: {
      type: String,
      enum: notificationTypeEnum,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    people: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    peopleCount: {
      type: Number,
    },
    read: {
      type: Boolean,
      default: false,
    },
    thread: {
      type: Schema.Types.ObjectId,
      ref: "Thread",
    },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
    },
    accepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification: Model<TNotification> =
  models.Notification ||
  model<TNotification>("Notification", notificationSchema);

export default Notification;
