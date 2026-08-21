import frontendPreset from "@ai-infused-projects/frontend/tailwind-preset";
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [frontendPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "../../../packages/frontend/src/**/*.{ts,tsx}",
  ],
};

export default config;
