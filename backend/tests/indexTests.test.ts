process.env.NODE_ENV = "test";

import mongoose from "mongoose";
import { beforeAll, afterAll } from "@jest/globals";
import authTests from "./authTests";
import userTests from "./userTests";

let authInfo = {
  token: "",
  userId: "",
};

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.DB_TEST_URL || "");
  }
  const collections = await mongoose.connection.db?.collections();

  if (!collections) {
    return;
  }

  // Delete all data in database before starting tests
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  const collections = await mongoose.connection.db?.collections();

  if (!collections) {
    return;
  }

  // Delete all data in database after finishing all tests
  for (const collection of collections) {
    await collection.deleteMany({});
  }
  await mongoose.connection.close();
});

authTests(authInfo);
userTests(authInfo);



// describe("User tests", () => {});

// describe("Food tests", () => {});

// describe("Exercise tests", () => {});

// describe("Daily log tests", () => {});

// describe("Challenge tests", () => {});
