import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  token?: string;
  authData?: any;
}

const TOKEN_ERROR_MESSAGE = "Invalid token";

const validateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
      return void res.status(400).json({ error: { message: TOKEN_ERROR_MESSAGE } });
    }

    const bearer = bearerHeader.split(" ");
    if (bearer.length !== 2 || bearer[0] !== "Bearer") {
      return void res.status(400).json({ error: { message: TOKEN_ERROR_MESSAGE } });
    }

    const token = bearer[1];
    if (!token) {
      return void res.status(400).json({ error: { message: TOKEN_ERROR_MESSAGE } });
    }

    const SECRET = process.env.TOKEN_SECRET_KEY as string;
    const decoded = jwt.verify(token, SECRET);

    if (!decoded || typeof decoded !== "object") {
      return void res.status(400).json({ error: { message: TOKEN_ERROR_MESSAGE } });
    }

    req.authData = decoded;
    return void res.status(200).json({ user: decoded.user });
  } catch (error) {
    return void res.status(400).json({ error: { message: TOKEN_ERROR_MESSAGE } });
  }
};

export default validateToken;
