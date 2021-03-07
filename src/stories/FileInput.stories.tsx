import { FileInput, FileInputProps } from "components";
import { Story, Meta } from "@storybook/react";

export default {
  title: "Primitives/FormElements/FileInput",
  component: FileInput,
  args: { children: "Datei hochladen" },
  argTypes: {
    onChange: { action: "file uploaded" },
  },
} as Meta;

const FileInputTemplate: Story<FileInputProps> = (args) => (
  <FileInput {...args} />
);

export const Default = FileInputTemplate.bind({});
