import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        plum: { 50:"#faf5f9",100:"#f3e8f1",200:"#e5c9e0",300:"#d3a3cb",400:"#b975ae",500:"#9c528f",600:"#7e4074",700:"#65335e",800:"#4e2849",900:"#3a1e37" },
        rose2: { 50:"#fff6f8",100:"#fdecef",200:"#f9d8df",300:"#f2b8c5",400:"#e98ea3",500:"#d96782",600:"#bd4d6a" },
        blush: { 50:"#fff9fa",100:"#fdf0f3",200:"#f8dde3",300:"#f0c2cd" },
        lavender: { 50:"#faf8ff",100:"#f1ecfb",200:"#e4daf6",300:"#d0bfed",400:"#b89fdf" },
        peach: { 50:"#fff8f3",100:"#fdeee2",200:"#f9dcc7",300:"#f2c1a1" },
        teal2: { 500:"#0e7c7b", 600:"#0a5f5e" },
        cream: "#fdfbf7",
      },
    },
  },
  plugins: [],
};
export default config;
