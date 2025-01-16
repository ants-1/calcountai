import { IUser } from "../models/user";
import jwt from "jsonwebtoken";

const generateToken = (user: IUser) => {
  const TOKEN_SECRET_KEY: string = process.env.TOKEN_SECRET_KEY as string;
  const TOKEN_EXPIRE_TIME: string = process.env.TOKEN_EXPIRE_TIME as string;

  const { _id, email } = user;

  return jwt.sign(
    {
      user: {
        _id,
        email,
      },
    },
    TOKEN_SECRET_KEY,
    { expiresIn: TOKEN_EXPIRE_TIME }
  );
};

export default generateToken;
