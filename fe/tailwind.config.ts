import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        lamaSky: "#C3EBFA",
        lamaSkyLight: "#EDF9FD",
        lamaPurple: "#CFCEFF",
        lamaPurpleLight: "#F1F0FF",
        lamaYellow: "#FAE27C",
        lamaYellowLight: "#FEFCE8",
        lamaOrange: "#FFD8A9",       // Cam pastel - mới
        lamaOrangeLight: "#FFF3E4",  // Cam pastel nhạt - mới
        lamaBlue: "#A7C7E7",         // Xanh dương nhạt - mới
        lamaBlueLight: "#EAF3FB",    // Xanh dương nhạt hơn - mới
      },
    },
  },
  plugins: [],
};
export default config;
