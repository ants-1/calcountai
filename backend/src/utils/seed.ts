import mongoose from "mongoose";
import dotenv from "dotenv";
import Challenge from "../models/challenge";

dotenv.config();

async function createSeed() {
  try {
    await mongoose.connect(process.env.DB_URL || "");
    console.log("Connected to DB");

    await seedChallenges();

    console.log("All data seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
}

async function seedChallenges() {
  try {
    await Challenge.deleteMany({});

    await Challenge.create([
      {
        name: "Streak 1",
        level: 1,
        description: "Complete by getting a 1-day login streak",
        challengeType: "Streak",
      },
      {
        name: "Streak 5",
        level: 5,
        description: "Complete by getting a 5-day login streak",
        challengeType: "Streak",
      },
      {
        name: "Streak 10",
        level: 10,
        description: "Complete by getting a 10-day login streak",
        challengeType: "Streak",
      },
      {
        name: "Streak 20",
        level: 20,
        description: "Complete by getting a 20-day login streak",
        challengeType: "Streak",
      },
      {
        name: "Streak 50",
        level: 50,
        description: "Complete by getting a 50-day login streak",
        challengeType: "Streak",
      },
      {
        name: "Log 1 Meal",
        level: 5,
        description: "Complete by logging 1 meal",
        challengeType: "Meal",
      },
      {
        name: "Log 5 Meals",
        level: 5,
        description: "Complete by logging 5 meals",
        challengeType: "Meal",
      },
      {
        name: "Log 10 Meals",
        level: 10,
        description: "Complete by logging 10 meals",
        challengeType: "Meal",
      },
      {
        name: "Log 20 Meals",
        level: 20,
        description: "Complete by logging 20 meals",
        challengeType: "Meal",
      },
      {
        name: "Log 50 Meals",
        level: 50,
        description: "Complete by logging 50 meals",
        challengeType: "Meal",
      },
      {
        name: "Log 1 Activity",
        level: 5,
        description: "Complete by logging 1 activity",
        challengeType: "Activity",
      },
      {
        name: "Log 5 Activities",
        level: 5,
        description: "Complete by logging 5 activities",
        challengeType: "Activity",
      },
      {
        name: "Log 10 Activities",
        level: 10,
        description: "Complete by logging 10 activities",
        challengeType: "Activity",
      },
      {
        name: "Log 20 Activities",
        level: 20,
        description: "Complete by logging 20 activities",
        challengeType: "Activity",
      },
      {
        name: "Log 50 Activities",
        level: 50,
        description: "Complete by logging 50 activities",
        challengeType: "Activity",
      },
    ]);

    console.log("Challenges seeded!");
  } catch (err) {
    console.error("Error seeding challenges", err);
  }
}

createSeed();
