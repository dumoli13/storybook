import React, { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Icon,
  IconButton,
  PaginationDataType,
  Table,
  TableColumn,
  TableProps,
  TableSortingProps,
  SelectValue,
} from '../../src';
import '../../src/output.css';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<TableProps<any>> = {
  title: 'Display/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'A flexible and customizable popper component designed to display a floating or dropdown-like content relative to a target element. It can handle positioning and alignment adjustments, including dynamic changes due to screen resizing or scrolling. The popper can also be toggled open or closed, and it supports detecting clicks outside the popper to close it automatically.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: false,
      description:
        'An array of column configurations, where each column can define its label, key, filter type, sortability, and rendering logic.',
      table: {
        type: { summary: 'TableColumn<T>[]' },
      },
    },
    data: {
      control: 'object',
      description:
        'The array of data rows to display in the table. Each object in the array should align with the column definitions.',
      table: {
        type: { summary: 'T[]' },
      },
    },
    stickyHeader: {
      control: 'boolean',
      description:
        'If `true`, the table header will remain fixed at the top when scrolling. If `true`, make sure to set table maxHeight.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    maxHeight: {
      control: 'text',
      description:
        "The maximum height of the table's scrollable area. Applies only when `stickyHeader` is `true`.",
      table: {
        defaultValue: { summary: '680' },
        type: { summary: 'number' },
      },
    },
    selectedRows: {
      control: false,
      description:
        'An array of indices for the selected rows. Enables controlled row selection.',
      table: {
        type: { summary: 'number[]' },
      },
    },
    onRowSelect: {
      action: false,
      description:
        'Callback triggered when a row is selected or deselected. Provides the index of the row, its new selected state, and the updated selected rows array.',
      table: {
        type: {
          summary:
            '(row: number, value: boolean, selectedRows: number[]) => void',
        },
      },
    },
    sorting: {
      control: false,
      description:
        'Initial sorting configuration. Defines the key to sort by and the direction (`asc`, `desc`, or `null`).',
      table: {
        type: { summary: 'TableSortingProps<T>' },
      },
    },
    onSort: {
      action: false,
      description:
        'Callback triggered when a column header is clicked for sorting. Provides the new sorting configuration.',
      table: {
        type: { summary: '(sort: TableSortingProps<T>) => void' },
      },
    },
    rowClassName: {
      control: false,
      description:
        'Function to determine the className of a row. Returns `string` to apply custom styling.',
      table: {
        type: { summary: '(record: T) => string' },
      },
    },
    rowStyle: {
      control: false,
      description:
        'Function to determine the style of a row. Returns `CSSProperties` to apply custom styling.',
      table: {
        type: { summary: '(record: T) => CSSProperties' },
      },
    },
    fullwidth: {
      control: 'boolean',
      description:
        'If `true`, the table spans the full width of its container.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    showSelected: {
      control: 'boolean',
      description:
        'If `true`, includes a column for row selection with checkboxes.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Determines the size of the table cells and typography.',
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: '"default" | "large"' },
      },
    },
    verticalAlign: {
      control: 'select',
      options: ['top', 'center', 'bottom'],
      description:
        'Controls the vertical alignment of cell content. Defaults to `top`.',
      table: {
        defaultValue: { summary: 'top' },
        type: { summary: '"top" | "center" | "bottom"' },
      },
    },
    style: {
      control: 'select',
      options: ['simple', 'default'],
      description: 'Determines the style of the table.',
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: '"default" | "simple"' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<TableProps<any>>;

type DataType = {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: string;
  country: string;
};
type FilterProps = {
  name: string;
  email: string;
  age: string;
  gender: SelectValue<string> | null;
  country: SelectValue<string> | null;
};
const data = [
  {
    id: 1,
    name: 'John',
    email: 'john@example.com',
    age: 30,
    gender: 'male',
    country: 'India',
  },
  {
    id: 2,
    name: 'Jane',
    email: 'jane@example.com',
    age: 25,
    gender: 'female',
    country: 'UK',
  },
  {
    id: 3,
    name: 'Bob',
    email: 'bob@example.com',
    age: 35,
    gender: 'male',
    country: 'USA',
  },
  {
    id: 4,
    name: 'Alice',
    email: 'alice@example.com',
    age: 40,
    gender: 'female',
    country: 'India',
  },
  {
    id: 5,
    name: 'Ridwan',
    email: 'ridwan@example.com',
    age: 31,
    gender: 'male',
    country: 'UK',
  },
  {
    id: 6,
    name: 'Oliver',
    email: 'oliver@example.com',
    age: 42,
    gender: 'male',
    country: 'USA',
  },
  {
    id: 7,
    name: 'Sophia',
    email: 'sophia@example.com',
    age: 22,
    gender: 'female',
    country: 'UK',
  },
  {
    id: 8,
    name: 'Liam',
    email: 'liam@example.com',
    age: 33,
    gender: 'male',
    country: 'India',
  },
  {
    id: 9,
    name: 'Emma',
    email: 'emma@example.com',
    age: 44,
    gender: 'female',
    country: 'USA',
  },
  {
    id: 10,
    name: 'Noah',
    email: 'noah@example.com',
    age: 32,
    gender: 'male',
    country: 'India',
  },
];

export const Playground: Story = {
  args: {
    size: 'default',
    verticalAlign: 'top',
    fullwidth: false,
    stickyHeader: true,
    maxHeight: '300px',
    style: 'default',
  },
  render: (args) => {
    const [sort, setSort] = useState<TableSortingProps<DataType>>({
      key: 'name',
      direction: null,
    });

    const [filter, setFilter] = useState<FilterProps>({
      name: '',
      email: '',
      age: '',
      gender: null,
      country: null,
    });

    const columns: TableColumn<DataType>[] = [
      {
        key: 'id',
        label: 'ID',
        dataIndex: 'id',
        width: '80px',
      },
      {
        key: 'name',
        label: 'Name',
        subLabel: <div className="text-12px">Sub Label</div>,
        dataIndex: 'name',
        width: 200,
        filter: 'textfield',
        filterValue: filter.name,
        onChange: (value) => setFilter({ ...filter, name: value }),
      },
      {
        key: 'email',
        label: 'Email',
        dataIndex: 'email',
        sortable: true,
        width: '25%',
        filter: 'textfield',
        filterValue: filter.email,
        onChange: (value) => setFilter({ ...filter, email: value }),
        render: (value) => <a href={`mailto:${value}`}>{value}</a>,
      },
      {
        key: 'age',
        label: 'Age',
        dataIndex: 'age',
        sortable: true,
        width: '25%',
        align: 'right',
        filter: 'textfield',
        filterValue: filter.age,
        onChange: (value) => setFilter({ ...filter, age: value }),
        render: (value) => `${value} years`,
      },
      {
        key: 'gender',
        label: 'Gender',
        dataIndex: 'gender',
        sortable: true,
        width: '20%',
        align: 'right',
        filter: 'select',
        filterValue: filter.gender,
        option: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
        onChange: (value) => setFilter({ ...filter, gender: value }),
      },
      {
        key: 'country',
        label: 'Country',
        dataIndex: 'country',
        sortable: true,
        width: '30%',
        filter: 'autocomplete',
        filterValue: filter.country,
        option: [
          { label: 'USA', value: 'USA' },
          { label: 'UK', value: 'UK' },
          { label: 'India', value: 'India' },
        ],
        onChange: (value) => setFilter({ ...filter, country: value }),
      },
    ];

    const parsedData = useMemo(
      () =>
        data
          .filter((item) => {
            const { name, email, age, gender, country } = filter;

            let included = true;
            if (included && name) {
              included = item.name.toLowerCase().includes(name.toLowerCase());
            }
            if (included && email) {
              included = item.email.toLowerCase().includes(email.toLowerCase());
            }
            if (included && age) {
              included = item.age
                .toString()
                .toLowerCase()
                .includes(age.toLowerCase());
            }
            if (included && gender) {
              included = item.gender === gender.value;
            }
            if (included && country) {
              included = item.country === country.value;
            }

            return included;
          })
          .sort((a, b) => {
            if (!sort.direction) return 0;
            if (sort.key === 'name') {
              return sort.direction === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
            }
            if (sort.key === 'email') {
              return sort.direction === 'asc'
                ? a.email.localeCompare(b.email)
                : b.email.localeCompare(a.email);
            }
            if (sort.key === 'age') {
              return sort.direction === 'asc' ? a.age - b.age : b.age - a.age;
            }
            if (sort.key === 'gender') {
              return sort.direction === 'asc'
                ? a.gender.localeCompare(b.gender)
                : b.gender.localeCompare(a.gender);
            }
            if (sort.key === 'country') {
              return sort.direction === 'asc'
                ? a.country.localeCompare(b.country)
                : b.country.localeCompare(a.country);
            }
            return 0;
          }),
      [data, sort, filter],
    );

    return (
      <div className="flex" style={{ width: 920 }}>
        <Table
          {...args}
          columns={columns}
          data={parsedData}
          onSort={setSort}
          sorting={sort}
        />
      </div>
    );
  },
  argTypes: {
    columns: { control: false },
    data: { control: false },
    onSort: { control: false },
    sorting: { control: false },
    showSelected: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Tables display sets of data. They can be fully customized.',
      },
      source: {
        code: `
import { useState } from 'react';

type DataType = {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: string;
    country: string;
}
type FilterProps = {
    name: string;
    email: string;
    age: string;
    gender: SelectValue<string> | null;
    country: SelectValue<string> | null
}
const data = [
    { id: 1, name: 'John', email: 'john@example.com', age: 30, gender: 'male', country: 'India' },
    { id: 2, name: 'Jane', email: 'jane@example.com', age: 25, gender: 'female', country: 'UK' },
    { id: 3, name: 'Bob', email: 'bob@example.com', age: 35, gender: 'male', country: 'USA' },
    { id: 4, name: 'Alice', email: 'alice@example.com', age: 40, gender: 'female', country: 'India' },
    { id: 5, name: 'Ridwan', email: 'ridwan@example.com', age: 31, gender: 'male', country: 'UK' }, 
];

const Playground = () => {
    const [sort, setSort] = useState<TableSortingProps<DataType>>({
        key: 'name',
        direction: null,
    });

    const [filter, setFilter] = useState<>({
        name: '',
        email: '',
        age: '',
        gender: null,
        country: null
    });


    const columns: TableColumn<DataType>[] = [
        {
            key: 'id',
            label: 'ID',
            dataIndex: 'id',
            width: '80px',
        },
        {
            key: 'name',
            label: 'Name',
            dataIndex: 'name',
            sortable: true,
            width: 200,
            filter: 'textfield',
            filterValue: filter.name,
            onChange: (value) => setFilter({ ...filter, name: value }),
        },
        {
            key: 'email',
            label: 'Email',
            dataIndex: 'email',
            sortable: true,
            width: '25%',
            filter: 'textfield',
            filterValue: filter.email,
            onChange: (value) => setFilter({ ...filter, email: value }),
        },
        {
            key: 'age',
            label: 'Age',
            dataIndex: 'age',
            sortable: true,
            width: '25%',
            filter: 'textfield',
            filterValue: filter.age,
            onChange: (value) => setFilter({ ...filter, age: value }),
            render: (value) => value + ' years',
        },
        {
            key: 'gender',
            label: 'Gender',
            dataIndex: 'gender',
            sortable: true,
            width: '20%',
            filter: 'select',
            filterValue: filter.gender,
            option: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }],
            onChange: (value) => setFilter({ ...filter, gender: value }),
        },
        {
            key: 'country',
            label: 'Country',
            dataIndex: 'country',
            sortable: true,
            width: '30%',
            filter: 'autocomplete',
            filterValue: filter.country,
            option: [{ label: 'USA', value: 'USA' }, { label: 'UK', value: 'UK' }, { label: 'India', value: 'India' }],
            onChange: (value) => setFilter({ ...filter, country: value }),
        }

    ];

    const parsedData = useMemo(() => data.filter(item => {
        const { name, email, age, gender, country } = filter;

        let included = true;
        if (included && name) {
            included = item.name.toLowerCase().includes(name.toLowerCase());
        }
        if (included && email) {
            included = item.email.toLowerCase().includes(email.toLowerCase());
        }
        if (included && age) {
            included = item.age.toString().toLowerCase().includes(age.toLowerCase());
        }
        if (included && gender) {
            included = item.gender === gender.value;
        }
        if (included && country) {
            included = item.country === country.value;
        }

        return included
    }).sort((a, b) => {
        if (!sort.direction) return 0;
        if (sort.key === 'name') {
            return sort.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        if (sort.key === 'email') {
            return sort.direction === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
        }
        if (sort.key === 'age') {
            return sort.direction === 'asc' ? a.age - b.age : b.age - a.age;
        }
        if (sort.key === 'gender') {
            return sort.direction === 'asc' ? a.gender.localeCompare(b.gender) : b.gender.localeCompare(a.gender);
        }
        if (sort.key === 'country') {
            return sort.direction === 'asc' ? a.country.localeCompare(b.country) : b.country.localeCompare(a.country);
        }
        return 0;
    }), [data, sort, filter])

    return (
        <div className="flex" style={{ width: 920 }}>
            <Table 
                columns={columns}
                data={parsedData}
                onSort={setSort}
                sorting={sort}
            />
        </div>
    );
};

export default Playground;
          `.trim(),
      },
    },
  },
};

export const ShowSelection: Story = {
  args: {
    size: 'default',
    verticalAlign: 'top',
    fullwidth: false,
    stickyHeader: true,
    maxHeight: '300px',
    data: data,
    showSelected: true,
  },
  render: (args) => {
    const columns: TableColumn<DataType>[] = [
      {
        key: 'id',
        label: 'ID',
        dataIndex: 'id',
        width: 80,
      },
      {
        key: 'name',
        label: 'Name',
        dataIndex: 'name',
      },
      {
        key: 'email',
        label: 'Email',
        dataIndex: 'email',
        align: 'right',
      },
      {
        key: 'action',
        label: 'Action',
        render: () => (
          <IconButton
            icon={<Icon name="printer" size={24} />}
            title="Edit"
            color="primary"
            size="large"
          />
        ),
      },
    ];

    const handleRowSelect = (row: number, isSelected: boolean) => {
      console.log(row, isSelected);
    };

    return (
      <div className="flex" style={{ width: 920 }}>
        <Table
          {...args}
          columns={columns}
          data={data}
          onRowSelect={handleRowSelect}
        />
      </div>
    );
  },
  argTypes: {
    columns: { control: false },
  },
  parameters: {
    docs: {
      source: {
        code: `
import { useState } from 'react';

type DataType = {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: string;
    country: string;
} 
const data = [
    { id: 1, name: 'John', email: 'john@example.com', age: 30, gender: 'male', country: 'India' },
    { id: 2, name: 'Jane', email: 'jane@example.com', age: 25, gender: 'female', country: 'UK' },
    { id: 3, name: 'Bob', email: 'bob@example.com', age: 35, gender: 'male', country: 'USA' },
    { id: 4, name: 'Alice', email: 'alice@example.com', age: 40, gender: 'female', country: 'India' },
    { id: 5, name: 'Ridwan', email: 'ridwan@example.com', age: 31, gender: 'male', country: 'UK' },
];

const Playground = () => { 
    const columns: TableColumn<DataType>[] = [
        {
            key: 'id',
            label: 'ID',
            dataIndex: 'id',
            width: 80,
        },
        {
            key: 'name',
            label: 'Name',
            dataIndex: 'name', 
        },
        {
            key: 'email',
            label: 'Email',
            dataIndex: 'email', 
        },

    ];

    const handleRowSelect = (row: number, isSelected: boolean) => {
        console.log(row, isSelected);
    }

    return (
        <Table {...args} columns={columns} data={data} onRowSelect={handleRowSelect} />
    );
};

export default Playground;
          `.trim(),
      },
    },
  },
};

export const CustomRowStyle: Story = {
  args: {
    size: 'default',
    verticalAlign: 'top',
    fullwidth: true,
    stickyHeader: true,
    maxHeight: '300px',
    data: data,
  },
  render: (args) => {
    const columns: TableColumn<DataType>[] = [
      {
        key: 'id',
        label: 'ID',
        dataIndex: 'id',
        width: '80px',
      },
      {
        key: 'name',
        label: 'Name',
        dataIndex: 'name',
      },
      {
        key: 'age',
        label: 'Age',
        dataIndex: 'age',
      },
    ];

    const handleRowClassName = (record: DataType) => {
      if (record.age < 30) {
        return 'bg-danger-surface dark:bg-danger-surface-dark hover:bg-danger-border/20 dark:hover:bg-danger-border/20-dark';
      }
      if (record.age > 40) {
        return 'bg-warning-surface dark:bg-warning-surface-dark hover:bg-warning-border/20 dark:hover:bg-warning-border/20-dark';
      }
      return '';
    };

    return (
      <div className="flex flex-col items-start" style={{ width: 920 }}>
        <div className="mb-2">Show Error if Age less than 30 years old</div>
        <Table
          {...args}
          columns={columns}
          data={data}
          rowClassName={handleRowClassName}
        />
      </div>
    );
  },
  argTypes: {
    columns: { control: false },
    showSelected: { control: false },
  },
  parameters: {
    docs: {
      source: {
        code: `
import { useState } from 'react';

type DataType = {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: string;
    country: string;
} 
const data = [
    { id: 1, name: 'John', email: 'john@example.com', age: 30, gender: 'male', country: 'India' },
    { id: 2, name: 'Jane', email: 'jane@example.com', age: 25, gender: 'female', country: 'UK' },
    { id: 3, name: 'Bob', email: 'bob@example.com', age: 35, gender: 'male', country: 'USA' },
    { id: 4, name: 'Alice', email: 'alice@example.com', age: 40, gender: 'female', country: 'India' },
    { id: 5, name: 'Ridwan', email: 'ridwan@example.com', age: 31, gender: 'male', country: 'UK' },
];

const Playground = () => { 
    const columns: TableColumn<DataType>[] = [
        {
            key: 'id',
            label: 'ID',
            dataIndex: 'id',
            width: '80px',
        },
        {
            key: 'name',
            label: 'Name',
            dataIndex: 'name',
        },
        {
            key: 'age',
            label: 'Age',
            dataIndex: 'age',
        },
    ];

    const handleRowClassName = (record: DataType) => {
        if(record.age < 30){
            return 'bg-danger-surface dark:bg-danger-surface-dark hover:bg-danger-border/20 dark:hover:bg-danger-border/20-dark'  
        }
        if(record.age > 40){
            return 'bg-warning-surface dark:bg-warning-surface-dark hover:bg-warning-border/20 dark:hover:bg-warning-border/20-dark'  
        }
        return ''
    }

    return (
        <div className="flex flex-col items-start" style={{ width: 920 }}>
            <div className="mb-2">Show Error if Age less than 30 years old</div>
            <Table
                {...args}
                columns={columns}
                data={data} 
                rowClassName={handleRowClassName}
            />
        </div>
    );
};

export default Playground;
          `.trim(),
      },
    },
  },
};

export const OnRowClick: Story = {
  args: {
    size: 'default',
    verticalAlign: 'top',
    fullwidth: false,
    stickyHeader: true,
    maxHeight: '300px',
    style: 'default',
  },
  render: (args) => {
    const columns: TableColumn<DataType>[] = [
      {
        key: 'id',
        label: 'ID',
        dataIndex: 'id',
        width: '80px',
      },
      {
        key: 'name',
        label: 'Name',
        subLabel: <div className="text-12px">Sub Label</div>,
        dataIndex: 'name',
        width: 200,
      },
      {
        key: 'email',
        label: 'Email',
        dataIndex: 'email',
        width: '25%',
      },
      {
        key: 'age',
        label: 'Age',
        dataIndex: 'age',
        width: '25%',
        align: 'right',
        render: (value) => `${value} years`,
      },
      {
        key: 'gender',
        label: 'Gender',
        dataIndex: 'gender',
        width: '20%',
        align: 'right',
      },
      {
        key: 'country',
        label: 'Country',
        sortable: true,
        width: '30%',
      },
    ];

    const handleRowClick = (record: DataType, index) => {
      console.log(record, index);
    };

    return (
      <div className="flex" style={{ width: 920 }}>
        <Table
          {...args}
          columns={columns}
          data={data}
          onRowClick={handleRowClick}
        />
      </div>
    );
  },
  argTypes: {
    columns: { control: false },
    data: { control: false },
    onSort: { control: false },
    sorting: { control: false },
    showSelected: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Tables display sets of data. They can be fully customized.',
      },
      source: {
        code: `
import { useState } from 'react';

type DataType = {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: string;
    country: string;
}
 
const data = [
    { id: 1, name: 'John', email: 'john@example.com', age: 30, gender: 'male', country: 'India' },
    { id: 2, name: 'Jane', email: 'jane@example.com', age: 25, gender: 'female', country: 'UK' },
    { id: 3, name: 'Bob', email: 'bob@example.com', age: 35, gender: 'male', country: 'USA' },
    { id: 4, name: 'Alice', email: 'alice@example.com', age: 40, gender: 'female', country: 'India' },
    { id: 5, name: 'Ridwan', email: 'ridwan@example.com', age: 31, gender: 'male', country: 'UK' }, 
];

const Playground = () => { 
    const columns: TableColumn<DataType>[] = [
        {
            key: 'id',
            label: 'ID',
            dataIndex: 'id',
            width: '80px',
        },
        {
            key: 'name',
            label: 'Name',
            dataIndex: 'name', 
            width: 200, 
        },
        {
            key: 'email',
            label: 'Email',
            dataIndex: 'email',
             width: '25%', 
        },
        {
            key: 'age',
            label: 'Age',
            dataIndex: 'age',
             width: '25%', 
            render: (value) => value + ' years',
        },
        {
            key: 'gender',
            label: 'Gender',
            dataIndex: 'gender',
             width: '20%', 
        },
        {
            key: 'country',
            label: 'Country',
            dataIndex: 'country',
             width: '30%', 
        } 
    ];

    const handleRowClick = (record: DataType, index) => {
        console.log(record, index);
    }
 

    return (
        <div className="flex" style={{ width: 920 }}>
            <Table 
                columns={columns}
                data={data} 
                onRowClick={handleRowClick}
            />
        </div>
    );
};

export default Playground;
          `.trim(),
      },
    },
  },
};

type CommentDataType = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export const AsyncTable: Story = {
  args: {
    size: 'default',
    verticalAlign: 'top',
    fullwidth: false,
    stickyHeader: true,
    // maxHeight: '300px',
    style: 'default',
  },
  render: (args) => {
    const [sort, setSort] = useState<TableSortingProps<CommentDataType>>({
      key: 'name',
      direction: null,
    });

    const [filter, setFilter] = useState<FilterProps>({
      name: '',
      email: '',
      age: '',
      gender: null,
      country: null,
    });

    const columns: TableColumn<CommentDataType>[] = [
      {
        key: 'id',
        label: 'ID',
        dataIndex: 'id',
        width: '80px',
      },
      {
        key: 'name',
        label: 'Name',
        dataIndex: 'name',
        width: '25%',
        filter: 'textfield',
        filterValue: filter.name,
        onChange: (value) => setFilter({ ...filter, name: value }),
      },
      {
        key: 'email',
        label: 'Email',
        dataIndex: 'email',
        sortable: true,
        width: '25%',
        filter: 'textfield',
        filterValue: filter.email,
        onChange: (value) => setFilter({ ...filter, email: value }),
        render: (value) => <a href={`mailto:${value}`}>{value}</a>,
      },
      {
        key: 'body',
        label: 'Body',
        dataIndex: 'body',
        sortable: true,
        width: '50%',
        filter: 'textfield',
        filterValue: filter.age,
        onChange: (value) => setFilter({ ...filter, age: value }),
      },
    ];

    const fetchData = async (
      filter: Record<keyof CommentDataType, string>,
      pagination: PaginationDataType,
      sort: TableSortingProps<CommentDataType>,
    ) => {
      const params = {
        _limit: pagination.limit.toString(),
        _page: pagination.page.toString(),
      };
      if (filter.name) params['name_like'] = filter.name;
      if (filter.email) params['email_like'] = filter.email;
      if (filter.body) params['age_like'] = filter.body;

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments?${new URLSearchParams(
          params,
        )}`,
      );
      return await response.json();
    };

    return (
      <Table
        {...args}
        columns={columns}
        onSort={setSort}
        sorting={sort}
        async
        fetchData={fetchData}
        fullwidth
      />
    );
  },
  argTypes: {
    columns: { control: false },
    data: { control: false },
    onSort: { control: false },
    sorting: { control: false },
    showSelected: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Tables display sets of data. They can be fully customized.',
      },
      source: {
        code: `
import { useState } from 'react';

type DataType = {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: string;
    country: string;
}
type FilterProps = {
    name: string;
    email: string;
    age: string;
    gender: SelectValue<string> | null;
    country: SelectValue<string> | null
}
const data = [
    { id: 1, name: 'John', email: 'john@example.com', age: 30, gender: 'male', country: 'India' },
    { id: 2, name: 'Jane', email: 'jane@example.com', age: 25, gender: 'female', country: 'UK' },
    { id: 3, name: 'Bob', email: 'bob@example.com', age: 35, gender: 'male', country: 'USA' },
    { id: 4, name: 'Alice', email: 'alice@example.com', age: 40, gender: 'female', country: 'India' },
    { id: 5, name: 'Ridwan', email: 'ridwan@example.com', age: 31, gender: 'male', country: 'UK' }, 
];

const AsyncTable = () => {
    const [sort, setSort] = useState<TableSortingProps<DataType>>({
        key: 'name',
        direction: null,
    });

    const [filter, setFilter] = useState<>({
        name: '',
        email: '',
        age: '',
        gender: null,
        country: null
    });


    const columns: TableColumn<DataType>[] = [
        {
            key: 'id',
            label: 'ID',
            dataIndex: 'id',
            width: '80px',
        },
        {
            key: 'name',
            label: 'Name',
            dataIndex: 'name',
            sortable: true,
            width: 200,
            filter: 'textfield',
            filterValue: filter.name,
            onChange: (value) => setFilter({ ...filter, name: value }),
        },
        {
            key: 'email',
            label: 'Email',
            dataIndex: 'email',
            sortable: true,
            width: '25%',
            filter: 'textfield',
            filterValue: filter.email,
            onChange: (value) => setFilter({ ...filter, email: value }),
        },
        {
            key: 'age',
            label: 'Age',
            dataIndex: 'age',
            sortable: true,
            width: '25%',
            filter: 'textfield',
            filterValue: filter.age,
            onChange: (value) => setFilter({ ...filter, age: value }),
            render: (value) => value + ' years',
        },
        {
            key: 'gender',
            label: 'Gender',
            dataIndex: 'gender',
            sortable: true,
            width: '20%',
            filter: 'select',
            filterValue: filter.gender,
            option: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }],
            onChange: (value) => setFilter({ ...filter, gender: value }),
        },
        {
            key: 'country',
            label: 'Country',
            dataIndex: 'country',
            sortable: true,
            width: '30%',
            filter: 'autocomplete',
            filterValue: filter.country,
            option: [{ label: 'USA', value: 'USA' }, { label: 'UK', value: 'UK' }, { label: 'India', value: 'India' }],
            onChange: (value) => setFilter({ ...filter, country: value }),
        }

    ];

    const parsedData = useMemo(() => data.filter(item => {
        const { name, email, age, gender, country } = filter;

        let included = true;
        if (included && name) {
            included = item.name.toLowerCase().includes(name.toLowerCase());
        }
        if (included && email) {
            included = item.email.toLowerCase().includes(email.toLowerCase());
        }
        if (included && age) {
            included = item.age.toString().toLowerCase().includes(age.toLowerCase());
        }
        if (included && gender) {
            included = item.gender === gender.value;
        }
        if (included && country) {
            included = item.country === country.value;
        }

        return included
    }).sort((a, b) => {
        if (!sort.direction) return 0;
        if (sort.key === 'name') {
            return sort.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        if (sort.key === 'email') {
            return sort.direction === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
        }
        if (sort.key === 'age') {
            return sort.direction === 'asc' ? a.age - b.age : b.age - a.age;
        }
        if (sort.key === 'gender') {
            return sort.direction === 'asc' ? a.gender.localeCompare(b.gender) : b.gender.localeCompare(a.gender);
        }
        if (sort.key === 'country') {
            return sort.direction === 'asc' ? a.country.localeCompare(b.country) : b.country.localeCompare(a.country);
        }
        return 0;
    }), [data, sort, filter])

    return (
        <div className="flex" style={{ width: 920 }}>
            <Table 
                columns={columns}
                data={parsedData}
                onSort={setSort}
                sorting={sort}
            />
        </div>
    );
};

export default AsyncTable;
          `.trim(),
      },
    },
  },
};
