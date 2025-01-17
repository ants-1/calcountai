import mongoose, { Model, Schema, Types } from "mongoose";

export interface IReward {
  _id: Types.ObjectId;
  name: string;
  description: string;
  user: Types.ObjectId;
  achieved: boolean;
}

type RewardModel = Model<IReward>;

const RewardSchema = new Schema<IReward, RewardModel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  achieved: { type: Boolean, default: false },
});

export default mongoose.model<IReward, RewardModel>("Reward", RewardSchema);
