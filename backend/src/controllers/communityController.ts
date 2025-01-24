import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import Community, { ICommunity } from "../models/community";

// GET /communities
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

// GET /communities/:communityId
const getCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { communityId } = req.params;

    const community: ICommunity | null = await Community.findById(
      communityId
    ).exec();

    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    return res.status(200).json({ community });
  } catch (err) {
    return next(err);
  }
};

// POST /communities
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

    // Get User and add to 

    return res.status(200).json({ newCommunity });
  } catch (err) {
    return next(err);
  }
};

// PUT /communities/:communityId
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

// DELETE /communities/:communityId
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

export default {
  getAllCommunities,
  getCommunity,
  createCommunity,
  updateCommunity,
  deleteCommunity,
};
