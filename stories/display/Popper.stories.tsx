import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon, Popper, PopperProps } from '../../src/components';
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
        children: {
            control: false,
            description: 'Content that triggers the popper.',
            table: {
                type: { summary: 'ReactNode' },
                defaultValue: { summary: 'Sample Popper' },
            },
        },
        open: {
            control: 'boolean',
            description: 'A controlled flag that determines whether the popper is visible or not.',
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
        verticalAlign: {
            control: 'select',
            options: ['top', 'bottom'],
            description: 'Vertical alignment of the popper.',
            table: {
                defaultValue: { summary: 'bottom' },
                type: { summary: '"top" | "bottom"' },
            },
        },
        horizontalAlign: {
            control: 'select',
            options: ['left', 'center', 'right'],
            description: 'Horizontal alignment of the popper.',
            table: {
                defaultValue: { summary: 'center' },
                type: { summary: '"left" | "center" | "right"' },
            },
        },
        disabled: {
            control: 'boolean',
            description: 'A flag that disables popper if set to true.',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
    },
    args:{
        disabled: false,
    }
};

export default meta;
type Story = StoryObj<PopperProps>;

export const Playground: Story = {
    args: {
        children: <Icon name="camera" color="currentColor" size={24} />,
        verticalAlign: 'bottom',
        horizontalAlign: 'center',
        content: 'Sample Popper',
    },
};




