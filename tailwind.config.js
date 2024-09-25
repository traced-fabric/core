/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '.dark'],

  content: [
    './docs/**/*.{md,vue}',
    './docs/.vitepress/components/**/*.vue',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
