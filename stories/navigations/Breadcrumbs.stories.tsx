import React from 'react'
import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb, BreadcrumbProps } from '../../src/components';
import '../../src/output.css';
import { MemoryRouter, useNavigate } from 'react-router-dom';

const meta: Meta<BreadcrumbProps> = {
    title: 'Navigation/Breadcrumb',
    component: Breadcrumb,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        items: {
            control: 'object',
            description: 'An array of breadcrumb items.',
            table: {
                type: { summary: '{ label: string, href?: string }[]' },
            },
        },
        maxDisplay: {
            control: 'number',
            description: 'Maximum number of breadcrumb items to display.',
            table: {
                type: { summary: 'number' },
            },
        },
        isFormEdited: {
            control: 'boolean',
            description: 'A flag to indicate if the form is edited. This flag is used when breadcrumb placed in form page to notify user about unsaved changes.',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        onNavigate: {
            action: 'navigate',
            description: 'Callback function triggered when a breadcrumb item is clicked. use react-router-dom useNavigate(). If you set isFormEdited to true, this callback should be used to navigate to the form page.',
            table: {
                type: { summary: 'NavigateFunction' },
            },
        },
    },
    args: {
        maxDisplay: 4,
    },
};

export default meta;
type Story = StoryObj<BreadcrumbProps>;


export const Playground: Story = {
    args: {
        isFormEdited: false,
        items: [
            { label: 'Home', href: '/' },
            { label: 'Components', href: '/components' },
            { label: 'Breadcrumb', href: '/components/breadcrumb' },
            { label: 'Playground', href: '/components/breadcrumb/playground' },
            { label: 'Edited', href: '/components/breadcrumb/playground/edited' },
        ],
        maxDisplay: 4,
    },
    render: (args) => {
        return (
            <MemoryRouter>
                <Wrapper args={args} />
            </MemoryRouter>
        )
    },
    parameters: {
        docs: {
            description: {
                story: 'A breadcrumb component displays a list of links that represent the current page\'s location in a hierarchical structure.',
            },
            source: {
                code: `
const Playground = () => {  
    const navigate = useNavigate();
    const [isFormEdited, setIsFormEdited] = React.useState(false);

    const items = [
        { label: 'Home', href: '/' },
        { label: 'Components', href: '/components' },
        { label: 'Breadcrumb', href: '/components/breadcrumb' },
        { label: 'Playground', href: '/components/breadcrumb/playground' },
        { label: 'Edited', href: '/components/breadcrumb/playground/edited' },
    ]



    return (
        <Breadcrumb 
            maxDisplay={4}
            items={items}
            isFormEdited={isFormEdited}
            onNavigate={navigate}
        />
    );
};

export default Playground;          
                `.trim(),
            }
        }
    }
};

const Wrapper = ({ args }: { args: BreadcrumbProps }) => {
    const navigate = useNavigate();

    return (
        <Breadcrumb
            {...args}
            isFormEdited={args.isFormEdited!}
            onNavigate={navigate}
        />
    );
};

