import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, type SkeletonTableProps } from 'mis-design';

const meta: Meta<SkeletonTableProps> = {
    title: 'Display/Skeleton.Table',
    component: Skeleton,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                story: 'Predefined skeleton for table structure with configurable column count.',
            },
        },
    },
    argTypes: {
        column: {
            control: { type: 'number' },
            description: 'Total number of columns in the table.',
        },
    },
    args: {
        column: 3,
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

