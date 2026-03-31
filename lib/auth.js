import jwt from "jsonwebtoken";

export function verifyToken(token) {
  return jwt.verify(token, process.env.AUTH_SECRET);
}