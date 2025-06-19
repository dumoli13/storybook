import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Icon, NotificationProps, useNotification } from '../../src/components'; 
import '../../src/output.css';
import MisDesignProvider from '../../src/context';
 
const colorOption = ['primary', 'success', 'danger', 'warning', 'info', 'neutral'];

const meta: Meta<NotificationProps> = {
    title: 'Feedback/Notification',
    tags: ['autodocs'], 
    parameters: {
        layout: 'centered', 
        docs: {
            description: {
                story: 'To display a notification message at the bottom right of the screen.'
            }
        }
    },
    argTypes: {
        title: {
            control: 'text',
            description: 'The title of the notification.',
            table: {
                type: { summary: 'string' },
            },
        },
        description: {
            control: 'text',
            description: 'The description or content of the notification.',
            table: {
                type: { summary: 'string' },
            },
        },
        icon: {
            control: false,
            description: 'An optional icon to display beside the title.',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        color: {
            control: { type: 'select' },
            options: colorOption,
            description: 'The color theme for the tag.',
            table: {
                defaultValue: { summary: 'primary' },
                type: { summary: 'primary | success | danger | warning | info | neutral' },
            },
        },
        duration: {
            control: 'number',
            description: 'The duration of the notification in milliseconds.',
            table: {
                type: { summary: 'number' },
            },
        }
    },
};

export default meta;
type Story = StoryObj<NotificationProps>;

export const Playground: Story = {
    args: {
        color: 'primary',
        title: 'Notification Title',
        description: 'Notification Description',
        icon: <Icon name="bookmark" size={24} strokeWidth={2} />,
        duration: 5000
    },
    render: (args) => {
        const notify = useNotification();

        const handleNotification = () => {
            notify({
                ...args,
            })
        }

        return (
            <MisDesignProvider>
                <div className="flex gap-4 items-center">
                    <Button color="primary" onClick={handleNotification}>Open Notification</Button>
                </div>
            </MisDesignProvider>
        );
    },
    parameters: {
        docs: { 
            source: {
                code: `
import { useState } from 'react'; 

const UncontrolledValue = () => {
    const notify = useNotification();

    const handleNotification = (color: 'primary' | 'success' | 'danger' | 'warning' | 'info') => () => {
        notify({
            color,
            title: 'Notification Title',
            description: 'Notification Description',
        })
    }

    const handleNotificationIcon = () => {
        notify({
            icon: <Icon name="bookmark" size={24} strokeWidth={2} />,
            color: 'primary',
            title: 'Notification Title',
            description: 'Notification Description',
        })
    }

    return (
        <MisDesignProvider>
            <div className="flex gap-4 items-center">
                <Button color="primary" onClick={handleNotificationIcon}>Primary with Icon</Button>
                <Button color="primary" onClick={handleNotification('primary')}>Primary</Button>
                <Button color="success" onClick={handleNotification('success')}>Success</Button>
                <Button color="danger" onClick={handleNotification('danger')}>Danger</Button>
                <Button color="warning" onClick={handleNotification('warning')}>Warning</Button>
                <Button color="info" onClick={handleNotification('info')}>Info</Button>
            </div>
        </MisDesignProvider>
    );
};

export default UncontrolledValue;
          `.trim(),
            },
        },
    },
};


export const Color: Story = {
    args: {
        title: 'Notification Title',
        description: 'Notification Description',
        duration: 5000
    },
    render: (args) => {
        const notify = useNotification();

        const handleNotification = (color: 'primary' | 'success' | 'danger' | 'warning' | 'info') => () => {
            notify({
                ...args,
                color,
            })
        }

        const handleNotificationIcon = () => {
            notify({
                ...args,
                icon: <Icon name="bold" size={24} strokeWidth={2} />,
                color: 'primary',
            })
        }

        return (
            <MisDesignProvider>
                <div className="flex gap-4 items-center">
                    <Button color="primary" onClick={handleNotificationIcon}>Primary with Icon</Button>
                    <Button color="primary" onClick={handleNotification('primary')}>Primary</Button>
                    <Button color="success" onClick={handleNotification('success')}>Success</Button>
                    <Button color="danger" onClick={handleNotification('danger')}>Danger</Button>
                    <Button color="warning" onClick={handleNotification('warning')}>Warning</Button>
                    <Button color="info" onClick={handleNotification('info')}>Info</Button>
                </div>
            </MisDesignProvider>
        );
    },
    argTypes: {
        color: { control: false },
    },
    parameters: {
        docs: { 
            source: {
                code: `
import { useState } from 'react'; 

const UncontrolledValue = () => {
    const notify = useNotification();

    const handleNotification = (color: 'primary' | 'success' | 'danger' | 'warning' | 'info') => () => {
        notify({
            color,
            title: 'Notification Title',
            description: 'Notification Description',
        })
    }

    const handleNotificationIcon = () => {
        notify({
            icon: <Icon name="bookmark" size={24} strokeWidth={2} />,
            color: 'primary',
            title: 'Notification Title',
            description: 'Notification Description',
        })
    }

    return (
        <MisDesignProvider>
            <div className="flex gap-4 items-center">
                <Button color="primary" onClick={handleNotificationIcon}>Primary with Icon</Button>
                <Button color="primary" onClick={handleNotification('primary')}>Primary</Button>
                <Button color="success" onClick={handleNotification('success')}>Success</Button>
                <Button color="danger" onClick={handleNotification('danger')}>Danger</Button>
                <Button color="warning" onClick={handleNotification('warning')}>Warning</Button>
                <Button color="info" onClick={handleNotification('info')}>Info</Button>
            </div>
        </MisDesignProvider>
    );
};

export default UncontrolledValue;
          `.trim(),
            },
        },
    },
};

