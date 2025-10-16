import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonProps } from '../../src';
import '../../src/output.css';

const meta: Meta<SkeletonProps> = {
  title: 'Display/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    width: {
      control: { type: 'number' },
      description: 'Width of the skeleton',
    },
    height: {
      control: { type: 'number' },
      description: 'Height of the skeleton',
    },
    type: {
      control: { type: 'radio' },
      options: ['circle', 'rounded', 'rect'],
      description: 'Type/shape of the skeleton',
      defaultValue: 'circle',
    },
  },
  args: {
    type: 'circle',
  },
};
export default meta;

type Story = StoryObj<SkeletonProps>;

export const Playground: Story = {
  args: {
    width: 100,
    height: 100,
    type: 'circle',
  },
};
