import { defineConfig } from "tsdown";

export default defineConfig({
  exports: true,
  failOnWarn: true,
  platform: "neutral",
  target: "es2024",
  unused: {
    enabled: true,
  },
});
