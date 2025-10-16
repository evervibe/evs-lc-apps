import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0C0C0F",
        foreground: "#ededed",
        primary: {
          DEFAULT: "#EAD19F",
          dark: "#c9b17e",
        },
        accent: "#4A90E2",
        card: "#1A1B1F",
        "text-soft": "#9CA3AF",
      },
    },
  },
};

export default config;
