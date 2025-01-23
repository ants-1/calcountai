import { Router } from "express";
import challengeController from "../controllers/challengeController";

const router = Router();

router.get("/user/:userId/challenges", challengeController.getAllChallenges);
router.get(
  "/user/:userId/challenges/personal",
  challengeController.getPersonalChallenges
);
router.get(
  "/user/:userId/community/:communityId",
  challengeController.getUserCommunityChallenges
);
router.get(
  "/community/:communityId/challenges",
  challengeController.getCommunityChallenges
);
router.post("/challenges", challengeController.createChallenge);
router.put(
  "/users/:userId/challenges/:challengeId/join",
  challengeController.joinChallenge
);
router.delete("/challenges/:challengeId", challengeController.deleteChallenge);

export default router;
