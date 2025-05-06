import React, { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconNames, TextArea, type TextAreaProps } from 'mis-design'; // Update import path as needed
import { iconNames } from '../../const/icon';


const sizeOption = ['default', 'large'];
const labelPositionOption = ['top', 'left'];

const meta: Meta<TextAreaProps> = {
    title: 'Input/TextArea',
    component: TextArea,
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: 'Controlled input value',
            table: {
                type: { summary: 'string' },
            },
        },
        defaultValue: {
            control: 'text',
            description: 'The initial value of the input field when the component is uncontrolled.',
            table: {
                type: { summary: 'string' },
            },
        },
        onChange: {
            action: 'changed',
            description: 'Callback function to handle input changes.',
            table: {
                type: { summary: '(value: string) => void' },
            },
        },
        inputRef: {
            control: false,
            description: 'A reference to access the input field and its value programmatically.',
            table: { disable: true }
        },
        label: {
            control: 'text',
            description: 'The label text displayed above or beside the input field',
            table: {
                type: { summary: 'string' },
            },
        },
        labelPosition: {
            control: 'select',
            options: labelPositionOption,
            description: 'The position of the label relative to the field',
            table: {
                defaultValue: { summary: 'top' },
                type: { summary: 'top | left' },
            },
        },
        autoHideLabel: {
            control: 'boolean',
            description: 'A flag to set if label should automatically hide when the input is focused.',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text displayed inside the input field when it is empty.',
            table: {
                type: { summary: 'string' },
            },
        },
        helperText: {
            control: 'text',
            description: 'A helper message displayed below the input field.',
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
            description: 'A flag to display error of input field. If set to string, it will be displayed as error message.',
            table: {
                type: { summary: 'boolean | string' },
            },
        },
        success: {
            control: 'boolean',
            description: 'A flag to display success of input field if set to true.',
            table: {
                type: { summary: 'boolean' },
            },
        },
        loading: {
            control: 'boolean',
            description: 'A flag to display loading state if set to true.',
            table: {
                defaultValue: { summary: 'false' },
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
            description: 'An optional icon to display at the start of the input field.',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        endIcon: {
            control: false,
            description: 'An optional icon to display at the end of the input field.',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        size: {
            control: 'select',
            options: sizeOption,
            description: 'The size of the input field',
            table: {
                defaultValue: { summary: 'default' },
                type: { summary: 'default | large' },
            },
        },
        fullWidth: {
            control: 'boolean',
            description: 'A flag that expand to full container width if set to true.',
            table: {
                type: { summary: 'boolean' },
            },
        },
        width: {
            control: 'number',
            description: 'Optional custom width for the input field (in px).',
            table: {
                type: { summary: 'number' },
            },
        },
        lines: {
            control: 'number',
            description: 'Set number of lines shown',
            table: {
                defaultValue: { summary: '2' },
                type: { summary: 'number' },
            },
        }
    },
};

export default meta;
type Story = StoryObj<TextAreaProps>;

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
                <TextArea
                    key={size}
                    {...args}
                    size={size as TextAreaProps['size']}
                    label={`Text Area size ${size}`}
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
        return (<div className="flex gap-10 flex-col">
            {labelPositionOption.map((position) => (
                <TextArea
                    key={position}
                    {...args}
                    labelPosition={position as TextAreaProps['labelPosition']}
                    label={`Text Area size ${position}`}
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
            <TextArea
                {...args}
                label="Neutral Text Area size"
                className='flex-1'
            />
            <TextArea
                {...args}
                label="Success Text Area size"
                className='flex-1'
                success
            />
            <TextArea
                {...args}
                label="Success Text Area size"
                className='flex-1'
                error
            />
            <TextArea
                {...args}
                label="Success Text Area size"
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


type WithIconControls = TextAreaProps & {
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

        return <TextArea {...rest} startIcon={start} endIcon={end} />;
    },
};