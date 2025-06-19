import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps } from '../../src/components';
import '../../src/output.css';

const meta: Meta<ModalProps> = {
    title: 'Feedback/Modal',
    component: Modal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        open: {
            control: 'boolean',
            description: 'Determines whether the modal is open or not. If false, the modal is not rendered.',
            table: {
                type: { summary: 'boolean' },
            },
        },
        className: {
            control: 'text',
            description: 'A className to customize the Modal.',
            table: {
                type: { summary: 'string' },
            },
        },
        width: {
            control: 'number',
            description: 'The width of the modal. If a number is provided, the width will be in px.',
            table: {
                type: { summary: 'string | number' },
                defaultValue: { summary: '804' },
            },
        },
        height: {
            control: 'number',
            description: 'The height of the modal. If a number is provided, the height will be in px.',
            table: {
                type: { summary: 'string | number' },
            }
        },
        closeOnOverlayClick: {
            control: 'boolean',
            description: 'Determines whether the modal should close when the user clicks outside of the modal.',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        onClose: {
            action: false,
            description: 'Callback when modal is closed.',
            table: {
                type: { summary: '() => void' },
            }
        }
    },
    args: {
        open: false,
        onClose: fn(),
        width: 804,
    },
};

export default meta;
type Story = StoryObj<ModalProps>;


export const Playground: Story = {
    render: (args) => {
        const [openModal, setOpenModal] = React.useState(false);
        return (
            <>
                <Modal {...args} open={openModal} width={600}>
                    <ModalHeader title="Use Google's location service?" />
                    <ModalBody>
                        Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            type="button"
                            onClick={() => setOpenModal(false)}
                        >
                            Disagree
                        </Button>
                        <Button >Agree</Button>
                    </ModalFooter>
                </Modal>
                <Button onClick={() => setOpenModal(true)}>Open Modal</Button>
            </>
        )
    },
    parameters: {
        docs: {
            source: {
                code: `
const Playground = () => {  
    const [openModal, setOpenModal] = React.useState(false);
    return (
        <>
            <Modal {...args} open={openModal} width={600}>
                <ModalHeader title="Use Google's location service?" />
                <ModalBody>
                    Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
                </ModalBody>
                <ModalFooter>
                    <Button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    >
                    Disagree
                    </Button>
                    <Button >Agree</Button>
                </ModalFooter>
            </Modal>
            <Button onClick={()=>setOpenModal(true)}>Open Modal</Button>
        </>
    )
};

export default Playground;          
                `.trim(),
            }
        }
    }
}; 