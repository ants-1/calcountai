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

    const user: IUser | null = await User.findById(id)
      .select("-password")
      .exec();

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
};

// @desc    Update user goal information
// @route   PUT /users/:id/goal-info
const updateUserGoalInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;

    const {
      gender,
      goal,
      currentWeight,
      targetWeight,
      height,
      dateOfBirth,
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!user.weightHistory) {
      user.weightHistory = [];
    }

    const date = new Date();

    // Push weight to weightHistory
    if (currentWeight) {
      if (user.weightHistory.length === 0) {
        user.weightHistory.push({ weight: currentWeight, date });
      } else {
        const currentStartWeight = user.weightHistory[0].weight;

        // Check if new weight is higher than start weight
        if (currentWeight > currentStartWeight) {
          user.weightHistory.unshift({ weight: currentWeight, date });
        } else {

      user.weightHistory?.push({ weight: currentWeight, date });
        }
      }
    }

    console.log(user.weightHistory);

    // Update goal-related fields
    user.gender = gender ?? user.gender;
    user.goal = goal ?? user.goal;
    user.currentWeight = currentWeight ?? user.currentWeight;
    user.targetWeight = targetWeight ?? user.targetWeight;
    user.height = height ?? user.height;
    user.dateOfBirth = dateOfBirth ?? user.dateOfBirth;

    await user.save();

    return res.status(200).json({ updatedUser: user });
  } catch (err) {
    return next(err);
  }
};

export default {
  getAllUsers,
  getUser,
  updateUserData,
  updateUserGoalInfo,
};
