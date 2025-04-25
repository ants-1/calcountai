import mongoose, { Model, Schema, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  gender?: string;
  goal?: [string];
  currentWeight?: Number;
  targetWeight?: Number;
  activityLevel?: string;
  weightHistory?: { weight: number; date: Date }[];
  calories?: Number;
  height?: string;
  dateOfBirth?: string;
  streak?: Number;
  dailyLogs?: Types.ObjectId[];
  challenges?: Types.ObjectId[];
}

type UserModel = Model<IUser>;

const UserSchema = new Schema<IUser, UserModel>({
  username: { type: String, minlength: 1, maxlength: 100, required: true },
  email: { type: String, maxlength: 256, required: true, unique: true },
  password: { type: String },
  gender: { type: String },
  goal: { type: [String] },
  currentWeight: { type: Number },
  targetWeight: { type: Number },
  activityLevel: { type: String },
  weightHistory: [
    {
      weight: { type: Number },
      date: { type: Date, default: Date.now },
    },
  ],
  calories: { type: Number},
  height: { type: String },
  dateOfBirth: { type: String },
  streak: { type: Number },
  dailyLogs: [{ type: Schema.Types.ObjectId, ref: "DailyLog" }],
  challenges: [{ type: Schema.Types.ObjectId, ref: "Challenge" }],
});

export default mongoose.model<IUser, UserModel>("User", UserSchema);
