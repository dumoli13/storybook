import React, { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconNames, AutoComplete, type AutoCompleteProps } from 'mis-design'; // Update import path as needed
import { iconNames } from '../../const/icon';


const sizeOption = ['default', 'large'];
const labelPositionOption = ['top', 'left'];

const meta: Meta<AutoCompleteProps<any>> = {
    title: 'Input/AutoComplete',
    component: AutoComplete,
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'object',
            description: 'Controlled input value',
            table: {
                type: { summary: '{ value: T,  label: string, detail?: D }' },
            },
        },
        defaultValue: {
            control: 'text',
            description: 'The initial value of the number input when the component is uncontrolled.',
            table: {
                type: { summary: 'T' },
            },
        },
        onChange: {
            action: 'false',
            description: 'Callback function to handle input changes.',
            table: {
                type: { summary: '(value: { value: T,  label: string, detail?: D }) => void' },
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
        clearable: {
            control: 'boolean',
            description: 'A flag that show clear button of input field if set to true',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        options: {
            control: 'object',
            description: 'An array of option objects, each containing a value and a label.',
            table: {
                type: { summary: '{ label: string, value: T }[]' },
            }

        }
    },
};

export default meta;
type Story = StoryObj<AutoCompleteProps<any>>;

const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Orange', value: 'orange' },
    { label: 'Banana', value: 'banana' },
]

export const Playground: Story = {
    args: {
        label: 'This is Label',
        placeholder: 'This is Placholder...',
        helperText: 'This is a helper text',
        size: 'default',
        clearable: false,
        fullWidth: false,
        loading: false,
        success: false,
        error: '',
        labelPosition: 'top',
        // defaultValue: 'apple',
        value: { label: 'Orange', value: 'orange' },
        options
    },
};

export const Sizes: Story = {
    render: (args) => {
        return (<div className="flex gap-10 flex-wrap">
            {sizeOption.map((size) => (
                <AutoComplete
                    key={size}
                    {...args}
                    size={size as AutoCompleteProps<any>['size']}
                    label={`Number Text Field size ${size}`}
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
                <AutoComplete
                    key={position}
                    {...args}
                    labelPosition={position as AutoCompleteProps<any>['labelPosition']}
                    label={`Number Text Field size ${position}`}
                    className='flex-1'
                    options={options}
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
            <AutoComplete
                {...args}
                label="Neutral Number Text Field size"
                className='flex-1'
                options={options}
            />
            <AutoComplete
                {...args}
                label="Success Number Text Field size"
                className='flex-1'
                success
                options={options}
            />
            <AutoComplete
                {...args}
                label="Success Number Text Field size"
                className='flex-1'
                error
                options={options}
            />
            <AutoComplete
                {...args}
                label="Success Number Text Field size"
                className='flex-1'
                error="Error with message"
                options={options}
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


type WithIconControls = AutoCompleteProps<any> & {
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

        const start = useMemo(() => <Icon name={startIconName} size={20} color="currentColor" />, [startIconName]);
        const end = useMemo(() => <Icon name={endIconName} size={20} color="currentColor" />, [endIconName]);

        return <AutoComplete {...rest} startIcon={start} endIcon={end} options={options} />;
    },
};