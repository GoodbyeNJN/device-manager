/** @type {import('tailwindcss').Config} */
const config = {
    content: ["./{pages,components}/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],

    daisyui: {
        themes: ["light", "dark"],
    },
};

module.exports = config;
