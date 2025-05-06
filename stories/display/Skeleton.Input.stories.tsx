import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, type SkeletonInputProps } from 'mis-design';

const sizeOption = ['default', 'large'];

const meta: Meta<SkeletonInputProps> = {
    title: 'Display/Skeleton.Input',
    component: Skeleton,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                story: 'Predefined skeleton for input forms, simulating label and input loading.',
            },
        },
    },
    argTypes: {
        size: {
            control: { type: 'select' },
            options: sizeOption,
            description: 'The size of the button.',
            table: {
                defaultValue: { summary: 'default' },
                type: { summary: 'small | default | large' },
            },
        },
    },
    args: {
        size: 'default',
    },
};
export default meta;

type Story = StoryObj<SkeletonInputProps>;

export const Playground: Story = {
    render: (args) => (
        <div style={{ width: 300 }}>
            <Skeleton.Input {...args} />
        </div>
    ),
};

