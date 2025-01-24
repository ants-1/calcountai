import mongoose, { Model, Schema, Types } from "mongoose";

export interface ICommunity {
  _id: Types.ObjectId;
  name: string;
  description: string;
  members: Types.ObjectId[];
  createdBy: Types.ObjectId;
  challenges: Types.ObjectId[];
}

type CommunityModel = Model<ICommunity>;

const CommunitySchema = new Schema<ICommunity, CommunityModel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  challenges: [{ type: Schema.Types.ObjectId, ref: "Challenge" }]
});

export default mongoose.model<ICommunity, CommunityModel>(
  "Community",
  CommunitySchema
);
