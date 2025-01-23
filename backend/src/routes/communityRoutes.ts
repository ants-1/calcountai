import express from "express";
import communityController from "../controllers/communityController";

const router = express.Router();

router.get("/communities", communityController.getAllCommunities);
router.get("/communities/:communityId", communityController.getCommunity);
router.post("/communities", communityController.createCommunity);
router.put("/communities/:communityId", communityController.updateCommunity);
router.delete("/communities/:communityId", communityController.deleteCommunity);

export default router;
