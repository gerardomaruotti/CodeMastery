/** @type {import('tailwindcss').Config} */
export default {
	mode: 'jit',
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#26282e',
				secondary: '#EDEEF0',
				secondaryText: '#D8D8D8CC',
				accent: '#5F59FF',
				accentSecondary: '#FFB567',
				accentThird: '#EB4872',
				focused: '#26282E',
				sidebar: '#1c1f25',
			},
			keyframes: {
				slideDown: {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(0)' },
				},
			},
			animation: {
				slideUp: 'slideUp 0.2s ease-out',
				slideDown: 'slideDown 0.3s ease-out',
			},
		},
	},
	plugins: [],
};
