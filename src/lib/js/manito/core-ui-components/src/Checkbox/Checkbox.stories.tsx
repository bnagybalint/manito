import { StoryFn, Meta } from '@storybook/react';

import { Checkbox } from './Checkbox';


export default {
    title: 'Checkbox',
    component: Checkbox,
    argTypes: {
        label: { type: "string" },
        checked: { type: "boolean" },
        onChange: { action: 'changed' },
    }
} as Meta<typeof Checkbox>;

const Template: StoryFn<typeof Checkbox> = (args) => (<Checkbox {...args} />);

export const Unchecked = Template.bind({});
Unchecked.args = {
    label: "Unchecked",
    checked: false
};

export const Checked = Template.bind({});
Checked.args = {
    label: "Checked",
    checked: true
};
