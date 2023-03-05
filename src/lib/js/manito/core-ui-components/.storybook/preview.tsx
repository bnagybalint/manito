import React from 'react';
import type { GlobalTypes } from '@storybook/types';
import { useGlobals } from '@storybook/client-api';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers'

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    backgrounds: {
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'gray 75%', value: '#bfbfbf' },
        { name: 'gray 50%', value: '#7f7f7f' },
        { name: 'gray 25%', value: '#404040' },
        { name: 'black', value: '#000000' },
      ],
    },
};

export const globalTypes: GlobalTypes = {
    locale: {
        name: 'Locale',
        description: 'Locale for components',
        defaultValue: 'hu-hu',
        type: "string",
        toolbar: {
            icon: 'globe',
            items: [
                { value: 'hu-hu', left: '🇭🇺', right: 'HU', title: 'Hungarian' },
                { value: 'en-us', left: '🇺🇸', right: 'US', title: 'English' },
            ],
            showName: true,
            // dynamicTitle: true,
        },
    },
};

export const decorators = [
    (StoryFn) => {
        const [{ locale }] = useGlobals();

        return (
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
                <StoryFn />
            </LocalizationProvider>
        )
    },
];