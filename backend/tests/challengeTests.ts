import request from "supertest";
import { app } from "../src/index";
import mongoose from "mongoose";
import { describe, expect, it } from "@jest/globals";
import Challenge from "../src/models/challenge";
import User from "../src/models/user";

export default function challengeTests(authInfo: {
  token: string;
  userId: string;
}) {
  describe("Challenge tests", () => {
    // Get all challenges
    it("should retrieve all challenges from database", async () => {
      const challenge = new Challenge({
        name: "Log 1 Meal",
        level: 1,
        description: "Log 1 meal",
        percentage: 0,
        participants: [],
        challengeType: "Meal",
      });

      await challenge.save();

      const res = await request(app).get("/api/v1/challenges");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("challenges");
    });

    it("should return HTTP status 404 and message when challenges is empty", async () => {
      await Challenge.deleteMany({});

      const res = await request(app).get("/api/v1/challenges");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("No challenges found.");
    });

    // Get a selected challenge tests
    it("should retrieve select challenge from database", async () => {
      const registerRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "John123",
        email: "testuser@example.com",
        password: "Test@1234",
      });

      expect(registerRes.status).toBe(201);
      expect(registerRes.body).toHaveProperty("user");

      authInfo.userId = registerRes.body.user._id;

      const challenge = new Challenge({
        name: "Log 1 Meal",
        level: 1,
        description: "Log 1 meal",
        percentage: 0,
        participants: [],
        challengeType: "Meal",
      });

      await challenge.save();

      // User joins challenge
      const joinRes = await request(app).put(
        `/api/v1/users/${authInfo.userId}/challenges/${challenge._id}/join`
      );
      expect(joinRes.status).toBe(200);

      const res = await request(app).get(
        `/api/v1/users/${authInfo.userId}/challenges`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("challenges");
    });

    it("should return HTTP status 404 if no user was found when getting user challenges", async () => {
      const challenge = new Challenge({
        name: "Log 1 Meal",
        level: 1,
        description: "Log 1 meal",
        percentage: 0,
        participants: [],
        challengeType: "Meal",
      });

      await challenge.save();

      const fakeUserId = new mongoose.Types.ObjectId();
      const res = await request(app).get(
        `/api/v1/users/${fakeUserId}/challenges`
      );

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("User was not found.");
    });

    it("should return HTTP status 404 if user has not challenges", async () => {
      await Challenge.deleteMany({});

      const res = await request(app).get(
        `/api/v1/users/${authInfo.userId}/challenges`
      );

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("No challenges found.");
    });

    // Create challenge test
    it("should create a new challenge", async () => {
      const challenge = {
        name: "Log 1 Meal",
        level: 1,
        description: "Log 1 meal",
        percentage: 0,
        participants: [],
        challengeType: "Meal",
      };

      const res = await request(app).post("/api/v1/challenges").send(challenge);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Challenge created successfully");
    });

    // Join challenge tests
    it("should allow user to join existing challenge", async () => {
      const challenge = new Challenge({
        name: "Log 1 Meal",
        level: 1,
        description: "Log 1 meal",
        percentage: 0,
        participants: [],
        challengeType: "Meal",
      });

      await challenge.save();

      const res = await request(app).put(
        `/api/v1/users/${authInfo.userId}/challenges/${challenge._id}/join`
      );

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User joined the challenge successfully");
    });

    it("should return with HTTP status 404 and error message if user does not exist", async () => {
      const challenge = new Challenge({
        name: "Log 1 Meal",
        level: 1,
        description: "Log 1 meal",
        percentage: 0,
        participants: [],
        challengeType: "Meal",
      });

      await challenge.save();

      const fakeUserId = new mongoose.Types.ObjectId();
      const res = await request(app).put(
        `/api/v1/users/${fakeUserId}/challenges/${challenge._id}/join`
      );

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("User not found");
    });

    it("should return with HTTP status 404 and error message if challenge does not exist when joining challenge", async () => {
      const fakeChallengeId = new mongoose.Types.ObjectId();
      const res = await request(app).put(
        `/api/v1/users/${authInfo.userId}/challenges/${fakeChallengeId}/join`
      );

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Challenge not found");
    });

    // Delete challenge tests
    it("should delete existing challenge from database", async () => {
      const challenge = new Challenge({
        name: "Delete Test",
        level: 1,
        description: "To be deleted",
        percentage: 0,
        participants: [],
        challengeType: "Meal",
      });

      await challenge.save();

      const res = await request(app).delete(
        `/api/v1/challenges/${challenge._id}`
      );

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Challenge deleted successfully");
    });

    it("should return with HTTP status 404 and error message if challenge does not exist when deleting it", async () => {
      const fakeChallengeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(
        `/api/v1/challenges/${fakeChallengeId}`
      );

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Challenge not found");
    });

    // Edit challenge tests
    it("should edit existing challenge information", async () => {
      const challenge = new Challenge({
        name: "Old Challenge",
        level: 1,
        description: "Old description",
        percentage: 0,
        participants: [],
        challengeType: "Meal",
      });

      await challenge.save();

      const res = await request(app)
        .put(`/api/v1/challenges/${challenge._id}`)
        .send({ name: "Updated Challenge", description: "Updated" });

      expect(res.status).toBe(200);
      expect(res.body.updatedChallenge.name).toBe("Updated Challenge");
      expect(res.body.updatedChallenge.description).toBe("Updated");
    });

    it("should return with HTTP status 404 and error message if challenge does not exist when editing challenge", async () => {
      const fakeChallengeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/v1/challenges/${fakeChallengeId}`)
        .send({ name: "Update Fail" });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Challenge was not found.");
    });

    // Leave challenge tests
    it("should allow existing user to leave a challenge they have joined", async () => {
      const challenge = new Challenge({
        name: "Leave Test",
        level: 1,
        description: "Leave this challenge",
        percentage: 0,
        participants: [
          { user: authInfo.userId, progress: 0, completed: false },
        ],
        challengeType: "Meal",
      });

      await challenge.save();

      const res = await request(app).put(
        `/api/v1/users/${authInfo.userId}/challenges/${challenge._id}/leave`
      );

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User left the challenge successfully");
    });

    it("should return with HTTP status 404 and error message if user does not exist when leaving challenge", async () => {
      const challenge = new Challenge({
        name: "Leave Test",
        level: 1,
        description: "Leave this challenge",
        percentage: 0,
        participants: [],
        challengeType: "Meal",
      });

      await challenge.save();

      const fakeUserId = new mongoose.Types.ObjectId();
      const res = await request(app).put(
        `/api/v1/users/${fakeUserId}/challenges/${challenge._id}/leave`
      );

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("User was not found.");
    });

    it("should return with HTTP status 404 and error message if challenge does not exist when leaving challenge", async () => {
      const fakeChallengeId = new mongoose.Types.ObjectId();
      const res = await request(app).put(
        `/api/v1/users/${authInfo.userId}/challenges/${fakeChallengeId}/leave`
      );

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Challenge was not found.");
    });

    it("should return 404 if challenge not found when leaving challenge", async () => {
      const fakeChallengeId = new mongoose.Types.ObjectId();
      const res = await request(app).put(
        `/api/v1/users/${authInfo.userId}/challenges/${fakeChallengeId}/leave`
      );

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Challenge was not found.");
    });

    it("should return with HTTP status 400 and error message if user is not a participant of challenge", async () => {
      const challenge = new Challenge({
        name: "Leave Test",
        level: 1,
        description: "User not joined",
        percentage: 0,
        participants: [],
        challengeType: "Meal",
      });

      await challenge.save();

      const res = await request(app).put(
        `/api/v1/users/${authInfo.userId}/challenges/${challenge._id}/leave`
      );

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User is not part of this challenge.");
    });
  });
}
