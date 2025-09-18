import React, { useMemo, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Icon,
  IconNames,
  PasswordField,
  PasswordFieldRef,
  type PasswordFieldProps,
} from "../../src/components";
import "../../src/output.css";
import { iconNames } from "../../const/icon";

const sizeOption = ["default", "large"];
const labelPositionOption = ["top", "left"];

const meta: Meta<PasswordFieldProps> = {
  title: "Input/PasswordField",
  component: PasswordField,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Controlled input value",
      table: {
        type: { summary: "string" },
      },
    },
    defaultValue: {
      control: "text",
      description: "Uncontrolled initial value",
      table: {
        type: { summary: "string" },
      },
    },
    onChange: {
      action: "changed",
      description: "Callback when input value changes",
      table: {
        type: { summary: "(value: string) => void" },
      },
    },
    inputRef: {
      control: false,
      table: {
        disable: true,
      },
    },
    label: {
      control: "text",
      description: "Label text displayed above or beside the input",
      table: {
        type: { summary: "string" },
      },
    },
    labelPosition: {
      control: "select",
      options: labelPositionOption,
      description: "Position of the label relative to the input field",
      table: {
        defaultValue: { summary: "top" },
        type: { summary: "'top' | 'left'" },
      },
    },
    autoHideLabel: {
      control: "boolean",
      description: "Hide label automatically when input is focused",
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
      description: "Placeholder text shown inside the input field",
      table: {
        type: { summary: "string" },
      },
    },
    helperText: {
      control: "text",
      description: "Helper message displayed below the input",
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
      description: "Error message or flag indicating error state",
      table: {
        type: { summary: "boolean | string" },
      },
    },
    success: {
      control: "boolean",
      description: "Display success state",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    loading: {
      control: "boolean",
      description: "Display loading state with spinner",
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
    startIcon: {
      control: false,
      description: "Optional icon at the beginning of the input",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    endIcon: {
      control: false,
      description: "Optional icon at the end of the input",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    fullWidth: {
      control: "boolean",
      description: "Make the input take full width of its container",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    width: {
      control: "number",
      description: "Custom width of the input in pixels",
      table: {
        type: { summary: "number" },
      },
    },
    size: {
      control: "select",
      options: sizeOption,
      description: "The size of the input field.",
      table: {
        defaultValue: { summary: "default" },
        type: { summary: "'default' | 'large'" },
      },
    },
  },
  args: {
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<PasswordFieldProps>;

export const Playground: Story = {
  args: {
    label: "Input Label",
    placeholder: "Input Placeholder...",
    helperText: "Input helper text",
    size: "default",
    fullWidth: false,
    loading: false,
    success: false,
    error: "",
    labelPosition: "top",
  },
};

export const DefaultValue: Story = {
  args: {
    label: "Input Label",
    placeholder: "Input Placeholder...",
    helperText: "Input helper text",
  },
  render: (args) => {
    const InputRef = useRef<PasswordFieldRef>(null);

    const getValueByRef = () => {
      return InputRef.current?.value; // string
    };

    return <PasswordField {...args} inputRef={InputRef} />;
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          "This story demonstrates a uncontrolled PasswordField. to access the input field and its value, use the inputRef.",
      },
      source: {
        code: `
import { useState } from 'react'; 

const UncontrolledValue = () => {
    const InputRef = useRef<PasswordFieldRef>(null);

    const getValueByRef = () => {
        return InputRef.current?.value; // string
    }

    return (
        <PasswordField inputRef={InputRef} />
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
    const [value, setValue] = useState<string>("");

    return <PasswordField {...args} value={value} onChange={setValue} />;
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          "This story demonstrates a controlled PasswordField with internal state using useState.",
      },
      source: {
        code: `
import { useState } from 'react';

const ControlledValue = () => {
    const [value, setValue] = useState<string>('');

    return (
        <PasswordField value={value} onChange={setValue}/>
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
          <PasswordField
            key={size}
            {...args}
            size={size as PasswordFieldProps["size"]}
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
    <div className="flex gap-10 flex-wrap">
      {labelPositionOption.map((position) => (
        <PasswordField
          key={position}
          {...args}
          labelPosition={position as PasswordFieldProps["labelPosition"]}
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

export const SuccessAndError: Story = {
  render: (args) => (
    <div className="flex flex-col gap-10">
      <PasswordField
        {...args}
        label="Neutral Password Field size"
        className="flex-1"
      />
      <PasswordField
        {...args}
        label="Success Password Field size"
        className="flex-1"
        success
      />
      <PasswordField
        {...args}
        label="Success Password Field size"
        className="flex-1"
        error
      />
      <PasswordField
        {...args}
        label="Success Password Field size"
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
    success: { control: false },
    error: { control: false },
  },
};

type WithIconControls = PasswordFieldProps & {
  startIconName: IconNames;
  endIconName: IconNames;
};
export const WithIcon: StoryObj<WithIconControls> = {
  args: {
    startIconName: "arrow-up",
    endIconName: "arrow-down",
    label: "Input Label",
    placeholder: "Input Placeholder...",
    helperText: "Input helper text",
  },
  argTypes: {
    startIconName: {
      control: { type: "select" },
      options: iconNames,
      description: "Name of the start icon",
      table: {
        category: "Icons",
      },
    },
    endIconName: {
      control: { type: "select" },
      options: iconNames,
      description: "Name of the end icon",
      table: {
        category: "Icons",
      },
    },
  },
  render: (args) => {
    const { startIconName, endIconName, ...rest } = args;
    const start = useMemo(
      () => <Icon name={startIconName} color="currentColor" />,
      [startIconName]
    );
    const end = useMemo(
      () => <Icon name={endIconName} color="currentColor" />,
      [endIconName]
    );

    return <PasswordField {...rest} startIcon={start} endIcon={end} />;
  },
};
