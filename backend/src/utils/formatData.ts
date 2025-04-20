import { Types } from "mongoose";

const formatSpoonacularData = (data: any) => {
  const nutrients = data.nutrition?.nutrients || [];
  const getNutrient = (name: string) =>
    nutrients.find((n: any) => n.name === name)?.amount ?? 0;

  return {
    _id: new Types.ObjectId(),
    name: data.title,
    calories: Number(getNutrient("Calories").toFixed(0)),
    numberOfServings: 1,
    servingSize: data.servings,
    protein: Number(getNutrient("Protein").toFixed(2)),
    fat: Number(getNutrient("Fat").toFixed(2)),
    carbohydrates: Number(getNutrient("Carbohydrates").toFixed(2)),
  };
}

export default formatSpoonacularData;