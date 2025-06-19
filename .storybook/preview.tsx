import React from 'react';
import type { Preview } from '@storybook/react';

// ✅ This decorator sets the "dark" class on <html> depending on Storybook's dark mode toggle
const withHtmlClassDarkMode = (Story, context) => {
  const isDark = context.globals.theme === 'dark';
  const root = document.documentElement;

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  return <Story />;
};

export const decorators = [withHtmlClassDarkMode];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      // Optional: these themes help sync with your Tailwind or CSS variables
      dark: { appBg: '#111111' },
      light: { appBg: '#ffffff' },
    },
  },
  // 👇 This is required for Storybook dark mode toggle
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: ['light', 'dark'],
        showName: true,
      },
    },
  },
};

export default preview;
