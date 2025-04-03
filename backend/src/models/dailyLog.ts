import mongoose, { Model, Schema, Types } from "mongoose";
import "./food"; 
import "./exercise";

export interface IDailyLog {
  _id: Types.ObjectId;
  foods?: Types.ObjectId[];
  protein?: Types.ObjectId;
  fats?: Types.ObjectId;
  carbs?: Types.ObjectId; 
  exercises?: Types.ObjectId[];
  completed?: Boolean;
  date: Date;
}

type DailyLogModel = Model<IDailyLog>;

const DailyLogSchema = new Schema<IDailyLog, DailyLogModel>({
  foods: [{ type: Schema.Types.ObjectId, ref: "Food" }],
  protein: { type: Number },
  fats: { type: Number },
  carbs: { type: Number },
  exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
  completed: { type: Boolean },
  date: { type: Date, required: true, default: Date.now },
});

export default mongoose.model<IDailyLog, DailyLogModel>(
  "DailyLog",
  DailyLogSchema
);
