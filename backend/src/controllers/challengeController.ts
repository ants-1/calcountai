import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user";
import Challenge, { IChallenge } from "../models/challenge";
import { Types } from "mongoose";

// @desc    Retrieves all challenges
// @route   GET /api/v1/challenges
const getAllChallenges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const challenges: IChallenge[] = await Challenge.find().exec();

    if (!challenges || challenges.length === 0) {
      return res.status(404).json({ message: "No challenges found." });
    }

    return res.status(200).json({ challenges });
  } catch (err) {
    return next(err);
  }
};

// @desc    Retrieve all challenges belonging to user
// @route   GET /api/v1/users/:userId/challenges
const getUserChallenges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId)
      .populate<{ challenges: IChallenge[] }>("challenges")
      .exec();

    if (!user) {
      return res
        .status(404)
        .json({ error: `User was not found.` });
    }

    const userChallenges = user.challenges;

    if (!userChallenges || userChallenges.length === 0) {
      return res.status(404).json({ message: "No challenges found." });
    }

    return res.status(200).json({
      challenges: userChallenges,
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Create new challenge
// @route   POST /api/v1/challanges
const createChallenge = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, level, description, challengeType } = req.body;

    // Validate challenge type
    if (!["Streak", "Meal", "Activity", "Goal"].includes(challengeType)) {
      return res.status(400).json({ error: "Invalid challenge type" });
    }

    // Create the challenge
    const newChallenge = await Challenge.create({
      name,
      level,
      description,
      percentage: 0,
      participants: [],
      challengeType,
    });

    return res.status(201).json({
      message: "Challenge created successfully",
      challenge: newChallenge,
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    User joins challenge and added to participants
// @route   PUT /api/v1/users/:userId/challenges/:challengeId/join
const joinChallenge = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId, challengeId } = req.params;

    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(challengeId)
    ) {
      return res.status(400).json({ error: "Invalid user or challenge ID" });
    }

    const user = await User.findById(userId);
    const challenge = await Challenge.findById(challengeId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    const alreadyParticipant = challenge.participants.some((p) =>
      p.user.equals(user._id)
    );

    if (!alreadyParticipant) {
      challenge.participants.push({
        user: user._id,
        progress: 0,
        completed: false,
      });
    }

    if (!user.challenges?.some((cid) => cid.equals(challenge._id))) {
      user.challenges?.push(challenge._id);
    }

    await challenge.save();
    await user.save();

    return res
      .status(200)
      .json({ message: "User joined the challenge successfully" });
  } catch (err) {
    return next(err);
  }
};

// @desc    Delete challenge from database
// @route   DELETE /api/v1/challenges/:challengeId
const deleteChallenge = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { challengeId } = req.params;

    if (!Types.ObjectId.isValid(challengeId)) {
      return res.status(400).json({ error: "Invalid challenge ID" });
    }

    const challenge = await Challenge.findByIdAndDelete(challengeId);

    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    // Remove challenge from all users
    await User.updateMany(
      { challenges: challenge._id },
      { $pull: { challenges: challenge._id } }
    );

    return res.status(200).json({ message: "Challenge deleted successfully" });
  } catch (err) {
    return next(err);
  }
};

// @desc    Edit challenge information
// @route   PUT /api/v1/challenges/:challengeId
const editChallenge = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { challengeId } = req.params;
    const { participants, ...updatedData } = req.body;

    if (!Types.ObjectId.isValid(challengeId)) {
      return res.status(400).json({ error: "Invalid challenge ID" });
    }

    // Fetch the challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        error: `Challenge was not found.`,
      });
    }

    // Update non-participant fields
    Object.assign(challenge, updatedData);

    // Update participants if provided
    if (participants && Array.isArray(participants)) {
      for (let participant of participants) {
        const { user, progress } = participant;

        if (user && typeof progress === "number") {
          const clampedProgress = Math.min(progress, challenge.level);
          const isCompleted = clampedProgress >= challenge.level;

          const existing = challenge.participants.find(
            (p) => p.user.toString() === user.toString()
          );

          if (existing) {
            existing.progress = clampedProgress;
            existing.completed = isCompleted;
          } else {
            challenge.participants.push({
              user,
              progress: clampedProgress,
              completed: isCompleted,
            });
          }
        }
      }
    }

    await challenge.save();

    return res.status(200).json({ updatedChallenge: challenge });
  } catch (err) {
    return next(err);
  }
};


// @desc    User leave challenge and is removed from participants
// @route   PUT /api/v1/users/:userId/challenges/:challengeId/leave
const leaveChallenge = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId, challengeId } = req.params;

    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(challengeId)
    ) {
      return res.status(400).json({ error: "Invalid user or challenge ID" });
    }

    const user = await User.findById(userId);
    const challenge = await Challenge.findById(challengeId);

    if (!user) {
      return res
        .status(404)
        .json({ error: `User was not found.` });
    }

    if (!challenge) {
      return res
        .status(404)
        .json({ error: `Challenge was not found.` });
    }

    const initialCount = challenge.participants.length;

    challenge.participants = challenge.participants.filter(
      (p) => !p.user.equals(user._id)
    );

    if (challenge.participants.length === initialCount) {
      return res
        .status(400)
        .json({ message: "User is not part of this challenge." });
    }

    user.challenges = user.challenges?.filter(
      (cId) => !cId.equals(challenge._id)
    );

    await challenge.save();
    await user.save();

    return res
      .status(200)
      .json({ message: "User left the challenge successfully" });
  } catch (err) {
    return next(err);
  }
};

export default {
  getAllChallenges,
  getUserChallenges,
  createChallenge,
  joinChallenge,
  deleteChallenge,
  editChallenge,
  leaveChallenge,
};
