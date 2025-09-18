import React, { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Switch, SwitchProps, SwitchRef } from "../../src/components";
import "../../src/output.css";

const sizeOption = ["default", "large"];
const labelPositionOption = ["top", "left"];

const meta: Meta<SwitchProps> = {
  title: "Input/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Controlled input value",
      table: {
        type: { summary: "string | number" },
      },
    },
    defaultValue: {
      control: "text",
      description:
        "The initial value of the input field when the component is uncontrolled.",
      table: {
        type: { summary: "string | number" },
      },
    },
    onChange: {
      action: "changed",
      description: "Callback function to handle input changes.",
      table: {
        type: { summary: "(value: string) => void" },
      },
    },
    inputRef: {
      control: false,
      description:
        "A reference to access the input field and its value programmatically.",
      table: { disable: true },
    },
    label: {
      control: "text",
      description: "The label text displayed above or beside the input field",
      table: {
        type: { summary: "string" },
      },
    },
    labelPosition: {
      control: "select",
      options: labelPositionOption,
      description: "The position of the label relative to the field",
      table: {
        defaultValue: { summary: "top" },
        type: { summary: "top | left" },
      },
    },
    autoHideLabel: {
      control: "boolean",
      description:
        "A flag to set if label should automatically hide when the input is focused.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    required: {
      control: "boolean",
      description: "A flag to set if input is required.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    placeholder: {
      control: "text",
      description:
        "Placeholder text displayed inside the input field when it is empty.",
      table: {
        type: { summary: "string" },
      },
    },
    helperText: {
      control: "text",
      description: "A helper message displayed below the input field.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    className: {
      control: false,
      description: "Additional class names to customize the component style.",
      table: {
        type: { summary: "string" },
      },
    },
    error: {
      control: "text",
      description:
        "A flag to display error of input field. If set to string, it will be displayed as error message.",
      table: {
        type: { summary: "boolean | string" },
      },
    },
    loading: {
      control: "boolean",
      description: "A flag to display loading state if set to true.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    disabled: {
      control: "boolean",
      description: "A flag that disables input field if set to true.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    size: {
      control: "select",
      options: sizeOption,
      description: "The size of the input field.",
      table: {
        defaultValue: { summary: "default" },
        type: { summary: "default | large" },
      },
    },
    fullWidth: {
      control: "boolean",
      description: "A flag that expand to full container width if set to true.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    width: {
      control: "number",
      description: "Optional custom width for the input field (in px).",
      table: {
        type: { summary: "number" },
      },
    },
    trueLabel: {
      control: "text",
      description:
        'The label to display when the switch is in the "on" or "checked" state.',
      table: {
        type: { summary: "string" },
      },
    },
    falseLabel: {
      control: "text",
      description:
        'The label to display when the switch is in the "off" or "unchecked" state.',
      table: {
        type: { summary: "string" },
      },
    },
  },
  args: {
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<SwitchProps>;

export const Playground: Story = {
  args: {
    label: "Input Label",
    placeholder: "Input Placeholder...",
    helperText: "Input helper text",
    size: "default",
    fullWidth: false,
    loading: false,
    error: "",
    labelPosition: "top",
  },
};

export const DefaultValue: Story = {
  args: {
    label: "Input Label",
    placeholder: "Input Placeholder...",
    helperText: "Input helper text",
    defaultValue: "lorem ipsum dolor sit amet",
  },
  render: (args) => {
    const InputRef = useRef<SwitchRef>(null);

    const getValueByRef = () => {
      return InputRef.current?.value; // string
    };

    return <Switch {...args} inputRef={InputRef} />;
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          "This story demonstrates a uncontrolled Switch. to access the input field and its value, use the inputRef.",
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
        <Switch inputRef={InputRef} />
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
    label: "Input Label",
    placeholder: "Input Placeholder...",
    helperText: "Input helper text",
  },
  render: (args) => {
    const [value, setValue] = useState<boolean>(false);

    return <Switch {...args} checked={value} onChange={setValue} />;
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          "This story demonstrates a controlled Switch with internal state using useState.",
      },
      source: {
        code: `
import { useState } from 'react';

const ControlledValue = () => {
    const [value, setValue] = useState<string>('');

    return (
        <Switch value={value} onChange={setValue}/>
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
          <Switch
            key={size}
            {...args}
            size={size as SwitchProps["size"]}
            label={`Size ${size}`}
          />
        ))}
      </div>
    );
  },
  args: {
    placeholder: "Input Placeholder...",
  },
  argTypes: {
    size: { control: false },
    label: { control: false },
  },
};

export const LabelPosition: Story = {
  render: (args) => (
    <div className="flex flex-col w-full gap-4">
      {labelPositionOption.map((position) => (
        <Switch
          key={position}
          {...args}
          labelPosition={position as SwitchProps["labelPosition"]}
          label={`Position ${position}`}
          width={500}
        />
      ))}
    </div>
  ),
  args: {
    placeholder: "Input Placeholder...",
    helperText: "Input helper text",
  },
  argTypes: {
    size: { control: false },
    label: { control: false },
  },
};

export const ShowError: Story = {
  render: (args) => (
    <div className="flex flex-col gap-10">
      <Switch {...args} label="Neutral Text Field size" className="flex-1" />
      <Switch
        {...args}
        label="Success Text Field size"
        className="flex-1"
        error
      />
      <Switch
        {...args}
        label="Success Text Field size"
        className="flex-1"
        error="Error with message"
      />
    </div>
  ),
  args: {
    placeholder: "Input Placeholder...",
    helperText: "Input helper text",
  },
  argTypes: {
    error: { control: false },
  },
};
