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
       dark: { appBg: '#111111' },
      light: { appBg: '#ffffff' },
    },
  },
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
    version: {
      name: 'Version',
      description: 'Select component version',
      defaultValue: 'v1',
      toolbar: {
        icon: 'layers', 
        items: [
          { value: 'v1', title: 'Version 1' },
          { value: 'v2', title: 'Version 2' },
          { value: 'v3', title: 'Version 3' },
        ],
        showName: true,  
      },
    },
  },
};

export default preview;
