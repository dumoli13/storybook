import React, { useMemo } from 'react';
import { fn } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, type ButtonProps, Icon, type IconNames } from '../../src';
import '../../src/output.css';
import { iconNames } from '../../const/icon';

const variantOption = ['contained', 'secondary', 'outlined', 'text'];
const colorOption = ['primary', 'success', 'danger', 'warning', 'info'];
const sizeOption = ['small', 'default', 'large'];

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<ButtonProps> = {
  title: 'Input/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: variantOption,
      description: 'The variant of the button.',
      table: {
        defaultValue: { summary: 'contained' },
        type: { summary: 'contained | secondary | outlined | text' },
      },
    },
    color: {
      control: { type: 'select' },
      options: colorOption,
      description: 'The color of the button.',
      table: {
        defaultValue: { summary: 'primary' },
        type: { summary: 'primary | success | danger | warning | info' },
      },
    },
    size: {
      control: { type: 'select' },
      options: sizeOption,
      description: 'The size of the button.',
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'small | default | large' },
      },
    },
    fullWidth: {
      type: 'boolean',
      description:
        'If true, the button will span the full width of the parent element.',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when the button is clicked',
      table: {
        type: { summary: '(e: MouseEvent<HTMLButtonElement>) => void' },
      },
    },
    loading: {
      type: 'boolean',
      description: 'If true, the button will show a loading indicator.',
    },

    startIcon: {
      control: false,
      description: 'react node of icon to display before the button text.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    endIcon: {
      control: false,
      description: 'react node of icon to display after the button text.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Playground: Story = {
  args: {
    children: 'Button',
    disabled: false,
    fullWidth: false,
    loading: false,
  },
};

export const VariantContained: Story = {
  args: {
    size: 'default',
    disabled: false,
    fullWidth: false,
    loading: false,
  },
  argTypes: {
    variant: { control: false },
    color: { control: false },
  },
  render: (args) => (
    <div className="flex gap-2">
      {colorOption.map((color) => (
        <Button
          key={color}
          {...args}
          variant="contained"
          color={color as ButtonProps['color']}
        >
          {color} Secondary
        </Button>
      ))}
    </div>
  ),
};

export const VariantSecondary: Story = {
  args: {
    size: 'default',
    disabled: false,
    fullWidth: false,
    loading: false,
  },
  argTypes: {
    variant: { control: false },
    color: { control: false },
  },
  render: (args) => (
    <div className="flex gap-2">
      {colorOption.map((color) => (
        <Button
          key={color}
          {...args}
          variant="secondary"
          color={color as ButtonProps['color']}
        >
          {color} Secondary
        </Button>
      ))}
    </div>
  ),
};

export const VariantOutlined: Story = {
  args: {
    size: 'default',
    disabled: false,
    fullWidth: false,
    loading: false,
  },
  argTypes: {
    variant: { control: false },
    color: { control: false },
  },
  render: (args) => (
    <div className="flex gap-2">
      {colorOption.map((color) => (
        <Button
          key={color}
          {...args}
          variant="outlined"
          color={color as ButtonProps['color']}
        >
          {color} Secondary
        </Button>
      ))}
    </div>
  ),
};

export const VariantText: Story = {
  args: {
    size: 'default',
    disabled: false,
    fullWidth: false,
    loading: false,
  },
  argTypes: {
    variant: { control: false },
    color: { control: false },
  },
  render: (args) => (
    <div className="flex gap-2">
      {colorOption.map((color) => (
        <Button
          key={color}
          {...args}
          variant="text"
          color={color as ButtonProps['color']}
        >
          {color} Secondary
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <Button {...args} size="small">
        small
      </Button>
      <Button {...args} size="default">
        default
      </Button>
      <Button {...args} size="large">
        large
      </Button>
    </div>
  ),
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'primary',
    disabled: false,
    fullWidth: false,
    loading: false,
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};

type WithIconControls = ButtonProps & {
  startIconName: IconNames;
  endIconName: IconNames;
};

export const WithIcon: StoryObj<WithIconControls> = {
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'primary',
    size: 'default',
    disabled: false,
    fullWidth: false,
    loading: false,
    startIconName: 'arrow-up',
    endIconName: 'arrow-down',
  },
  argTypes: {
    startIconName: {
      control: { type: 'select' },
      options: iconNames,
      description: 'Name of the start icon',
      table: {
        category: 'Icons',
      },
    },
    endIconName: {
      control: { type: 'select' },
      options: iconNames,
      description: 'Name of the end icon',
      table: {
        category: 'Icons',
      },
    },
  },
  render: (args) => {
    const { startIconName, endIconName, ...rest } = args;
    const start = useMemo(
      () => <Icon name={startIconName} color="currentColor" />,
      [startIconName],
    );
    const end = useMemo(
      () => <Icon name={endIconName} color="currentColor" />,
      [endIconName],
    );

    return <Button {...rest} startIcon={start} endIcon={end} />;
  },
};
