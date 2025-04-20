import mongoose, { Model, Schema, Types } from "mongoose";

export interface IFeed {
  username: string;
  content: string;
  createdAt: Date;
}

export interface ICommunity {
  _id: Types.ObjectId;
  name: string;
  description: string;
  members: Types.ObjectId[];
  createdBy: Types.ObjectId;
  feed: IFeed[];
}

type CommunityModel = Model<ICommunity>;

const FeedSchema = new Schema<IFeed>({
  username: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CommunitySchema = new Schema<ICommunity, CommunityModel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  feed: { type: [FeedSchema], default: [] },
});

export default mongoose.model<ICommunity, CommunityModel>(
  "Community",
  CommunitySchema
);
