import { FoodType } from '@/types/FoodType';
import { ExerciseType } from '@/types/ExerciseType';

export interface LogType {
  _id: string;
  date: string;
  foods?: FoodType[];
  exercises?: ExerciseType[];
  completed: boolean; 
}