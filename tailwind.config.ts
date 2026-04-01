import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        sand: "#f6f0e8",
        coral: "#f97360",
        ocean: "#1f6f78",
        mint: "#c4f1de",
        gold: "#f4c95d"
      },
      fontFamily: {
        sans: ["Segoe UI", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 16px 40px rgba(24, 33, 47, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
