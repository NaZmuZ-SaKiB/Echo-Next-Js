import { Model, Schema, model, models } from "mongoose";
import { TUser } from "./user.interface";

const userSchema = new Schema<TUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    image: String,
    bio: {
      type: String,
      required: false,
      trim: true,
    },
    onboarded: {
      type: Boolean,
      default: false,
      required: true,
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

const User: Model<TUser> = models.User || model<TUser>("User", userSchema);

export default User;
