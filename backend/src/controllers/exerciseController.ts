import { NextFunction, Request, Response } from "express";
import Exercise, { IExercise } from "../models/exercise";
import { Types } from "mongoose";

// @desc    Retrieve all exercises
// @route   GET /api/v1/exercises
const getAllExercises = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const exercises: IExercise[] | null = await Exercise.find().exec();

    if (!exercises || exercises.length == 0) {
      return res.status(404).json({ message: "No exercises found" });
    }

    return res.status(200).json({ exercises });
  } catch (err) {
    return next(err);
  }
};

// @desc    Retrieve select exercise
// @route   GET /api/v1/exercises/:exerciseId
const getExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { exerciseId } = req.params;

    if (!Types.ObjectId.isValid(exerciseId)) {
      return res.status(400).json({ error: "Invalid Exercise ID" });
    }

    const exercise: IExercise | null = await Exercise.findById(
      exerciseId
    ).exec();

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    return res.status(200).json({ exercise });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new exercise
// @route   POST /api/v1/exercises
const createExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const newExercise = new Exercise({
      name: req.body.name,
      duration: req.body.duration,
      caloriesBurned: req.body.caloriesBurned,
    });

    if (!newExercise) {
      return res.status(404).json({ error: "Unable to create exercise" });
    }

    await newExercise.save();

    return res.status(200).json({ newExercise });
  } catch (err) {
    return next(err);
  }
};

// @desc    Update selected exercise information
// @route   PUT /exercises/:exerciseId
const updateExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { exerciseId } = req.params;
    const updatedData = req.body;

    if (!Types.ObjectId.isValid(exerciseId)) {
      return res.status(400).json({ error: "Invalid exercise ID" });
    }

    const updatedExercise = await Exercise.findByIdAndUpdate(
      exerciseId,
      updatedData,
      {
        new: true,
      }
    );

    if (!updatedExercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    return res.status(200).json({ updatedExercise });
  } catch (err) {
    return next(err);
  }
};

// @desc    Delete exercise from database
// @route   DELETE /api/v1/exercises/:exerciseId
const deleteExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { exerciseId } = req.params;

    if (!Types.ObjectId.isValid(exerciseId)) {
      return res.status(400).json({ error: "Invalid exercise ID" });
    }

    const deletedExercise = await Exercise.findByIdAndDelete(exerciseId);

    if (!deletedExercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    return res
      .status(200)
      .json({ message: "Exercise successfully deleted", exerciseId });
  } catch (err) {
    return next(err);
  }
};

export default {
  getAllExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
};
