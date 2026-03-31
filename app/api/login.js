import { verifyPassword, generateToken } from "@/lib/auth";

export async function POST(req) {
  const { email, password } = await req.json();

  if (email !== process.env.ADMIN_EMAIL) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isValid = await verifyPassword(
    password,
    process.env.ADMIN_PASSWORD_HASH
  );

  if (!isValid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = generateToken({ email, role: "admin" });

  return Response.json({ token });
}