import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import connectToDatabase from "./db";
import initialisePassport from "./passport/initialisePassport";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectToDatabase();
initialisePassport();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, () => {
    console.log(`Server if running on port ${PORT}`);
});