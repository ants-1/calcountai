import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import connectToDatabase from "./config/db";
import initialisePassport from "./passport/initialisePassport";
import bodyParser from "body-parser";
import session from "express-session";
import routes from "./routes/index";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
// const allowedOrigins = [
//   String(PORT),
//   "http://localhost:4000",
//   String(process.env.FRONTEND_DEV_URL),
//   String(process.env.FRONTEND_PRO_URL),
// ];

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
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", routes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };