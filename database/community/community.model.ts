import { Model, Schema, model, models } from "mongoose";
import { TCommunity } from "./community.interface";

const communitySchema = new Schema<TCommunity>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
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
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Community: Model<TCommunity> =
  models.Community || model<TCommunity>("Community", communitySchema);

export default Community;
