import { Model, Schema, model, models } from "mongoose";
import { TCommunity, TCommunityRequest } from "./community.interface";

const communitySchema = new Schema<TCommunity>(
  {
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
  },
  { timestamps: true }
);

const communityRequestSchema = new Schema<TCommunityRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
    },
  },
  { timestamps: true }
);

const Community: Model<TCommunity> =
  models.Community || model<TCommunity>("Community", communitySchema);

export const CommunityRequest: Model<TCommunityRequest> =
  models.CommunityRequest ||
  model<TCommunityRequest>("CommunityRequest", communityRequestSchema);

export default Community;
