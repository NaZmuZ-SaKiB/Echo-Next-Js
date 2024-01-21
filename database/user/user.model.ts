import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
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

const User = models.User || model("User", userSchema);

export default User;
