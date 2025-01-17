import mongoose, { Model, Schema, Types } from "mongoose";
import "./food"; 
import "./exercise";

export interface IDailyLog {
  _id: Types.ObjectId;
  foods?: Types.ObjectId[];
  exercises?: Types.ObjectId[];
  completed: Boolean;
  date: Date;
}

type DailyLogModel = Model<IDailyLog>;

const DailyLogSchema = new Schema<IDailyLog, DailyLogModel>({
  foods: [{ type: Schema.Types.ObjectId, ref: "Food" }],
  exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
  completed: { type: Boolean, require: true },
  date: { type: Date, require: true },
});

export default mongoose.model<IDailyLog, DailyLogModel>(
  "DailyLog",
  DailyLogSchema
);
