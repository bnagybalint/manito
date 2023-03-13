import { StoryFn, Meta } from '@storybook/react';
import { MenuItem } from '@mui/material';

import { DropDown } from './DropDown';
import { useState } from 'react';


export default {
    title: 'DropDown',
    component: DropDown,
    argTypes: {
        label: { type: 'string' },
        value: { type: 'string' },
        required: { type: 'boolean' },
        placeholder: { type: 'string' },
        onChange: { action: 'changed' },
    }
} as Meta<typeof DropDown>;

const Template: StoryFn<typeof DropDown> = (args) => {
    const [value, setValue] = useState("apple");

    return (
        <DropDown
            value={value}
            onChange={setValue}
            {...args}
        >
            <MenuItem key="apple" value="apple">Apple</MenuItem>
            <MenuItem key="pear" value="pear">In a Pear Tree</MenuItem>
            <MenuItem key="plum" value="plum">Plum</MenuItem>
        </DropDown>
    );
}

export const Default = Template.bind({})
Default.args = {
    label: "Fruit",
}
