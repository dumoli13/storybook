import type { Meta, StoryObj } from '@storybook/react';
import { Pagination, PaginationButtonProps } from '../../src';
import '../../src/output.css';

const meta: Meta<PaginationButtonProps> = {
  title: 'Navigation/Pagination.Prev',
  component: Pagination.Prev,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'The Pagination.Prev component enables the user to navigate to the previous page.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: 'Callback when the button is clicked',
      table: {
        type: { summary: '() => void' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'A flag that disables button if set to true.',
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
type Story = StoryObj<PaginationButtonProps>;

export const Playground: Story = {
  args: {
    disabled: false,
  },
};
