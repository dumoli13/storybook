import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconButton, type IconButtonProps } from '../../src/components';
import '../../src/output.css';
import { fn } from '@storybook/test';

const variantOption = ['contained', 'secondary', 'outlined', 'text'];
const colorOption = ['primary', 'success', 'danger', 'warning', 'info'];
const sizeOption = ['small', 'default', 'large'];
const titleHorizontalAlignOption = ['left', 'center', 'right'];
const titleVerticalAlignOption = ['top', 'bottom'];

const meta: Meta<IconButtonProps> = {
    title: 'input/IconButton',
    component: IconButton,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: variantOption,
            description: 'The variant of the icon button',
            table: {
                defaultValue: { summary: 'contained' },
                type: { summary: 'contained | secondary | outlined | text' },
            },
        },
        color: {
            control: { type: 'select' },
            options: colorOption,
            description: 'The color theme for the icon button',
            table: {
                defaultValue: { summary: 'primary' },
                type: { summary: 'primary | success | danger | warning | info' },
            },
        },
        size: {
            control: { type: 'select' },
            options: sizeOption,
            description: 'The size of the icon button.',
            table: {
                defaultValue: { summary: 'default' },
                type: { summary: 'small | default | large' },
            },
        },
        titleVerticalAlign: {
            control: { type: 'radio' },
            options: titleVerticalAlignOption,
            description: 'Vertical alignment for the title',
            table: {
                defaultValue: { summary: 'bottom' },
                type: { summary: 'top | bottom' },
            }
        },
        titleHorizontalAlign: {
            control: { type: 'radio' },
            options: titleHorizontalAlignOption,
            description: 'Horizontal alignment for the title',
            table: {
                defaultValue: { summary: 'center' },
                type: { summary: 'left | center | right' },
            }
        },
        loading: {
            control: 'boolean',
            description: 'A flag to display loading state if set to true.',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        icon: {
            control: false,
            description: 'Icon to display inside the button',
        },
        title: {
            control: 'text',
            description: 'Tooltip text when hovering over the icon',
        },
        onClick: {
            action: 'clicked',
            description: 'Callback when the button is clicked',
            table: {
                type: { summary: '(e: MouseEvent<HTMLButtonElement>) => void' },
            },
        },
    },
    args: {
        onClick: fn(),
    }
};

export default meta;
type Story = StoryObj<IconButtonProps>;


export const Playground: Story = {
    args: {
        variant: 'contained',
        color: 'primary',
        title: 'Info',
        icon: <Icon name="bookmark" size={20} />,
        size: 'default',
        loading: false,
        titleVerticalAlign: 'bottom',
        titleHorizontalAlign: 'center',
    },
};

export const VariantContained: Story = {
    args: {
        size: 'default',
        disabled: false,
        loading: false,
    },
    argTypes: {
        variant: { control: false },
        color: { control: false },
    },
    render: (args) => (
        <div className="flex gap-2 w-full">
            {colorOption.map((color) => (
                <IconButton
                    key={color}
                    {...args}
                    variant="contained"
                    color={color as IconButtonProps['color']}
                    icon={<Icon name="bookmark" />}
                    title={args.title || `${color} color, Contained variant`}
                />
            ))}
        </div>
    )
}

export const VariantSecondary: Story = {
    args: {
        size: 'default',
        disabled: false,
        loading: false,
    },
    argTypes: {
        variant: { control: false },
        color: { control: false },
    },
    render: (args) => (
        <div className="flex gap-4">
            {colorOption.map((color) => (
                <IconButton
                    key={color}
                    {...args}
                    variant="secondary"
                    color={color as IconButtonProps['color']}
                    icon={<Icon name="bookmark" />}
                    title={args.title || `${color} color, Secondary variant`}
                />
            ))}
        </div>
    )
}

export const VariantOutlined: Story = {
    args: {
        size: 'default',
        disabled: false,
        loading: false,
    },
    argTypes: {
        variant: { control: false },
        color: { control: false },
    },
    render: (args) => (
        <div className="flex gap-4">
            {colorOption.map((color) => (
                <IconButton
                    key={color}
                    {...args}
                    variant="outlined"
                    color={color as IconButtonProps['color']}
                    icon={<Icon name="bookmark" />}
                    title={args.title || `${color} color, Outlined variant`}
                />
            ))}
        </div>
    )
}

export const VariantText: Story = {
    args: {
        size: 'default',
        disabled: false,
        loading: false,
    },
    argTypes: {
        variant: { control: false },
        color: { control: false },
    },
    render: (args) => (
        <div className="flex gap-4">
            {colorOption.map((color) => (
                <IconButton
                    key={color}
                    {...args}
                    variant="text"
                    color={color as IconButtonProps['color']}
                    icon={<Icon name="bookmark" />}
                    title={args.title || `${color} color, Text variant`}
                />
            ))}
        </div>
    )
}

export const Sizes: Story = {
    render: (args) => (
        <div className="flex gap-4">
            <IconButton {...args} size='small' icon={<Icon name="bookmark" />} title='small size' />
            <IconButton {...args} size='default' icon={<Icon name="bookmark" />} title='default size' />
            <IconButton {...args} size='large' icon={<Icon name="bookmark" />} title='large size' />
        </div>
    ),
    args: {
        children: 'Button',
        variant: 'contained',
        color: 'primary',
        disabled: false,
        loading: false,
    },
    argTypes: {
        size: { control: false },
    },
}