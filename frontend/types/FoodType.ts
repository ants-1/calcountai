export interface FoodType {
  _id: string;
  name: string;
  calories: number;
  numberOfServings?: number;
  servingSize?: number;
  mealType: string;
  protein?: number;
  fat?: number;
  carbohydrates?: number;
}
