import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from 'mis-design';

const meta: Meta<typeof Button> = {
  title: 'Components/Inputs/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'secondary', 'outlined', 'text'],
      description: 'Defines the button style',
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'danger', 'warning', 'info'],
      description: 'Button color theme',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size of the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Expands button to full width',
    },
    loading: {
      control: 'boolean',
      description: 'Displays a loading state',
    },
    startIcon: {
      control: 'object',
      description: 'Adds an icon at the start',
    },
    endIcon: {
      control: 'object',
      description: 'Adds an icon at the end',
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default Button Story
export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: 'contained',
    color: 'primary',
    size: 'default',
  },
};

// Contained Button
export const Contained: Story = {
  args: {
    children: 'Contained Button',
    variant: 'contained',
    color: 'primary',
  },
};

// Outlined Button
export const Outlined: Story = {
  args: {
    children: 'Outlined Button',
    variant: 'outlined',
    color: 'danger',
  },
};

// Text Button
export const Text: Story = {
  args: {
    children: 'Text Button',
    variant: 'text',
    color: 'info',
  },
};

// Button with Loading
export const Loading: Story = {
  args: {
    children: 'Loading...',
    variant: 'contained',
    color: 'warning',
    loading: true,
  },
};

// Full-Width Button
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'contained',
    color: 'success',
    fullWidth: true,
  },
};
