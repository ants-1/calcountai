import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user";
import DailyLog, { IDailyLog } from "../models/dailyLog";
import { Types } from "mongoose";
import Food from "../models/food";
import Exercise from "../models/exercise";

// GET /users/:userId/dailyLogs
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

    const user = await User.findById(userId).populate("dailyLogs");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.dailyLogs || user.dailyLogs.length === 0) {
      return res.status(404).json({ message: "No daily Logs found" });
    }

    return res.status(200).json({ dailyLogs: user.dailyLogs });
  } catch (err) {
    return next(err);
  }
};

// GET /users/:userId/dailyLogs/:dailyLogId
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
      .populate("foods", "exercises")
      .exec();

    if (!dailyLog) {
      return res.status(404).json({ error: "Daily log not found" });
    }

    return res.status(200).json({ dailyLog });
  } catch (err) {
    next(err);
  }
};

// POST /users/:userId/dailyLogs
const createDailyLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId } = req.params;
    const { foods, exercises, completed, data } = req.body;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if daily log with same date already exist

    const dailyLog = await DailyLog.create({
      foods,
      exercises,
      completed,
      data,
    });

    user.dailyLogs?.push(dailyLog._id);
    await user.save();

    return res.status(201).json({ dailyLog });
  } catch (err) {
    next(err);
  }
};

// PUT /users/:userId/dailyLogs/:dailyLogId
const editDailyLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId, dailyLogId } = req.params;
    const updateData = req.body;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user: IUser | null = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedDailyLog = await DailyLog.findByIdAndUpdate(
      dailyLogId,
      updateData,
      {
        new: true,
      }
    ).populate("foods", "exercises");

    if (!updatedDailyLog) {
      return res.status(404).json({ error: " Daily log not found" });
    }

    return res.status(200).json({ dailyLog: updatedDailyLog });
  } catch (err) {
    next(err);
  }
};

// DELETE /users/:userId/dailyLogs/:dailyLogId
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

export default {
  getAllDailyLogs,
  getDailyLog,
  createDailyLog,
  editDailyLog,
  deleteDailyLog,
};
