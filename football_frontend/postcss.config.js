import autofixer from 'autoprefixer'
export default {
  plugins: {
    tailwindcss: { config: './tailwind.config.js' },
    autoprefixer: { config: autofixer },
  },
}
