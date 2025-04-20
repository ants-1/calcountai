import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user";
import DailyLog, { IDailyLog } from "../models/dailyLog";
import Food from "../models/food";
import Exercise from "../models/exercise";
import { Types } from "mongoose";

// @desc    Retrieve all daily logs for user
// @route   GET /api/v1/users/:userId/dailyLogs
const getAllDailyLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId).populate({
      path: "dailyLogs",
      populate: [
        { path: "foods", model: "Food" },
        { path: "exercises", model: "Exercise" },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.dailyLogs || user.dailyLogs.length === 0) {
      return res.status(404).json({ message: "No daily logs found" });
    }

    return res.status(200).json({ dailyLogs: user.dailyLogs });
  } catch (err) {
    return next(err);
  }
};

// @desc    Get daily log for user
// @route   GET /api/v1/users/:userId/dailyLogs/:dailyLogId
const getDailyLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId, dailyLogId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user: IUser | null = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const dailyLog: IDailyLog | null = await DailyLog.findById(dailyLogId)
      .populate([
        { path: "foods", model: "Food" },
        { path: "exercises", model: "Exercise" },
      ])
      .exec();

    if (!dailyLog) {
      return res.status(404).json({ error: "Daily log not found" });
    }

    return res.status(200).json({ dailyLog });
  } catch (err) {
    next(err);
  }
};

// @desc    Get streak number
// @route   GET /api/v1/users/:userId/streaks
const getStreaks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = await User.findById(userId).populate({
      path: "dailyLogs",
      select: "date",
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.dailyLogs || user.dailyLogs.length === 0) {
      res.status(200).json({ streak: 0 });
      return;
    }

    const sortedLogs = user.dailyLogs
      .map((log) => ({
        _id: log._id,
        date: (log as unknown as IDailyLog).date,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let streak = 0;
    let prevDate: Date | null = null;
    const today = new Date();

    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      if (prevDate) {
        const diffDays = Math.floor(
          (logDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays > 1) {
          streak = 0;
        }
      }
      streak++;
      prevDate = logDate;
    }

    if (
      !prevDate ||
      (today.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24) > 1
    ) {
      streak = 0;
    }

    res.status(200).json({ streak });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new daily log
// @route   POST /api/v1/users/:userId/dailyLogs
const createDailyLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId } = req.params;
    const { foods, exercises, completed, date } = req.body;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const dailyLog = await DailyLog.create({
      foods,
      protein: 0,
      fats: 0,
      carbs: 0,
      exercises,
      completed,
      date,
    });

    user.dailyLogs?.push(dailyLog._id);
    await user.save();

    return res.status(201).json({ dailyLog });
  } catch (err) {
    next(err);
  }
};

// @desc    Edit daily log information and update total nutrients
// @route   PUT /users/:userId/dailyLogs/:dailyLogId
const editDailyLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId, dailyLogId } = req.params;
    const updateData = req.body; // This should contain the foods and optionally protein, fat, carbs

    // Check if userId is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Find user by ID
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the daily log by its ID and update
    const updatedDailyLog = await DailyLog.findByIdAndUpdate(
      dailyLogId,
      updateData,
      {
        new: true,
      }
    ).populate("foods"); // Populate the foods in the daily log (so we have all food details)

    if (!updatedDailyLog) {
      return res.status(404).json({ error: "Daily log not found" });
    }

    // Ensure foods is defined and is an array
    const foods = updatedDailyLog.foods || [];

    // Calculate the total protein, fat, and carbs
    let totalProtein = 0;
    let totalFats = 0;
    let totalCarbs = 0;

    // Loop through all the foods in the updated log
    foods.forEach((food: any) => {
      totalProtein += food.protein || 0;
      totalFats += food.fat || 0;
      totalCarbs += food.carbohydrates || 0;
    });

    // Update the daily log with the calculated totals
    updatedDailyLog.protein = totalProtein;
    updatedDailyLog.fats = totalFats;
    updatedDailyLog.carbs = totalCarbs;

    // Save the updated daily log
    await updatedDailyLog.save();

    return res.status(200).json({ dailyLog: updatedDailyLog });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete daily log from database
// @route   DELETE /api/v1/users/:userId/dailyLogs/:dailyLogId
const deleteDailyLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId, dailyLogId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: " User not found" });
    }

    const deletedDailyLog = await DailyLog.findByIdAndDelete(dailyLogId);

    if (!deletedDailyLog) {
      return res.status(404).json({ error: "Daily log not found" });
    }

    user.dailyLogs = user.dailyLogs?.filter(
      (dailyLog) => dailyLog.toString() != dailyLogId
    );

    await user.save();
  } catch (err) {
    next(err);
  }
};

// @desc    Remove meal from user's daily log
// @route   PUT /api/v1/dailyLogs/:dailyLogId/meals/:mealId
const deleteLogMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { dailyLogId, mealId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId);

    // Check if user exist
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const dailyLog = await DailyLog.findById(dailyLogId);

    // Check if daily log exist
    if (!dailyLog) {
      return res.status(404).json({ error: "Daily log not found" });
    }

    const meal = await Food.findById(mealId);

    // Check if meal exist
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    // Check if meal exist in log
    const logMeal = dailyLog.foods?.findIndex((id) => id.toString() === mealId);

    if (logMeal === -1 || logMeal === undefined) {
      return res
        .status(404)
        .json({ error: "Meal not found in this daily log " });
    }

    // Remove meal from daily log's food array
    dailyLog.foods?.splice(logMeal, 1);

    // Subtract nutritional values from daily log
    dailyLog.protein = Math.max(
      0,
      (dailyLog.protein as number) - ((meal.protein as number) || 0)
    );
    dailyLog.fats = Math.max(
      0,
      (dailyLog.fats as number) - ((meal.fat as number) || 0)
    );
    dailyLog.carbs = Math.max(
      0,
      (dailyLog.carbs as number) - ((meal.carbohydrates as number) || 0)
    );

    await dailyLog.save();

    return res.status(200).json({
      message: "Meal removed from daily log successfully",
      updatedLog: dailyLog,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove activity from user's daily log
// @route   PUT /api/v1/dailyLogs/:dailyLogId/activities/:activityId
const deleteLogActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { dailyLogId, activityId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId);

    // Check if user exist
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const dailyLog = await DailyLog.findById(dailyLogId);

    // Check if daily log exist
    if (!dailyLog) {
      return res.status(404).json({ error: "Daily log not found" });
    }

    const activity = await Exercise.findById(activityId);

    // Check if activity exist
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // Check if activity exist in log
    const logActivity = dailyLog.exercises?.findIndex(
      (id) => id.toString() === activityId
    );

    if (logActivity === -1 || logActivity === undefined) {
      return res
        .status(404)
        .json({ error: "Activity not found in this daily log" });
    }

    // Remove activity from daily log's exercise array
    dailyLog.exercises?.splice(logActivity, 1);

    await dailyLog.save();

    return res.status(200).json({
      message: "Activity removed from daily log successfully",
      updatedLog: dailyLog,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getAllDailyLogs,
  getDailyLog,
  getStreaks,
  createDailyLog,
  editDailyLog,
  deleteDailyLog,
  deleteLogMeal,
  deleteLogActivity,
};
