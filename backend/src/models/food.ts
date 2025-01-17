import mongoose, { Model, Schema, Types } from "mongoose";

export interface IFood {
  _id: Types.ObjectId;
  name: String;
  calories: Number;
  numberOfServings: Number;
  servingSize: Number;
  mealType: String;
  protein?: Number;
  fat?: Number;
  carbohydrates?: Number;
}

type FoodModel = Model<IFood>;

const FoodSchema = new Schema<IFood, FoodModel>({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  numberOfServings: { type: Number, required: true },
  servingSize: { type: Number, required: true },
  mealType: { type: String, required: true },
  protein: { type: Number },
  fat: { type: Number },
  carbohydrates: { type: Number },
});

export default mongoose.model<IFood, FoodModel>("Food", FoodSchema);
