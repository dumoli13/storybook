import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  DateValue,
  FormProps,
  SelectValue,
  AutoComplete,
  Button,
  DatePicker,
  Form,
  TextField,
  useNotification,
  NumberTextField,
  AutoCompleteMultiple,
  FormRef,
  MisDesignProvider,
  DateRangePicker,
  DateRangeValue,
  Checkbox,
  MultipleDatePicker,
  PasswordField,
  Select,
  Switch,
  TextArea,
  TimerField,
} from '../../src';
import { options } from '../const/select';
import '../../src/output.css';

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

export const BasicForm: Story = {
  args: {
    disabled: false,
    focusOnLastFieldEnter: false,
  },
  render: (args) => {
    const formRef = React.useRef<FormRef<FormComposition>>(null);
    type FormComposition = {
      name: string;
      fruit: SelectValue<string>;
      multipleFruit: SelectValue<string>[];
      email: string;
      website: string;
      phone: string;
      date: DateValue;
      stayPeriod: DateRangeValue;
    };

    const notify = useNotification();

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
          formRef={formRef}
          rules={() => ({
            name: ['required'],
            fruit: ['required'],
            multipleFruit: ['required'],
            email: ['required', 'email'],
            website: [{ required: true }, { url: true }],
            phone: [{ required: true }, { pattern: /^(62|0)8[1-9]\d{6,9}$/ }],
            date: [{ required: true }],
            stayPeriod: [{ required: true }],
          })}
        >
          <TextField name="name" label="Name" placeholder="Enter your name" />

          <TextField
            name="email"
            label="Email"
            placeholder="Enter your email"
          />
          <AutoComplete
            name="fruit"
            label="Fruit"
            options={options}
            placeholder="Select your favorite fruit"
          />
          <AutoCompleteMultiple
            name="multipleFruit"
            label="Multiple Fruit"
            options={options}
            placeholder="Select your favorite fruit"
            appendIfNotFound
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
          <DateRangePicker
            name="stayPeriod"
            label="Date"
            placeholder="Enter your stay period"
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
type FormComposition = {
  name: string;
  fruit: SelectValue<string>;
  multipleFruit: SelectValue<string>[];
  email: string;
  website: string;
  phone: string;
  date: DateValue;
};

const BasicForm = () => {
  const formRef = React.useRef<FormRef<FormComposition>>(null);
  const notify = useNotification();

  const handleSubmit = (value: FormComposition) => {
    console.log(value)
  };

  return (
    <MisDesignProvider>
      <Form<FormComposition>
        {...args}
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        formRef={formRef}
        rules={() => ({
          name: ['required'],
          fruit: ['required'],
          multipleFruit: ['required'],
          email: ['required', 'email'],
          website: [{ required: true }, { url: true }],
          phone: [{ required: true }, { pattern: /^(62|0)8[1-9]\d{6,9}$/ }],
          date: [{ required: true }],
        })}
      >
        <TextField name="name" label="Name" placeholder="Enter your name" />
        <AutoComplete
          name="fruit"
          label="Fruit"
          options={options}
          placeholder="Select your favorite fruit"
        />
        <AutoCompleteMultiple
          name="multipleFruit"
          label="Multiple Fruit"
          options={options}
          placeholder="Select your favorite fruit"
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
        <Button type="submit">Submit</Button>
      </Form>
    </MisDesignProvider>
  );
}

export default BasicForm;
          `.trim(),
      },
    },
  },
};

export const AllInputType: Story = {
  args: {
    disabled: false,
    focusOnLastFieldEnter: false,
  },
  render: (args) => {
    const formRef = React.useRef<FormRef<FormComposition>>(null);
    type FormComposition = {
      name: string;
      fruit: SelectValue<string>;
      multipleFruit: SelectValue<string>[];
      email: string;
      website: string;
      phone: string;
      date: DateValue;
      stayPeriod: DateRangeValue;
    };

    const notify = useNotification();

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
          formRef={formRef}
        >
          <div className="flex items-center gap-2">
            <AutoComplete
              name="autoComplete"
              label="Auto Complete"
              options={options}
              placeholder="Select one option"
              className="flex-1"
              clearable
            />
            <AutoComplete
              name="autoCompleteAppend"
              label="Auto Complete (Append Option)"
              options={options}
              placeholder="Select one option"
              appendIfNotFound
              className="flex-1"
              clearable
            />
          </div>
          <div className="flex items-center gap-2">
            <AutoCompleteMultiple
              name="autoCompleteMultiple"
              label="Auto Complete Multiple"
              options={options}
              placeholder="Select several option"
              className="flex-1"
              clearable
            />
            <AutoCompleteMultiple
              name="autoCompleteMultipleAppend"
              label="Auto Complete Multiple (Append)"
              options={options}
              placeholder="Select several option"
              appendIfNotFound
              className="flex-1"
              clearable
            />
          </div>
          <Checkbox name="checkbox" label="Checkbox" />
          <div className="flex items-center gap-2">
            <DatePicker
              name="datePicker"
              label="Date Picker"
              className="flex-1"
              clearable
            />
            <DatePicker
              name="datePickerTime"
              label="Date Picker"
              showTime
              className="flex-1"
              clearable
            />
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker
              name="dateRangePicker"
              label="Date Range Picker"
              placeholder="Select date range"
              className="flex-1"
              clearable
            />
            <DateRangePicker
              name="dateRangePickerTime"
              label="Date Range Picker"
              placeholder="Select date range"
              showTime
              className="flex-1"
              clearable
            />
          </div>
          <MultipleDatePicker
            name="multipleDatePicker"
            label="Multiple Date Picker"
            placeholder="Select several date"
            clearable
          />
          <PasswordField name="password" label="Password Field" clearable />
          <Select
            name="select"
            label="Select"
            options={options}
            placeholder="Select one option"
            clearable
          />
          <Switch name="switch" label="Switch" />
          <TextArea
            name="textArea"
            label="Text Area"
            placeholder="write something..."
          />
          <TextField
            name="textField"
            label="Text Field"
            placeholder="write something..."
            clearable
          />
          <TimerField name="timerField" label="Timer Field" clearable />
          <Button type="submit">Submit</Button>
        </Form>
      </MisDesignProvider>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
type FormComposition = {
  name: string;
  fruit: SelectValue<string>;
  multipleFruit: SelectValue<string>[];
  email: string;
  website: string;
  phone: string;
  date: DateValue;
};

const BasicForm = () => {
  const formRef = React.useRef<FormRef<FormComposition>>(null);
  const notify = useNotification();

  const handleSubmit = (value: FormComposition) => {
    console.log(value)
  };

  return (
    <MisDesignProvider>
      <Form<FormComposition>
        {...args}
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        formRef={formRef}
        rules={() => ({
          name: ['required'],
          fruit: ['required'],
          multipleFruit: ['required'],
          email: ['required', 'email'],
          website: [{ required: true }, { url: true }],
          phone: [{ required: true }, { pattern: /^(62|0)8[1-9]\d{6,9}$/ }],
          date: [{ required: true }],
        })}
      >
        <TextField name="name" label="Name" placeholder="Enter your name" />
        <AutoComplete
          name="fruit"
          label="Fruit"
          options={options}
          placeholder="Select your favorite fruit"
        />
        <AutoCompleteMultiple
          name="multipleFruit"
          label="Multiple Fruit"
          options={options}
          placeholder="Select your favorite fruit"
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
        <Button type="submit">Submit</Button>
      </Form>
    </MisDesignProvider>
  );
}

export default BasicForm;
          `.trim(),
      },
    },
  },
};

export const InterdependentFormRules: Story = {
  args: {
    disabled: false,
    focusOnLastFieldEnter: false,
  },
  render: (args) => {
    const formRef = React.useRef<FormRef<FormComposition>>(null);
    type FormComposition = {
      luckyKey: number;
      luckyNumber: number;
    };

    const notify = useNotification();

    const handleSubmit = (value: FormComposition) => {
      notify({
        color: 'success',
        title: 'Form Submitted',
        description: `lucky Number: ${value.luckyNumber}.`,
      });
    };

    const handleValidate = () => {
      formRef.current?.validate();
    };

    return (
      <MisDesignProvider>
        <Form<FormComposition>
          {...args}
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          formRef={formRef}
          rules={(ref) => ({
            luckyKey: [
              'required',
              {
                validate: (value) => value > 100,
                message: 'Lucky number must be above 100',
              },
              {
                validate: (value) => value < 1000,
                message: 'Lucky number must be below 1000',
              },
            ],
            luckyNumber: [
              {
                equal: ref['luckyKey'],
                message: "It's not the lucky number",
              },
            ],
          })}
        >
          <NumberTextField
            name="luckyKey"
            label="Lucky Key"
            placeholder="Enter your lucky key"
          />
          <NumberTextField
            name="luckyNumber"
            label="Lucky Number"
            placeholder="Enter your lucky number"
          />
          <div className="flex items-center gap-4 w-full">
            <Button
              type="button"
              onClick={handleValidate}
              className="flex-1"
              variant="secondary"
            >
              Validate
            </Button>
            <Button type="submit" className="flex-1">
              Submit
            </Button>
          </div>
        </Form>
      </MisDesignProvider>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
import { useState } from 'react';

type FormComposition = {
  luckyKey: number;
  luckyNumber: number;
};

const InterdependentFormRules = () => {
  const formRef = React.useRef<FormRef<FormComposition>>(null);
  const notify = useNotification();

  const handleSubmit = (value: FormComposition) => {
    console.log(value)
  };

  const handleValidate = () => {
    formRef.current?.validate();
  };

  return (
    <MisDesignProvider>
      <Form<FormComposition>
        {...args}
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        formRef={formRef}
        rules={(ref) => ({
          luckyKey: [
            'required',
            {
              validate: (value) => value > 100,
              message: 'Lucky number must be above 100',
            },
            {
              validate: (value) => value < 1000,
              message: 'Lucky number must be below 1000',
            },
          ],
          luckyNumber: [
            {
              equal: ref['luckyKey'],
              message: "It's not the lucky number",
            },
          ],
        })}
      >
        <NumberTextField
          name="luckyKey"
          label="Lucky Key"
          placeholder="Enter your lucky key"
        />
        <NumberTextField
          name="luckyNumber"
          label="Lucky Number"
          placeholder="Enter your lucky number"
        />
        <div className="flex items-center gap-4 w-full">
          <Button
            type="button"
            onClick={handleValidate}
            className="flex-1"
            variant="secondary"
          >
            Validate
          </Button>
          <Button type="submit" className="flex-1">
            Submit
          </Button>
        </div>
      </Form>
    </MisDesignProvider>
  )
};

export default InterdependentFormRules;
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
      date: DateValue;
      fruit: SelectValue<string>;
    };

    const notify = useNotification();

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
          rules={() => ({
            name: ['required'],
            email: ['required', 'email'],
            website: [{ required: true }, { url: true }],
            phone: [{ required: true }, { pattern: /^(62|0)8[1-9]\d{6,9}$/ }],
            date: [{ required: true }],
            fruit: ['required'],
          })}
        >
          <TextField name="name" label="Name" placeholder="Enter your name" />
          <AutoComplete
            name="fruit"
            label="Fruit"
            options={options}
            placeholder="Select your favorite fruit"
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
        </Form>
      </MisDesignProvider>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
type FormComposition = {
  name: string;
  fruit: SelectValue<string>;
  multipleFruit: SelectValue<string>[];
  email: string;
  website: string;
  phone: string;
  date: DateValue;
};

const AutoSubmit = () => {
  const notify = useNotification();

  const handleSubmit = (value: FormComposition) => {
    console.log(value)
  };

  return (
    <MisDesignProvider>
      <Form<FormComposition>
        {...args}
        submitOnChange
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        rules={() => ({
          name: ['required'],
          email: ['required', 'email'],
          website: [{ required: true }, { url: true }],
          phone: [{ required: true }, { pattern: /^(62|0)8[1-9]\d{6,9}$/ }],
          date: [{ required: true }],
          fruit: ['required'],
        })}
      >
        <TextField name="name" label="Name" placeholder="Enter your name" />
        <AutoComplete
          name="fruit"
          label="Fruit"
          options={options}
          placeholder="Select your favorite fruit"
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
      </Form>
    </MisDesignProvider>
  );
};

export default AutoSubmit;
          `.trim(),
      },
    },
  },
};
