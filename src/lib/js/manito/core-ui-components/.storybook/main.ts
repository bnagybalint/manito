import type { StorybookConfig } from '@storybook/types';

const mainConfig: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|ts|jsx|tsx)"],
  logLevel: 'debug',
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  core: {
    disableTelemetry: true
  },
};

module.exports = mainConfig;