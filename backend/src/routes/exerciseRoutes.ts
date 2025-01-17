import express from "express";
import exerciseController from "../controllers/exerciseController";

const router = express.Router();

router.get("/exercises", exerciseController.getAllExercises);
router.get("/exercises/:exerciseId", exerciseController.getExercise);
router.post("/exercises", exerciseController.createExercise);
router.put("/exercises/:exerciseId", exerciseController.updateExercise);
router.delete("/exercises/:exerciseId", exerciseController.deleteExercise);

export default router;
