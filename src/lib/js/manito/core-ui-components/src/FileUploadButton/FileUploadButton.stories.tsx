import { StoryFn, Meta } from '@storybook/react';

import { FileUploadButton } from './FileUploadButton';


export default {
    title: 'FileUploadButton',
    component: FileUploadButton,
    argTypes: {
        text: { type: 'string' },
        acceptContentTypes: { control: 'array' },
        maxFileSize: { type: 'number' },
        onUpload: { action: 'file selected' },
    }
} as Meta<typeof FileUploadButton>;

const Template: StoryFn<typeof FileUploadButton> = (args) => (<FileUploadButton {...args} />);

export const Default = Template.bind({});
Default.args = {
    text: "Upload file",
    acceptContentTypes: undefined,
};
