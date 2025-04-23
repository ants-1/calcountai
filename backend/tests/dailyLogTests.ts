import request from "supertest";
import { app } from "../src/index";
import mongoose from "mongoose";
import { describe, expect, it } from "@jest/globals";
import DailyLog from "../src/models/dailyLog";
import Food from "../src/models/food";
import Exercise from "../src/models/exercise";
import User from "../src/models/user";

export default function dailyLogTests(authInfo: {
  token: string;
  userId: string;
}) {
  describe("Daily Log tests", () => {
    // Get all user's daily logs tests
    it("should retrieve all daily logs for user", async () => {
      const registerRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "dailyLog",
        email: "dailylogtest@example.com",
        password: "Test@1234",
      });

      expect(registerRes.status).toBe(201);
      expect(registerRes.body).toHaveProperty("user");

      authInfo.userId = registerRes.body.user._id;

      const dailyLog = new DailyLog({
        foods: [],
        protein: 0,
        fats: 0,
        carbs: 0,
        exercises: [],
        completed: false,
        date: new Date(),
      });

      await dailyLog.save();

      const user = await User.findById(authInfo.userId);
      expect(user).not.toBeNull();

      user?.dailyLogs?.push(dailyLog._id);
      await user!.save();

      const res = await request(app).get(
        `/api/v1/users/${authInfo.userId}/dailyLogs`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("dailyLogs");
      expect(Array.isArray(res.body.dailyLogs)).toBe(true);
      expect(res.body.dailyLogs.length).toBeGreaterThan(0);
      expect(res.body.dailyLogs[0]._id).toBe(String(dailyLog._id));
    });

    it("should return HTTP status 404 and message when users does not have any daily logs", async () => {
      await DailyLog.deleteMany({});

      const res = await request(app).get(
        `/api/v1/users/${authInfo.userId}/dailyLogs`
      );

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("No daily logs found");
    });

    it("should return HTTP status 404 and error message if user does not exist when getting all daily logs", async () => {
      const fakeUserId = new mongoose.Types.ObjectId();

      const res = await request(app).get(
        `/api/v1/users/${fakeUserId}/dailyLogs`
      );

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("User not found");
    });

    // Get selected daily log tests
    it("should retrieve selected daily log for user", async () => {
      const registerRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "selectedLogUser",
        email: "selectedlog@example.com",
        password: "Test@1234",
      });

      expect(registerRes.status).toBe(201);
      const userId = registerRes.body.user._id;

      const dailyLog = new DailyLog({
        foods: [],
        protein: 10,
        fats: 5,
        carbs: 20,
        exercises: [],
        completed: false,
        date: new Date(),
      });

      await dailyLog.save();

      const user = await User.findById(userId);
      user?.dailyLogs?.push(dailyLog._id);
      await user!.save();

      const res = await request(app).get(
        `/api/v1/users/${userId}/dailyLogs/${dailyLog._id}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("dailyLog");
      expect(res.body.dailyLog._id).toBe(String(dailyLog._id));
    });

    it("should return HTTP status 404 and error message if user does not exist when getting selected daily log", async () => {
      const fakeUserId = new mongoose.Types.ObjectId();

      const dailyLog = new DailyLog({
        foods: [],
        protein: 10,
        fats: 5,
        carbs: 20,
        exercises: [],
        completed: false,
        date: new Date(),
      });

      await dailyLog.save();

      const res = await request(app).get(
        `/api/v1/users/${fakeUserId}/dailyLogs/${dailyLog._id}`
      );

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });

    it("should return HTTP status 404 and error message if daily log does not exist when getting selected daily log", async () => {
      const registerRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "missingLogUser",
        email: "missinglog@example.com",
        password: "Test@1234",
      });

      const userId = registerRes.body.user._id;
      const fakeLogId = new mongoose.Types.ObjectId();

      const res = await request(app).get(
        `/api/v1/users/${userId}/dailyLogs/${fakeLogId}`
      );

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Daily log not found");
    });

    // Get user streaks tests
    it("should return user's streak total", async () => {
      const registerRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "streakUser",
        email: "streakuser@example.com",
        password: "Test@1234",
      });

      expect(registerRes.status).toBe(201);
      const userId = registerRes.body.user._id;

      // Create 3 daily logs for the user
      for (let i = 0; i < 3; i++) {
        const dailyLog = new DailyLog({
          foods: [],
          protein: 0,
          fats: 0,
          carbs: 0,
          exercises: [],
          completed: true,
          date: new Date(Date.now() - i * 86400000),
        });
        await dailyLog.save();

        await User.findByIdAndUpdate(userId, {
          $push: { dailyLogs: dailyLog._id },
        });
      }

      const res = await request(app).get(`/api/v1/users/${userId}/streaks`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("streak", 3);
    });

    it("should return HTTP status and error message if user is not found when getting streak", async () => {
      const fakeUserId = new mongoose.Types.ObjectId();

      const res = await request(app).get(`/api/v1/users/${fakeUserId}/streaks`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });

    // Create new daily log tests
    it("should create a new daily log for user", async () => {
      const registerRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "logCreator",
        email: "logcreator@example.com",
        password: "Test@1234",
      });

      expect(registerRes.status).toBe(201);
      const userId = registerRes.body.user._id;

      const res = await request(app)
        .post(`/api/v1/users/${userId}/dailyLogs`)
        .send({
          completed: false,
          date: new Date(),
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("dailyLog");
      expect(res.body.dailyLog).toHaveProperty("protein", 0);
      expect(res.body.dailyLog).toHaveProperty("fats", 0);
      expect(res.body.dailyLog).toHaveProperty("carbs", 0);
      expect(res.body.dailyLog).toHaveProperty("completed", false);

      const user = await User.findById(userId).populate("dailyLogs");
      expect(user?.dailyLogs?.length).toBe(1);
    });

    it("should return HTTP status 404 and error message if user does not exist when creating daily log", async () => {
      const fakeUserId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .post(`/api/v1/users/${fakeUserId}/dailyLogs`)
        .send({
          protein: 10,
          fats: 5,
          carbs: 15,
          completed: true,
        });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });

    // Update daily log information tests
    it("should update selected daily log information", async () => {
      const registerRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "logEditor",
        email: "logeditor@example.com",
        password: "Test@1234",
      });

      const userId = registerRes.body.user._id;

      const dailyLogRes = await request(app)
        .post(`/api/v1/users/${userId}/dailyLogs`)
        .send({
          completed: false,
        });

      const dailyLogId = dailyLogRes.body.dailyLog._id;

      const updateRes = await request(app)
        .put(`/api/v1/users/${userId}/dailyLogs/${dailyLogId}`)
        .send({
          completed: true,
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.dailyLog).toHaveProperty("completed", true);
    });

    it("should return HTTP status 404 and error message if user does not exist when updating daily log", async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const dailyLog = new DailyLog({
        foods: [],
        protein: 0,
        fats: 0,
        carbs: 0,
        exercises: [],
        completed: true,
        date: new Date(Date.now()),
      });

      const dailyLogId = dailyLog._id;

      await request(app).delete(`/api/v1/users/${fakeUserId}`);

      const updateRes = await request(app)
        .put(`/api/v1/users/${fakeUserId}/dailyLogs/${dailyLogId}`)
        .send({
          completed: true,
        });

      expect(updateRes.status).toBe(404);
      expect(updateRes.body).toHaveProperty("error", "User not found");
    });

    // Delete meal from daily log tests
    it("should delete meal from selected daily log", async () => {
      const userRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "mealDeleter",
        email: "mealdeleter@example.com",
        password: "Test@1234",
      });
      const userId = userRes.body.user._id;

      const meal = await Food.create({
        name: "Test Meal",
        mealType: "Lunch",
        servingSize: 1,
        numberOfServings: 1,
        calories: 250,
        protein: 10,
        fat: 5,
        carbohydrates: 30,
      });

      const logRes = await request(app)
        .post(`/api/v1/users/${userId}/dailyLogs`)
        .send({
          completed: false,
          date: new Date(),
          foods: [meal._id],
          exercises: [],
        });

      const logId = logRes.body.dailyLog._id;

      const deleteRes = await request(app)
        .put(`/api/v1/dailyLogs/${logId}/meals/${meal._id}`)
        .send({ userId });

      expect(deleteRes.status).toBe(200);

      const updatedLog = await DailyLog.findById(logId);
      expect(updatedLog?.foods?.length).toBe(0);
    });

    it("should return HTTP status 404 and error message if user does not exist when deleting meal from daily log", async () => {
      const fakeUserId = new mongoose.Types.ObjectId();

      const meal = await Food.create({
        name: "Fake Meal",
        mealType: "Dinner",
        servingSize: 1,
        numberOfServings: 1,
        calories: 300,
        protein: 15,
        fat: 10,
        carbohydrates: 20,
      });

      const log = await DailyLog.create({ foods: [meal._id] });

      const res = await request(app)
        .put(`/api/v1/dailyLogs/${log._id}/meals/${meal._id}`)
        .send({ userId: fakeUserId });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });

    it("should return HTTP status 404 and error message if daily log does not exist when deleting meal from daily log", async () => {
      const userRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "logNotFound",
        email: "logNotFound@example.com",
        password: "Test@1234",
      });
      const userId = userRes.body.user._id;
      const fakeLogId = new mongoose.Types.ObjectId();

      const meal = await Food.create({
        name: "Test Meal",
        mealType: "Lunch",
        servingSize: 1,
        numberOfServings: 1,
        calories: 250,
        protein: 10,
        fat: 5,
        carbohydrates: 30,
      });

      const res = await request(app)
        .put(`/api/v1/dailyLogs/${fakeLogId}/meals/${meal._id}`)
        .send({ userId });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Daily log not found");
    });

    it("should return HTTP status 404 and error message if meal does not exist when deleting meal from daily log", async () => {
      const userRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "noMealUser",
        email: "noMealUser@example.com",
        password: "Test@1234",
      });
      const userId = userRes.body.user._id;

      const logRes = await request(app)
        .post(`/api/v1/users/${userId}/dailyLogs`)
        .send({
          completed: false,
          date: new Date(),
          foods: [],
          exercises: [],
        });

      const logId = logRes.body.dailyLog._id;
      const fakeMealId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/v1/dailyLogs/${logId}/meals/${fakeMealId}`)
        .send({ userId });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Meal not found");
    });

    it("should return HTTP status 404 and error message if meal does not exist in daily log", async () => {
      const userRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "mealMismatch",
        email: "mealMismatch@example.com",
        password: "Test@1234",
      });
      const userId = userRes.body.user._id;

      const meal = await Food.create({
        name: "Extra Meal",
        mealType: "Snack",
        servingSize: 1,
        numberOfServings: 1,
        calories: 100,
        protein: 5,
        fat: 3,
        carbohydrates: 15,
      });

      const logRes = await request(app)
        .post(`/api/v1/users/${userId}/dailyLogs`)
        .send({
          completed: false,
          date: new Date(),
          foods: [],
          exercises: [],
        });

      const logId = logRes.body.dailyLog._id;

      const res = await request(app)
        .put(`/api/v1/dailyLogs/${logId}/meals/${meal._id}`)
        .send({ userId });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty(
        "error",
        "Meal not found in this daily log "
      );
    });

    // Delete activity from daily log tests
    it("should delete activity from selected daily log", async () => {
      const userRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "activityDeleter",
        email: "activitydeleter@example.com",
        password: "Test@1234",
      });
      const userId = userRes.body.user._id;

      const activity = await Exercise.create({
        name: "Running",
        duration: 30,
        caloriesBurned: 300,
      });

      const logRes = await request(app)
        .post(`/api/v1/users/${userId}/dailyLogs`)
        .send({
          completed: false,
          date: new Date(),
          foods: [],
          exercises: [activity._id],
        });

      const logId = logRes.body.dailyLog._id;

      const deleteRes = await request(app)
        .put(`/api/v1/dailyLogs/${logId}/activities/${activity._id}`)
        .send({ userId });

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.message).toBe(
        "Activity removed from daily log successfully"
      );

      const updatedLog = await DailyLog.findById(logId);
      expect(updatedLog?.exercises?.length).toBe(0);
    });

    it("should return HTTP status 404 and error message if user does not exist when deleting activity from daily log", async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const activity = await Exercise.create({
        name: "Cycling",
        duration: 45,
        caloriesBurned: 400,
      });

      const log = await DailyLog.create({ exercises: [activity._id] });

      const res = await request(app)
        .put(`/api/v1/dailyLogs/${log._id}/activities/${activity._id}`)
        .send({ userId: fakeUserId });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });

    it("should return HTTP status 404 and error message if activity does not exist", async () => {
      const userRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "noActivityUser",
        email: "noactivityuser@example.com",
        password: "Test@1234",
      });
      const userId = userRes.body.user._id;

      const logRes = await request(app)
        .post(`/api/v1/users/${userId}/dailyLogs`)
        .send({
          completed: false,
          date: new Date(),
          foods: [],
          exercises: [],
        });

      const logId = logRes.body.dailyLog._id;
      const fakeActivityId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/v1/dailyLogs/${logId}/activities/${fakeActivityId}`)
        .send({ userId });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Activity not found");
    });

    it("should return HTTP status 404 and error message if activity does not exist in daily log", async () => {
      const userRes = await request(app).post("/api/v1/auth/sign-up").send({
        username: "activityMismatch",
        email: "activitymismatch@example.com",
        password: "Test@1234",
      });
      const userId = userRes.body.user._id;

      const activity = await Exercise.create({
        name: "Yoga",
        duration: 60,
        caloriesBurned: 250,
      });

      const logRes = await request(app)
        .post(`/api/v1/users/${userId}/dailyLogs`)
        .send({
          completed: false,
          date: new Date(),
          foods: [],
          exercises: [],
        });

      const logId = logRes.body.dailyLog._id;

      const res = await request(app)
        .put(`/api/v1/dailyLogs/${logId}/activities/${activity._id}`)
        .send({ userId });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty(
        "error",
        "Activity not found in this daily log"
      );
    });
  });
}
