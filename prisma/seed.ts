/**
 * Charge .env depuis la racine du projet (meme si le seed est lance autrement que via Prisma).
 */
import "dotenv/config";

import path from "node:path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function missingEnvHelp(): never {
  const envPath = path.join(process.cwd(), ".env");
  console.error(`
[seed] Configuration incomplete.

1. Copiez le modele :  .env.example  ->  .env
2. Remplissez au minimum :
   - DATABASE_URL
   - ADMIN_PASSWORD   (min. 8 caracteres)
3. Puis :  npm run db:seed

Fichier attendu : ${envPath}
`);
  throw new Error("Configuration manquante pour le seed.");
}

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@pharmacie.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!password || password.length < 8) {
    console.error(
      "[seed] ADMIN_PASSWORD absent ou trop court (minimum 8 caracteres)."
    );
    missingEnvHelp();
  }

  if (!process.env.DATABASE_URL) {
    console.error("[seed] DATABASE_URL est absent du fichier .env");
    missingEnvHelp();
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      role: "ADMIN",
    },
    update: {
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`[seed] Compte administrateur pret : ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
