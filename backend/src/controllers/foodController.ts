import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user";
import Food, { IFood } from "../models/food";
import { Types } from "mongoose";

// GET /foods
const getAllFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const foods: IFood[] | null = await Food.find().exec();

    if (!foods || foods.length == 0) {
      return res.status(404).json({ message: "No foods found" });
    }

    return res.status(200).json({ foods });
  } catch (err) {
    return next(err);
  }
};

// GET /foods/:foodId
const getFood = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { foodId } = req.params;

    if (!Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ error: "Invalid food ID" });
    }

    const food: IFood | null = await Food.findById(foodId).exec();

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    return res.status(200).json({ food });
  } catch (err) {
    next(err);
  }
};

// POST /foods
const createFood = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const newFood = new Food({
      name: req.body.name,
      calories: req.body.calories,
      numberOfServings: req.body.numberOfServings,
      servingSize: req.body.servingSize,
      mealType: req.body.mealType,
      protein: req.body.protein || null,
      fat: req.body.fat || null,
      carbohydrates: req.body.carbohydrates || null,
    });

    if (!newFood) {
      return res.status(404).json({ error: "Unable to create food item" });
    }

    await newFood.save();

    return res.status(200).json({ newFood });
  } catch (err) {
    return next(err);
  }
};

// PUT /foods/:foodId
const updateFood = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { foodId } = req.params;
    const updatedData = req.body;

    if (!Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ error: "Invalid food ID" });
    }

    const updatedFood = await Food.findByIdAndUpdate(foodId, updatedData, {
      new: true,
    });

    if (!updatedFood) {
      return res.status(404).json({ error: "Food not found" });
    }

    return res.status(200).json({ updatedFood });
  } catch (err) {
    return next(err);
  }
};

// DELETE /foods/:foodId
const deleteFood = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { foodId } = req.params;

    if (!Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ error: "Invalid food ID" });
    }

    const deletedFood = await Food.findByIdAndDelete(foodId);

    if (!deletedFood) {
        return res.status(404).json({ error: "Food not found" });
    }

    return res.status(200).json({ message: "Food successfully deleted", foodId })
  } catch (err) {
    return next(err);
  }
};

export default {
  getAllFoods,
  getFood,
  createFood,
  updateFood,
  deleteFood,
};
