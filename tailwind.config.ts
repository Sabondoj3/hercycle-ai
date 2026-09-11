import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        plum: { 50:"#faf5f9",100:"#f3e8f1",200:"#e5c9e0",300:"#d3a3cb",400:"#b975ae",500:"#9c528f",600:"#7e4074",700:"#65335e",800:"#4e2849",900:"#3a1e37" },
        teal2: { 500:"#0e7c7b", 600:"#0a5f5e" },
        cream: "#fdfbf7",
      },
    },
  },
  plugins: [],
};
export default config;
