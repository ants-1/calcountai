import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import connectToDatabase from "./db";
import initialisePassport from "./passport/initialisePassport";
import bodyParser from "body-parser";
import session from "express-session";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userController";
import dailyLogRoutes from "./routes/dailyLogRoutes";
import foodRoutes from "./routes/foodRoutes";
import exerciseRoutes from "./routes/exerciseRoutes";
import challengeRoutes from "./routes/challengeRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectToDatabase();
initialisePassport();

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.TOKEN_SECRET_KEY!,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/", userRoutes);
app.use("/", dailyLogRoutes);
app.use("/", foodRoutes);
app.use("/", exerciseRoutes);
app.use("/", challengeRoutes);

app.listen(PORT, () => {
  console.log(`Server if running on port ${PORT}`);
});
