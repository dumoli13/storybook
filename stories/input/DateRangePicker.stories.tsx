import React, { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker, DateRangePickerProps, InputDateRangePickerRef, InputDateRangeValue } from '../../src/components';
import '../../src/output.css';


const sizeOption = ['default', 'large'];
const labelPositionOption = ['top', 'left'];
const pickerOption = ['date', 'month', 'year'];

const meta: Meta<DateRangePickerProps> = {
    title: 'Input/DateRangePicker',
    component: DateRangePicker,
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: 'Controlled input value',
            table: {
                type: { summary: 'InputDateValue' },
            },
        },
        defaultValue: {
            control: 'text',
            description: 'The initial value of the input field when the component is uncontrolled.',
            table: {
                type: { summary: 'InputDateValue' },
            },
        },
        onChange: {
            action: 'changed',
            description: 'Callback function to handle input changes.',
            table: {
                type: { summary: '(value: InputDateValue) => void' },
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
        helperText: {
            control: 'text',
            description: 'A helper message displayed below the input field.',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text displayed inside the input field when it is empty.',
            table: {
                type: { summary: 'string' },
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
        disabledDate: {
            control: false,
            description: 'A function to determine if a specific date is disabled (not selectable).',
            table: {
                type: { summary: '(date: Date) => boolean' },
            },
        },
        clearable: {
            control: 'boolean', description: 'A flag that show clear button of input field if set to true',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
    },
    args: {
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<DateRangePickerProps>;

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
        error: '',
        labelPosition: 'top',
    },
};

export const DefaultValue: Story = {
    args: {
        label: 'Input Label',
        placeholder: 'Input Placeholder...',
        helperText: 'Input helper text',
        defaultValue: [new Date('2023-12-01'), new Date('2023-12-10')],
    },
    render: (args) => {
        const InputRef = useRef<InputDateRangePickerRef>(null);

        return (
            <DateRangePicker {...args} inputRef={InputRef} />
        );
    },
    argTypes: {
        value: { control: false },
        defaultValue: { control: false },
    },
    parameters: {
        docs: {
            description: {
                story: 'This story demonstrates a uncontrolled DateRangePicker. to access the input field and its value, use the inputRef.',
            },
            source: {
                code: `
import { useState } from 'react'; 

const UncontrolledValue = () => {
    const InputRef = useRef<InputDateRangePickerRef>(null);
 
    return (
        <DateRangePicker inputRef={InputRef} />
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
        const [value, setValue] = useState<InputDateRangeValue>(null);

        return (
            <DateRangePicker
                {...args}
                value={value}
                onChange={setValue}
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
                story: 'This story demonstrates a controlled DateRangePicker with internal state using useState.',
            },
            source: {
                code: `
import { useState } from 'react';

const ControlledValue = () => {
    const [value, setValue] = useState<InputDateValue>(null);

    return (
        <DateRangePicker value={value} onChange={setValue}/>
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
                <DateRangePicker
                    key={size}
                    {...args}
                    size={size as DateRangePickerProps['size']}
                    label={`Size ${size}`}
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

export const Picker: Story = {
    render: (args) => (
        <div className="flex flex-col w-full gap-10">
            <div className="flex flex-col gap-4 flex-wrap">
                {pickerOption.map((picker) => (
                    <DateRangePicker
                        key={picker}
                        {...args}
                        picker={picker as DateRangePickerProps['picker']}
                        label={`Picker type ${picker}`}
                    />
                ))}
            </div >
            <div className="flex flex-col gap-4 flex-wrap">
                {pickerOption.map((picker) => (
                    <DateRangePicker
                        key={picker}
                        {...args}
                        picker={picker as DateRangePickerProps['picker']}
                        label={`Custom Picker format ${picker} (MMMM DD, YYYY)`}
                        format="MMMM DD, YYYY"
                    />
                ))}
            </div >
        </div>
    ),
    args: {
        placeholder: 'Input Placeholder...',
    },
    argTypes: {
        picker: { control: false },
        label: { control: false },
    },
}

export const LabelPosition: Story = {
    render: (args) => (
        <div className="flex flex-col w-full gap-4">
            {labelPositionOption.map((position) => (
                <DateRangePicker
                    key={position}
                    {...args}
                    labelPosition={position as DateRangePickerProps['labelPosition']}
                    label={`Position ${position}`}
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
            <DateRangePicker
                {...args}
                label="Neutral Text Field size"
                className='flex-1'
            />
            <DateRangePicker
                {...args}
                label="Success Text Field size"
                className='flex-1'
                success
            />
            <DateRangePicker
                {...args}
                label="Success Text Field size"
                className='flex-1'
                error
            />
            <DateRangePicker
                {...args}
                label="Success Text Field size"
                className='flex-1'
                error="Error with message"
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

export const DisabledDate: Story = {
    args: {
        label: 'Input Label',
        placeholder: 'Input Placeholder...',
        helperText: 'Input helper text',
        disabledDate: (date) => date.getDate() % 2 === 1,
    },
    render: (args) => (
        <DateRangePicker
            {...args}
            helperText="Disabled Odd Dates"
        />
    ),
    argTypes: {
        value: { control: false },
        defaultValue: { control: false },
    },
    parameters: {
        docs: {
            description: {
                story: 'This story demonstrates DateRangePicker that has disabled dates.'
            },
            source: {
                code: `
import { useState } from 'react';

const DisabledDate = () => { 
    return (
        <DateRangePicker 
            helperText="Disabled Odd Dates"
            disabledDate={(date) => date.getDate() % 2 === 1}
        />
    );
};

export default DisabledDate;
          `.trim(),
            },
        },
    },
};