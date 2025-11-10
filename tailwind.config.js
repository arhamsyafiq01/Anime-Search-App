// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        // This is crucial for the responsive grid layout
        fluid: "repeat(auto-fit, minmax(180px, 1fr))", // Adjust minmax(180px) to control card width
      },
    },
  },
  plugins: [],
};
