import request from "supertest";
import { app } from "../src/index";
import mongoose from "mongoose";
import { describe, expect, it } from "@jest/globals";
import Food from "../src/models/food";

export default function foodTests() {
  describe("Food tests", () => {
    // Get all food tests
    it("should retrieve all foods from database", async () => {
      const food = new Food({
        name: "Test food",
        calories: 10,
        numberOfServings: 1,
        servingSize: 2,
        mealType: "Lunch",
        protein: 2,
        fat: 3,
        carbohydrates: 3,
      });

      await food.save();

      const res = await request(app).get("/api/v1/foods");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("foods");
    });

    it("should return HTTP status 404 and message when foods is empty", async () => {
      await Food.deleteMany({});

      const res = await request(app).get("/api/v1/foods");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("No foods found");
    });

    // Get selected food tests
    it("should retrieve select food from database", async () => {
      const food = new Food({
        name: "Test food",
        calories: 10,
        numberOfServings: 1,
        servingSize: 2,
        mealType: "Lunch",
        protein: 2,
        fat: 3,
        carbohydrates: 3,
      });

      await food.save();

      const res = await request(app).get(`/api/v1/foods/${food._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("food");
    });

    it("should return HTTP status 404 and message if selected food was not found", async () => {
      const fakeFoodId = new mongoose.Types.ObjectId();

      const res = await request(app).get(`/api/v1/foods/${fakeFoodId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Food not found");
    });

    // Create food test
    it("should create new food item in database", async () => {
      const newFood = {
        name: "Test food",
        calories: 10,
        numberOfServings: 1,
        servingSize: 2,
        mealType: "Lunch",
        protein: 2,
        fat: 3,
        carbohydrates: 3,
      };

      const res = await request(app).post("/api/v1/foods").send(newFood);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("newFood");
    });

    // Update food information tests
    it("should update existing food item information", async () => {
      const food = new Food({
        name: "Test food",
        calories: 10,
        numberOfServings: 1,
        servingSize: 2,
        mealType: "Lunch",
        protein: 2,
        fat: 3,
        carbohydrates: 3,
      });

      const updatedFood = {
        name: "Test food (Updated)",
        calories: 10,
        numberOfServings: 1,
        servingSize: 2,
        mealType: "Dinner",
        protein: 2,
        fat: 3,
        carbohydrates: 3,
      };

      await food.save();

      const foodId = food._id;
      const res = await request(app)
        .put(`/api/v1/foods/${foodId}`)
        .send(updatedFood);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("updatedFood");
      expect(res.body.updatedFood.name).toBe("Test food (Updated)");
      expect(res.body.updatedFood.mealType).toBe("Dinner");
    });

    it("should return HTTP status 404 and error message when food ID not found", async () => {
      const updatedFood = {
        name: "Test food (Updated)",
        calories: 10,
        numberOfServings: 1,
        servingSize: 2,
        mealType: "Dinner",
        protein: 2,
        fat: 3,
        carbohydrates: 3,
      };

      const fakeFoodID = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/v1/foods/${fakeFoodID}`)
        .send(updatedFood);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Food not found");
    });

    // Delete food tests
    it("should delete selected food from database", async () => {
      const food = new Food({
        name: "Test food",
        calories: 10,
        numberOfServings: 1,
        servingSize: 2,
        mealType: "Lunch",
        protein: 2,
        fat: 3,
        carbohydrates: 3,
      });

      await food.save();

      const foodId = food._id;
      const res = await request(app).delete(`/api/v1/foods/${foodId}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Food successfully deleted");
      expect(res.body.foodId).toBe(foodId.toString());
    });

    it("should return HTTP status 404 and error message if food not found", async () => {
      const fakeFoodId = new mongoose.Types.ObjectId();

      const res = await request(app).delete(`/api/v1/foods/${fakeFoodId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Food not found");
    });
  });
}
