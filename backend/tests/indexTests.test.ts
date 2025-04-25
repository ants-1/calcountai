import mongoose from "mongoose";
import { beforeAll, afterAll, jest } from "@jest/globals";
import authTests from "./authTests";
import userTests from "./userTests";
import dailyLogTests from "./dailyLogTests";
import foodTests from "./foodTests";
import exerciseTests from "./exerciseTests";
import challengeTests from "./challengeTests";

let authInfo = {
  token: "",
  userId: "",
};

beforeAll(async () => {
  try {
    await mongoose.connection.close();
    if (mongoose.connection.readyState === 0) {
      const testDBUrl = process.env.DB_TEST_URL;
      await mongoose.connect(testDBUrl || "");
    }
    const collections = await mongoose.connection.db?.collections();

    if (!collections) {
      return;
    }

    // Delete all data in database before starting tests
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  } catch (err) {
    console.error("Error during beforeAll when testing: ", err);
    throw err;
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
foodTests();
exerciseTests();
challengeTests(authInfo);
dailyLogTests(authInfo);
