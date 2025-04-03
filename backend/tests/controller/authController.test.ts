import request from "supertest";
import { app, server } from "../../src/index";
import mongoose from "mongoose";
import User from "../../src/models/user";
import { describe, expect, beforeAll, afterAll, it } from "@jest/globals";

describe("Auth Controller Tests", () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DB_TEST_URL || "");
    }

    await User.deleteMany({ email: "testuser@example.com" });
  });

  afterAll(async () => {
    // Delete all users after testing
    await User.deleteMany({ email: "testuser@example.com" });
    await mongoose.connection.close();
    server.close();
  });

  // Test sign up for a new user with the correct information
  it("should sign up a new user", async () => {
    token = "";
    userId = "";

    const res = await request(app).post("/api/v1/auth/sign-up").send({
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      password: "Test@1234",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("testuser@example.com");
    // Check if password is encrypted
    expect(res.body.user.password).not.toBe("Test@1234");
    token = res.body.token;
    userId = res.body.user._id;
  });

  // Test sign up for a new user with a missing field
  it("should not sign up a new user with missing field", async () => {
    const res = await request(app).post("/api/v1/auth/sign-up").send({
      firstName: "Test",
      lastName: "User",
      // Missing 'email' field
      password: "Test@1234",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Sign up failed. User already exists or invalid data."
    );
  });

  // Test login for an existing user with the correct information
  it("should log in an existing user", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "testuser@example.com",
      password: "Test@1234",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  // Test login for an existing user with the incorrect information
  it("should not log in with incorrect credentials", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials.");
  });

  // Test logout for user
  it("should log out a user", async () => {
    const res = await request(app)
      .get("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });
});
