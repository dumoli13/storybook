import React, { useMemo, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AutoCompleteMultiple, AutoCompleteMultipleProps, AutoCompleteMultipleRef, Icon, IconNames, SelectValue } from '../../src/components';
import '../../src/output.css';
import { iconNames } from '../../const/icon';
import { options } from '../../src/const/select';
 

const sizeOption = ['default', 'large'];
const labelPositionOption = ['top', 'left'];

const meta: Meta<AutoCompleteMultipleProps<any>> = {
    title: 'Input/AutoCompleteMultiple',
    component: AutoCompleteMultiple,
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
            description: 'The initial value of the input when the component is uncontrolled. only need to provide the key of the option',
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
            control: false,
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
                defaultValue: { summary: 'false' },
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
            description: 'The size of the input field.',
            table: {
                defaultValue: { summary: 'default' },
                type: { summary: 'default | large' },
            },
        },
        fullWidth: {
            control: 'boolean',
            description: 'A flag that expand to full container width if set to true.',
            table: {
                defaultValue: { summary: 'false' },
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
            description: 'An array of option objects, each containing a value and a label. Component re-renders every time options change, so make sure manage options in the state or outside the component to prevent unnecessary re-renders.',
            table: {
                type: { summary: '{ label: string, value: T }[]' },
            },

        }
    },
    args:{
        disabled: false,
    },
    parameters: {
        controls: {
            sort: ['value', 'defaultValue', 'onChange', 'inputRef', 'label', 'labelPosition', 'autoHideLabel', 'placeholder', 'helperText', 'className', 'error', 'success', 'loading', 'disabled', 'startIcon', 'endIcon', 'size', 'fullWidth', 'width', 'clearable', 'options']
        }
    }
};

export default meta;

type Story = StoryObj<AutoCompleteMultipleProps<any>>;

export const Playground: Story = {
    args: {
        label: 'Input Label',
        placeholder: 'Input Placeholder...',
        helperText: 'Input helper text',
        size: 'default',
        clearable: false,
        fullWidth: false,
        loading: false,
        success: false,
        labelPosition: 'top',
        options
    },
    parameters: {
        docs: {
            description: {
                story: 'The AutoCompleteMultiple is a normal text input enhanced by a panel of suggested options.',
            },
        },
    },
};

export const DefaultValue: Story = {
    args: {
        label: 'Input Label',
        placeholder: 'Input Placeholder...',
        helperText: 'Input helper text',
        defaultValue: ['apple'],
        options
    },
    render: (args) => {
        const InputRef = useRef<AutoCompleteMultipleRef<string>>(null);

        const getValueByRef = () => {
            return InputRef.current?.value; // {value: T, label: string, detail?: D}[]
        }

        return (
            <AutoCompleteMultiple {...args} options={options} inputRef={InputRef} />
        );
    },
    argTypes: {
        value: { control: false },
        defaultValue: { control: false },
    },
    parameters: {
        docs: {
            description: {
                story: 'This story demonstrates a uncontrolled AutoCompleteMultiple. to access the input field and its value, use the inputRef.',
            },
            source: {
                code: `
import { useState } from 'react';

const options: SelectValue<string>[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Orange', value: 'orange' },
    { label: 'Banana', value: 'banana' },
];

const UncontrolledValue = () => {
    const InputRef = useRef<AutoCompleteMultipleRef<string>>(null);

    const getValueByRef = () => {
        return InputRef.current?.value; // {value: T, label: string, detail?: D}[]
    }

    return (
        <AutoCompleteMultiple
            label="This is label"
            placeholder="Input Placeholder..."
            value={value}
            onChange={setValue}
            options={options}
        />
    );
};

export default UncontrolledValue;
          `.trim(),
            },
        },
    },
};

export const ControlledValue: Story = {
    args: {
        label: 'Input Label',
        placeholder: 'Input Placeholder...',
        helperText: 'Input helper text',
    },
    render: (args) => {
        const [value, setValue] = useState<SelectValue<string>[]>(
            [{ label: 'Orange', value: 'orange' }]
        );

        return (
            <AutoCompleteMultiple
                {...args}
                value={value}
                onChange={setValue}
                options={options}
            />
        );
    },
    argTypes: {
        value: { control: false },
        defaultValue: { control: false },
    },
    parameters: {
        docs: {
            description: {
                story: 'This story demonstrates a controlled AutoCompleteMultiple with internal state using useState.',
            },
            source: {
                code: `
import { useState } from 'react';

const options: SelectValue<string>[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Orange', value: 'orange' },
    { label: 'Banana', value: 'banana' },
];

const ControlledValue = () => {
    const [value, setValue] = useState<SelectValue<string>[]>({ label: 'Orange', value: 'orange' });

    return (
        <AutoCompleteMultiple
            label="This is label"
            placeholder="Input Placeholder..."
            value={value}
            onChange={setValue}
            options={options}
        />
    );
};

export default ControlledValue;
          `.trim(),
            },
        },
    },
};


export const Sizes: Story = {
    render: (args) => (
        <div className="flex gap-10 flex-wrap">
            {sizeOption.map((size) => (
                <AutoCompleteMultiple
                    key={size}
                    {...args}
                    size={size as AutoCompleteMultipleProps<any>['size']}
                    label={`Size ${size}`}
                    options={options}
                />
            ))}
        </div >
    ),
    args: {
        placeholder: 'Input Placeholder...',
    },
    argTypes: {
        size: { control: false },
        label: { control: false },
    },
}

export const LabelPosition: Story = {
    render: (args) => (
        <div className="flex flex-col w-full gap-4">
            {labelPositionOption.map((position) => (
                <AutoCompleteMultiple
                    key={position}
                    {...args}
                    labelPosition={position as AutoCompleteMultipleProps<any>['labelPosition']}
                    label={`Position ${position}`}
                    options={options}
                    width={500}
                />
            ))}
        </div >
    ),
    args: {
        placeholder: 'Input Placeholder...',
        helperText: 'Input helper text',
    },
    argTypes: {
        size: { control: false },
        label: { control: false },
    },
}

export const SuccessAndError: Story = {
    render: (args) => (
        <div className="flex flex-col gap-10">
            <AutoCompleteMultiple
                {...args}
                label="Neutral AutoCompleteMultiple size"
                className='flex-1'
                options={options}
            />
            <AutoCompleteMultiple
                {...args}
                label="Success AutoCompleteMultiple size"
                className='flex-1'
                success
                options={options}
            />
            <AutoCompleteMultiple
                {...args}
                label="Success AutoCompleteMultiple size"
                className='flex-1'
                error
                options={options}
            />
            <AutoCompleteMultiple
                {...args}
                label="Success AutoCompleteMultiple size"
                className='flex-1'
                error="Error with message"
                options={options}
            />
        </div >
    ),
    args: {
        placeholder: 'Input Placeholder...',
        helperText: 'Input helper text',
    },
    argTypes: {
        success: { control: false },
        error: { control: false },
    },
}


type WithIconControls = AutoCompleteMultipleProps<any> & {
    startIconName: IconNames;
    endIconName: IconNames;
};
export const WithIcon: StoryObj<WithIconControls> = {
    args: {
        startIconName: 'arrow-up',
        endIconName: 'arrow-down',
        label: 'Input Label',
        placeholder: 'Input Placeholder...',
        helperText: 'Input helper text',
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

        const start = useMemo(() => <Icon name={startIconName} color="currentColor" />, [startIconName]);
        const end = useMemo(() => <Icon name={endIconName} color="currentColor" />, [endIconName]);

        return <AutoCompleteMultiple {...rest} startIcon={start} endIcon={end} options={options} />;
    },
};