import express from "express";
import dailyLogController from "../controllers/dailyLogController";

const router = express.Router();

router.get(
  "/users/:userId/dailyLogs",
   dailyLogController.getAllDailyLogs);
router.get(
  "/users/:userId/dailyLogs/:dailyLogId",
  dailyLogController.getDailyLog
);
router.get(
  "/users/:userId/streaks",
  dailyLogController.getStreaks
);
router.post(
  "/users/:userId/dailyLogs",
  dailyLogController.createDailyLog);
router.put(
  "/users/:userId/dailyLogs/:dailyLogId",
  dailyLogController.editDailyLog
);
router.delete(
  "/users/:userId/dailyLogs/:dailyLogId",
  dailyLogController.deleteDailyLog
);

export default router;
