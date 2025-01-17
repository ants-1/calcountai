import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  token?: string;
  authData?: any;
}

const validateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    if (bearer.length === 2) {
      const bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(
        req.token,
        process.env.TOKEN_SECRET_KEY || "",
        (err, authData) => {
          if (err) {
            return res.status(403).json({ message: "Forbidden" });
          } else {
            req.authData = authData;
            next();
          }
        }
      );
    } else {
      return res.status(403).json({ message: "Invalid token format" });
    }
  } else {
    return res.status(403).json({ message: "Unauthorized access" });
  }
};
export default validateToken;
