/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "400px",
      },
      backgroundImage: {
        loginBg: "url('./src/assets/images/loginbg.png')",
      },
      colors: {
        loginWhite: "#f4eeee",
        loginBlue: "#4f709c",
        yellowAccent: "##e5d283",
        mediumBlue: "#0cc0df",
      },
    },
  },
  plugins: [],
};
