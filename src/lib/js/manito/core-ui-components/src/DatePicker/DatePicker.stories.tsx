import { StoryFn, Meta } from '@storybook/react';
import moment from 'moment';

import { DatePicker } from './DatePicker';


export default {
    title: 'DatePicker',
    component: DatePicker,
    argTypes: {
        label: { type: 'string' },
        value: { control: 'date' },
        onChange: { action: 'date updated' },
    },
} as Meta<typeof DatePicker>;

const Template: StoryFn<typeof DatePicker> = (args) => (<DatePicker {...args} />);

export const Default = Template.bind({});
Default.args = {
    value: moment(),
};

export const WithLabel = Template.bind({});
WithLabel.args = {
    value: moment(),
    label: "Start date",
};

export const NoIcon = Template.bind({});
NoIcon.args = {
    value: moment(),
    hideOpenIcon: true,
};
