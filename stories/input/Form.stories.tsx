import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  DatePicker,
  Form,
  FormProps,
  InputDateValue,
  NumberTextField,
  Select,
  TextField,
  useNotification,
} from '../../src/components';
import '../../src/output.css';
import MisDesignProvider from '../../src/context';
import { SelectValue } from '../../src';

const meta: Meta<FormProps<any>> = {
  title: 'Input/Form',
  component: Form,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: false,
      description: 'Additional class names to customize the component style.',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      control: false,
      description:
        'Children of the form. Make sure to use input from the mis-design to make it work with the form.',
      table: { disable: true },
    },
    formRef: {
      control: false,
      description:
        'A reference to access the input field and its value programmatically.',
      table: { disable: true },
    },
    disabled: {
      control: 'boolean',
      description: 'A flag that disables input field if set to true.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    submitOnChange: {
      control: 'boolean',
      description:
        'A flag that submits the form when any input field changes if set to true.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    focusOnLastFieldEnter: {
      control: 'boolean',
      description:
        'A flag that focuses submit button when user hit enter on the last field if set to true.',
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
type Story = StoryObj<FormProps<any>>;

export const ControlledValue: Story = {
  args: {
    disabled: false,
    focusOnLastFieldEnter: false,
  },
  render: (args) => {
    type FormComposition = {
      name: string;
      date: InputDateValue;
      fruit: SelectValue<string>;
    };

    const notify = useNotification();
    const [options, setOptions] = useState<SelectValue<string>[]>([
      { label: 'Apple', value: 'apple' },
      { label: 'Orange', value: 'orange' },
    ]);

    const handleSubmit = (value: FormComposition) => {
      notify({
        color: 'success',
        title: 'Form Submitted',
        description: `name: ${value.name}, date: ${value.date}, fruit: ${value.fruit.label}, etc.`,
      });
    };

    return (
      <MisDesignProvider>
        <Form<FormComposition>
          {...args}
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          rules={{
            name: ['required'],
            maxnum: [{ required: true }, { max: 444 }, { min: 11 }],
            email: ['required', 'email'],
            website: [{ required: true, url: true }],
            phone: [{ required: true }, { pattern: /^(62|0)8[1-9]\d{6,9}$/ }],
            date: [{ required: true }],
            fruit: ['required'],
          }}
        >
          <TextField name="name" label="Name" placeholder="Enter your name" />
          <NumberTextField
            name="maxnum"
            label="Max Min Number"
            placeholder="Enter number max: 444, min: 11"
            min={11}
            max={444}
          />
          <TextField
            name="email"
            label="Email"
            placeholder="Enter your email"
          />
          <TextField
            name="website"
            label="Website"
            placeholder="Enter your website"
          />
          <TextField
            name="phone"
            label="Phone"
            placeholder="Enter your phone"
          />
          <DatePicker
            name="date"
            label="Date"
            placeholder="Enter your birthday"
          />
          <Select
            name="fruit"
            label="Fruit"
            options={options}
            placeholder="Select your favorite fruit"
          />

          <Button type="submit">Submit</Button>
        </Form>
      </MisDesignProvider>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
import { useState } from 'react';

const ControlledValue = () => {
    const [value, setValue] = useState<string>('');

    return (
        <Form value={value} onChange={setValue}/>
    );
};

export default ControlledValue;
          `.trim(),
      },
    },
  },
};

export const AutoSubmit: Story = {
  args: {
    disabled: false,
  },
  render: (args) => {
    type FormComposition = {
      name: string;
      date: InputDateValue;
      fruit: SelectValue<string>;
    };

    const notify = useNotification();
    const [options, setOptions] = useState<SelectValue<string>[]>([
      { label: 'Apple', value: 'apple' },
      { label: 'Orange', value: 'orange' },
    ]);

    const handleSubmit = (value: FormComposition) => {
      notify({
        color: 'success',
        title: 'Form Submitted',
        description: `name: ${value.name}, date: ${value.date}, fruit: ${value.fruit.label}, etc.`,
      });
    };

    return (
      <MisDesignProvider>
        <Form<FormComposition>
          {...args}
          submitOnChange
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          rules={{
            name: ['required'],
            email: ['required', 'email'],
            website: [{ required: true, url: true }],
            phone: [{ required: true }, { pattern: /^(62|0)8[1-9]\d{6,9}$/ }],
            date: [{ required: true }],
            fruit: ['required'],
          }}
        >
          <TextField name="name" label="Name" placeholder="Enter your name" />
          <TextField
            name="email"
            label="Email"
            placeholder="Enter your email"
          />
          <TextField
            name="website"
            label="Website"
            placeholder="Enter your website"
          />
          <TextField
            name="phone"
            label="Phone"
            placeholder="Enter your phone"
          />
          <DatePicker
            name="date"
            label="Date"
            placeholder="Enter your birthday"
          />
          <Select
            name="fruit"
            label="Fruit"
            options={options}
            placeholder="Select your favorite fruit"
          />

          <Button type="submit">Submit</Button>
        </Form>
      </MisDesignProvider>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
import { useState } from 'react';

const ControlledValue = () => {
    const [value, setValue] = useState<string>('');

    return (
        <Form value={value} onChange={setValue}/>
    );
};

export default ControlledValue;
          `.trim(),
      },
    },
  },
};
