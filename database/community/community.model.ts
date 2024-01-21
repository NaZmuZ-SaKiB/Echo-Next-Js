import { Schema, model, models } from "mongoose";
import { TCommunity } from "./community.interface";

const communitySchema = new Schema<TCommunity>({
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
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  threads: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Community =
  models.Community || model<TCommunity>("Community", communitySchema);

export default Community;
