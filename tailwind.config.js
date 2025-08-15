/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT")

module.exports = withMT({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        animatedgradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        // Modal
        "scale-in": {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        // Input Select
        "input-select-slide-up": {
          "0%": { transform: "translateY(-342px)" },
          "100%": { transform: "translateY(-350px)" },
        },
        "input-select-slide-down": {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(8px)" },
        },
        // Tooltip
        "slide-up-fade": {
          "0%": { opacity: 0, transform: "translateY(2px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-right-fade": {
          "0%": { opacity: 0, transform: "translateX(-2px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "slide-down-fade": {
          "0%": { opacity: 0, transform: "translateY(-2px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-left-fade": {
          "0%": { opacity: 0, transform: "translateX(2px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        // Navigation menu
        "enter-from-right": {
          "0%": { transform: "translateX(200px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "enter-from-left": {
          "0%": { transform: "translateX(-200px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "exit-to-right": {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(200px)", opacity: 0 },
        },
        "exit-to-left": {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(-200px)", opacity: 0 },
        },
        "scale-in-content": {
          "0%": { transform: "rotateX(-30deg) scale(0.9)", opacity: 0 },
          "100%": { transform: "rotateX(0deg) scale(1)", opacity: 1 },
        },
        "scale-out-content": {
          "0%": { transform: "rotateX(0deg) scale(1)", opacity: 1 },
          "100%": { transform: "rotateX(-10deg) scale(0.95)", opacity: 0 },
        },
        // Accordion
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        // Custom wiggle animation
        wiggle: {
          "0%, 100%": {
            transform: "translateX(0%)",
            transformOrigin: "50% 50%",
          },
          "15%": { transform: "translateX(-4px) rotate(-4deg)" },
          "30%": { transform: "translateX(6px) rotate(4deg)" },
          "45%": { transform: "translateX(-6px) rotate(-2.4deg)" },
          "60%": { transform: "translateX(2px) rotate(1.6deg)" },
          "75%": { transform: "translateX(-1px) rotate(-0.8deg)" },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      animation: {
        gradient: 'animatedgradient 6s ease infinite alternate',
        fade: 'fadeOut 5s ease-in-out'
      },
    },
  },
  plugins: [
    require("tailwindcss-radix")
  ],
  safelist: [
    // Employee Management specific classes
    'bg-gray-50',
    'bg-gray-100',
    'bg-gray-200',
    'bg-gray-300',
    'bg-gray-400',
    'bg-gray-500',
    'bg-gray-600',
    'bg-gray-700',
    'bg-gray-800',
    'bg-gray-900',
    'text-gray-50',
    'text-gray-100',
    'text-gray-200',
    'text-gray-300',
    'text-gray-400',
    'text-gray-500',
    'text-gray-600',
    'text-gray-700',
    'text-gray-800',
    'text-gray-900',
    'border-gray-50',
    'border-gray-100',
    'border-gray-200',
    'border-gray-300',
    'border-gray-400',
    'border-gray-500',
    'border-gray-600',
    'border-gray-700',
    'border-gray-800',
    'border-gray-900',
    // Responsive classes
    'sm:flex-row',
    'sm:flex-col',
    'sm:grid-cols-1',
    'sm:grid-cols-2',
    'sm:grid-cols-3',
    'sm:grid-cols-4',
    'lg:grid-cols-1',
    'lg:grid-cols-2',
    'lg:grid-cols-3',
    'lg:grid-cols-4',
    'lg:col-span-1',
    'lg:col-span-2',
    'lg:col-span-3',
    'sm:text-sm',
    'sm:text-base',
    'sm:text-lg',
    'sm:text-xl',
    'sm:text-2xl',
    'sm:text-3xl',
    'lg:text-sm',
    'lg:text-base',
    'lg:text-lg',
    'lg:text-xl',
    'lg:text-2xl',
    'lg:text-3xl',
    // Spacing classes
    'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8',
    'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-8',
    'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6', 'py-8',
    'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8',
    'mx-1', 'mx-2', 'mx-3', 'mx-4', 'mx-5', 'mx-6', 'mx-8',
    'my-1', 'my-2', 'my-3', 'my-4', 'my-5', 'my-6', 'my-8',
    'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-8',
    'space-x-1', 'space-x-2', 'space-x-3', 'space-x-4', 'space-x-5', 'space-x-6', 'space-x-8',
    'space-y-1', 'space-y-2', 'space-y-3', 'space-y-4', 'space-y-5', 'space-y-6', 'space-y-8',
    // Flex and Grid classes
    'flex', 'flex-col', 'flex-row', 'flex-wrap', 'flex-nowrap',
    'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4',
    'items-start', 'items-center', 'items-end', 'items-stretch',
    'justify-start', 'justify-center', 'justify-end', 'justify-between', 'justify-around',
    // Card and layout classes
    'rounded', 'rounded-lg', 'rounded-xl', 'rounded-2xl',
    'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl',
    'bg-white', 'bg-transparent',
    'border', 'border-0', 'border-2', 'border-4',
    // Status and color classes
    'bg-green-500', 'bg-green-600', 'bg-green-700',
    'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
    'bg-red-500', 'bg-red-600', 'bg-red-700',
    'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700',
    'bg-purple-500', 'bg-purple-600', 'bg-purple-700',
    'text-green-500', 'text-green-600', 'text-green-700',
    'text-blue-500', 'text-blue-600', 'text-blue-700',
    'text-red-500', 'text-red-600', 'text-red-700',
    'text-yellow-500', 'text-yellow-600', 'text-yellow-700',
    'text-purple-500', 'text-purple-600', 'text-purple-700',
  ],
});
