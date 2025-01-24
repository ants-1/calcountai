import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user";
import Challenge from "../models/challenge";
import { Types } from "mongoose";
import Community from "../models/community";

// GET /user/:userId/challenges
const getAllChallenges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId).populate("challenges").exec();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.challenges || user.challenges.length === 0) {
      return res.status(404).json({ message: "No challenges found" });
    }

    return res.status(200).json({ challenges: user.challenges });
  } catch (err) {
    console.error("Error fetching challenges:", err);
    return next(err);
  }
};

// GET /user/:userId/challenges/personal
const getPersonalChallenges = async (
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
      path: "challenges",
      match: { challengeType: "Personal" },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.challenges || user.challenges.length === 0) {
      return res.status(404).json({ message: "No personal challenges found" });
    }

    return res.status(200).json({ challenges: user.challenges });
  } catch (err) {
    return next(err);
  }
};

// GET /user/:userId/communities/:communityId/challenges
const getUserCommunityChallenges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId, communityId } = req.params;

    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(communityId)
    ) {
      return res.status(400).json({ error: "Invalid user or community ID" });
    }

    const user = await User.findById(userId).populate("challenges").exec();
    const community = await Community.findById(communityId)
      .populate("challenges")
      .exec();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    const communityChallenges = community.challenges.filter((challengeId) =>
      user.challenges?.some(
        (userChallenge) => userChallenge.toString() === challengeId.toString()
      )
    );

    return res.status(200).json({ challenges: communityChallenges });
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

export default {
  getAllChallenges,
  getPersonalChallenges,
  getUserCommunityChallenges,
  getCommunityChallenges,
  createChallenge,
  joinChallenge,
  deleteChallenge,
};
