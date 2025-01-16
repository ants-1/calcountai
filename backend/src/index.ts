import express from "express";
import connectToDatabase from "./db";

const app = express();
const PORT = process.env.PORT || 3000;

connectToDatabase();

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server if running on port ${PORT}`);
});