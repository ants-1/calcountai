import { Router } from "express";
import challengeController from "../controllers/challengeController";

const router = Router();

router.get(
  "/challenges", 
  challengeController.getAllChallenges
);
router.get(
  "/users/:userId/challenges", 
  challengeController.getUserChallenges
);
router.get(
  "/community/:communityId/challenges",
  challengeController.getCommunityChallenges
);
router.post(
  "/challenges",
  challengeController.createChallenge
);
router.put(
  "/users/:userId/challenges/:challengeId/join",
  challengeController.joinChallenge
);
router.delete(
  "/challenges/:challengeId",
  challengeController.deleteChallenge
);
router.put(
  "/challenges/:challengeId",
  challengeController.editChallenge
);
router.put(
  "/users/:userId/challenges/:challengeId/leave",
  challengeController.leaveChallenge
);

export default router;
