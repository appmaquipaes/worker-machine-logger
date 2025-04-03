import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Caterpillar-inspired color palette
				primary: {
					DEFAULT: '#FFBF00', // Caterpillar Yellow
					foreground: '#000000', // Black text on yellow background
				},
				secondary: {
					DEFAULT: '#231F20', // Caterpillar Black
					foreground: '#FFFFFF', // White text on black background
				},
				accent: {
					DEFAULT: '#FFD700', // Slightly lighter yellow
					foreground: '#000000',
				},
				border: {
					DEFAULT: '#231F20', // Black border
				},
				// Keeping other color variants with Caterpillar-inspired adjustments
				destructive: {
					DEFAULT: '#DC3545', // A strong red for destructive actions
					foreground: '#FFFFFF',
				},
				muted: {
					DEFAULT: '#6C757D', // A muted gray
					foreground: '#FFFFFF',
				},
				background: '#F8F9FA', // Light background
				foreground: '#231F20', // Dark text
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
