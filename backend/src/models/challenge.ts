import mongoose, { Model, Schema, Types } from "mongoose";

export interface IChallenge {
  _id: Types.ObjectId;
  name: string;
  description: string;
  percentage: number;
  participants: Types.ObjectId[];
  completed: Boolean;
  startDate: Date;
  endDate: Date;
  challengeType: string;
}

type ChallengeModel = Model<IChallenge>;

const ChallengeSchema = new Schema<IChallenge, ChallengeModel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  percentage: { type: Number, default: 0, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  completed: { type: Boolean, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  challengeType: { type: String, required: true },
});

export default mongoose.model<IChallenge, ChallengeModel>(
  "Challenge",
  ChallengeSchema
);
