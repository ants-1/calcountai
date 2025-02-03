import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import connectToDatabase from "./db";
import initialisePassport from "./passport/initialisePassport";
import bodyParser from "body-parser";
import session from "express-session";
import routes from "./routes/index";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

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
app.use("/", routes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
