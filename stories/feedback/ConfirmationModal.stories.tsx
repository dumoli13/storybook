import React, { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button, Icon, IconNames, Modal } from '../../src/components';
import '../../src/output.css';
import { ConfirmModalProps } from '../../src/components/Modals/ConfirmModal';
import { iconNames } from '../../const/icon';

const meta: Meta<ConfirmModalProps> = {
    title: 'Feedback/ModalConfirmation',
    component: Modal.confirm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        icon: {
            control: false,
            description: 'An optional icon to display beside the title.',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        title: {
            control: 'text',
            description: 'The title of the modal that describes the action to be confirmed.',
            table: {
                type: { summary: 'string' },
            },
        },
        content: {
            control: 'text',
            description: 'The content of the modal, explaining the action in more detail.',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        confirmText: {
            control: 'text',
            description: 'The text to be displayed on the confirm button (default is "Confirm").',
            table: {
                type: { summary: 'string' },
            },
        },
        cancelText: {
            control: 'text',
            description: 'The text to display on the cancel button (default is "Cancel").',
            table: {
                type: { summary: 'string' },
            },
        },
        onConfirm: {
            control: false,
            description: 'Callback when modal confirm button is clicked.',
            table: {
                type: { summary: '() => void' },
            },
        },
        onCancel: {
            control: false,
            description: 'Callback when modal cancel button is clicked.',
            table: {
                type: { summary: '() => void' },
            }
        },
        size: {
            control: 'select',
            options: ['default', 'large'],
            description: 'The size of the modal.',
            table: {
                defaultValue: { summary: 'default' },
                type: { summary: 'default | large' },
            },
        }
    },
    args: {
        confirmText: "OK",
        cancelText: "Cancel",
        onConfirm: fn(),
        onCancel: fn(),
    },
};

export default meta;

type WithIconControls = ConfirmModalProps & {
    iconName: IconNames;
};
export const Playground: StoryObj<WithIconControls> = {
    args: {
        // iconName: 'arrow-up',
        title: 'Confirmation Title',
        content: 'Are you sure?',
    },
    argTypes: {
        iconName: {
            control: { type: 'select' },
            options: iconNames,
            description: 'Name of the start icon',
            table: {
                category: 'Icons',
            },
        },
    },
    render: (args) => {
        const { iconName, ...rest } = args;
        const modalIcon = useMemo(() => iconName ? <Icon name={iconName} /> : undefined, [iconName]);

        const handleOpenModal = (type: 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'confirm') => {
            Modal[type]({
                ...rest,
                icon: modalIcon
            });
        }

        return (
            <div className="flex items-center gap-4">
                <Button color="success" onClick={() => handleOpenModal('success')}>Success modal</Button>
                <Button color="info" onClick={() => handleOpenModal('info')}>Info modal</Button>
                <Button color="warning" onClick={() => handleOpenModal('warning')}>Warning modal</Button>
                <Button color="danger" onClick={() => handleOpenModal('danger')}>Danger modal</Button>
                <Button color="primary" onClick={() => handleOpenModal('confirm')}>Confirm</Button>
                <Button color="primary" variant="secondary" onClick={() => handleOpenModal('primary')}>Primary modal</Button>
            </div>
        )
    },
    parameters: {
        docs: {
            source: {
                code: `
const Playground = () => {  
    const { iconName, ...rest } = args;
    const modalIcon = useMemo(() => <Icon name={iconName}>, [iconName]);

    const handleOpenModal = (type: 'success' | 'info' | 'warning' | 'danger' | 'primary') => {
        Modal[type]({
            icon: modalIcon,
            title: 'Confirmation Title',
            description: 'Are you sure?',
            confirmText: "OK",
            cancelText: "Cancel",
            size: 'default',
            onConfirm: () => {},
            onCancel: () => {},
        });
    }

    return (
        <div className="flex items-center gap-4">
            <Button color="success" onClick={() => handleOpenModal('success')}>Success modal</Button>
            <Button color="info" onClick={() => handleOpenModal('info')}>Info modal</Button>
            <Button color="warning" onClick={() => handleOpenModal('warning')}>Warning modal</Button>
            <Button color="danger" onClick={() => handleOpenModal('danger')}>Danger modal</Button>
            <Button color="primary" onClick={() => handleOpenModal('primary')}>Primary modal</Button>
        </div>
    )
};

    export default Playground;          
                    `.trim(),
            }
        }
    }
};

