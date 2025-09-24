import React, { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox, CheckboxProps, CheckboxRef } from '../../src/components';
import '../../src/output.css';

const sizeOption = ['default', 'large'];
const labelPositionOption = ['top', 'bottom', 'left', 'right'];

const meta: Meta<CheckboxProps> = {
  title: 'Input/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Controlled input value',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    defaultChecked: {
      control: 'text',
      description:
        'The initial value of the input field when the component is uncontrolled.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    initialChecked: {
      control: 'text',
      description:
        'The initial value of the input when default value or value isnot provided. This is useful when user want to reset field/form and it will return to initial value',
      table: {
        type: { summary: 'boolean' },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Callback function to handle input changes.',
      table: {
        type: { summary: '(value: boolean) => void' },
      },
    },
    inputRef: {
      control: false,
      description:
        'A reference to access the input field and its value programmatically.',
      table: { disable: true },
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
        defaultValue: { summary: 'right' },
        type: { summary: 'top | bottom | left | right' },
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
        type: { summary: 'string' },
      },
    },
    error: {
      control: 'text',
      description:
        'A flag to display error of input field. If set to string, it will be displayed as error message.',
      table: {
        type: { summary: 'boolean | string' },
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
    width: {
      control: 'number',
      description: 'Optional custom width for the input field (in px).',
      table: {
        type: { summary: 'number' },
      },
    },
  },
  args: {
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<CheckboxProps>;

export const Playground: Story = {
  args: {
    label: 'Input Label',
    helperText: 'Input helper text',
    size: 'default',
    loading: false,
    labelPosition: 'right',
  },
};

export const DefaultValue: Story = {
  args: {
    label: 'Input Label',
    helperText: 'Input helper text',
    defaultChecked: true,
  },
  render: (args) => {
    const InputRef = useRef<CheckboxRef>(null);

    const getValueByRef = () => {
      return InputRef.current?.value; // boolean
    };

    return <Checkbox {...args} inputRef={InputRef} />;
  },
  argTypes: {
    checked: { control: false },
    defaultChecked: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates a uncontrolled Checkbox. to access the input field and its value, use the inputRef.',
      },
      source: {
        code: `
import { useState } from 'react'; 

const UncontrolledValue = () => {
    const InputRef = useRef<TextAreaRef>(null);

    const getValueByRef = () => {
        return InputRef.current?.value; // boolean
    }

    return (
        <Checkbox inputRef={InputRef} />
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
    helperText: 'Input helper text',
  },
  render: (args) => {
    const [value, setValue] = useState<boolean>(false);

    return <Checkbox {...args} checked={value} onChange={setValue} />;
  },
  argTypes: {
    defaultChecked: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates a controlled Checkbox with internal state using useState.',
      },
      source: {
        code: `
import { useState } from 'react';

const ControlledValue = () => {
    const [value, setValue] = useState<string>('');

    return (
        <Checkbox
            value={value}
            onChange={setValue}
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
        <Checkbox
          key={size}
          {...args}
          size={size as CheckboxProps['size']}
          label={`Size ${size}`}
        />
      ))}
    </div>
  ),
  argTypes: {
    size: { control: false },
    label: { control: false },
  },
};

export const LabelPosition: Story = {
  render: (args) => (
    <div className="flex flex-col w-full gap-4">
      {labelPositionOption.map((position) => (
        <Checkbox
          key={position}
          {...args}
          labelPosition={position as CheckboxProps['labelPosition']}
          label={`Position ${position}`}
          className="flex-1"
          width={500}
        />
      ))}
    </div>
  ),
  args: {
    helperText: 'Input helper text',
  },
  argTypes: {
    size: { control: false },
    label: { control: false },
  },
};

export const SuccessAndError: Story = {
  render: (args) => (
    <div className="flex flex-col gap-10">
      <Checkbox {...args} label="Neutral Text Field size" className="flex-1" />
      <Checkbox
        {...args}
        label="Success Text Field size"
        className="flex-1"
        error
      />
      <Checkbox
        {...args}
        label="Success Text Field size"
        className="flex-1"
        error="Error with message"
      />
    </div>
  ),
  args: {
    helperText: 'Input helper text',
  },
  argTypes: {
    error: { control: false },
  },
};
