import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user";

// @desc    Retrieve all users from database
// @route   GET /api/v1/users
const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const users: IUser[] = await User.find().select("-password").exec();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users: users });
  } catch (err) {
    return next(err);
  }
};

// @desc    Retrieve selected user from database
// @route   GET /api/v1/users/:id
const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;

    const user: IUser | null = await User.findById(id).select("-password").exec();

    if (!user) {
      return res.status(404).json({ user });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
};

// @desc    Update user information
// @route   PUT /api/v1/users/:id
const updateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;

    const updatedUser = {
      username: req.body.username,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(id, updatedUser, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ updatedUser });
  } catch (err) {
    return next(err);
  }
}

// @desc    Update user goal information
// @route   PUT /users/:id/goal-info
const updateUserGoalInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;

    const updatedUser = {
      gender: req.body.gender,
      goal: req.body.goal,
      currentWeight: req.body.currentWeight,
      targetWeight: req.body.targetWeight,
      height: req.body.height,
      dateOfBirth: req.body.dateOfBirth,
    };

    const user = await User.findByIdAndUpdate(id, updatedUser, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ updatedUser });
  } catch (err) {
    return next(err);
  }
}


export default {
  getAllUsers,
  getUser,
  updateUserData,
  updateUserGoalInfo,
};
