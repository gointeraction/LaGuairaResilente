/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── VENEZUELA FLAG PALETTE ───────────────────────────────────────
        // Blue stripe: deep cobalt navy
        primary: {
          50:  '#e6edf8',
          100: '#c0d0ee',
          200: '#98b0e3',
          300: '#6e90d8',
          400: '#4d77d0',
          500: '#2d5dc8',   // mid-brand blue
          600: '#1a4ab5',   // primary interactive
          700: '#0a38a0',   // hover state
          800: '#003893',   // 🇻🇪 Venezuelan flag blue
          900: '#002470',   // deep navy
          950: '#001040',
        },
        // Red stripe: vivid patriotic red
        'vzla-red': {
          50:  '#fde8eb',
          100: '#fac5cc',
          200: '#f59eaa',
          300: '#ef7688',
          400: '#e85069',
          500: '#CF142B',   // 🇻🇪 Venezuelan flag red
          600: '#b50f24',
          700: '#9a0a1d',
          800: '#7e0617',
          900: '#5e0310',
        },
        // Yellow/Gold stripe: warm gold
        'vzla-gold': {
          50:  '#fffde6',
          100: '#fffac0',
          200: '#fff595',
          300: '#ffee67',
          400: '#ffe640',
          500: '#FCD116',   // 🇻🇪 Venezuelan flag yellow
          600: '#e6bc00',
          700: '#c9a400',
          800: '#a88900',
          900: '#7a6400',
        },
        // ─── SEMANTIC TOKENS ──────────────────────────────────────────────
        success: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
        },
        accent: {
          50:  '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        gray: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1.4' }],
        'sm':   ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem',     { lineHeight: '1.6' }],
        'lg':   ['1.125rem', { lineHeight: '1.6' }],
        'xl':   ['1.25rem',  { lineHeight: '1.4' }],
        '2xl':  ['1.5rem',   { lineHeight: '1.3' }],
        '3xl':  ['1.875rem', { lineHeight: '1.3' }],
        '4xl':  ['2.25rem',  { lineHeight: '1.2' }],
        '5xl':  ['3rem',     { lineHeight: '1.15' }],
      },
      spacing: {
        '18':  '4.5rem',
        '88':  '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'sm':      '4px',
        'DEFAULT': '8px',
        'lg':      '12px',
        'xl':      '16px',
        '2xl':     '24px',
        '3xl':     '32px',
        'full':    '9999px',
      },
      boxShadow: {
        'sm':    '0 1px 3px rgba(0, 0, 0, 0.1)',
        'DEFAULT':'0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'md':    '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'lg':    '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'xl':    '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
        '2xl':   '0 25px 50px rgba(0, 0, 0, 0.12)',
        // Coloured glows using Venezuela flag colours
        'glow-blue': '0 0 24px rgba(0, 56, 147, 0.35)',
        'glow-red':  '0 0 24px rgba(207, 20, 43, 0.35)',
        'glow-gold': '0 0 24px rgba(252, 209, 22, 0.45)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        // Venezuelan tricolor gradient (horizontal: red → yellow → blue)
        'vzla-flag':     'linear-gradient(to right, #CF142B, #FCD116, #003893)',
        // Diagonal tricolor for hero/banner accents
        'vzla-diagonal': 'linear-gradient(135deg, #003893 0%, #003893 33%, #FCD116 33%, #FCD116 66%, #CF142B 66%, #CF142B 100%)',
        // Subtle page background tint using primary blue
        'page-gradient': 'linear-gradient(135deg, #e6edf8 0%, #f8fafc 50%, #fde8eb 100%)',
        // Card shimmer
        'shimmer':       'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
      },
      transitionDuration: {
        'DEFAULT': '150ms',
        'fast':    '100ms',
        'normal':  '200ms',
        'slow':    '350ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth':    'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        flagWave: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        starPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':      { transform: 'scale(1.15)', opacity: '0.8' },
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out forwards',
        'slide-up':   'slideUp 0.4s ease-out forwards',
        'scale-in':   'scaleIn 0.25s ease-out forwards',
        'shimmer':    'shimmer 1.5s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flag-wave':  'flagWave 4s ease infinite',
        'star-pulse': 'starPulse 2s ease-in-out infinite',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
      },
    },
  },
  plugins: [],
}
