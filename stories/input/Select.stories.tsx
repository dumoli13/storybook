import React, { useMemo, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SelectProps,
  SelectValue,
  Icon,
  IconNames,
  Select,
  SelectRef,
} from '../../src';
import { iconNames } from '../../const/icon';
import { options } from '../const/select';
import cx from 'classnames';
import '../../src/output.css';

const sizeOption = ['default', 'large'];
const labelPositionOption = ['top', 'left'];

const meta: Meta<SelectProps<any>> = {
  title: 'Input/Select',
  component: Select,
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

type Story = StoryObj<SelectProps<any>>;

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
          'Select components are used for collecting user provided information from a list of options.',
      },
    },
  },
};

export const DefaultValue: Story = {
  args: {
    label: 'Input Label',
    placeholder: 'Input Placeholder...',
    helperText: 'Input helper text',
    defaultValue: 'apple',
    options,
  },
  render: (args) => {
    const InputRef = useRef<SelectRef<string> | null>(null);

    const getValueByRef = () => {
      return InputRef.current?.value; // {value: T, label: string, detail?: D}
    };

    return <Select {...args} options={options} inputRef={InputRef} />;
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates a uncontrolled Select. to access the input field and its value, use the inputRef.',
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
    const InputRef = useRef<SelectRef<string> | null>(null);

    const getValueByRef = () => {
        return InputRef.current?.value; // {value: T, label: string, detail?: D}
    }

    return (
        <Select
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

export const AsyncAndCustomRender: Story = {
  args: {
    label: 'Input Label',
    placeholder: 'Input Placeholder...',
    helperText: 'Input helper text',
  },
  render: (args) => {
    const fetchData = async (page: number, limit: number) => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`,
      );
      const data = await response.json();
      return data.map((item) => ({
        label: item.title,
        value: item.id,
        detail: item,
      }));
    };

    const handleRenderOption = (
      option: Array<SelectValue<number, any>>,
      onClick: (value: SelectValue<number, any>) => void,
      value: SelectValue<number, any> | null,
    ) => {
      return (
        <table>
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">UserId</th>
              <th className="px-4 py-2">Body</th>
            </tr>
          </thead>
          <tbody>
            {option.map((item) =>
              item.detail ? (
                <tr
                  key={item.value}
                  onClick={() => onClick(item)}
                  className={cx('', {
                    'bg-primary-surface dark:bg-primary-surface-dark text-primary-main dark:text-primary-main-dark':
                      item.value === value?.value,
                    'cursor-pointer hover:bg-neutral-20 dark:hover:bg-neutral-20-dark ':
                      item.value !== value?.value,
                  })}
                >
                  <td className="px-4 py-2">{item.detail?.id ?? '-'}</td>
                  <td className="px-4 py-2">{item.detail?.title ?? '-'}</td>
                  <td className="px-4 py-2">{item.detail?.userId ?? '-'}</td>
                  <td className="px-4 py-2">{item.detail?.body ?? '-'}</td>
                </tr>
              ) : (
                '-'
              ),
            )}
          </tbody>
        </table>
      );
    };

    return (
      <Select
        {...args}
        async
        fetchOptions={fetchData}
        renderOption={handleRenderOption}
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
        story:
          'This story demonstrates a uncontrolled AutoComplete. to access the input field and its value, use the inputRef.',
      },
      source: {
        code: ` 
const AsyncAndCustomRender = () => {
    const fetchData = async (keyword: string, page: number, limit: number) => {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await response.json();
      return data.map((item) => ({
        label: item.title,
        value: item.id,
        detail: item,
      }));
    };

    const handleRenderOption = (
      option: Array<SelectValue<number, any>>,
      onClick: (value: SelectValue<number, any>) => void,
      value: SelectValue<number, any> | null
    ) => {
      return (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>UserId</th>d
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {option.map((item) =>
              item.detail ? (
                <tr key={item.value} onClick={() => onClick(item)}>
                  <td>{item.detail?.id ?? "-"}</td>
                  <td>{item.detail?.title ?? "-"}</td>
                  <td>{item.detail?.userId ?? "-"}</td>
                  <td>{item.detail?.body ?? "-"}</td>
                </tr>
              ) : (
                "-"
              )
            )}
          </tbody>
        </table>
      );
    };

    return (
      <Select
        {...args}
        async
        fetchOptions={fetchData}
        renderOption={handleRenderOption}
      />
    );
};

export default AsyncAndCustomRender;
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
    const [value, setValue] = useState<SelectValue<string> | null>({
      label: 'Orange',
      value: 'orange',
    });

    return (
      <Select {...args} value={value} onChange={setValue} options={options} />
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
          'This story demonstrates a controlled Select with internal state using useState.',
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
    const [value, setValue] = useState<SelectValue<string> | null>({ label: 'Orange', value: 'orange' });

    return (
        <Select
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
        <Select
          key={size}
          {...args}
          size={size as SelectProps<any>['size']}
          label={`Size ${size}`}
          options={options}
        />
      ))}
    </div>
  ),
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
        <Select
          key={position}
          {...args}
          labelPosition={position as SelectProps<any>['labelPosition']}
          label={`Position ${position}`}
          options={options}
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
      <Select
        {...args}
        label="Neutral Select size"
        className="flex-1"
        options={options}
      />
      <Select
        {...args}
        label="Success Select size"
        className="flex-1"
        success
        options={options}
      />
      <Select
        {...args}
        label="Success Select size"
        className="flex-1"
        error
        options={options}
      />
      <Select
        {...args}
        label="Success Select size"
        className="flex-1"
        error="Error with message"
        options={options}
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

type WithIconControls = SelectProps<any> & {
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

    const start = useMemo(
      () => <Icon name={startIconName} color="currentColor" />,
      [startIconName],
    );
    const end = useMemo(
      () => <Icon name={endIconName} color="currentColor" />,
      [endIconName],
    );

    return (
      <Select {...rest} startIcon={start} endIcon={end} options={options} />
    );
  },
};
