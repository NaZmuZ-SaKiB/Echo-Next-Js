import { Model, Schema, model, models } from "mongoose";
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
