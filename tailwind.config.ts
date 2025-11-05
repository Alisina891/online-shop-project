import type { Config } from "tailwindcss";

export default {
content: [
  "./src/app/**/*.{ts,tsx,js,jsx,mdx}",
  "./src/components/**/*.{ts,tsx,js,jsx,mdx}",
  "./src/hooks/**/*.{ts,tsx,js,jsx,mdx}",
  "./src/libs/**/*.{ts,tsx,js,jsx,mdx}",
],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
