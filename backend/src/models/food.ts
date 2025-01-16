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
  name: { type: String, require: true },
  calories: { type: Number, require: true },
  numberOfServings: { type: Number, require: true },
  servingSize: { type: Number, require: true },
  mealType: { type: String, require: true },
  protein: { type: Number },
  fat: { type: Number },
  carbohydrates: { type: Number },
});

export default mongoose.model<IFood, FoodModel>("Food", FoodSchema);
