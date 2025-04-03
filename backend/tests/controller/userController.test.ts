import request from "supertest";
import { app, server } from "../../src/index";
import mongoose from "mongoose";
import User from "../../src/models/user";
import { describe, expect, beforeAll, afterAll, it } from "@jest/globals";

describe("User Controller Tests", () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DB_TEST_URL || "");
    }
    server.close();

    // Clear users before running tests to avoid duplicates
    await User.deleteMany({ email: "testuser@example.com" });

    // Create a test user
    const res = await request(app).post("/api/v1/auth/sign-up").send({
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      password: "Test@1234",
    });

    token = res.body.token;
    userId = res.body.user._id;
  });

  afterAll(async () => {
    // Delete all users after testing
    await User.deleteMany({ email: "testuser@example.com" });
    await mongoose.connection.close();
    server.close();
  });

  // Test retrieving all users
  it("should retrieve all users", async () => {
    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("users");
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  // Test retrieving a single user by ID
  it("should retrieve a single user", async () => {
    const res = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user._id).toBe(userId);
  });

  // Test retrieving a user that does not exist
  it("should return 404 for a non-existent user", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/v1/users/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("user", null);
  });

  // Test updating user data
  it("should update user data", async () => {
    const updatedData = {
      firstName: "Updated",
      lastName: "User",
      email: "updateduser123@example.com", 
    };
  
    const res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);
  
    expect(res.status).toBe(200);
    expect(res.body.updatedUser.firstName).toBe(updatedData.firstName);
    expect(res.body.updatedUser.email).toBe(updatedData.email);
  });
  

  // Test updating user goal information
  it("should update user goal information", async () => {
    const updatedGoalInfo = {
      gender: "Male",
      goal: "Weight Loss",
      currentWeight: 80,
      targetWeight: 70,
      height: 175,
      dateOfBirth: "1990-01-01",
    };

    const res = await request(app)
      .put(`/api/v1/users/${userId}/goal-info`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedGoalInfo);

    expect(res.status).toBe(200);
    expect(res.body.updatedUser.goal).toBe(updatedGoalInfo.goal);
    expect(res.body.updatedUser.currentWeight).toBe(
      updatedGoalInfo.currentWeight
    );
  });

  // Test updating a non-existent user
  it("should return 404 for updating a non-existent user", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/v1/users/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "Ghost" });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "User not found.");
  });
});
