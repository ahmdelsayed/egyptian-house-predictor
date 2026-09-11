/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B211F",
          mid: "#153431",
          soft: "#1E433F",
        },
        papyrus: {
          DEFAULT: "#F7F1E0",
          dim: "#EFE5C8",
        },
        ink: {
          DEFAULT: "#16312C",
          soft: "#54655E",
        },
        gold: {
          DEFAULT: "#B08A3E",
          bright: "#C89F4E",
        },
        olive: "#6E7A4F",
        line: "#E3D9BD",
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 30px 60px -20px rgba(0, 0, 0, 0.45)",
        soft: "0 10px 30px -10px rgba(11, 33, 31, 0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      maxWidth: {
        prose: "40ch",
      },
    },
  },
  plugins: [],
};
