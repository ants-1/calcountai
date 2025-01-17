import express from "express";
import foodController from "../controllers/foodController";

const router = express.Router();

router.get("/foods", foodController.getAllFoods);
router.get("/foods/:foodId", foodController.getFood);
router.post("/foods", foodController.createFood);
router.put("/foods/:foodId", foodController.updateFood);
router.delete("/foods/:foodId", foodController.deleteFood);

export default router;