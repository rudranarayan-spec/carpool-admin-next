/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        velocity: {
          bg: "#0B0C10",          // Deep dark background
          sidebar: "#0F1017",     // Slightly lighter panel bg
          card: "#141622",        // Glass card fill
          border: "#23263B",      // Subtle card border
          purple: "#8B5CF6",      // Primary accent purple/violet
          purpleGlow: "rgba(139, 92, 246, 0.15)",
          emerald: "#10B981",     // Stat green
          amber: "#F59E0B",       // Pending orange
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glow: "0 0 20px rgba(139, 92, 246, 0.3)",
      },
    },
  },
  plugins: [],
};