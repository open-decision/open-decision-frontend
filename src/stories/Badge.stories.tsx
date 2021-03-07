import { Badge, BadgeProps } from "components";
import { Story, Meta } from "@storybook/react";

export default {
  title: "Primitives/Badge",
  component: Badge,
} as Meta;

const Template: Story<BadgeProps> = (args) => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Badge",
};
