import express from "express";
import authController from "../controllers/authController";
import validateToken from "../utils/validateToken";

const router = express.Router();

router.post("/auth/sign-up", authController.signUp);
router.post("/auth/login", authController.login);
router.get("/auth/logout", authController.logout);
router.get("/auth/user-token", validateToken);

export default router;
