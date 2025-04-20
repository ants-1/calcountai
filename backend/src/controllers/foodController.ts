import { NextFunction, Request, Response } from "express";
import Food, { IFood } from "../models/food";
import { Types } from "mongoose";
import dotenv from "dotenv";
import formatSpoonacularData from "../utils/formatData";

dotenv.config();

// @desc    Retrieve all foods from database
// @route   GET /api/v1/foods
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

// @desc    Retrieve all foods from Spoonacular API
// @route   GET /api/v1/foods/api
const getAllAPIFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name } = req.query;
    const apiKey = process.env.SPOONACULAR_API_KEY;

    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'name' query parameter." });
    }

    const spoonacularAPIUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${name}&addRecipeNutrition=True`;
    const response = await fetch(spoonacularAPIUrl);

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.statusText}`);
    }
    const data = await response.json();

    const foodData = (data.results || []).map((item: any) =>
      formatSpoonacularData(item)
    );

    if (!foodData) {
      return res.status(404).json({ message: "No food data found." });
    }

    return res.json({ foods: foodData });
  } catch (err) {
    return next(err);
  }
};

// @desc    Retrieve selected food from database
// @route   GET /api/v1/foods/:foodId
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

// @desc    Create new food item and add it to database
// @route   POST /api/v1/foods
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
      protein: req.body.protein || 0,
      fat: req.body.fat || 0,
      carbohydrates: req.body.carbohydrates || 0,
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

// @desc    Update food information
// @route   PUT /api/v1/foods/:foodId
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

// @desc    Delete food from database
// @route   DELETE /foods/:foodId
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

    return res
      .status(200)
      .json({ message: "Food successfully deleted", foodId });
  } catch (err) {
    return next(err);
  }
};

export default {
  getAllFoods,
  getAllAPIFoods,
  getFood,
  createFood,
  updateFood,
  deleteFood,
};
