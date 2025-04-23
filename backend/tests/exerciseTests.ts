import request from "supertest";
import { app } from "../src/index";
import mongoose from "mongoose";
import { describe, expect, it } from "@jest/globals";
import Exercise from "../src/models/exercise";

export default function exerciseTests() {
  describe("Exercise tests", () => {
    // Get all exercise tests
    it("should retrieve all exercises from database", async () => {
      const exercise = new Exercise({
        name: "Test exercise",
        duration: "1",
        caloriesBurned: 100,
      });

      await exercise.save();

      const res = await request(app).get("/api/v1/exercises");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("exercises");
    });

    it("should return HTTP status 404 and message when foods database is empty", async () => {
      await Exercise.deleteMany({});

      const res = await request(app).get("/api/v1/exercises");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("No exercises found");
    });

    // Get selected exercise tests
    it("should retrieve select exercise from database", async () => {
      const exercise = new Exercise({
        name: "Test exercise",
        duration: "1",
        caloriesBurned: 100,
      });

      await exercise.save();

      const res = await request(app).get(`/api/v1/exercises/${exercise._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("exercise");
    });

    it("should reutrn HTTP status 404 and message if selected exercise was not found", async () => {
      const fakeExerciseId = new mongoose.Types.ObjectId();

      const res = await request(app).get(`/api/v1/exercises/${fakeExerciseId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Exercise not found");
    });

    // Create exercise test
    it("should create new exercise item in database", async () => {
      const newExercise = {
        name: "Test exercise",
        duration: "1",
        caloriesBurned: 100,
      };

      const res = await request(app)
        .post("/api/v1/exercises")
        .send(newExercise);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("newExercise");
    });

    // Update exercise information tests
    it("should update existing exercise item information", async () => {
      const exercise = new Exercise({
        name: "Test exercise",
        duration: "1",
        caloriesBurned: 100,
      });

      const updatedExercise = {
        name: "Test exercise (Updated)",
        duration: "1",
        caloriesBurned: 200,
      };

      await exercise.save();

      const exerciseId = exercise._id;
      const res = await request(app)
        .put(`/api/v1/exercises/${exerciseId}`)
        .send(updatedExercise);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("updatedExercise");
      expect(res.body.updatedExercise.name).toBe("Test exercise (Updated)");
      expect(res.body.updatedExercise.caloriesBurned).toBe(200);
    });

    it("should return HTTP status 404 an error message when exercise ID not found, when updating exercise", async () => {
      const updatedExercise = {
        name: "Test exercise (Updated)",
        duration: "1",
        caloriesBurned: 200,
      };

      const fakeExerciseId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/v1/exercises/${fakeExerciseId}`)
        .send(updatedExercise);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Exercise not found");
    });

    // Delete exercise tests
    it("should delete selected exercise from database", async () => {
      const exercise = new Exercise({
        name: "Test exercise",
        duration: "1",
        caloriesBurned: 100,
      });

      await exercise.save();

      const exerciseId = exercise._id;
      const res = await request(app).delete(`/api/v1/exercises/${exerciseId}`);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Exercise successfully deleted");
      expect(res.body.exerciseId).toBe(exerciseId.toString());
    });

    it("should return HTTP status 404 and error message if exercies not found, when deleting exercise", async () => {
        const fakeExerciseId = new mongoose.Types.ObjectId();

        const res = await request(app).delete(`/api/v1/exercises/${fakeExerciseId}`);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Exercise not found");
    })
  });
}
