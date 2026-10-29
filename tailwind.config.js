module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "wrnc-background": "#080808",
        "wrnc-surface": "#1A1D22",
        "wrnc-surface-elevated": "#24282E",
        "wrnc-border": "#30343A",
        "wrnc-text-primary": "#FFFFFF",
        "wrnc-text-secondary": "#C0C0C0",
        "wrnc-action-primary": "#FF6400",
        "wrnc-data-accent": "#7C3AED",
        "wrnc-data-accent-text": "#C4B5FD",
        "semantic-success": "#22C55E",
        "semantic-warning": "#F59E0B",
        "semantic-error": "#EF4444"
      },
      fontSize: {
        xs: "11px",
        sm: "13px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px"
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
};
