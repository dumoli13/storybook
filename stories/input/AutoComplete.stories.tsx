import type { Meta, StoryObj } from '@storybook/react';
import { AutoComplete, AutoCompleteProps } from '../../src/components';
import '../../src/output.css';
import { options } from '../../src/const/select';

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
      description:
        'The initial value of the input when the component is uncontrolled. only need to provide the key of the option',
      table: {
        type: { summary: 'T' },
      },
    },
    initialValue: {
      control: 'text',
      description:
        'The initial value of the input when default value or value isnot provided. This is useful when user want to reset field/form and it will return to initial value',
      table: {
        type: { summary: '{ value: T,  label: string, detail?: D }' },
      },
    },
    onChange: {
      action: 'false',
      description: 'Callback function to handle input changes.',
      table: {
        type: {
          summary: '(value: { value: T,  label: string, detail?: D }) => void',
        },
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
    startIcon: {
      control: false,
      description:
        'An optional icon to display at the start of the input field.',
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
      description:
        'A flag that show clear button of input field if set to true',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    options: {
      control: 'object',
      description:
        'An array of option objects, each containing a value and a label. Component re-renders every time options change, so make sure manage options in the state or outside the component to prevent unnecessary re-renders.',
      table: {
        type: { summary: '{ label: string, value: T }[]' },
      },
    },
    appendIfNotFound: {
      control: 'boolean',
      description:
        'If true, the input will be appended with the first option if the user types a new value that is not in the options list.',
      table: {
        type: { summary: 'boolean' },
      },
    },
    onAppend: {
      control: 'object',
      description: 'Callback function to handle appending options.',
      table: {
        type: { summary: '(input: string) => void' },
      },
    },
    renderOption: {
      control: 'object',
      description: 'Render function for each option.',
      table: {
        type: {
          summary:
            '(option: Array<SelectValue<T, D>>, onClick: (value: SelectValue<T, D>) => void) => ReactNode',
        },
      },
    },
    async: {
      control: 'boolean',
      description: 'Flag to enable asynchronous loading of options.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    fetchOptions: {
      control: 'object',
      description: 'Function to fetch options asynchronously.',
      table: {
        type: {
          summary:
            '(keyword: string, page: number, limit: number) => SelectValue<T, D>',
        },
      },
    },
  },
  args: {
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<AutoCompleteProps<any>>;

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
    value: { label: 'Orange', value: 'orange' },
    options,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The autocomplete is a normal text input enhanced by a panel of suggested options.',
      },
    },
  },
};
