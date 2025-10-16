import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination, PaginationProps } from '../../src';
import '../../src/output.css';

const meta: Meta<PaginationProps> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    total: {
      control: 'number',
      description: 'The total number of items to paginate through.',
      table: {
        type: { summary: 'number' },
      },
    },
    currentPage: {
      control: 'number',
      description: 'The current page being viewed.',
      table: {
        type: { summary: 'number' },
      },
    },
    pageSize: {
      control: 'number',
      description: 'The initial number of items to display per page.',
      table: {
        type: { summary: 'number' },
      },
    },
    itemPerPage: {
      control: 'object',
      description:
        'An array of options for the number of items per page (e.g., [10, 20, 50]).',
      table: {
        type: { summary: 'number[]' },
      },
    },
    onPageChange: {
      action: 'navigate',
      description: 'Callback function triggered when a page is clicked. ',
      table: {
        type: { summary: 'NavigateFunction' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<PaginationProps>;

export const Playground: Story = {
  args: {
    total: 100,
    currentPage: 1,
    itemPerPage: [10, 20, 50],
  },
};
