import { StoryFn, Meta } from '@storybook/react';
import moment from 'moment';

import DateRangeFilter from './DateRangeFilter';


export default {
    title: 'DateRangeFilter',
    component: DateRangeFilter,
    argTypes: {
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        onDateRangeChange: { action: 'date range updated' },
        onPreviousClick: { action: 'changed to previous interval' },
        onNextClick: { action: 'changed to next interval' },
    }
} as Meta<typeof DateRangeFilter>;

const Template: StoryFn<typeof DateRangeFilter> = (args) => (<DateRangeFilter {...args} />);

export const Default = Template.bind({});
Default.args = {
    startDate: moment("2023-02-12"),
    endDate: moment("2023-02-15"),
};
