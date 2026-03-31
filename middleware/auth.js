import { verifyToken } from "@/lib/auth";

export function authMiddleware(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("Token manquant");
  }

  const token = authHeader.split(" ")[1];

  return verifyToken(token);
}