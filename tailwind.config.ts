import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sunrise: "#FFB347",
        ocean: "#4FC3F7",
        forest: "#4CAF50",
        dusk: "#9575CD"
      },
      fontFamily: {
        display: ["'Baloo 2'", "Segoe UI", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: [typography]
};

export default config;

