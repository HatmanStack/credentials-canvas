/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: [
    // Dynamic theme classes that use template literals
    // These are CSS classes in launch.css, not Tailwind-generated
    // Safelist ensures they're documented and won't be purged if moved to Tailwind
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
        // Base colors (from theme-variables.css and styles.css)
        'background-primary': '#171519',
        'rest-color': '#9b9dad',
        'active-color': '#b68672',

        // Theme-specific colors (from checkbox.css and theme-variables.css)
        'urban-theme': '#e96929',
        'rural-theme': '#80c080',
        'classy-theme': '#ef5555',
        'chill-theme': '#9fa8da',
        'graphics-theme': '#000000',

        // Additional theme variants
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
}

