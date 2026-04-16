import dotenv from "dotenv";

// Node.js 20.6+ expõe process.loadEnvFile(); Bun (e outras runtimes) podem não ter.
const loadEnvFile = (process as NodeJS.Process & { loadEnvFile?: () => void })
  .loadEnvFile;
if (typeof loadEnvFile === "function") {
  loadEnvFile();
} else {
  dotenv.config();
}
