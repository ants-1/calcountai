import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user";
import passport from "passport";
import generateToken from "../utils/generateToken";

// @desc    Register new user
// @route   POST /api/v1/auth/sign-up
const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate("signup", (err: Error | null, user: IUser | false) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).json({
        error: "Sign up failed. User already exists or invalid data.",
      });
    }

    req.login(user, { session: false }, async (loginErr) => {
      if (loginErr) {
        return res.status(400).json({ error: "Error during login process." });
      }

      try {
        const token = generateToken(user);
        return res.status(201).json({ success: true, token, user });
      } catch (generateTokenError) {
        return next(generateTokenError);
      }
    });
  })(req, res, next);
};

// @desc    Login user & get token
// @route   POST /api/v1/auth/login
const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate("login", (err: Error | null, user: IUser | false) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    req.login(user, { session: false }, async (loginErr) => {
      if (loginErr) {
        return res.status(400).json({ error: "Error during login process." });
      }

      try {
        const token = generateToken(user);
        return res.status(200).json({ success: true, token });
      } catch (generateTokenError) {
        return next(generateTokenError);
      }
    });
  })(req, res, next);
};

// @desc    Logout user
// @route   GET /api/v1/auth/logout
const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }

      return res
        .status(200)
        .json({ success: true, message: "Logout successful." });
    });
  } catch (err) {
    return next(err);
  }
};

export default {
  signUp,
  login,
  logout,
};
