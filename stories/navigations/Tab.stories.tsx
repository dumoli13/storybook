import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TabProps, Tab } from '../../src';
import '../../src/output.css';

const meta: Meta<TabProps> = {
  title: 'Navigation/Tab',
  component: Tab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description:
        'An array of tab items, each containing the following properties:',
      table: {
        type: {
          summary:
            'Array<{ key: string, label: string, children: ReactNode , disabled?: boolean }>',
        },
      },
    },
    defaultActiveKey: {
      control: 'text',
      description: 'The key of the default active tab.',
      table: {
        type: { summary: 'string' },
      },
    },
    activeKey: {
      control: 'text',
      description: 'The key of the currently active tab.',
      table: {
        type: { summary: 'string' },
      },
    },
    onChange: {
      action: 'navigate',
      description: 'Callback function triggered when a tab is clicked. ',
      table: {
        type: { summary: '(key: string) => void' },
      },
    },
    onTabClick: {
      action: 'navigate',
      description: 'Callback function triggered when a tab is clicked. ',
      table: {
        type: { summary: '(key: string) => void' },
      },
    },
    onTabClose: {
      action: 'close',
      description: 'Callback function triggered when a tab is closed. ',
      table: {
        type: { summary: '(key: string) => void' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<TabProps>;

export const Playground: Story = {
  args: {
    items: [
      { key: 1, label: 'Tab 1', children: <div>Tab 1 Content</div> },
      { key: 2, label: 'Tab 2', children: <div>Tab 2 Content</div> },
      { key: 3, label: 'Tab 3', children: <div>Tab 3 Content</div> },
      { key: 4, label: 'Tab 4', children: <div>Tab 4 Content</div> },
      { key: 5, label: 'Tab 5', children: <div>Tab 5 Content</div> },
    ],
  },
  render: (args) => <Tab {...args} items={args.items} />,
};
