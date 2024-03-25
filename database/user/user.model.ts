import { Model, Schema, model, models } from "mongoose";
import { TUser } from "./user.interface";

const userSchema = new Schema<TUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    image: String,
    bio: String,
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

const User: Model<TUser> = models.User || model<TUser>("User", userSchema);

export default User;
