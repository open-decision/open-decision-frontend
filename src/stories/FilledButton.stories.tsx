import { FilledButton, FilledButtonProps } from "components";
import { Story, Meta } from "@storybook/react";

export default {
  title: "Primitives/Buttons/FilledButton",
  component: FilledButton,
  args: {
    children: "Button",
  },
  argTypes: { onClick: { action: "clicked" } },
} as Meta;

const ButtonTemplate: Story<FilledButtonProps> = (args) => (
  <FilledButton {...args} />
);

export const Primary = ButtonTemplate.bind({});
