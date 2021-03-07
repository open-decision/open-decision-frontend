import { OutlinedButton, OutlinedButtonProps } from "components";
import { Story, Meta } from "@storybook/react";

export default {
  title: "Primitives/Buttons/OutlinedButton",
  component: OutlinedButton,
  args: {
    children: "Button",
  },
  argTypes: { onClick: { action: "clicked" } },
} as Meta;

const ButtonTemplate: Story<OutlinedButtonProps> = (args) => (
  <OutlinedButton {...args} />
);

export const Primary = ButtonTemplate.bind({});
