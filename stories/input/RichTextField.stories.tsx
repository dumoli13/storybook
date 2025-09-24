import React, { useMemo, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconNames, type TextFieldProps } from '../../src/components';
import '../../src/output.css';
import { iconNames } from '../../const/icon';
import RichTextField, {
  RichTextFieldProps,
  RichTextfieldRef,
} from '../../src/components/Inputs/RichTextField';
import { Descendant } from 'slate';

const sizeOption = ['default', 'large'];
const labelPositionOption = ['top', 'left'];

const meta: Meta<RichTextFieldProps> = {
  title: 'Input/RichTextField',
  component: RichTextField,
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
      description:
        'The initial value of the input field when the component is uncontrolled.',
      table: {
        type: { summary: 'string | number' },
      },
    },
    initialValue: {
      control: 'text',
      description:
        'The initial value of the input when default value or value isnot provided. This is useful when user want to reset field/form and it will return to initial value',
      table: {
        type: { summary: 'string | number' },
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
        defaultValue: { summary: 'top' },
        type: { summary: 'top | left' },
      },
    },
    autoHideLabel: {
      control: 'boolean',
      description:
        'A flag to set if label should automatically hide when the input is focused.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    required: {
      control: 'boolean',
      description: 'A flag to set if input is required.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    placeholder: {
      control: 'text',
      description:
        'Placeholder text displayed inside the input field when it is empty.',
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
type Story = StoryObj<RichTextFieldProps>;

export const Playground: Story = {
  args: {
    label: 'Input Label',
    placeholder: 'Input Placeholder...',
    helperText: 'Input helper text',
    size: 'default',
    loading: false,
    success: false,
    error: '',
    labelPosition: 'top',
  },
};

export const DualField: Story = {
  args: {
    label: 'Input Label',
    placeholder: 'Input Placeholder...',
    helperText: 'Input helper text',
  },
  render: (args) => {
    return (
      <>
        <RichTextField {...args} />
        <RichTextField {...args} />
      </>
    );
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates a uncontrolled Textfield. to access the input field and its value, use the inputRef.',
      },
      source: {
        code: `
import { useState } from 'react'; 

const UncontrolledValue = () => {
    const InputRef = useRef<TextAreaRef>(null);

    const getValueByRef = () => {
        return InputRef.current?.value; // string
    }

    return (
        <RichTextField inputRef={InputRef} />
    );
};

export default UncontrolledValue;
          `.trim(),
      },
    },
  },
};

export const DefaultValue: Story = {
  args: {
    label: 'Input Label',
    placeholder: 'Input Placeholder...',
    helperText: 'Input helper text',
    defaultValue: [
      {
        type: 'paragraph',
        children: [
          {
            text: '',
          },
          {
            type: 'link',
            link: {
              hyperlink: 'https://google.com/',
              title: 'Ng Symptoms',
            },
            children: [
              {
                text: '',
              },
            ],
          },
          {
            text: ' ',
          },
          {
            type: 'link',
            link: {
              hyperlink: 'https://google.com/',
              title: 'Ng Symptoms',
            },
            children: [
              {
                text: '',
              },
            ],
          },
          {
            text: '',
          },
        ],
      },
    ],
  },
  render: (args) => {
    const InputRef = useRef<RichTextfieldRef>(null);

    const getValueByRef = () => {
      return InputRef.current?.value; // string
    };

    return <RichTextField {...args} inputRef={InputRef} />;
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates a uncontrolled Textfield. to access the input field and its value, use the inputRef.',
      },
      source: {
        code: `
import { useState } from 'react'; 

const UncontrolledValue = () => {
    const InputRef = useRef<TextAreaRef>(null);

    const getValueByRef = () => {
        return InputRef.current?.value; // string
    }

    return (
        <RichTextField inputRef={InputRef} />
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
    const [value, setValue] = useState<Descendant[]>([
      {
        type: 'paragraph',
        children: [
          {
            text: '',
          },
          {
            type: 'link',
            link: {
              hyperlink:
                'http://localhost:6006/?path=/story/input-richtextfield--playground',
              title: '1',
            },
            children: [
              {
                text: '',
              },
            ],
          },
          {
            text: '',
          },
        ],
      },
    ]);

    return <RichTextField {...args} value={value} onChange={setValue} />;
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates a controlled RichTextField with internal state using useState.',
      },
      source: {
        code: `
import { useState } from 'react';

const ControlledValue = () => {
    const [value, setValue] = useState<string>('');

    return (
        <RichTextField value={value} onChange={setValue}/>
    );
};

export default ControlledValue;
          `.trim(),
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => {
    return (
      <div className="flex gap-10 flex-wrap">
        {sizeOption.map((size) => (
          <RichTextField
            key={size}
            {...args}
            size={size as RichTextFieldProps['size']}
            label={`Size ${size}`}
          />
        ))}
      </div>
    );
  },
  args: {
    placeholder: 'Input Placeholder...',
  },
  argTypes: {
    size: { control: false },
    label: { control: false },
  },
};

export const LabelPosition: Story = {
  render: (args) => (
    <div className="flex gap-10 flex-wrap">
      {labelPositionOption.map((position) => (
        <RichTextField
          key={position}
          {...args}
          labelPosition={position as RichTextFieldProps['labelPosition']}
          label={`Position ${position}`}
          width={500}
        />
      ))}
    </div>
  ),
  args: {
    placeholder: 'Input Placeholder...',
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
      <RichTextField
        {...args}
        label="Neutral Text Field size"
        className="flex-1"
      />
      <RichTextField
        {...args}
        label="Success Text Field size"
        className="flex-1"
        success
      />
      <RichTextField
        {...args}
        label="Success Text Field size"
        className="flex-1"
        error
      />
      <RichTextField
        {...args}
        label="Success Text Field size"
        className="flex-1"
        error="Error with message"
      />
    </div>
  ),
  args: {
    placeholder: 'Input Placeholder...',
    helperText: 'Input helper text',
  },
  argTypes: {
    success: { control: false },
    error: { control: false },
  },
};
