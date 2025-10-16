import React, { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Popover, PopoverProps } from '../../src';
import '../../src/output.css';
import { fn } from '@storybook/test';

const meta: Meta<PopoverProps> = {
  title: 'Display/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Content that triggers the popover.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    open: {
      control: 'boolean',
      description:
        'A controlled flag that determines whether the popover is visible or not.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    elementRef: {
      action: false,
      description: 'Ref of the target element.',
      table: {
        type: { summary: 'React.RefObject<HTMLElement>' },
      },
    },
    onClose: {
      control: false,
      description: 'Callback when popover is closed.',
      table: {
        type: { summary: '() => void' },
      },
    },
    verticalAlign: {
      control: 'select',
      options: ['top', 'bottom'],
      description: 'Vertical alignment of the popover.',
      table: {
        defaultValue: { summary: 'bottom' },
        type: { summary: '"top" | "bottom"' },
      },
    },
    horizontalAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Horizontal alignment of the popover.',
      table: {
        defaultValue: { summary: 'center' },
        type: { summary: '"left" | "center" | "right"' },
      },
    },
  },
  args: {
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<PopoverProps>;

export const Playground: Story = {
  args: {
    verticalAlign: 'bottom',
    horizontalAlign: 'left',
  },
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    const popOverRef = useRef<HTMLButtonElement>(null);

    return (
      <div>
        <Button onClick={() => setOpen(true)} ref={popOverRef}>
          Open Popover
        </Button>
        <Popover
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          elementRef={popOverRef}
        >
          This is the content of the Popover
        </Popover>
      </div>
    );
  },
  argTypes: {
    open: { control: false },
    elementRef: { control: false },
  },
  parameters: {
    docs: {
      source: {
        code: `
import { useState } from 'react';

const Playground = () => {
    const [open, setOpen] = React.useState(false);
    const popOverRef = useRef<HTMLButtonElement>(null);

    return (
        <div>
            <Button onClick={() => setOpen(true)} ref={popOverRef}>Open Popover</Button>
            <Popover 
                open={open}
                onClose={() => setOpen(false)}
                elementRef={popOverRef}
                horizontalAlign="left"
                verticalAlign="bottom"
                transformOriginHorizontal="left"
                transformOriginVertical="top"
            >
                This is the content of the Popover
            </Popover>
        </div>
    );
};

export default Playground;
          `.trim(),
      },
    },
  },
};
