import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import Community, { ICommunity } from "../models/community";
import User, { IUser } from "../models/user";
import Challenge from "../models/challenge";

// @desc    Retrieve all communitites
// @route   GET /api/v1/communities
const getAllCommunities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const communities: ICommunity[] | null = await Community.find().exec();

    if (!communities) {
      return res.status(404).json({ message: "No communities found" });
    }

    return res.status(200).json({ communities });
  } catch (err) {
    return next(err);
  }
};

// @desc    Retrieve selected community
// @route   GET /api/v1/communities/:communityId
const getCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { communityId } = req.params;

    if (!Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ error: "Invalid community ID" });
    }

    const community = await Community.findById(communityId)
      .populate({ path: "members", select: "username email" })
      .exec();

    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    return res.status(200).json({ community });
  } catch (err) {
    return next(err);
  }
};

// @desc    Retrieve all communities that the user belongs to
// @route   GET /api/v1/users/:userId/communities
const getUserCommunities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found"});
    }

    const userCommunities = await Community.find({ members: userId });

    if (!userCommunities) {
      return res.status(404).json({ message: "User belongs to no communities"});
    }

    return res.status(200).json({
      communities: userCommunities
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Create new community
// @route   POST /api/v1/communities
const createCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const newCommunity = await Community.create({
      name: req.body.name,
      description: req.body.description,
      members: req.body.members,
      createdBy: req.body.createdBy,
      challenges: req.body.challenges,
    });

    return res.status(200).json({ newCommunity });
  } catch (err) {
    return next(err);
  }
};

// @desc    User joins community
// @route   POST /api/v1/communities/:communityId/join
const joinCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { communityId } = req.params;
    const { userId } = req.body;

    if (!Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ error: "Invalid community ID" });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    if (community.members.includes(userId)) {
      return res
        .status(400)
        .json({ error: "User is already a member of this community" });
    }

    community.members.push(userId);

    const updatedCommunity = await community.save();

    return res.status(200).json({
      message: "User successfully joined the community",
      updatedCommunity,
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Update community information
// @route   PUT /api/v1/communities/:communityId
const updateCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { communityId } = req.params;
    const updatedData = req.body;

    if (!Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ error: "Invalid community ID" });
    }

    const updateCommunity = await Community.findByIdAndUpdate(
      communityId,
      updatedData,
      {
        new: true,
      }
    );

    if (!updateCommunity) {
      return res.status(404).json({ error: "Community not found" });
    }

    return res.status(200).json({ updateCommunity });
  } catch (err) {
    return next(err);
  }
};

// @desc    User leaves community
// @route   DELETE /api/v1/communities/:communityId/leave
const leaveCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { communityId } = req.params;
    const { userId } = req.body;

    if (!Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ error: "Invalid community ID" });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    // Check if the user is a member of the community
    if (!community.members.includes(userId)) {
      return res
        .status(400)
        .json({ error: "User is not a member of this community" });
    }

    // Remove the user from the members array
    community.members = community.members.filter(
      (memberId) => !memberId.equals(userId)
    );

    const updatedCommunity = await community.save();

    return res.status(200).json({
      message: "User successfully left the community",
      updatedCommunity,
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Delete community from database
// @route   DELETE /api/v1/communities/:communityId
const deleteCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { communityId } = req.params;

    if (!Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ error: "Invalid community ID" });
    }

    const deletedCommunity = await Community.findByIdAndDelete(
      communityId
    ).exec();

    if (!deletedCommunity) {
      return res.status(404).json({ error: "Community not found" });
    }

    return res.status(200).json({
      message: "Community deleted successfully",
      communityId,
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Add content to selected community feed
// @route   POST /api/v1/communities/:communityId/feeds
const createCommunityPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { communityId } = req.params;
    const { userId, challengeId } = req.body;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    // Find this user in the challenge's participants
    const participant = challenge.participants.find(
      (p) => p.user.toString() === userId
    );

    if (!participant) {
      return res.status(400).json({ message: "User is not a participant of this challenge" });
    } else if (!participant.completed) {
      return res.status(400).json({ message: "User has not completed this challenge" });
    }

    const postMessage = `${user.username} has completed the "${challenge.name}" challenge.`;

    const newPost = {
      username: user.username,
      content: postMessage,
      createdAt: new Date(),
    };

    community.feed.push(newPost);
    await community.save();

    res.status(200).json({ message: "Feed post added", feed: community.feed });
  } catch (err) {
    return next(err);
  }
};


export default {
  getAllCommunities,
  getCommunity,
  getUserCommunities,
  createCommunity,
  leaveCommunity,
  joinCommunity,
  updateCommunity,
  deleteCommunity,
  createCommunityPost,
};
