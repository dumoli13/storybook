import React from 'react';
import { fn } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionProps, Button } from '../../src/components';
import '../../src/output.css';

const collapsibleOption = ['icon', 'header'];
const sizeOption = ['default', 'large'];

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export 
const meta: Meta<AccordionProps> = {
  title: 'Display/Accordion',
  component: Accordion,
  parameters: {
      layout: 'centered', 
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    collapsible: {
      control: { type: 'select' },
      options: collapsibleOption,
      description: 'Determines which part of the header triggers collapse.',
      table: {
        defaultValue: { summary: 'header' },
        type: { summary: 'header | icon' },
      },
    },
    size: {
      control: { type: 'select' },
      options: sizeOption,
      description: 'The size of the accordion items.',
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'default | large' },
      },
    },
    singleCollapse: {
      control: { type: 'boolean' },
      description: 'If true, only one accordion item can be open at a time.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultActiveKey: {
      control: { type: 'object' },
      description: 'The keys of the panels that should be open by default on initial render.',
      table: {
        type: { summary: 'string[] | number[]' },
      },
    },
    activeKey: {
      control: { type: 'multi-select' },
      description: 'Controlled keys of the currently active panels, for external control.',
      table: {
        type: { summary: 'string[] | number[]' },
      },
    },
    items: {
      control: { type: 'object' },
      description: 'The items of the accordion to display.',
      table: {
        type: { summary: '{key: string, title: string, content: ReactNode}[]' },
      },
    },
    onChangeActiveKey: {
      action: 'activeKeyChanged',
      description: 'Callback when active keys are changed.',
      table: {
          type: { summary: '(key: Array<string | number>) => void' },
      },
    }
  },
  args: {
    size: 'default',
    onChangeActiveKey: fn(),
  },
};


export default meta;
type Story = StoryObj<AccordionProps>;


const items = [
  { key: '1', title: 'First Item', content: 'This is the content of the first item.' },
  { key: '2', title: 'Second Item', content: 'Content for the second item goes here.' },
  { key: '3', title: 'Third Item', content: 'Another piece of content for the third.' },
];
export const Playground: Story = {
  args: {
    collapsible: 'header',
    singleCollapse: false,
    defaultActiveKey: ['2'],
    size: 'default',
    items,
  },
  argTypes: {
    activeKey: {
      control: { type: 'multi-select' },
      options: items.map((item) => item.key),
    },
  }
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {sizeOption.map((size) => (
        <Accordion key={size} {...args} size={size as AccordionProps['size']} items={[
          { key: '1', title: `Size ${size}`, content: `Content for ${size} size accordion.` }
        ]} />
      ))}
    </div>
  ),
  args: {
    collapsible: 'header',
    singleCollapse: false,
    defaultActiveKey: ['1'],
  },
};


export const ControlledAccordion: Story = {
  render: (args) => {
    const [activeKey, setActiveKey] = React.useState<Array<string | number>>(['1']);

    return (
      <div className="flex flex-col gap-4 w-full ">
        <Accordion
          {...args}
          activeKey={activeKey}
          onChangeActiveKey={(newKeys) => setActiveKey(newKeys)}
        />
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => setActiveKey(['1'])}
          >
            Open First
          </Button>
          <Button
            onClick={() => setActiveKey(['2'])}
          >
            Open Second
          </Button>
          <Button
            onClick={() => setActiveKey(['3'])}
          >
            Open Third
          </Button>
          <Button
            variant='secondary'
            onClick={() => setActiveKey([])}
          >
            Close All
          </Button>
          <Button
            variant='secondary'
            onClick={() => setActiveKey(['1','2','3'])}
          >
            Open All
          </Button>
        </div>
      </div>
    );
  },
  args: {
    items: [
      { key: '1', title: 'Controlled First Item', content: 'This is the first controlled item.' },
      { key: '2', title: 'Controlled Second Item', content: 'This is the second controlled item.' },
      { key: '3', title: 'Controlled Third Item', content: 'This is the third controlled item.' },
    ],
    collapsible: 'header',
     size: 'default',
  },
};
