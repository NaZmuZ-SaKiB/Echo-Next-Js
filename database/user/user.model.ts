import { Schema, model, models } from "mongoose";
import { TUser } from "./user.interface";

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: false,
    },
    image: String,
    bio: String,
    threads: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thread",
      },
    ],
    onboarded: {
      type: Boolean,
      default: false,
    },
    communities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Community",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = models.User || model<TUser>("User", userSchema);

export default User;
