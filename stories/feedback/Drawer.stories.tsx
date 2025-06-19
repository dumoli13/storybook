import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button, Drawer, DrawerProps, } from '../../src/components';
import '../../src/output.css';

const meta: Meta<DrawerProps> = {
    title: 'Feedback/Drawer',
    component: Drawer,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        className: {
            control: 'text',
            description: 'A className to customize the Drawer.',
            table: {
                type: { summary: 'string' },
            },
        },
        open: {
            control: 'boolean',
            description: 'Determines whether the drawer is open or not. If false, the drawer is not rendered.',
            table: {
                type: { summary: 'boolean' },
            },
        },
        onClose: {
            action: false,
            description: 'Callback when drawer is closed.',
            table: {
                type: { summary: '() => void' },
            }
        },
        position: {
            control: 'select',
            options: ['left', 'right', 'top', 'bottom'],
            description: 'The position of the drawer.',
            table: {
                defaultValue: { summary: 'left' },
                type: { summary: 'left | right | top | bottom' },
            },
        },
        width: {
            control: 'number',
            description: 'The width of the drawer. If a number is provided, the width will be in px.',
            table: {
                type: { summary: 'string | number' },
                defaultValue: { summary: '804' },
            },
        },
        height: {
            control: 'number',
            description: 'The height of the drawer. If a number is provided, the height will be in px.',
            table: {
                type: { summary: 'string | number' },
            }
        },
        closeOnOverlayClick: {
            control: 'boolean',
            description: 'Determines whether the drawer should close when the user clicks outside of the drawer.',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        disableEscapeKeyDown: {
            control: 'boolean',
            description: 'Determines whether the drawer should close when the user presses the Escape key.',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            }
        }
    },
    args: {
        open: false,
        onClose: fn(),
    },
};

export default meta;
type Story = StoryObj<DrawerProps>;


export const Playground: Story = {
    render: (args) => {
        const [openDrawer, setOpenDrawer] = React.useState(false);
        return (
            <>
                <Drawer {...args} open={openDrawer} onClose={() => setOpenDrawer(false)}>
                    Drawer
                </Drawer>
                <Button onClick={() => setOpenDrawer(true)}>Open Drawer</Button>
            </>
        )
    },
    parameters: {
        docs: {
            source: {
                code: `
const Playground = () => {  
    const [openDrawer, setOpenDrawer] = React.useState(false);
    return (
        <>
            <Drawer {...args} open={openDrawer} width={600}>
                <DrawerHeader title="Use Google's location service?" />
                <DrawerBody>
                    Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
                </DrawerBody>
                <DrawerFooter>
                    <Button
                    type="button"
                    onClick={() => setOpenDrawer(false)}
                    >
                    Disagree
                    </Button>
                    <Button >Agree</Button>
                </DrawerFooter>
            </Drawer>
            <Button onClick={()=>setOpenDrawer(true)}>Open Drawer</Button>
        </>
    )
};

export default Playground;          
                `.trim(),
            }
        }
    }
}; 