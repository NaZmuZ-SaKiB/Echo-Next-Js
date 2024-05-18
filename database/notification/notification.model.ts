import { Model, Schema, model, models } from "mongoose";
import { TNotification } from "./notification.interface";

const notificationSchema = new Schema<TNotification>(
  {
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
    read: {
      type: Boolean,
      default: false,
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
