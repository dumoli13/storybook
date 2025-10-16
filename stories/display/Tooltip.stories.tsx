import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon, Tooltip, TooltipProps } from '../../src';
import '../../src/output.css';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<TooltipProps> = {
  title: 'Display/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Content that triggers the tooltip.',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'Sample Tooltip' },
      },
    },
    onOpen: {
      action: 'open',
      description: 'Callback when tooltip is opened.',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
    verticalAlign: {
      control: 'select',
      options: ['top', 'bottom'],
      description: 'Vertical alignment of the tooltip.',
      table: {
        defaultValue: { summary: 'bottom' },
        type: { summary: '"top" | "bottom"' },
      },
    },
    horizontalAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Horizontal alignment of the tooltip.',
      table: {
        defaultValue: { summary: 'center' },
        type: { summary: '"left" | "center" | "right"' },
      },
    },
    arrow: {
      control: 'boolean',
      description: 'Display arrow pointing to the content.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    mouseEnterDelay: {
      control: 'number',
      description:
        'Delay before tooltip is shown when mouse enters the content.',
      table: {
        defaultValue: { summary: '500' },
        type: { summary: 'number' },
      },
    },
    mouseLeaveDelay: {
      control: 'number',
      description:
        'Delay before tooltip is hidden when mouse leaves the content.',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'number' },
      },
    },
    title: {
      control: 'text',
      description: 'Tooltip text when hovering the content',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'A flag that disables popover if set to true.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
  },
  args: {
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<TooltipProps>;

export const Playground: Story = {
  args: {
    children: <Icon name="camera" color="currentColor" size={24} />,
    title: 'Take a picture',
    verticalAlign: 'bottom',
    horizontalAlign: 'center',
    arrow: true,
    mouseEnterDelay: 500,
    mouseLeaveDelay: 0,
  },
};
