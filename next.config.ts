import type { NextConfig } from "next";

import { createJiti } from "jiti";
import { fileURLToPath } from "url";
const jiti = createJiti(fileURLToPath(import.meta.url));

async function loadEnv() {
  await jiti.import("./src/env.js");
}

loadEnv().catch((e) => {
  console.error(e);
  process.exit(1);
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
