import request from "supertest";
import { app } from "../src/index";
import { describe, expect, it } from "@jest/globals";

export default function authTests(authInfo: { token: string; userId: string }) {
  describe("Auth tests", () => {
    it("should sign up a new user and return HTTP status 201", async () => {
      const res = await request(app).post("/api/v1/auth/sign-up").send({
        username: "John123",
        email: "testuser@example.com",
        password: "Test@1234",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user.username).toBe("John123");
      expect(res.body.user.email).toBe("testuser@example.com");
      authInfo.token = res.body.token;
      authInfo.userId = res.body.user._id;
    });

    it("should not sign up a new user with missing field and return HTTP status 400", async () => {
      const res = await request(app).post("/api/v1/auth/sign-up").send({
        username: "John123",
        password: "Test@1234",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Sign up failed. User already exists or invalid data."
      );
    });

    it("should log in an existing user and return HTTP status 200", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "testuser@example.com",
        password: "Test@1234",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      authInfo.token = res.body.token;
    });

    it("should not log in with incorrect credentials and return HTTP status 401", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "testuser@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error", "Invalid credentials.");
    });

    it("should log out a user and return HTTP status 200", async () => {
      const res = await request(app)
        .get("/api/v1/auth/logout")
        .set("Authorization", `Bearer ${authInfo.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
    });
  });
}
