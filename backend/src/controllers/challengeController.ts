import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user";
import Challenge, { IChallenge } from "../models/challenge";
import { Types } from "mongoose";
import Community from "../models/community";
import challenge from "../models/challenge";

// GET /challenges
const getAllChallenges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const challanges: IChallenge[] = await Challenge.find().exec();

    if (!challanges || challanges.length === 0) {
      return res.status(404).json({ message: "No challanges found." });
    }

    return res.status(200).json({ challanges });
  } catch (err) {
    return next(err);
  }
};

// GET /users/:userId/challenges
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
        .json({ error: `User with ID: ${userId} was not found.` });
    }

    const personalChallenges = user.challenges?.filter(
      (challenge: IChallenge) => challenge.challengeType === "Personal"
    );
    const communityChallenges = user.challenges?.filter(
      (challenge: IChallenge) => challenge.challengeType === "Community"
    );

    if (personalChallenges.length === 0 && communityChallenges.length === 0) {
      return res.status(404).json({ message: "No challenges found." });
    }

    return res.status(200).json({
      personal: {
        challenges: personalChallenges
      },
      community: {
        challenges: communityChallenges
      }
    });
  } catch (err) {
    return next(err);
  }
};

// GET /community/:communityId/challenges
const getCommunityChallenges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { communityId } = req.body;

    const community = await Community.findById(communityId).exec();

    if (!community) {
      return res.status(404).json({ message: "No community found" });
    }

    if (!community || community.challenges.length) {
      return res.status(404).json({ message: "No challenges found" });
    }

    return res.status(200).json({ challenges: community.challenges });
  } catch (err) {
    return next(err);
  }
};

// POST /challanges
const createChallenge = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, description, startDate, endDate, challengeType, targetId } =
      req.body;

    const newChallenge = await Challenge.create({
      name,
      description,
      percentage: 0,
      participants: [],
      completed: false,
      startDate,
      endDate,
      challengeType,
    });

    if (challengeType.toLowerCase() === "personal") {
      const user = await User.findById(targetId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.challenges?.push(newChallenge._id);
      await user.save();
    } else if (challengeType.toLowerCase() === "community") {
      const community = await Community.findById(targetId);

      if (!community) {
        return res.status(404).json({ error: "Community not found" });
      }

      community.challenges.push(newChallenge._id);
      await community.save();
    } else {
      return res.status(400).json({ error: "Invalid challenge type" });
    }

    return res.status(201).json({
      message: "Challenge created successfully",
      challenge: newChallenge,
    });
  } catch (err) {
    return next(err);
  }
};

// PUT users/:userId/challenges/:challengeId/join
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

    const userObjectId = new Types.ObjectId(userId);
    const challengeObjectId = new Types.ObjectId(challengeId);

    const challenge = await Challenge.findById(challengeObjectId);
    const user = await User.findById(userObjectId);

    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!challenge.participants.includes(userObjectId)) {
      challenge.participants.push(userObjectId);
      await challenge.save();
    }

    if (!user.challenges?.includes(challengeObjectId)) {
      user.challenges?.push(challengeObjectId);
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "User joined the challenge successfully" });
  } catch (err) {
    return next(err);
  }
};

// DELETE /challenges/:challengeId
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

    return res.status(200).json({ message: "Challenge deleted successfully" });
  } catch (err) {
    return next(err);
  }
};

// PUT challenges/:challengeId
const editChallenge = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { challengeId } = req.params;
  const updatedData = req.body;

  if (!Types.ObjectId.isValid(challengeId)) {
    return res.status(400).json({ error: "Invalid challenge ID" });
  }

  const updatedChallenge = await Challenge.findByIdAndUpdate(
    challengeId,
    updatedData,
    {
      new: true,
    }
  );

  if (!updatedChallenge) {
    return res
      .status(404)
      .json({ error: `Challenge with ID: ${challengeId} was not found.` });
  }

  return res.status(200).json({ updatedChallenge });
};

// PUT /users/:userId/challenges/:challengeId/leave
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
        .json({ error: `User with ID: ${userId} was not found.` });
    }

    if (!challenge) {
      return res
        .status(404)
        .json({ error: `Challenge with ID: ${challengeId} was not found.` });
    }

    const isUserInChallenge = challenge.participants.some((participantId) =>
      participantId.equals(user._id)
    );

    if (!isUserInChallenge) {
      return res
        .status(400)
        .json({ message: "User is not part of this challenge." });
    }

    challenge.participants = challenge.participants.filter(
      (participantId) => !participantId.equals(user._id)
    );

    const stillInChallenge = challenge.participants.some((participantId) =>
      participantId.equals(user._id)
    );

    if (stillInChallenge) {
      return res
        .status(500)
        .json({ error: "Failed to remove user from challenge." });
    }

    user.challenges = user.challenges?.filter(
      (cId) => !cId.equals(challenge._id)
    );

    const stillHasChallenge = user.challenges?.some((cId) =>
      cId.equals(challenge._id)
    );

    if (stillHasChallenge) {
      return res
        .status(500)
        .json({ error: "Failed to remove challenge from user's list." });
    }

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
  getCommunityChallenges,
  createChallenge,
  joinChallenge,
  deleteChallenge,
  editChallenge,
  leaveChallenge,
};
