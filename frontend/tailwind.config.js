/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'text-stroke-urban',
    'text-stroke-rural',
    'text-stroke-classy',
    'text-stroke-chill',
    'text-stroke-graphics',
    'title-stroke',
  ],
  theme: {
    extend: {
      colors: {
        'background-primary': '#171519',
        'rest-color': '#9b9dad',
        'active-color': '#b68672',
        'urban-theme': '#e96929',
        'rural-theme': '#80c080',
        'classy-theme': '#ef5555',
        'chill-theme': '#9fa8da',
        'graphics-theme': '#000000',
        'urban-active': '#e96929',
        'urban-rest': '#b68672',
        'rural-active': '#80c080',
        'rural-rest': '#869582',
        'classy-active': '#ef5555',
        'classy-rest': '#f38484',
        'chill-active': '#9fa8da',
        'chill-rest': '#8f909d',
      },
    },
  },
  plugins: [],
};
