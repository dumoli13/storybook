import React from 'react'
import type { Meta, StoryObj } from '@storybook/react';
import { StepProps, Steps } from '../../src/components';
import '../../src/output.css';

const meta: Meta<StepProps> = {
    title: 'Navigation/Steps',
    component: Steps,
    parameters: {
        layout: 'centered', 
    },
    tags: ['autodocs'],
    argTypes: {
        active: {
            control: 'number',
            description: 'The index of the currently active step.',
            table: {
                type: { summary: 'number' },
            },
        },
        items: {
            control: 'object',
            description: 'An array of step items, each containing the following properties:',
            table: {
                type: { summary: 'Array<{ title: string, description?: string, error?: boolean, success?: boolean, available?: boolean }>' },
            }
        },
        onChange: {
            action: 'navigate',
            description: 'Callback function triggered when a page is clicked. ',
            table: {
                type: { summary: '(index: number) => void' },
            },
        },
        disabled: {
            control: 'boolean',
            description: 'A flag that disables button if set to true.',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
    },
    args:{
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<StepProps>;


export const Playground: Story = {
    args: {
        active: 2,
        items: [
            {
                title: 'Step 1',
                description: 'This is the first step',
                success: true,
            },
            {
                title: 'Step 2',
                description: 'This is the second step',
                error: true,
            },
            {
                title: 'Step 3',
                description: 'This is the third step',
                progress: 60,
            },
            {
                title: 'Step 4',
                description: 'This is the fourth step',
                available: true,
            },
            { title: 'Step 5', description: 'This is the fifth step' },
        ],
        disabled: false
    },
    render: (args) => (
        <Steps {...args} items={args.items} />
    )
};

