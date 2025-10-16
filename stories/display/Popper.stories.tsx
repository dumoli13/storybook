import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon, Popper, PopperProps } from '../../src';
import '../../src/output.css';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<PopperProps> = {
  title: 'Display/Popper',
  component: Popper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'A flag that disables popper if set to true.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    content: {
      control: 'text',
      description: 'Content that appears when popper is opened.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    children: {
      control: false,
      description: 'Content that triggers the popper.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    open: {
      control: 'boolean',
      description:
        'A controlled flag that determines whether the popper is visible or not.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onOpen: {
      action: false,
      description: 'Callback when popper is opened.',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
    placement: {
      control: 'select',
      description: 'Placement of the popper.',
      table: {
        type: {
          summary:
            '"top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right" | "left" | "left-top" | "left-bottom" | "right" | "right-top" | "right-bottom"',
        },
        defaultValue: { summary: 'bottom-left' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional class names to be applied to the popper.',
      table: {
        type: { summary: 'string' },
      },
    },
    style: {
      control: 'object',
      description: 'Additional styles to be applied to the popper.',
      table: {
        type: { summary: 'React.CSSProperties' },
      },
    },
  },
  args: {
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<PopperProps>;

export const Playground: Story = {
  args: {
    children: <Icon name="camera" color="currentColor" size={24} />,
    content: 'Sample Popper',
    placement: 'bottom-left',
    offset: 8,
  },
};
