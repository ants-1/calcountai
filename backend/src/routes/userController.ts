import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUser);

export default router;
