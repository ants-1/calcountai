import request from "supertest";
import { app } from "../src/index";
import mongoose from "mongoose";
import { describe, expect, it } from "@jest/globals";

export default function userTests(authInfo: { token: string; userId: string }) {
  describe("User tests", () => {
    it("should retrieve all users and return HTTP status 200", async () => {
      const res = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${authInfo.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("users");
      expect(Array.isArray(res.body.users)).toBe(true);
    });

    it("should return HTTP status 404 and message when no users exist in the database", async () => {
      // Remove all users from the collection
      await mongoose.connection.collection("users").deleteMany({});

      const res = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${authInfo.token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "No users found");

      const registerRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "John123",
        email: "testuser@example.com",
        password: "Test@1234",
      });

      expect(registerRes.status).toBe(201);
      expect(registerRes.body).toHaveProperty("user");
      authInfo.userId = registerRes.body.user._id;

      // Log in again to get a fresh token
      const loginRes = await request(app).post("/api/v1/auth/login").send({
        email: "testuser@example.com",
        password: "Test@1234",
      });

      authInfo.token = loginRes.body.token;
    });

    it("should retrieve a single user and return HTTP status 200", async () => {
      const res = await request(app)
        .get(`/api/v1/users/${authInfo.userId}`)
        .set("Authorization", `Bearer ${authInfo.token}`);

      console.log("userId:", authInfo.userId);
      console.log("req user id:", res.body.user._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
      expect(res.body.user._id).toBe(authInfo.userId);
    });

    it("should return 404 for a non-existent user", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/v1/users/${fakeId}`)
        .set("Authorization", `Bearer ${authInfo.token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });

    it("should update user's data such as username and email and return HTTP status 200", async () => {
      const updatedData = {
        username: "updatedUsername",
        email: "updateduser123@example.com",
      };

      const res = await request(app)
        .put(`/api/v1/users/${authInfo.userId}`)
        .set("Authorization", `Bearer ${authInfo.token}`)
        .send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body.updatedUser.username).toBe(updatedData.username);
      expect(res.body.updatedUser.email).toBe(updatedData.email);
    });

    it("should update user's goal information and return HTTP status 200", async () => {
      const updatedGoalInfo = {
        gender: "Male",
        goal: "Reduce Stress",
        currentWeight: 80,
        targetWeight: 70,
        height: 175,
        dateOfBirth: "1990-01-01",
      };

      const res = await request(app)
        .put(`/api/v1/users/${authInfo.userId}/goal-info`)
        .set("Authorization", `Bearer ${authInfo.token}`)
        .send(updatedGoalInfo);

      expect(res.status).toBe(200);
      expect(res.body.updatedUser.goal).toEqual([updatedGoalInfo.goal]);
      expect(res.body.updatedUser.currentWeight).toEqual(
        updatedGoalInfo.currentWeight
      );
    });

    it("should return HTTP status 404 and an error message for updating a non-existent user", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/v1/users/${fakeId}`)
        .set("Authorization", `Bearer ${authInfo.token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found.");
    });

    it("should reutrn a HTTP status 404 and an error message for updating goal information a non-existent user", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/v1/users/${fakeId}/goal-info`)
        .set("Authorization", `Bearer ${authInfo.token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found.");
    });
  });
}
