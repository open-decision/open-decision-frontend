import { Input, InputProps } from "components";
import { Story, Meta } from "@storybook/react";

export default {
  title: "Primitives/FormElements/Input",
  component: Input,
  argTypes: { onChange: { action: "changed" } },
} as Meta;

const InputTemplate: Story<InputProps> = (args) => <Input {...args} />;

export const Default = InputTemplate.bind({});
