import mongoose, { Model, Schema, Types } from "mongoose";

export interface IParticipant {
  user: Types.ObjectId;
  progress: number;
}

export interface IChallenge {
  _id: Types.ObjectId;
  name: string;
  level: number;
  description: string;
  participants: IParticipant[];
  completed: Boolean;
  challengeType: "Streak" | "Meal" | "Activity" | "Goal" ;
}

type ChallengeModel = Model<IChallenge>;

const ParticipantSchema = new Schema<IParticipant>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  progress: { type: Number, default: 0, required: true },
});

const ChallengeSchema = new Schema<IChallenge, ChallengeModel>({
  name: { type: String, required: true },
  level: { type: Number, required: true },
  description: { type: String, required: true },
  participants: { type: [ParticipantSchema], default: [] },
  completed: { type: Boolean, required: true },
  challengeType: {
    type: String,
    enum: ["Streak", "Meal", "Activity", "Goal"],
    required: true,
  },
});

export default mongoose.model<IChallenge, ChallengeModel>(
  "Challenge",
  ChallengeSchema
);
