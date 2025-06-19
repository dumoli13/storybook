import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonTableProps } from '../../src/components';
import '../../src/output.css';

const meta: Meta<SkeletonTableProps> = {
    title: 'Display/Skeleton.Table',
    component: Skeleton.Table,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                story: 'Predefined skeleton for table structure with configurable column count. Skeleton size is based on the size of the container.',
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

