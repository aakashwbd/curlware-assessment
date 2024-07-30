/** @type {import('tailwindcss').Config} */
export default {
    content: ["./resources/**/*.blade.php", "./resources/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                primary: ["Montserrat", "sans-serif"],
                secondary: ["Edu AU VIC WA NT Hand", "cursive"],
            },
        },
    },
    plugins: [],
};
