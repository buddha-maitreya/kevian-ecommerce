import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#353535",
        accent: "#dd8c00",
      },
    },
  },
  plugins: [],
} satisfies Config;
