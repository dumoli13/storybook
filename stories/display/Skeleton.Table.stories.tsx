import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonTableProps } from '../../src';
import '../../src/output.css';

const meta: Meta<SkeletonTableProps> = {
  title: 'Display/Skeleton.Table',
  component: Skeleton.Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Predefined skeleton for table structure with configurable column count. Skeleton size is based on the size of the container.',
      },
    },
  },
  argTypes: {
    column: {
      control: { type: 'number' },
      description: 'Total number of columns in the table.',
      table: {
        defaultValue: { summary: '2' },
      },
    },
    row: {
      control: { type: 'number' },
      description: 'Total number of rows in the table.',
      table: {
        defaultValue: { summary: '3' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'default', 'large'],
      description: 'Skeleton size.',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
  },
  args: {
    column: 3,
    row: 5,
    size: 'default',
  },
};
export default meta;

type Story = StoryObj<SkeletonTableProps>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 600 }}>
      <Skeleton.Table {...args} />
    </div>
  ),
};
