import express from "express";  
import authRoutes from "./authRoutes";
import userRoutes from "./userController";
import dailyLogRoutes from "./dailyLogRoutes";
import foodRoutes from "./foodRoutes";
import exerciseRoutes from "./exerciseRoutes";
import challengeRoutes from "./challengeRoutes";
import communityRoutes from "./communityRoutes";

const routes = express.Router();

routes.use("/api/v1", authRoutes);
routes.use("/api/v1", userRoutes);
routes.use("/api/v1", dailyLogRoutes);
routes.use("/api/v1", foodRoutes);
routes.use("/api/v1", exerciseRoutes);
routes.use("/api/v1", challengeRoutes);
routes.use("/api/v1", communityRoutes);

export default routes;
