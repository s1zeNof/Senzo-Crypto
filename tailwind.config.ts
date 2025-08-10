import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      container: { center: true, padding: '2rem' },
      colors: {
        border: 'hsl(214, 14%, 20%)',
        background: 'hsl(222, 16%, 10%)',
        foreground: 'hsl(210, 20%, 98%)',
        card: 'hsl(222, 16%, 12%)',
        muted: 'hsl(215, 14%, 16%)',
        primary: { DEFAULT: 'hsl(210, 100%, 60%)' },
        ring: 'hsl(210, 100%, 60%)'
      },
      borderRadius: { lg: '12px', md: '10px', sm: '8px' }
    }
  },
  plugins: []
} satisfies Config
