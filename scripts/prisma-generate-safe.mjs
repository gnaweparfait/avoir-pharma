import { spawnSync } from "node:child_process";

function runGenerate() {
  return spawnSync("npx", ["prisma", "generate"], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });
}

const result = runGenerate();
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

if (result.status === 0) {
  process.exit(0);
}

const out = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
const lockedEngine =
  out.includes("EPERM") || out.includes("query_engine-windows.dll.node");

if (lockedEngine) {
  console.error("\n[db:generate] Prisma engine verrouille par un process (Windows).\n");
  console.error("Actions recommandees :");
  console.error("1) Arreter le serveur Next.js en cours (Ctrl+C)");
  console.error("2) Fermer Prisma Studio si ouvert");
  console.error("3) Relancer: npm run db:generate");
  console.error("\nOption force (si necessaire): taskkill /F /IM node.exe\n");
}

process.exit(result.status ?? 1);
