import React, { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconNames, TimerField, type TimerFieldProps } from 'mis-design';
import { iconNames } from '../../const/icon';



const sizeOption = ['default', 'large'];
const labelPositionOption = ['top', 'left'];


const meta: Meta<TimerFieldProps> = {
    title: 'Input/TimerField',
    component: TimerField,
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: 'Controlled input value',
            table: {
                type: { summary: 'string | number' },
            },
        },
        defaultValue: {
            control: 'text',
            description: 'Uncontrolled initial value',
            table: {
                type: { summary: 'string | number' },
            },
        },
        onChange: {
            action: 'changed',
            description: 'Callback when input value changes',
            table: {
                type: { summary: '(value: string) => void' },
            },
        },
        inputRef: {
            control: false,
            table: {
                disable: true,
            },
        },
        label: {
            control: 'text',
            description: 'Label text displayed above or beside the input',
            table: {
                type: { summary: 'string' },
            },
        },
        labelPosition: {
            control: 'select',
            options: labelPositionOption,
            description: 'Position of the label relative to the input field',
            table: {
                defaultValue: { summary: 'top' },
                type: { summary: "'top' | 'left'" },
            },
        },
        autoHideLabel: {
            control: 'boolean',
            description: 'Hide label automatically when input is focused',
            table: {
                type: { summary: 'boolean' },
            },
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text shown inside the input field',
            table: {
                type: { summary: 'string' },
            },
        },
        helperText: {
            control: 'text',
            description: 'Helper message displayed below the input',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        className: {
            control: 'text',
            description: 'Additional class names to customize the component style.',
            table: {
                type: { summary: 'string' }
            }
        },
        error: {
            control: 'text',
            description: 'Error message or flag indicating error state',
            table: {
                type: { summary: 'boolean | string' },
            },
        },
        success: {
            control: 'boolean',
            description: 'Display success state',
            table: {
                type: { summary: 'boolean' },
            },
        },
        loading: {
            control: 'boolean',
            description: 'Display loading state with spinner',
            table: {
                type: { summary: 'boolean' },
            },
        },
        disabled: {
            control: 'boolean',
            description: 'A flag that disables input field if set to true.',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        startIcon: {
            control: false,
            description: 'Optional icon at the beginning of the input',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        endIcon: {
            control: false,
            description: 'Optional icon at the end of the input',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        fullWidth: {
            control: 'boolean',
            description: 'Make the input take full width of its container',
            table: {
                type: { summary: 'boolean' },
            },
        },
        width: {
            control: 'number',
            description: 'Custom width of the input in pixels',
            table: {
                type: { summary: 'number' },
            },
        },
        size: {
            control: 'select',
            options: sizeOption,
            description: 'The size of the input field',
            table: {
                defaultValue: { summary: 'default' },
                type: { summary: "'default' | 'large'" },
            },
        },
    }
};

export default meta;
type Story = StoryObj<TimerFieldProps>;

export const Playground: Story = {
    args: {
        label: 'This is Label',
        placeholder: 'This is Placholder...',
        helperText: 'This is a helper text',
        size: 'default',
        fullWidth: false,
        loading: false,
        success: false,
        error: '',
        labelPosition: 'top',
    },
};

export const Sizes: Story = {
    render: (args) => {
        return (<div className="flex gap-10 flex-wrap">
            {sizeOption.map((size) => (
                <TimerField
                    key={size}
                    {...args}
                    size={size as TimerFieldProps['size']}
                    label={`Password Field size ${size}`}
                />
            ))}
        </div >)
    },
    args: {
        placeholder: 'This is Placholder...',
    },
    argTypes: {
        size: {
            control: false,
        },
        label: {
            control: false,
        },
    },
}

export const LabelPosition: Story = {
    render: (args) => {
        return (<div className="flex gap-10 flex-wrap">
            {labelPositionOption.map((position) => (
                <TimerField
                    key={position}
                    {...args}
                    labelPosition={position as TimerFieldProps['labelPosition']}
                    label={`Password Field size ${position}`}
                    className='flex-1'
                />
            ))}
        </div >)
    },
    args: {
        placeholder: 'This is Placholder...',
        helperText: 'This is a helper text',
    },
    argTypes: {
        size: {
            control: false,
        },
        label: {
            control: false,
        },
    },
}

export const SuccessAndError: Story = {
    render: (args) => {
        return (<div className="flex flex-col gap-10">
            <TimerField
                {...args}
                label="Neutral Password Field size"
                className='flex-1'
            />
            <TimerField
                {...args}
                label="Success Password Field size"
                className='flex-1'
                success
            />
            <TimerField
                {...args}
                label="Success Password Field size"
                className='flex-1'
                error
            />
            <TimerField
                {...args}
                label="Success Password Field size"
                className='flex-1'
                error="Error with message"
            />
        </div >)
    },
    args: {
        placeholder: 'This is Placholder...',
        helperText: 'This is a helper text',
    },
    argTypes: {
        success: {
            control: false,
        },
        error: {
            control: false,
        },
    },
}


type WithIconControls = TimerFieldProps & {
    startIconName: IconNames;
    endIconName: IconNames;
};
export const WithIcon: StoryObj<WithIconControls> = {
    args: {
        startIconName: 'arrow-up',
        endIconName: 'arrow-down',
        label: 'This is Label',
        placeholder: 'This is Placholder...',
        helperText: 'This is a helper text',
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
        console.log("startIconName", startIconName);

        const start = useMemo(() => <Icon name={startIconName} size={20} color="currentColor" />, [startIconName]);
        const end = useMemo(() => <Icon name={endIconName} size={20} color="currentColor" />, [endIconName]);

        return <TimerField {...rest} startIcon={start} endIcon={end} />;
    },
};