import mongoose, { Model, Schema, Types } from "mongoose";

export interface IExercise {
  _id: Types.ObjectId;
  name: String;
  duration: Number;
  caloriesBurned: Number;
}

type ExerciseModel = Model<IExercise>;

const ExerciseSchema = new Schema<IExercise, ExerciseModel>({
  name: { type: String, require: true },
  duration: { type: Number, require: true },
  caloriesBurned: { type: Number, require: true },
});

export default mongoose.model<IExercise, ExerciseModel>(
  "Exercise",
  ExerciseSchema
);
